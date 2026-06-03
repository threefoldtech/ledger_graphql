import type {Result, Option} from './support'

export interface ContractBill {
    contractId: bigint
    timestamp: bigint
    discountLevel: DiscountLevel
    amountBilled: bigint
}

export interface Contract {
    version: number
    state: ContractState
    contractId: bigint
    twinId: number
    contractType: ContractData
}

export interface Entity {
    version: number
    id: number
    name: Uint8Array
    accountId: Uint8Array
    country: Uint8Array
    city: Uint8Array
}

export interface Farm {
    version: number
    id: number
    name: Uint8Array
    twinId: number
    pricingPolicyId: number
    certificationType: CertificationType
    publicIps: PublicIP[]
}

export interface FarmingPolicy {
    version: number
    id: number
    name: Uint8Array
    cu: number
    su: number
    nu: number
    ipv4: number
    timestamp: bigint
    certificationType: CertificationType
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
}

export interface Twin {
    version: number
    id: number
    accountId: Uint8Array
    ip: Uint8Array
    entities: EntityProof[]
}

export type DiscountLevel = DiscountLevel_None | DiscountLevel_Default | DiscountLevel_Bronze | DiscountLevel_Silver | DiscountLevel_Gold

export interface DiscountLevel_None {
    __kind: 'None'
}

export interface DiscountLevel_Default {
    __kind: 'Default'
}

export interface DiscountLevel_Bronze {
    __kind: 'Bronze'
}

export interface DiscountLevel_Silver {
    __kind: 'Silver'
}

export interface DiscountLevel_Gold {
    __kind: 'Gold'
}

export type ContractState = ContractState_Created | ContractState_Deleted | ContractState_OutOfFunds

export interface ContractState_Created {
    __kind: 'Created'
}

export interface ContractState_Deleted {
    __kind: 'Deleted'
}

export interface ContractState_OutOfFunds {
    __kind: 'OutOfFunds'
}

export type ContractData = ContractData_NodeContract | ContractData_NameContract

export interface ContractData_NodeContract {
    __kind: 'NodeContract'
    value: NodeContract
}

export interface ContractData_NameContract {
    __kind: 'NameContract'
    value: NameContract
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

export interface PublicConfig {
    ipv4: Uint8Array
    ipv6: Uint8Array
    gw4: Uint8Array
    gw6: Uint8Array
    domain: Uint8Array
}

export interface Interface {
    name: Uint8Array
    mac: Uint8Array
    ips: Uint8Array[]
}

export interface Policy {
    value: number
    unit: Unit
}

export interface EntityProof {
    entityId: number
    signature: Uint8Array
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
