import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class Twin {
    constructor(props?: Partial<Twin>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    gridVersion!: number

    @Index_()
    @Column_("int4", {nullable: false})
    twinID!: number

    @Column_("text", {nullable: false})
    accountID!: string

    @Column_("text", {nullable: true})
    relay!: string | undefined | null

    @Column_("text", {nullable: true})
    publicKey!: string | undefined | null
}
