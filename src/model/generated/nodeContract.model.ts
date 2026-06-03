import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {ContractState} from "./_contractState"
import {ContractResources} from "./contractResources.model"

@Entity_()
export class NodeContract {
    constructor(props?: Partial<NodeContract>) {
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

    @Index_()
    @Column_("int4", {nullable: false})
    nodeID!: number

    @Column_("text", {nullable: false})
    deploymentData!: string

    @Column_("text", {nullable: false})
    deploymentHash!: string

    @Column_("int4", {nullable: false})
    numberOfPublicIPs!: number

    @Index_()
    @Column_("varchar", {length: 11, nullable: false})
    state!: ContractState

    @Index_()
    @ManyToOne_(() => ContractResources, {nullable: true})
    resourcesUsed!: ContractResources | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    createdAt!: bigint

    @Column_("int4", {nullable: true})
    solutionProviderID!: number | undefined | null
}
