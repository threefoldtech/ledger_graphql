import { Farm, FarmCertification, PublicIp } from "../model"
import { TfgridModuleFarmStoredEvent, TfgridModuleFarmDeletedEvent, TfgridModuleFarmUpdatedEvent, TfgridModuleFarmPayoutV2AddressRegisteredEvent, TfgridModuleFarmCertificationSetEvent } from "../types/events"
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

import { Ctx } from '../processor'

import { validateString } from "./nodes"

import * as ipaddr from 'ipaddr.js';

export function parseFarmCertification(kind: string): FarmCertification {
    switch (kind) {
        case 'Gold': return FarmCertification.Gold
        default: return FarmCertification.NotCertified
    }
}

export class FarmWithIPs {
    constructor(farmID: number, ips: PublicIp[]) {
        this.farmID = farmID
        this.publicIPs = ips
    }

    farmID: number;
    publicIPs: PublicIp[];
}

export async function farmStored(
    ctx: Ctx,
    item: EventItem<'TfgridModule.FarmStored', { event: { args: true } }>
) {
    const farmStoredEvent = new TfgridModuleFarmStoredEvent(ctx, item.event)

    let farmStoredEventParsed
    if (farmStoredEvent.isV9) {
        farmStoredEventParsed = farmStoredEvent.asV9
    } else if (farmStoredEvent.isV50) {
        farmStoredEventParsed = farmStoredEvent.asV50
    } else if (farmStoredEvent.isV63) {
        // Workaround: existing indexer snapshots were built with an old typesBundle
        // that had a typo "dedicatedFarm:" (trailing colon) in the Farm struct.
        // The stored JSON has "dedicatedFarm:" as the key, but the processor expects
        // "dedicatedFarm" (no colon). Patch with the actual value from the colon key.
        // Remove this after all indexers are resynced with the corrected typesBundle.
        const rawArgs = item.event.args as any
        rawArgs.dedicatedFarm = rawArgs['dedicatedFarm:'] ?? rawArgs.dedicatedFarm ?? false
        farmStoredEventParsed = farmStoredEvent.asV63
    }

    if (!farmStoredEventParsed) {
        ctx.log.error({ eventName: item.name }, `found farm with unknown version! make sure types are updated`);
        return
    }

    const newFarm = new Farm()

    newFarm.id = item.event.id
    newFarm.gridVersion = farmStoredEventParsed.version
    newFarm.farmID = farmStoredEventParsed.id
    newFarm.name = validateString(ctx, farmStoredEventParsed.name.toString())
    newFarm.twinID = farmStoredEventParsed.twinId
    newFarm.pricingPolicyID = farmStoredEventParsed.pricingPolicyId
    newFarm.dedicatedFarm = 'dedicatedFarm' in farmStoredEventParsed
        ? (farmStoredEventParsed as any).dedicatedFarm
        : false
    newFarm.certification = FarmCertification.NotCertified

    await ctx.store.save<Farm>(newFarm)

    const ipPromises = farmStoredEventParsed.publicIps.map((ip, index) => {
        if (!checkIPs(ctx, ip.ip.toString(), ip.gateway.toString())) {
            return Promise.resolve()
        }

        const newIP = new PublicIp()

        newIP.id = item.event.id + '-' + index

        newIP.ip = validateString(ctx, ip.ip.toString())
        newIP.gateway = validateString(ctx, ip.gateway.toString())

        newIP.contractId = ip.contractId
        newIP.farm = newFarm

        newFarm.publicIPs?.push(newIP)
        ctx.log.debug({ eventName: item.name, ip: newIP.ip }, `Public IP: ${newIP.ip} added with farm id: ${newFarm.farmID}`);
        return ctx.store.save<PublicIp>(newIP)
    })
    await Promise.all(ipPromises)
    await ctx.store.save<Farm>(newFarm)
}

