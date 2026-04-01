import { Node, Location, PublicConfig, NodeCertification, Interfaces, UptimeEvent, NodeResourcesTotal, NodePower, PowerState, Power, PowerTargetReport, PowerStateReport } from "../model";
import {
    TfgridModuleNodeCertificationSetEvent, TfgridModuleNodeDeletedEvent,
    TfgridModuleNodePublicConfigStoredEvent, TfgridModuleNodeStoredEvent,
    TfgridModuleNodeUpdatedEvent, TfgridModuleNodeUptimeReportedEvent,
    TfgridModulePowerStateChangedEvent, TfgridModulePowerTargetChangedEvent,
    SmartContractModuleNodeExtraFeeSetEvent
} from "../types/events";
import { SubstrateBlock } from '@subsquid/substrate-processor';
import { In } from 'typeorm'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { PublicConfig as V105PublicConfig } from '../types/v105'

import { Ctx } from '../processor'
import assert from "assert";

export function parseNodeCertification(kind: string): NodeCertification {
    switch (kind) {
        case 'Certified': return NodeCertification.Certified
        default: return NodeCertification.Diy
    }
}

export async function nodeStored(
    ctx: Ctx,
    item: EventItem<'TfgridModule.NodeStored', { event: { args: true } }>,
    timestamp: bigint
) {
    const node = new TfgridModuleNodeStoredEvent(ctx, item.event)

    let nodeEvent
    if (node.isV9) {
        nodeEvent = node.asV9
    } else if (node.isV28) {
        nodeEvent = node.asV28
    } else if (node.isV43) {
        nodeEvent = node.asV43
    } else if (node.isV63) {
        nodeEvent = node.asV63
    } else if (node.isV105) {
        nodeEvent = node.asV105
    } else if (node.isV118) {
        nodeEvent = node.asV118
    }

    if (!nodeEvent) {
        ctx.log.error({ eventName: item.name }, `found Node with unknown version! make sure types are updated`);
        return
    }

    const newNode = new Node()
    newNode.id = item.event.id
    newNode.gridVersion = nodeEvent.version
    newNode.farmID = nodeEvent.farmId
    newNode.nodeID = nodeEvent.id
    newNode.twinID = nodeEvent.twinId
    newNode.dedicated = false

    newNode.createdAt = timestamp
    newNode.updatedAt = timestamp

    if (node.isV9) {
        nodeEvent = node.asV9
        newNode.country = validateString(ctx, nodeEvent.country.toString())
        newNode.city = validateString(ctx, nodeEvent.city.toString())
    }
    if (node.isV28) {
        nodeEvent = node.asV28
        newNode.country = validateString(ctx, nodeEvent.country.toString())
        newNode.city = validateString(ctx, nodeEvent.city.toString())
    }

    newNode.created = Number(nodeEvent.created)
    newNode.farmingPolicyId = nodeEvent.farmingPolicyId
    newNode.certification = NodeCertification.Diy

    const newLocation = new Location()
    newLocation.id = item.event.id
    newLocation.latitude = validateString(ctx, nodeEvent.location.latitude.toString())
    newLocation.longitude = validateString(ctx, nodeEvent.location.longitude.toString())
    await ctx.store.save<Location>(newLocation)

    newNode.location = newLocation

    await ctx.store.save<Node>(newNode)

    const pubConfig = getNodePublicConfig(ctx, node)
    if (pubConfig) {
        const newPubConfig = new PublicConfig()
        newPubConfig.id = item.event.id
        newPubConfig.ipv4 = pubConfig.ip4
        newPubConfig.gw4 = pubConfig.gw4
        newPubConfig.ipv6 = pubConfig.ip6
        newPubConfig.gw6 = pubConfig.gw6
        newPubConfig.node = newNode
        await ctx.store.save<PublicConfig>(newPubConfig)
    }

    if (node.isV43) {
        const nodeAsV43 = node.asV43
        newNode.country = validateString(ctx, nodeAsV43.country.toString())
        newNode.city = validateString(ctx, nodeAsV43.city.toString())
        newNode.secure = nodeAsV43.secureBoot ? true : false
        newNode.virtualized = nodeAsV43.virtualized ? true : false
        newNode.serialNumber = validateString(ctx, nodeAsV43.serialNumber.toString())
    }

    if (node.isV63 || node.isV105) {
        let nodeEvent
        if (node.isV63) {
            nodeEvent = node.asV63
        } else if (node.isV105) {
            nodeEvent = node.asV105
        } else {
            return
        }
        newNode.country = validateString(ctx, nodeEvent.country.toString())
        newNode.city = validateString(ctx, nodeEvent.city.toString())
        newNode.secure = nodeEvent.secureBoot ? true : false
        newNode.virtualized = nodeEvent.virtualized ? true : false
        newNode.serialNumber = validateString(ctx, nodeEvent.serialNumber.toString())
        newNode.connectionPrice = nodeEvent.connectionPrice
    }

    if (node.isV118) {
        let nodeEvent = node.asV118
        newNode.country = validateString(ctx, nodeEvent.location.country.toString())
        newNode.city = validateString(ctx, nodeEvent.location.city.toString())
        newNode.secure = nodeEvent.secureBoot ? true : false
        newNode.virtualized = nodeEvent.virtualized ? true : false
        newNode.serialNumber = nodeEvent.serialNumber ? validateString(ctx, nodeEvent.serialNumber.toString()) : 'Unknown'
        newNode.connectionPrice = nodeEvent.connectionPrice
    }

    await ctx.store.save<Node>(newNode)

    const resourcesTotal = new NodeResourcesTotal()
    resourcesTotal.node = newNode
    resourcesTotal.id = item.event.id
    resourcesTotal.sru = nodeEvent.resources.sru
    resourcesTotal.hru = nodeEvent.resources.hru
    resourcesTotal.mru = nodeEvent.resources.mru
    resourcesTotal.cru = nodeEvent.resources.cru
    await ctx.store.save<NodeResourcesTotal>(resourcesTotal)

    const interfacesPromisses = nodeEvent.interfaces.map(async (intf, index) => {
        const newInterface = new Interfaces()
        newInterface.id = item.event.id + '-' + index
        newInterface.node = newNode
        newInterface.name = validateString(ctx, intf.name.toString())
        newInterface.mac = validateString(ctx, intf.mac.toString())
        newInterface.ips = intf.ips.map(ip => validateString(ctx, ip.toString())).join(',')
        await ctx.store.save<Interfaces>(newInterface)
    })

    await Promise.all(interfacesPromisses)
}

