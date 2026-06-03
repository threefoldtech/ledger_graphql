import type {Result, Option} from './support'

export interface Twin {
    version: number
    id: number
    accountId: Uint8Array
    ip: Uint8Array
    entities: EntityProof[]
}

export interface EntityProof {
    entityId: number
    signature: Uint8Array
}
