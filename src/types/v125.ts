import type {Result, Option} from './support'

export type PowerState = PowerState_Up | PowerState_Down

export interface PowerState_Up {
    __kind: 'Up'
}

export interface PowerState_Down {
    __kind: 'Down'
    value: number
}

export type Power = Power_Up | Power_Down

export interface Power_Up {
    __kind: 'Up'
}

export interface Power_Down {
    __kind: 'Down'
}

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