export async function nodeUpdated(
    ctx: Ctx,
    item: EventItem<'TfgridModule.NodeUpdated', { event: { args: true } }>,
    timestamp: bigint
) {
    const node = new TfgridModuleNodeUpdatedEvent(ctx, item.event)

    let nodeEvent
    if (node.isV9) {
        nodeEvent = node.asV9
    } else if (node.isV28) {
        nodeEvent = node.asV28
    } else if (node.isV43) {
        nodeEvent = node.asV43
    } else if (node.isV63) {
        nodeEvent = node.asV63
    } else if (node.isV105) {
        nodeEvent = node.asV105
    } else if (node.isV118) {
        nodeEvent = node.asV118
    }

    if (!nodeEvent) {
        ctx.log.error({ eventName: item.name }, `found Node with unknown version! make sure types are updated`);
        return
    }
    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeEvent.id }, relations: { location: true, interfaces: true } })

    if (!savedNode) return

    savedNode.gridVersion = nodeEvent.version
    savedNode.farmID = nodeEvent.farmId
    savedNode.nodeID = nodeEvent.id
    savedNode.twinID = nodeEvent.twinId
    savedNode.updatedAt = timestamp
    savedNode.farmingPolicyId = nodeEvent.farmingPolicyId

    // Recalculate total / free resoures when a node get's updated
    let resourcesTotal = await ctx.store.get(NodeResourcesTotal, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })
    if (resourcesTotal) {
        resourcesTotal.sru = nodeEvent.resources.sru
        resourcesTotal.hru = nodeEvent.resources.hru
        resourcesTotal.mru = nodeEvent.resources.mru
        resourcesTotal.cru = nodeEvent.resources.cru
        await ctx.store.save<NodeResourcesTotal>(resourcesTotal)
    }

    if (node.isV9) {
        nodeEvent = node.asV9
        savedNode.country = validateString(ctx, nodeEvent.country.toString())
        savedNode.city = validateString(ctx, nodeEvent.city.toString())
    }

    if (node.isV118) {
        nodeEvent = node.asV118
        savedNode.country = validateString(ctx, nodeEvent.location.country.toString())
        savedNode.city = validateString(ctx, nodeEvent.location.city.toString())
    }

    if (savedNode.location) {
        const location = await ctx.store.get(Location, { where: { id: savedNode.location.id } })
        if (location) {
            location.latitude = validateString(ctx, nodeEvent.location.latitude.toString())
            location.longitude = validateString(ctx, nodeEvent.location.longitude.toString())
            await ctx.store.save<Location>(location)
            savedNode.location = location
        }
    }

    if (node.isV28) {
        const nodeAsV28 = node.asV28
        savedNode.country = validateString(ctx, nodeAsV28.country.toString())
        savedNode.city = validateString(ctx, nodeAsV28.city.toString())

        savedNode.certification = nodeAsV28.certificationType
            ? parseNodeCertification(nodeAsV28.certificationType.__kind.toString())
            : NodeCertification.Diy
    }

    if (node.isV43) {
        const nodeAsV43 = node.asV43
        savedNode.country = validateString(ctx, nodeAsV43.country.toString())
        savedNode.city = validateString(ctx, nodeAsV43.city.toString())
        savedNode.secure = nodeAsV43.secureBoot ? true : false
        savedNode.virtualized = nodeAsV43.virtualized ? true : false
        savedNode.serialNumber = validateString(ctx, nodeAsV43.serialNumber.toString())
        savedNode.certification = nodeAsV43.certificationType
            ? parseNodeCertification(nodeAsV43.certificationType.__kind.toString())
            : NodeCertification.Diy
    }

    if (node.isV63 || node.isV105) {
        let nodeEvent
        if (node.isV63) {
            nodeEvent = node.asV63
        } else if (node.isV105) {
            nodeEvent = node.asV105
        } else {
            return
        }
        savedNode.country = validateString(ctx, nodeEvent.country.toString())
        savedNode.city = validateString(ctx, nodeEvent.city.toString())
        savedNode.secure = nodeEvent.secureBoot ? true : false
        savedNode.virtualized = nodeEvent.virtualized ? true : false
        savedNode.serialNumber = validateString(ctx, nodeEvent.serialNumber.toString())
        savedNode.certification = nodeEvent.certification
            ? parseNodeCertification(nodeEvent.certification.__kind.toString())
            : NodeCertification.Diy
    }

    if (node.isV118) {
        const nodeEvent = node.asV118

        savedNode.country = validateString(ctx, nodeEvent.location.country.toString())
        savedNode.city = validateString(ctx, nodeEvent.location.city.toString())
        savedNode.secure = nodeEvent.secureBoot ? true : false
        savedNode.virtualized = nodeEvent.virtualized ? true : false
        savedNode.serialNumber = nodeEvent.serialNumber ? validateString(ctx, nodeEvent.serialNumber.toString()) : 'Unknown'
        savedNode.certification = nodeEvent.certification
            ? parseNodeCertification(nodeEvent.certification.__kind.toString())
            : NodeCertification.Diy
    }

    // First remove all ifs
    const nodeIfs = await ctx.store.find(Interfaces, { where: { node: { nodeID: savedNode.nodeID } } })
    await ctx.store.remove(nodeIfs)

    // Save ones from update event
    await Promise.all(nodeEvent.interfaces.map(async (intf, index) => {
        const newInterface = new Interfaces()
        newInterface.id = item.event.id + '-' + index
        newInterface.name = validateString(ctx, intf.name.toString())
        newInterface.mac = validateString(ctx, intf.mac.toString())
        newInterface.ips = intf.ips.map(ip => validateString(ctx, ip.toString())).join(',')
        newInterface.node = savedNode
        await ctx.store.save<Interfaces>(newInterface)

    }))

    await ctx.store.save<Node>(savedNode)
}

