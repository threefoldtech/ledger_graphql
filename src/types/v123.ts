import type {Result, Option} from './support'

export interface ServiceContract {
    serviceContractId: bigint
    serviceTwinId: number
    consumerTwinId: number
    baseFee: bigint
    variableFee: bigint
    metadata: Uint8Array
    acceptedByService: boolean
    acceptedByConsumer: boolean
    lastBill: bigint
    state: ServiceContractState
}

export interface ServiceContractBill {
    variableAmount: bigint
    window: bigint
    metadata: Uint8Array
}

export type Cause = Cause_CanceledByUser | Cause_OutOfFunds

export interface Cause_CanceledByUser {
    __kind: 'CanceledByUser'
}

export interface Cause_OutOfFunds {
    __kind: 'OutOfFunds'
}

export type ServiceContractState = ServiceContractState_Created | ServiceContractState_AgreementReady | ServiceContractState_ApprovedByBoth

export interface ServiceContractState_Created {
    __kind: 'Created'
}

export interface ServiceContractState_AgreementReady {
    __kind: 'AgreementReady'
}

export interface ServiceContractState_ApprovedByBoth {
    __kind: 'ApprovedByBoth'
}
