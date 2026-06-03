import type {Result, Option} from './support'

export interface Contract {
    version: number
    state: ContractState
    contractId: bigint
    twinId: number
    contractType: ContractData
}

export interface PricingPolicy {
    version: number
    id: number
    name: Uint8Array
    su: Policy
    cu: Policy
    nu: Policy
    ipu: Policy
    uniqueName: Policy
    domainName: Policy
    foundationAccount: Uint8Array
    certifiedSalesAccount: Uint8Array
    discountForDedicationNodes: number
}

export type ContractState = ContractState_Created | ContractState_Deleted | ContractState_GracePeriod

export interface ContractState_Created {
    __kind: 'Created'
}

export interface ContractState_Deleted {
    __kind: 'Deleted'
    value: Cause
}

export interface ContractState_GracePeriod {
    __kind: 'GracePeriod'
    value: bigint
}

export type ContractData = ContractData_NodeContract | ContractData_NameContract | ContractData_RentContract

export interface ContractData_NodeContract {
    __kind: 'NodeContract'
    value: NodeContract
}

export interface ContractData_NameContract {
    __kind: 'NameContract'
    value: NameContract
}

export interface ContractData_RentContract {
    __kind: 'RentContract'
    value: RentContract
}

export interface Policy {
    value: number
    unit: Unit
}

export type Cause = Cause_CanceledByUser | Cause_OutOfFunds

export interface Cause_CanceledByUser {
    __kind: 'CanceledByUser'
}

export interface Cause_OutOfFunds {
    __kind: 'OutOfFunds'
}

export interface NodeContract {
    nodeId: number
    deploymentData: Uint8Array
    deploymentHash: Uint8Array
    publicIps: number
    publicIpsList: PublicIP[]
}

export interface NameContract {
    name: Uint8Array
}

export interface RentContract {
    nodeId: number
}

export type Unit = Unit_Bytes | Unit_Kilobytes | Unit_Megabytes | Unit_Gigabytes | Unit_Terrabytes

export interface Unit_Bytes {
    __kind: 'Bytes'
}

export interface Unit_Kilobytes {
    __kind: 'Kilobytes'
}

export interface Unit_Megabytes {
    __kind: 'Megabytes'
}

export interface Unit_Gigabytes {
    __kind: 'Gigabytes'
}

export interface Unit_Terrabytes {
    __kind: 'Terrabytes'
}

export interface PublicIP {
    ip: Uint8Array
    gateway: Uint8Array
    contractId: bigint
}