export async function nodeDeleted(
    ctx: Ctx,
    item: EventItem<'TfgridModule.NodeDeleted', { event: { args: true } }>,
) {
    const nodeID = new TfgridModuleNodeDeletedEvent(ctx, item.event).asV9

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID }, relations: { location: true, interfaces: true } })

    if (savedNode) {
        const resourcesTotal = await ctx.store.find(NodeResourcesTotal, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })
        if (resourcesTotal) {
            const p = resourcesTotal.map(r => ctx.store.remove(r))
            await Promise.all(p)
        }

        const pubConfig = await ctx.store.get(PublicConfig, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })
        if (pubConfig) {
            await ctx.store.remove(pubConfig)
        }

        const intfs = await ctx.store.find(Interfaces, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })
        const promises = intfs.map(intf => {
            return ctx.store.remove(intf)
        })
        await Promise.all(promises)

        await ctx.store.remove(savedNode)
    }
}

export async function nodeUptimeReported(ctx: Ctx): Promise<void> {
    let uptimes = collectUptimeEvents(ctx)

    let touchedNodes = new Map(
        (await ctx.store.find(Node, {
            where: {
                nodeID: In([...new Set(uptimes.map(up => up.event.nodeID)).keys()])
            }, relations: { location: true, interfaces: true }
        })).map(n => [n.nodeID, n])
    )

    for (let up of uptimes) {
        let node = touchedNodes.get(up.event.nodeID)
        if (node) {
            node.uptime = up.event.uptime
            node.updatedAt = BigInt(up.block.timestamp) / BigInt(1000)
        }
    }

    await ctx.store.save(uptimes.map(up => up.event))
    await ctx.store.save([...touchedNodes.values()])
}


