import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {ContractState} from "./_contractState"

@Entity_()
export class NameContract {
    constructor(props?: Partial<NameContract>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    gridVersion!: number

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    contractID!: bigint

    @Index_()
    @Column_("int4", {nullable: false})
    twinID!: number

    @Column_("text", {nullable: false})
    name!: string

    @Index_()
    @Column_("varchar", {length: 11, nullable: false})
    state!: ContractState

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    createdAt!: bigint

    @Column_("int4", {nullable: true})
    solutionProviderID!: number | undefined | null
}