function checkIPs(ctx: Ctx, ipv4_a: string, ipv4_b: string): boolean {
    try {
        // Check if both IP addresses are valid
        if (!ipaddr.isValidCIDR(ipv4_a) || !ipaddr.isValid(ipv4_b)) {
            ctx.log.warn(`One or both IP addresses are invalid. Public IP: ${ipv4_a}, Gateway: ${ipv4_b}`);
            return false;
        }
        // Parse the IP addresses
        const ip_a = ipaddr.parseCIDR(ipv4_a);
        const ip_b = ipaddr.parse(ipv4_b);

        // check if both IP addresses are the same
        if (ip_a[0].toString() == ip_b.toString()) {
            ctx.log.warn(`The IP addresses are the same. Public IP: ${ipv4_a}, Gateway: ${ipv4_b}`);
            return false;
        }

        // Check if both IP addresses are public
        if (ip_a[0].range() == 'private' || ip_b.range() == 'private') {
            ctx.log.warn(`One or both IP addresses are not public. Public IP: ${ipv4_a}, Gateway: ${ipv4_b}`);
            return false;
        }

        // Check if both IP addresses are unicast addresses
        if (ip_a[0].range() !== 'unicast' || ip_b.range() !== 'unicast') {
            ctx.log.warn(`One or both IP addresses are not unicast addresses. Public IP: ${ipv4_a}, Gateway: ${ipv4_b}`);
            return false;
        }


        // Check if the gateway is in the same subnet as the host
        if (!ip_b.match(ip_a)) {
            ctx.log.warn(`The gateway is not in the same subnet as the host. Public IP: ${ipv4_a}, Gateway: ${ipv4_b}`);
            return false;
        }

        return true;
    } catch (error: any) {
        ctx.log.error(`An error occurred: ${error.message}. Public IP: ${ipv4_a}, Gateway: ${ipv4_b}`);
        return false;
    }
}