function collectUptimeEvents(ctx: Ctx): { block: SubstrateBlock, event: UptimeEvent }[] {
    let list: { block: SubstrateBlock, event: UptimeEvent }[] = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name === "TfgridModule.NodeUptimeReported") {
                const [nodeID, now, uptime] = new TfgridModuleNodeUptimeReportedEvent(ctx, item.event).asV9
                const event = new UptimeEvent()
                event.id = item.event.id
                event.nodeID = nodeID
                event.timestamp = now
                event.uptime = uptime
                list.push({
                    block: block.header,
                    event
                })
            }
        }
    }
    return list
}

export async function nodePublicConfigStored(
    ctx: Ctx,
    item: EventItem<'TfgridModule.NodePublicConfigStored', { event: { args: true } }>
) {
    const storedEvent = new TfgridModuleNodePublicConfigStoredEvent(ctx, item.event)

    let nodeID, config
    let ipv4, ipv6, gw4, gw6, domain

    if (storedEvent.isV12) {
        [nodeID, config] = storedEvent.asV12
        ipv4 = validateString(ctx, config.ipv4.toString())
        ipv6 = validateString(ctx, config.ipv6.toString())
        gw4 = validateString(ctx, config.gw4.toString())
        gw6 = validateString(ctx, config.gw6.toString())
        domain = config.domain.toString()
    } else if (storedEvent.isV105) {
        [nodeID, config] = storedEvent.asV105
        return await handlePublicConfigV105(ctx, item.event.id, nodeID, config)
    } else {
        return
    }

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID }, relations: { location: true, interfaces: true } })
    if (!savedNode) return

    let publicConfig = await ctx.store.get(PublicConfig, { where: { node: { nodeID: savedNode.nodeID } }, relations: { node: true } })

    if (!publicConfig) {
        publicConfig = new PublicConfig()
        publicConfig.id = item.event.id
        publicConfig.node = savedNode
    }

    publicConfig.ipv4 = ipv4
    publicConfig.ipv6 = ipv6
    publicConfig.gw4 = gw4
    publicConfig.gw6 = gw6
    publicConfig.domain = domain || ''

    await ctx.store.save<PublicConfig>(publicConfig)
}

