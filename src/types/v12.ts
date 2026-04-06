import type {Result, Option} from './support'

export interface PublicConfig {
    ipv4: Uint8Array
    ipv6: Uint8Array
    gw4: Uint8Array
    gw6: Uint8Array
    domain: Uint8Array
}
