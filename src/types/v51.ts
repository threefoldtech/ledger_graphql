import type {Result, Option} from './support'

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
    discountForDedicatedNodes: number
}

export interface Policy {
    value: number
    unit: Unit
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
