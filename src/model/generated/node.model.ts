import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Location} from "./location.model"
import {PublicConfig} from "./publicConfig.model"
import {NodeResourcesTotal} from "./nodeResourcesTotal.model"
import {Interfaces} from "./interfaces.model"
import {NodeCertification} from "./_nodeCertification"
import {NodePower} from "./_nodePower"

@Entity_()
export class Node {
    constructor(props?: Partial<Node>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    gridVersion!: number

    @Index_()
    @Column_("int4", {nullable: false})
    nodeID!: number

    @Index_()
    @Column_("int4", {nullable: false})
    farmID!: number

    @Index_()
    @Column_("int4", {nullable: false})
    twinID!: number

    @Index_()
    @ManyToOne_(() => Location, {nullable: true})
    location!: Location

    @Column_("text", {nullable: true})
    country!: string | undefined | null

    @Column_("text", {nullable: true})
    city!: string | undefined | null



    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    uptime!: bigint | undefined | null

    @Column_("int4", {nullable: false})
    created!: number

    @Column_("int4", {nullable: false})
    farmingPolicyId!: number

    @OneToMany_(() => Interfaces, e => e.node)
    interfaces!: Interfaces[]

    @Index_()
    @Column_("varchar", {length: 9, nullable: true})
    certification!: NodeCertification | undefined | null

    @Column_("bool", {nullable: true})
    secure!: boolean | undefined | null

    @Column_("bool", {nullable: true})
    virtualized!: boolean | undefined | null

    @Column_("text", {nullable: true})
    serialNumber!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    createdAt!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    updatedAt!: bigint

    @Column_("int4", {nullable: true})
    connectionPrice!: number | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new NodePower(undefined, obj)}, nullable: true})
    power!: NodePower | undefined | null

    @Column_("bool", {nullable: false})
    dedicated!: boolean

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    extraFee!: bigint | undefined | null
}
