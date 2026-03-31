import type {Result, Option} from './support'

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
    certificationType: CertificationType
    secureBoot: boolean
    virtualized: boolean
    serialNumber: Uint8Array
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

export type CertificationType = CertificationType_Diy | CertificationType_Certified

export interface CertificationType_Diy {
    __kind: 'Diy'
}

export interface CertificationType_Certified {
    __kind: 'Certified'
}
