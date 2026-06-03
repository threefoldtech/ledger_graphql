import type {Result, Option} from './support'

export interface NruConsumption {
    contractId: bigint
    timestamp: bigint
    window: bigint
    nru: bigint
}

export interface ContractResources {
    contractId: bigint
    used: Resources
}

export interface Resources {
    hru: bigint
    sru: bigint
    cru: bigint
    mru: bigint
}
