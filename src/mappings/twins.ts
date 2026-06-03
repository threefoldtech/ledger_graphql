import * as ss58 from "@subsquid/ss58";
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Ctx } from '../processor'
import { SubstrateBlock } from '@subsquid/substrate-processor'

import { Twin } from "../model";
import { TfgridModuleTwinStoredEvent, TfgridModuleTwinDeletedEvent, TfgridModuleTwinUpdatedEvent } from "../types/events";
import { validateString } from "./nodes";

export async function twinStored(
    ctx: Ctx,
    item: EventItem<'TfgridModule.TwinStored', { event: { args: true } }>
) {
    const twin = getTwinCreate(ctx, item)

    const newTwin = new Twin()

    newTwin.id = item.event.id
    newTwin.gridVersion = twin.version
    newTwin.twinID = twin.twinID
    newTwin.accountID = twin.accountID
    newTwin.relay = twin.relay
    newTwin.publicKey = twin.pk

    await ctx.store.save<Twin>(newTwin)
}

export async function twinUpdated(
    ctx: Ctx,
    item: EventItem<'TfgridModule.TwinUpdated', { event: { args: true } }>
) {
    const twin = getTwinUpdate(ctx, item)

    const savedTwin: any = await ctx.store.get(Twin, { where: { twinID: twin.twinID } })
    if (!savedTwin) return

    savedTwin.relay = twin.relay
    savedTwin.publicKey = twin.pk
    savedTwin.gridVersion = twin.version
    savedTwin.accountID = twin.accountID

    await ctx.store.save<Twin>(savedTwin)
}

export async function twinDeleted(
    ctx: Ctx,
    item: EventItem<'TfgridModule.TwinDeleted', { event: { args: true } }>
) {
    const twinDeletedEvent = new TfgridModuleTwinDeletedEvent(ctx, item.event).asV9

    const savedTwin: any = await ctx.store.get(Twin, { where: { twinID: twinDeletedEvent } })
    if (!savedTwin) return

    await ctx.store.remove<Twin>(savedTwin)
}

export async function twinCreateOrUpdateOrDelete(ctx: Ctx): Promise<[Twin[], Twin[], Twin[]]> {
    let newTwins = []
    let updatedTwins = []
    let deletedTwins = []
    for (let block of ctx.blocks) {
        for (let item of block.items) {
            if (item.name === "TfgridModule.TwinStored") {
                const twin = getTwinCreate(ctx, item)

                const newTwin = new Twin()

                newTwin.id = item.event.id
                newTwin.gridVersion = twin.version
                newTwin.twinID = twin.twinID
                newTwin.accountID = twin.accountID
                newTwin.relay = twin.relay
                newTwin.publicKey = twin.pk

                newTwins.push(newTwin)
            }
            if (item.name === "TfgridModule.TwinUpdated") {
                const twin = getTwinUpdate(ctx, item)

                const foundInNewListIndex: number = newTwins.findIndex(t => t.twinID == twin.twinID);
                if (foundInNewListIndex != -1) {
                    const savedTwin: Twin = newTwins[foundInNewListIndex]
                    savedTwin.relay = twin.relay
                    savedTwin.publicKey = twin.pk
                    savedTwin.gridVersion = twin.version
                    newTwins[foundInNewListIndex] = savedTwin
                    continue
                }

                const foundInUpdatedListIndex: number = updatedTwins.findIndex(t => t.twinID == twin.twinID);
                if (foundInUpdatedListIndex != -1) {
                    let savedTwin: Twin = updatedTwins[foundInUpdatedListIndex]
                    savedTwin.relay = twin.relay
                    savedTwin.publicKey = twin.pk
                    savedTwin.gridVersion = twin.version
                    updatedTwins[foundInUpdatedListIndex] = savedTwin
                    continue
                }

                const savedTwin: any = await ctx.store.get(Twin, { where: { twinID: twin.twinID } })
                if (!savedTwin) continue
                savedTwin.relay = twin.relay
                savedTwin.publicKey = twin.pk
                savedTwin.gridVersion = twin.version
                updatedTwins.push(savedTwin)
            }
            if (item.name === "TfgridModule.TwinDeleted") {
                const twinDeletedEvent = new TfgridModuleTwinDeletedEvent(ctx, item.event).asV9

                const savedTwin = await ctx.store.get(Twin, { where: { twinID: twinDeletedEvent } })
                if (savedTwin) {
                    deletedTwins.push(savedTwin)
                }
            }
        }
    }

    return [newTwins, updatedTwins, deletedTwins]
}

function getTwinCreate(
    ctx: Ctx,
    item: EventItem<'TfgridModule.TwinStored', { event: { args: true } }>
): TwinEvent {
    let id = ""
    let twinID = 0
    let version = 0
    let relay = ""
    let accountID = ""
    let pk = ""

    const twinEvent = new TfgridModuleTwinStoredEvent(ctx, item.event)
    let twin
    if (twinEvent.isV9) {
        twin = twinEvent.asV9
        id = item.event.id
        twinID = twin.id
        version = twin.version
        relay = validateString(ctx, twin.ip.toString())
        accountID = ss58.codec("substrate").encode(twin.accountId)
    } else if (twinEvent.isV125) {
        twin = twinEvent.asV125
        id = item.event.id
        twinID = twin.id
        if (twin.relay) {
            relay = validateString(ctx, twin.relay?.toString())
        }
        accountID = ss58.codec("substrate").encode(twin.accountId)
        if (twin.pk) {
            pk = '0x' + Buffer.from(twin.pk).toString('hex');
        }
    }

    return {
        id,
        twinID,
        version,
        relay,
        accountID,
        pk
    }
}

function getTwinUpdate(
    ctx: Ctx,
    item: EventItem<'TfgridModule.TwinUpdated', { event: { args: true } }>
): TwinEvent {
    let id = ""
    let twinID = 0
    let version = 0
    let relay = ""
    let accountID = ""
    let pk = ""

    const twinEvent = new TfgridModuleTwinUpdatedEvent(ctx, item.event)
    let twin
    if (twinEvent.isV9) {
        twin = twinEvent.asV9
        id = item.event.id
        twinID = twin.id
        version = twin.version
        relay = validateString(ctx, twin.ip.toString())
        accountID = ss58.codec("substrate").encode(twin.accountId)
    } else if (twinEvent.isV125) {
        twin = twinEvent.asV125
        id = item.event.id
        twinID = twin.id
        if (twin.relay) {
            relay = validateString(ctx, twin.relay?.toString())
        }
        accountID = ss58.codec("substrate").encode(twin.accountId)
        if (twin.pk) {
            pk = validateString(ctx, '0x' + Buffer.from(twin.pk).toString('hex'));
        }
    }

    return {
        id,
        twinID,
        version,
        relay,
        accountID,
        pk
    }
}

interface TwinEvent {
    id: string
    twinID: number
    version: number
    relay: string
    accountID: string
    pk: string
}