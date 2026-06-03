import type {Result, Option} from './support'

export interface Twin {
    id: number
    accountId: Uint8Array
    relay: (Uint8Array | undefined)
    entities: EntityProof[]
    pk: (Uint8Array | undefined)
}

export interface EntityProof {
    entityId: number
    signature: Uint8Array
}
