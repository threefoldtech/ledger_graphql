import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Ctx } from '../processor'

import { ServiceContract, ServiceContractState, ServiceContractBill } from "../model";
import { SmartContractModuleServiceContractCreatedEvent, SmartContractModuleServiceContractMetadataSetEvent, SmartContractModuleServiceContractFeesSetEvent, SmartContractModuleServiceContractApprovedEvent, SmartContractModuleServiceContractCanceledEvent, SmartContractModuleServiceContractBilledEvent } from "../types/events";
import { validateString } from "./nodes";

export async function serviceContractCreated(
    ctx: Ctx,
    item: EventItem<'SmartContractModule.ServiceContractCreated', { event: { args: true } }>,
) {
    let serviceContractCreatedEvent = new SmartContractModuleServiceContractCreatedEvent(ctx, item.event).asV123

    let serviceContract = new ServiceContract()

    serviceContract.id = item.event.id
    serviceContract.serviceContractID = serviceContractCreatedEvent.serviceContractId
    serviceContract.serviceTwinID = serviceContractCreatedEvent.serviceTwinId
    serviceContract.consumerTwinID = serviceContractCreatedEvent.consumerTwinId
    serviceContract.baseFee = BigInt(0)
    serviceContract.variableFee = BigInt(0)
    serviceContract.metadata = ""
    serviceContract.acceptedByService = false
    serviceContract.acceptedByConsumer = false
    serviceContract.lastBill = BigInt(0)
    serviceContract.state = ServiceContractState.Created
    await ctx.store.save<ServiceContract>(serviceContract)
}

export async function serviceContractMetadataSet(
    ctx: Ctx,
    item: EventItem<'SmartContractModule.ServiceContractMetadataSet', { event: { args: true } }>,
) {
    let serviceContractMetadataSetEvent = new SmartContractModuleServiceContractMetadataSetEvent(ctx, item.event).asV123

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractID: serviceContractMetadataSetEvent.serviceContractId } })
    if (savedServiceContract) {
        savedServiceContract.metadata = validateString(ctx, serviceContractMetadataSetEvent.metadata.toString())

        let state = ServiceContractState.Created
        switch (serviceContractMetadataSetEvent.state.__kind) {
            case 'AgreementReady':
                state = ServiceContractState.AgreementReady
                break
            case 'ApprovedByBoth':
                state = ServiceContractState.ApprovedByBoth
                break
        }
        savedServiceContract.state = state
        await ctx.store.save<ServiceContract>(savedServiceContract)
    }
}

export async function serviceContractFeesSet(
    ctx: Ctx,
    item: EventItem<'SmartContractModule.ServiceContractFeesSet', { event: { args: true } }>,
) {
    let serviceContractFeesSetEvent = new SmartContractModuleServiceContractFeesSetEvent(ctx, item.event).asV123

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractID: serviceContractFeesSetEvent.serviceContractId } })
    if (savedServiceContract) {
        savedServiceContract.baseFee = serviceContractFeesSetEvent.baseFee
        savedServiceContract.variableFee = serviceContractFeesSetEvent.variableFee

        let state = ServiceContractState.Created
        switch (serviceContractFeesSetEvent.state.__kind) {
            case 'AgreementReady':
                state = ServiceContractState.AgreementReady
                break
            case 'ApprovedByBoth':
                state = ServiceContractState.ApprovedByBoth
                break
        }
        savedServiceContract.state = state
        await ctx.store.save<ServiceContract>(savedServiceContract)
    }
}

export async function serviceContractApproved(
    ctx: Ctx,
    item: EventItem<'SmartContractModule.ServiceContractApproved', { event: { args: true } }>,
) {
    let serviceContractApprovedEvent = new SmartContractModuleServiceContractApprovedEvent(ctx, item.event).asV123

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractID: serviceContractApprovedEvent.serviceContractId } })
    if (savedServiceContract) {
        savedServiceContract.acceptedByService = serviceContractApprovedEvent.acceptedByService
        savedServiceContract.acceptedByConsumer = serviceContractApprovedEvent.acceptedByConsumer
        savedServiceContract.lastBill = serviceContractApprovedEvent.lastBill

        let state = ServiceContractState.Created
        switch (serviceContractApprovedEvent.state.__kind) {
            case 'AgreementReady':
                state = ServiceContractState.AgreementReady
                break
            case 'ApprovedByBoth':
                state = ServiceContractState.ApprovedByBoth
                break
        }
        savedServiceContract.state = state
        await ctx.store.save<ServiceContract>(savedServiceContract)
    }
}

export async function serviceContractCanceled(
    ctx: Ctx,
    item: EventItem<'SmartContractModule.ServiceContractCanceled', { event: { args: true } }>,
) {
    const SmartContractModuleServiceContractCanceled = new SmartContractModuleServiceContractCanceledEvent(ctx, item.event)
    let serviceContractCanceledEvent
    if (SmartContractModuleServiceContractCanceled.isV123) {
        serviceContractCanceledEvent = SmartContractModuleServiceContractCanceled.asV123
    } else if (SmartContractModuleServiceContractCanceled.isV147) {
        serviceContractCanceledEvent = SmartContractModuleServiceContractCanceled.asV147
    } else if (SmartContractModuleServiceContractCanceled.isV148) {
        serviceContractCanceledEvent = SmartContractModuleServiceContractCanceled.asV148
    }
    if (!serviceContractCanceledEvent) {
        ctx.log.error({eventName: item.name}, `found serviceContract with unknown version! make sure types are updated`);
        return
    }
    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractID: serviceContractCanceledEvent.serviceContractId } })

    if (savedServiceContract) {
        await ctx.store.remove(savedServiceContract)
    }
}

export async function serviceContractBilled(
    ctx: Ctx,
    item: EventItem<'SmartContractModule.ServiceContractBilled', { event: { args: true } }>,
) {
    const serviceContractBilledEvent = new SmartContractModuleServiceContractBilledEvent(ctx, item.event).asV123

    const serviceContractBill = new ServiceContractBill()

    serviceContractBill.id = item.event.id
    serviceContractBill.serviceContractID = serviceContractBilledEvent.serviceContract.serviceContractId
    serviceContractBill.variableAmount = serviceContractBilledEvent.bill.variableAmount
    serviceContractBill.window = serviceContractBilledEvent.bill.window
    serviceContractBill.metadata = validateString(ctx, serviceContractBilledEvent.bill.metadata.toString())
    serviceContractBill.amount = serviceContractBilledEvent.amount
    await ctx.store.save<ServiceContractBill>(serviceContractBill)

    const savedServiceContract = await ctx.store.get(ServiceContract, { where: { serviceContractID: serviceContractBilledEvent.serviceContract.serviceContractId } })
    if (savedServiceContract) {
        savedServiceContract.lastBill = serviceContractBilledEvent.serviceContract.lastBill
        await ctx.store.save<ServiceContract>(savedServiceContract)
    }
}