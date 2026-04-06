import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {DiscountLevel} from "./_discountLevel"

@Entity_()
export class ContractBillReport {
    constructor(props?: Partial<ContractBillReport>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    contractID!: bigint

    @Column_("varchar", {length: 7, nullable: false})
    discountReceived!: DiscountLevel

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    amountBilled!: bigint

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    timestamp!: bigint
}
