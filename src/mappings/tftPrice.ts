import { Ctx } from '../processor'
import { SubstrateBlock } from '@subsquid/substrate-processor';
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { TftPriceModulePriceStoredEvent, TftPriceModuleAveragePriceStoredEvent } from '../types/events';
import { PriceStored, AveragePriceStored } from '../model';
import { ParserFixPointFn, parseI16F16 } from '@encointer/util'
import BN from 'bn.js'
import { BigDecimal } from '@subsquid/big-decimal';

export async function priceStored(
    ctx: Ctx,
    item: EventItem<'TFTPriceModule.PriceStored', { event: { args: true } }>,
    timestamp: bigint,
    block: SubstrateBlock
) {
    let priceStoredEvent = new TftPriceModulePriceStoredEvent(ctx, item.event)

    let priceEvent
    if (priceStoredEvent.isV9) {
        priceEvent = BigDecimal(parseI16F16(new BN(priceStoredEvent.asV9[0], 'le'))) // [Uint8Array, Uint8Array] <- U16F16, AccountId
        ctx.log.trace(`V9: block number: ${block.height}, timestamp: ${timestamp}, Price: ${priceEvent}, Raw: ${priceStoredEvent.asV9[0]}`)

    } else if (priceStoredEvent.isV19) {
        priceEvent = BigDecimal(parseI16F16(new BN(priceStoredEvent.asV19, 'le'))) // Uint8Array <-U16F16
        ctx.log.trace(`V19: block number: ${block.height}, timestamp: ${timestamp}, Price: ${priceEvent}, Raw: ${priceStoredEvent.asV19}`)

    } else if (priceStoredEvent.isV101) {
        priceEvent = BigDecimal(priceStoredEvent.asV101 / 1000) // number <- u32 (milli USD)
        ctx.log.trace(`V101: block number: ${block.height}, timestamp: ${timestamp}, Price: ${priceEvent}, Raw: ${priceStoredEvent.asV101}`)
    }

    if (!priceEvent) {
        ctx.log.error({ eventName: item.name }, `found PriceStored with unknown version! make sure types are updated`);
        return
    }

    let newPrice = new PriceStored()
    newPrice.id = item.event.id
    newPrice.block = block.height
    newPrice.timestamp = timestamp
    newPrice.newPrice = priceEvent

    await ctx.store.save<PriceStored>(newPrice)
}

export async function averagePriceStored(
    ctx: Ctx,
    item: EventItem<'TFTPriceModule.AveragePriceStored', { event: { args: true } }>,
    timestamp: bigint,
    block: SubstrateBlock
) {
    let averagePriceStoredEvent = new TftPriceModuleAveragePriceStoredEvent(ctx, item.event)

    let priceEvent
    if (averagePriceStoredEvent.isV105) {
        priceEvent = BigDecimal(averagePriceStoredEvent.asV105 / 1000) // number <- u32 (milli USD)
    }

    if (!priceEvent) {
        ctx.log.error({ eventName: item.name }, `found averagePriceStored with unknown version! make sure types are updated`);
        return
    }

    let newPrice = new AveragePriceStored()
    newPrice.id = item.event.id
    newPrice.block = block.height
    newPrice.timestamp = timestamp
    newPrice.newAveragePrice = priceEvent
    ctx.log.trace(`V105: block number: ${block.height}, timestamp: ${timestamp}, Average Price: ${priceEvent}, Raw: ${averagePriceStoredEvent.asV105}`);

    await ctx.store.save<AveragePriceStored>(newPrice)
}