async function handlePublicConfigV105(ctx: Ctx, eventID: string, nodeID: number, config: V105PublicConfig | undefined) {
    if (!config) {
        const pubConfig = await ctx.store.get(PublicConfig, { where: { node: { nodeID } }, relations: { node: true } })
        if (pubConfig) {
            await ctx.store.remove(pubConfig)
        }
        return
    }

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID }, relations: { location: true, interfaces: true } })
    if (!savedNode) return

    let publicConfig = await ctx.store.get(PublicConfig, { where: { node: { nodeID } }, relations: { node: true } })

    if (!publicConfig) {
        publicConfig = new PublicConfig()
        publicConfig.id = eventID
        publicConfig.node = savedNode
    }

    publicConfig.ipv4 = config?.ip4.ip ? validateString(ctx, config?.ip4.ip.toString()) : null
    publicConfig.gw4 = config?.ip4.gw ? validateString(ctx, config?.ip4.gw.toString()) : null
    publicConfig.ipv6 = config?.ip6?.ip ? validateString(ctx, config?.ip6?.ip.toString()) : null
    publicConfig.gw6 = config?.ip6?.gw ? validateString(ctx, config?.ip6?.gw.toString()) : null
    publicConfig.domain = config?.domain ? validateString(ctx, config.domain.toString()) : null

    await ctx.store.save<PublicConfig>(publicConfig)
}

export async function nodeCertificationSet(
    ctx: Ctx,
    item: EventItem<'TfgridModule.NodeCertificationSet', { event: { args: true } }>
) {
    const [nodeID, certification] = new TfgridModuleNodeCertificationSetEvent(ctx, item.event).asV63

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeID }, relations: { location: true, interfaces: true } })
    if (!savedNode) return

    savedNode.certification = parseNodeCertification(certification.__kind.toString())

    await ctx.store.save<Node>(savedNode)
}

export async function powerTargetChanged(
    ctx: Ctx,
    item: EventItem<'TfgridModule.PowerTargetChanged', { event: { args: true } }>,
    timestamp: bigint,
    block: SubstrateBlock
) {
    const { farmId, nodeId, powerTarget } = new TfgridModulePowerTargetChangedEvent(ctx, item.event).asV125

    let target = Power.Up
    switch (powerTarget.__kind) {
        case 'Up':
            target = Power.Up
            break
        case 'Down':
            target = Power.Down
            break
    }
    let powerReported = new PowerTargetReport()
    powerReported.id = item.event.id
    powerReported.farmID = farmId
    powerReported.nodeID = nodeId
    powerReported.newPowerTarget = target
    powerReported.block = block.height
    powerReported.timestamp = timestamp

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeId }, relations: { location: true, interfaces: true } })
    if (!savedNode) return

    assert(savedNode.farmID === farmId)
    assert(savedNode.nodeID === nodeId)

    if (!savedNode.power) {
        savedNode.power = new NodePower()
        savedNode.power.state = PowerState.Up
    }
    savedNode.power.target = target
    await ctx.store.save<Node>(savedNode)
    await ctx.store.save<PowerTargetReport>(powerReported)
}

export async function powerStateChanged(
    ctx: Ctx,
    item: EventItem<'TfgridModule.PowerStateChanged', { event: { args: true } }>,
    timestamp: bigint,
    block: SubstrateBlock
) {
    const { farmId, nodeId, powerState } = new TfgridModulePowerStateChangedEvent(ctx, item.event).asV125

    let state = PowerState.Up
    switch (powerState.__kind) {
        case 'Up':
            state = PowerState.Up
            break
        case 'Down':
            state = PowerState.Down
            break
    }

    let powerReported = new PowerStateReport()
    powerReported.id = item.event.id
    powerReported.farmID = farmId
    powerReported.nodeID = nodeId
    powerReported.newPowerState = state
    powerReported.block = block.height
    powerReported.timestamp = timestamp

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeId }, relations: { location: true, interfaces: true } })
    if (!savedNode) return

    if (!savedNode.power) {
        savedNode.power = new NodePower()
        savedNode.power.target = Power.Up
    }
    savedNode.power.state = state
    await ctx.store.save<Node>(savedNode)
    await ctx.store.save<PowerStateReport>(powerReported)
}

export async function nodeExtraFeeSet(
    ctx: Ctx,
    item: EventItem<'SmartContractModule.NodeExtraFeeSet', { event: { args: true } }>
) {
    const { nodeId, extraFee } = new SmartContractModuleNodeExtraFeeSetEvent(ctx, item.event).asV140

    const savedNode = await ctx.store.get(Node, { where: { nodeID: nodeId }, relations: { location: true, interfaces: true } })
    if (!savedNode) return

    savedNode.extraFee = extraFee
    // Also mark the node as dedicated if the fee is not 0
    savedNode.dedicated = extraFee > 0

    await ctx.store.save<Node>(savedNode)
}

