import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Farm} from "./farm.model"

@Entity_()
export class PublicIp {
    constructor(props?: Partial<PublicIp>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Farm, {nullable: true})
    farm!: Farm

    @Column_("text", {nullable: false})
    gateway!: string

    @Index_()
    @Column_("text", {nullable: false})
    ip!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    contractId!: bigint
}
