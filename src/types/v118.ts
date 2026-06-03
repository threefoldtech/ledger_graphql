import type {Result, Option} from './support'

export interface Node {
    version: number
    id: number
    farmId: number
    twinId: number
    resources: Resources
    location: Location
    publicConfig: (PublicConfig | undefined)
    created: bigint
    farmingPolicyId: number
    interfaces: Interface[]
    certification: NodeCertification
    secureBoot: boolean
    virtualized: boolean
    serialNumber: (Uint8Array | undefined)
    connectionPrice: number
}

export interface Resources {
    hru: bigint
    sru: bigint
    cru: bigint
    mru: bigint
}

export interface Location {
    city: Uint8Array
    country: Uint8Array
    latitude: Uint8Array
    longitude: Uint8Array
}

export interface PublicConfig {
    ip4: IP
    ip6: (IP | undefined)
    domain: (Uint8Array | undefined)
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

export interface IP {
    ip: Uint8Array
    gw: Uint8Array
}
