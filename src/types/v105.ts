import type {Result, Option} from './support'

export interface Contract {
    version: number
    state: ContractState
    contractId: bigint
    twinId: number
    contractType: ContractData
    solutionProviderId: (bigint | undefined)
}

export interface SolutionProvider {
    solutionProviderId: bigint
    providers: Provider[]
    description: Uint8Array
    link: Uint8Array
    approved: boolean
}

export interface PublicConfig {
    ip4: IP
    ip6: (IP | undefined)
    domain: (Uint8Array | undefined)
}

export interface Node {
    version: number
    id: number
    farmId: number
    twinId: number
    resources: Resources
    location: Location
    country: Uint8Array
    city: Uint8Array
    publicConfig: (PublicConfig | undefined)
    created: bigint
    farmingPolicyId: number
    interfaces: Interface[]
    certification: NodeCertification
    secureBoot: boolean
    virtualized: boolean
    serialNumber: Uint8Array
    connectionPrice: number
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

export interface Provider {
    who: Uint8Array
    take: number
}

export interface IP {
    ip: Uint8Array
    gw: Uint8Array
}

export interface Resources {
    hru: bigint
    sru: bigint
    cru: bigint
    mru: bigint
}

export interface Location {
    longitude: Uint8Array
    latitude: Uint8Array
}

export interface Interface {
    name: Uint8Array
    mac: Uint8Array
    ips: Uint8Array[]
}

export type NodeCertification = NodeCertification_Diy | NodeCertification_Certified

export interface NodeCertification_Diy {
    __kind: 'Diy'
}

export interface NodeCertification_Certified {
    __kind: 'Certified'
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
    deploymentHash: Uint8Array
    deploymentData: Uint8Array
    publicIps: number
    publicIpsList: PublicIP[]
}

export interface NameContract {
    name: Uint8Array
}

export interface RentContract {
    nodeId: number
}

export interface PublicIP {
    ip: Uint8Array
    gateway: Uint8Array
    contractId: bigint
}
