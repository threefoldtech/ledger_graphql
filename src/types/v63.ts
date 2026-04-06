import type {Result, Option} from './support'

export type FarmCertification = FarmCertification_NotCertified | FarmCertification_Gold

export interface FarmCertification_NotCertified {
    __kind: 'NotCertified'
}

export interface FarmCertification_Gold {
    __kind: 'Gold'
}

export interface Farm {
    version: number
    id: number
    name: Uint8Array
    twinId: number
    pricingPolicyId: number
    certification: FarmCertification
    publicIps: PublicIP[]
    dedicatedFarm: boolean
    farmingPolicyLimits: (FarmingPolicyLimit | undefined)
}

export interface FarmingPolicy {
    version: number
    id: number
    name: Uint8Array
    cu: number
    su: number
    nu: number
    ipv4: number
    minimalUptime: number
    policyCreated: number
    policyEnd: number
    immutable: boolean
    default: boolean
    nodeCertification: NodeCertification
    farmCertification: FarmCertification
}

export type NodeCertification = NodeCertification_Diy | NodeCertification_Certified

export interface NodeCertification_Diy {
    __kind: 'Diy'
}

export interface NodeCertification_Certified {
    __kind: 'Certified'
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

export interface PublicIP {
    ip: Uint8Array
    gateway: Uint8Array
    contractId: bigint
}

export interface FarmingPolicyLimit {
    farmingPolicyId: number
    cu: (bigint | undefined)
    su: (bigint | undefined)
    end: (bigint | undefined)
    nodeCount: (number | undefined)
    nodeCertification: boolean
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