interface NodePublicConfig {
    ip4: string
    gw4: string
    ip6: string
    gw6: string
    domain: string
}

function getNodePublicConfig(ctx: Ctx, node: TfgridModuleNodeStoredEvent): NodePublicConfig | null | undefined {
    let nodeEvent
    if (node.isV9) {
        nodeEvent = node.asV9
        if (nodeEvent.publicConfig) {
            return {
                ip4: validateString(ctx, nodeEvent.publicConfig?.ipv4.toString()),
                gw4: validateString(ctx, nodeEvent.publicConfig?.gw4.toString()),
                ip6: validateString(ctx, nodeEvent.publicConfig?.ipv6.toString()),
                gw6: validateString(ctx, nodeEvent.publicConfig?.gw6.toString()),
                domain: validateString(ctx, nodeEvent.publicConfig?.domain.toString())
            }
        }
    } else if (node.isV28) {
        nodeEvent = node.asV28
        if (nodeEvent.publicConfig) {
            return {
                ip4: validateString(ctx, nodeEvent.publicConfig?.ipv4.toString()),
                gw4: validateString(ctx, nodeEvent.publicConfig?.gw4.toString()),
                ip6: validateString(ctx, nodeEvent.publicConfig?.ipv6.toString()),
                gw6: validateString(ctx, nodeEvent.publicConfig?.gw6.toString()),
                domain: validateString(ctx, nodeEvent.publicConfig?.domain.toString())
            }
        }
    } else if (node.isV43) {
        nodeEvent = node.asV43
        if (nodeEvent.publicConfig) {
            return {
                ip4: validateString(ctx, nodeEvent.publicConfig?.ipv4.toString()),
                gw4: validateString(ctx, nodeEvent.publicConfig?.gw4.toString()),
                ip6: validateString(ctx, nodeEvent.publicConfig?.ipv6.toString()),
                gw6: validateString(ctx, nodeEvent.publicConfig?.gw6.toString()),
                domain: validateString(ctx, nodeEvent.publicConfig?.domain.toString())
            }
        }
    } else if (node.isV63) {
        nodeEvent = node.asV63
        if (nodeEvent.publicConfig) {
            return {
                ip4: validateString(ctx, nodeEvent.publicConfig?.ipv4.toString()),
                gw4: validateString(ctx, nodeEvent.publicConfig?.gw4.toString()),
                ip6: validateString(ctx, nodeEvent.publicConfig?.ipv6.toString()),
                gw6: validateString(ctx, nodeEvent.publicConfig?.gw6.toString()),
                domain: validateString(ctx, nodeEvent.publicConfig?.domain.toString())
            }
        }
    } else if (node.isV105 || node.isV118) {
        nodeEvent = node.isV105? node.asV105:node.asV118
        if (nodeEvent.publicConfig) {
            let domain = ''
            if (nodeEvent.publicConfig.domain) {
                domain = nodeEvent.publicConfig.domain.toString()
            }
            return {
                ip4: validateString(ctx, nodeEvent.publicConfig?.ip4.ip.toString()),
                gw4: validateString(ctx, nodeEvent.publicConfig?.ip4.gw.toString()),
                ip6: validateString(ctx, nodeEvent.publicConfig?.ip6?.ip.toString() || ''),
                gw6: validateString(ctx, nodeEvent.publicConfig?.ip6?.gw.toString() || ''),
                domain
            }
        }
    } else {
        ctx.log.error(`found Node with unknown version during parsing NodePublicConfig! make sure types are updated`);
        return null
    }

    return null
}

// validateString checks if the string includes '\x00' which is not accepted by postgres
// if so, it replaces the string with invalid and logs the error
export function validateString(ctx: Ctx, str: string): string {
    if (str.includes('\x00')) {
        ctx.log.error(`invalid string containing "\\x00": ${str}`)
        return "invalid"
    }

    return str
}