export async function farmUpdated(
    ctx: Ctx,
    item: EventItem<'TfgridModule.FarmUpdated', { event: { args: true } }>
) {
    const farmUpdatedEvent = new TfgridModuleFarmUpdatedEvent(ctx, item.event)

    let certification = FarmCertification.NotCertified

    let farmUpdatedEventParsed
    if (farmUpdatedEvent.isV9) {
        farmUpdatedEventParsed = farmUpdatedEvent.asV9
    } else if (farmUpdatedEvent.isV50) {
        farmUpdatedEventParsed = farmUpdatedEvent.asV50
    } else if (farmUpdatedEvent.isV63) {
        // Workaround: see comment in farmStored above for the dedicatedFarm colon typo.
        const rawArgs = item.event.args as any
        rawArgs.dedicatedFarm = rawArgs['dedicatedFarm:'] ?? rawArgs.dedicatedFarm ?? false
        farmUpdatedEventParsed = farmUpdatedEvent.asV63
        certification = parseFarmCertification(farmUpdatedEvent.asV63.certification.__kind)
    }

    if (!farmUpdatedEventParsed) {
        ctx.log.error({ eventName: item.name }, `found farm with unknown version! make sure types are updated`);
        return
    }

    const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmUpdatedEventParsed.id } })
    if (!savedFarm) return

    savedFarm.gridVersion = farmUpdatedEventParsed.version
    savedFarm.name = validateString(ctx, farmUpdatedEventParsed.name.toString())
    savedFarm.twinID = farmUpdatedEventParsed.twinId
    // reason for commented the below line is that update_farm on-chain isnever meant to change the pricing policy attached to a farm
    // see here https://github.com/threefoldtech/tfchain_graphql/issues/96#issuecomment-2068325597
    // savedFarm.pricingPolicyID = farmUpdatedEventParsed.pricingPolicyId
    savedFarm.certification = certification

    let eventPublicIPs = farmUpdatedEventParsed.publicIps
    for (let index = 0; index < farmUpdatedEventParsed.publicIps.length; index++) {
        const ip = farmUpdatedEventParsed.publicIps[index]
        if (!checkIPs(ctx, ip.ip.toString(), ip.gateway.toString())) {
            continue
        }
        if (ip.ip.toString().indexOf('\x00') >= 0) {
            continue
        }
        const savedIP = await ctx.store.get(PublicIp, { where: { ip: ip.ip.toString() }, relations: { farm: true } })
        if (savedIP) {
            if (savedIP.farm.id !== savedFarm.id) {
                ctx.log.error({ eventName: item.name, ip: ip.ip.toString() }, `PublicIP: ${ip.ip.toString()} already exists on farm: ${savedIP.farm.farmID}, skipped adding it to farm with ID: ${savedFarm.farmID}`);
                continue
            }
            // Same farm — update gateway
            savedIP.gateway = validateString(ctx, ip.gateway.toString())
            savedIP.contractId = ip.contractId
            await ctx.store.save<PublicIp>(savedIP)
        } else {
            const newIP = new PublicIp()
            newIP.id = item.event.id + '-' + index
            newIP.ip = validateString(ctx, ip.ip.toString())
            newIP.gateway = validateString(ctx, ip.gateway.toString())
            newIP.contractId = ip.contractId
            newIP.farm = savedFarm
            await ctx.store.save<PublicIp>(newIP)
            ctx.log.debug({ eventName: item.name, ip: ip.ip.toString() }, `PublicIP: ${ip.ip.toString()} added with farm id: ${savedFarm.farmID}`);
        }
    }

    if ('dedicatedFarm' in farmUpdatedEventParsed) {
        savedFarm.dedicatedFarm = (farmUpdatedEventParsed as any).dedicatedFarm
    }

    await ctx.store.save<Farm>(savedFarm)

    const publicIPsOfFarm = await ctx.store.find<PublicIp>(PublicIp, { where: { farm: { id: savedFarm.id } }, relations: { farm: true } })
    for (const ip of publicIPsOfFarm) {
        if (eventPublicIPs.filter(eventIp => validateString(ctx, eventIp.ip.toString()) === ip.ip).length === 0) {
            // IP got removed from farm
            await ctx.store.remove<PublicIp>(ip)
            ctx.log.debug({ eventName: item.name, ip: ip.ip.toString() }, `PublicIP: ${ip.ip.toString()} in farm: ${savedFarm.farmID} removed from publicIPs`);
        }
    }

}

export async function farmDeleted(
    ctx: Ctx,
    item: EventItem<'TfgridModule.FarmDeleted', { event: { args: true } }>
) {
    const farmID = new TfgridModuleFarmDeletedEvent(ctx, item.event).asV9

    const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

    if (savedFarm) {
        await ctx.store.remove(savedFarm)
        ctx.log.debug({ eventName: item.name, farmID: savedFarm.farmID }, `Farm: ${savedFarm.farmID} removed from storage`);
    }
}

export async function farmPayoutV2AddressRegistered(
    ctx: Ctx,
    item: EventItem<'TfgridModule.FarmPayoutV2AddressRegistered', { event: { args: true } }>
) {
    const [farmID, stellarAddress] = new TfgridModuleFarmPayoutV2AddressRegisteredEvent(ctx, item.event).asV9

    const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

    if (savedFarm) {
        let address = ''
        if (!stellarAddress.includes(0)) {
            address = validateString(ctx, stellarAddress.toString())
        }

        savedFarm.stellarAddress = address
        await ctx.store.save<Farm>(savedFarm)
    }
}

export async function farmCertificationSet(
    ctx: Ctx,
    item: EventItem<'TfgridModule.FarmCertificationSet', { event: { args: true } }>
) {
    const [farmID, certification] = new TfgridModuleFarmCertificationSetEvent(ctx, item.event).asV63

    const savedFarm = await ctx.store.get(Farm, { where: { farmID: farmID } })

    if (!savedFarm) {
        ctx.log.error({ eventName: item.name }, `found FarmCertification with unknown version! make sure types are updated`);
        return
    }

    savedFarm.certification = parseFarmCertification(certification.__kind.toString())
    await ctx.store.save<Farm>(savedFarm)
}
