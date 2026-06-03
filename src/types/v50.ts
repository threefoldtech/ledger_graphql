import type {Result, Option} from './support'

export interface Contract {
    version: number
    state: ContractState
    contractId: bigint
    twinId: number
    contractType: ContractData
}

export interface Farm {
    version: number
    id: number
    name: Uint8Array
    twinId: number
    pricingPolicyId: number
    certificationType: CertificationType
    publicIps: PublicIP[]
    dedicatedFarm: boolean
}

export type ContractState = ContractState_Created | ContractState_Deleted

export interface ContractState_Created {
    __kind: 'Created'
}

export interface ContractState_Deleted {
    __kind: 'Deleted'
    value: Cause
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

export type CertificationType = CertificationType_Diy | CertificationType_Certified

export interface CertificationType_Diy {
    __kind: 'Diy'
}

export interface CertificationType_Certified {
    __kind: 'Certified'
}

export interface PublicIP {
    ip: Uint8Array
    gateway: Uint8Array
    contractId: bigint
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
