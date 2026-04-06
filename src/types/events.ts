import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v9 from './v9'
import * as v49 from './v49'
import * as v50 from './v50'
import * as v51 from './v51'
import * as v12 from './v12'
import * as v59 from './v59'
import * as v63 from './v63'
import * as v25 from './v25'
import * as v28 from './v28'
import * as v101 from './v101'
import * as v43 from './v43'
import * as v105 from './v105'
import * as v118 from './v118'
import * as v123 from './v123'
import * as v125 from './v125'
import * as v127 from './v127'
import * as v126 from './v126'
import * as v147 from './v147'
import * as v148 from './v148'

export class BalancesTransferEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Transfer')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    get isV9(): boolean {
        return this._chain.getEventHash('Balances.Transfer') === 'dad2bcdca357505fa3c7832085d0db53ce6f902bd9f5b52823ee8791d351872c'
    }

    /**
     *  Transfer succeeded. \[from, to, value\]
     */
    get asV9(): [Uint8Array, Uint8Array, bigint] {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * Transfer succeeded.
     */
    get isV101(): boolean {
        return this._chain.getEventHash('Balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
    }

    /**
     * Transfer succeeded.
     */
    get asV101(): {from: Uint8Array, to: Uint8Array, amount: bigint} {
        assert(this.isV101)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractBilledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractBilled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractBilled') === '80f35d404149c70acbd173262c31ae49812dbb6c9f279954678dd758bb5aa239'
    }

    get asV9(): v9.ContractBill {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractCreated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractCreated') === '66add02bf570546099fea4bac24f8839006167dc1b80dd7136c271908b243276'
    }

    get asV9(): v9.Contract {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV25(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractCreated') === '9236d6ceb4b18a4a48634488b1cde9b5b395eff965ccc88c9ce3c2425d27e50f'
    }

    get asV25(): v25.Contract {
        assert(this.isV25)
        return this._chain.decodeEvent(this.event)
    }

    get isV50(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractCreated') === '824f21a7f4d646625468e03ff8a0c50449d6e0c5527edf82013d385754881c45'
    }

    get asV50(): v50.Contract {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }

    get isV59(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractCreated') === '5446945d28da7c765303d310f9ca55fc9bb46e7b5f281ac184521f913c430ee0'
    }

    get asV59(): v59.Contract {
        assert(this.isV59)
        return this._chain.decodeEvent(this.event)
    }

    get isV101(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractCreated') === '1a46e93bb259ee0953495d2ee65d31503cd4736d74c87f1fabc89ea4773bc73c'
    }

    get asV101(): v101.Contract {
        assert(this.isV101)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A contract got created
     */
    get isV105(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractCreated') === 'bc600595215d0331e91aaeff45059fe6383f3362d537b936e491fe1154d3a842'
    }

    /**
     * A contract got created
     */
    get asV105(): v105.Contract {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A contract got created
     */
    get isV147(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractCreated') === '7b1fac3eee26bad6f35e60f95445eaff64030725c074c795899e96ed831a51bc'
    }

    /**
     * A contract got created
     */
    get asV147(): v147.Contract {
        assert(this.isV147)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A contract got created
     */
    get isV148(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractCreated') === '57619064e9c1f946a9889f41afe4d6c9cfb49c07403f39eac35870a7b5588845'
    }

    /**
     * A contract got created
     */
    get asV148(): v148.Contract {
        assert(this.isV148)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractGracePeriodEndedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractGracePeriodEnded')
        this._chain = ctx._chain
        this.event = event
    }

    get isV59(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractGracePeriodEnded') === 'da3d413ec5a77ddce8b8c12c9cdd58340716a71ab4effe398cbaf249a16d0542'
    }

    get asV59(): [bigint, number, number] {
        assert(this.isV59)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A Contract grace period was ended
     */
    get isV105(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractGracePeriodEnded') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
    }

    /**
     * A Contract grace period was ended
     */
    get asV105(): {contractId: bigint, nodeId: number, twinId: number} {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractGracePeriodStartedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractGracePeriodStarted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV59(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractGracePeriodStarted') === 'e6ffbb3cdd02a660fb04c1fb606cae70e4a388774028c58e59a98d56f3654371'
    }

    get asV59(): [bigint, number, number, bigint] {
        assert(this.isV59)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A Contract grace period is triggered
     */
    get isV105(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractGracePeriodStarted') === '5c4b7518ed686396094c34c59a2f5d1cd0da102a76c852ec194b5c72a0faf79e'
    }

    /**
     * A Contract grace period is triggered
     */
    get asV105(): {contractId: bigint, nodeId: number, twinId: number, blockNumber: bigint} {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleContractUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ContractUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractUpdated') === '66add02bf570546099fea4bac24f8839006167dc1b80dd7136c271908b243276'
    }

    get asV9(): v9.Contract {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV25(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractUpdated') === '9236d6ceb4b18a4a48634488b1cde9b5b395eff965ccc88c9ce3c2425d27e50f'
    }

    get asV25(): v25.Contract {
        assert(this.isV25)
        return this._chain.decodeEvent(this.event)
    }

    get isV50(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractUpdated') === '824f21a7f4d646625468e03ff8a0c50449d6e0c5527edf82013d385754881c45'
    }

    get asV50(): v50.Contract {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }

    get isV59(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractUpdated') === '5446945d28da7c765303d310f9ca55fc9bb46e7b5f281ac184521f913c430ee0'
    }

    get asV59(): v59.Contract {
        assert(this.isV59)
        return this._chain.decodeEvent(this.event)
    }

    get isV101(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractUpdated') === '1a46e93bb259ee0953495d2ee65d31503cd4736d74c87f1fabc89ea4773bc73c'
    }

    get asV101(): v101.Contract {
        assert(this.isV101)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A contract was updated
     */
    get isV105(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractUpdated') === 'bc600595215d0331e91aaeff45059fe6383f3362d537b936e491fe1154d3a842'
    }

    /**
     * A contract was updated
     */
    get asV105(): v105.Contract {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A contract was updated
     */
    get isV147(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractUpdated') === '7b1fac3eee26bad6f35e60f95445eaff64030725c074c795899e96ed831a51bc'
    }

    /**
     * A contract was updated
     */
    get asV147(): v147.Contract {
        assert(this.isV147)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A contract was updated
     */
    get isV148(): boolean {
        return this._chain.getEventHash('SmartContractModule.ContractUpdated') === '57619064e9c1f946a9889f41afe4d6c9cfb49c07403f39eac35870a7b5588845'
    }

    /**
     * A contract was updated
     */
    get asV148(): v148.Contract {
        assert(this.isV148)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleNameContractCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.NameContractCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV19(): boolean {
        return this._chain.getEventHash('SmartContractModule.NameContractCanceled') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
    }

    get asV19(): bigint {
        assert(this.isV19)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A Name contract is canceled
     */
    get isV105(): boolean {
        return this._chain.getEventHash('SmartContractModule.NameContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
    }

    /**
     * A Name contract is canceled
     */
    get asV105(): {contractId: bigint} {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleNodeContractCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.NodeContractCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV19(): boolean {
        return this._chain.getEventHash('SmartContractModule.NodeContractCanceled') === 'da3d413ec5a77ddce8b8c12c9cdd58340716a71ab4effe398cbaf249a16d0542'
    }

    get asV19(): [bigint, number, number] {
        assert(this.isV19)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A Node contract is canceled
     */
    get isV105(): boolean {
        return this._chain.getEventHash('SmartContractModule.NodeContractCanceled') === '2a451998845cc7fbb5269823cda637a7f9805f49123c343665bb37cbbf9cfbe4'
    }

    /**
     * A Node contract is canceled
     */
    get asV105(): {contractId: bigint, nodeId: number, twinId: number} {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleNodeExtraFeeSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.NodeExtraFeeSet')
        this._chain = ctx._chain
        this.event = event
    }

    get isV140(): boolean {
        return this._chain.getEventHash('SmartContractModule.NodeExtraFeeSet') === '965d5bd144bf08240df0df2baab4138d23a994cd48c75be6d98818238ceb0161'
    }

    get asV140(): {nodeId: number, extraFee: bigint} {
        assert(this.isV140)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleNruConsumptionReportReceivedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.NruConsumptionReportReceived')
        this._chain = ctx._chain
        this.event = event
    }

    get isV49(): boolean {
        return this._chain.getEventHash('SmartContractModule.NruConsumptionReportReceived') === '8fb8781273a0957437746af773ed15577fcddcf30727d6027f1651e65345eaf8'
    }

    get asV49(): v49.NruConsumption {
        assert(this.isV49)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleRentContractCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.RentContractCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    get isV50(): boolean {
        return this._chain.getEventHash('SmartContractModule.RentContractCanceled') === '0e1caef0df80727d2768bc480792261a4e7615b57b3e8182c7f664f06c96a08e'
    }

    get asV50(): bigint {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * a Rent contract is canceled
     */
    get isV105(): boolean {
        return this._chain.getEventHash('SmartContractModule.RentContractCanceled') === '28d75d7f6a405072b1337c49414e7c89805fbab702800c1a4b653076bd2dc4db'
    }

    /**
     * a Rent contract is canceled
     */
    get asV105(): {contractId: bigint} {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractApprovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractApproved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract is approved
     */
    get isV123(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractApproved') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
    }

    /**
     * A Service contract is approved
     */
    get asV123(): v123.ServiceContract {
        assert(this.isV123)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractBilledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractBilled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract is billed
     */
    get isV123(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractBilled') === '7985d39a3e56b65ab2853980404ab7250260ef1f2f7395adf3092259fb9ddbc5'
    }

    /**
     * A Service contract is billed
     */
    get asV123(): {serviceContract: v123.ServiceContract, bill: v123.ServiceContractBill, amount: bigint} {
        assert(this.isV123)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractCanceled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract is canceled
     */
    get isV123(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractCanceled') === '5d9c761d54a2a85566da8e150a364cc6f59f363b1139be81f9993b7d62a74bb0'
    }

    /**
     * A Service contract is canceled
     */
    get asV123(): {serviceContractId: bigint, cause: v123.Cause} {
        assert(this.isV123)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A Service contract is canceled
     */
    get isV147(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractCanceled') === 'c1b811383f4c46c79d9252b8f6dbe81b61a54f6c5220f0e27c08afc4e3bb7e05'
    }

    /**
     * A Service contract is canceled
     */
    get asV147(): {serviceContractId: bigint, cause: v147.Cause} {
        assert(this.isV147)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * A Service contract is canceled
     */
    get isV148(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractCanceled') === '81b199eeeb3cc1475f804bd214247b4b1139b8030c6317968be94deb438b6e07'
    }

    /**
     * A Service contract is canceled
     */
    get asV148(): {serviceContractId: bigint, cause: v148.Cause} {
        assert(this.isV148)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract is created
     */
    get isV123(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractCreated') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
    }

    /**
     * A Service contract is created
     */
    get asV123(): v123.ServiceContract {
        assert(this.isV123)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractFeesSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractFeesSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract fees are set
     */
    get isV123(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractFeesSet') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
    }

    /**
     * A Service contract fees are set
     */
    get asV123(): v123.ServiceContract {
        assert(this.isV123)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleServiceContractMetadataSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.ServiceContractMetadataSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A Service contract metadata is set
     */
    get isV123(): boolean {
        return this._chain.getEventHash('SmartContractModule.ServiceContractMetadataSet') === '31b80feead37363efd85ab0f302bd2d559a9275d61d4642185d79b006d0ddc52'
    }

    /**
     * A Service contract metadata is set
     */
    get asV123(): v123.ServiceContract {
        assert(this.isV123)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleSolutionProviderApprovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.SolutionProviderApproved')
        this._chain = ctx._chain
        this.event = event
    }

    get isV105(): boolean {
        return this._chain.getEventHash('SmartContractModule.SolutionProviderApproved') === '840ac8d292e1374dbb168d73165f148f05f011c240521661b812cf877cec0614'
    }

    get asV105(): [bigint, boolean] {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleSolutionProviderCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.SolutionProviderCreated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV105(): boolean {
        return this._chain.getEventHash('SmartContractModule.SolutionProviderCreated') === 'd32a4b80af4fcacbe96dc685f8a21488024fe716bdb4ea57ff9ddee85e29bc26'
    }

    get asV105(): v105.SolutionProvider {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }
}

export class SmartContractModuleUpdatedUsedResourcesEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'SmartContractModule.UpdatedUsedResources')
        this._chain = ctx._chain
        this.event = event
    }

    get isV49(): boolean {
        return this._chain.getEventHash('SmartContractModule.UpdatedUsedResources') === 'a2596f7d808ddd9ac668241df18cffb93329f10e334b13b87782cc828372795a'
    }

    get asV49(): v49.ContractResources {
        assert(this.isV49)
        return this._chain.decodeEvent(this.event)
    }
}

export class TftPriceModuleAveragePriceStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TFTPriceModule.AveragePriceStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV105(): boolean {
        return this._chain.getEventHash('TFTPriceModule.AveragePriceStored') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV105(): number {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }
}

export class TftPriceModulePriceStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TFTPriceModule.PriceStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TFTPriceModule.PriceStored') === '0615ab106c98f0dc111aaa1aaa3901d19627e63c024251c1976f8f1d72de2e9c'
    }

    get asV9(): [Uint8Array, Uint8Array] {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV19(): boolean {
        return this._chain.getEventHash('TFTPriceModule.PriceStored') === '138dc2d5a73c044287c07ba8dc3d0b80e3ee48f0386b56d7e69282b25cb09dd0'
    }

    get asV19(): Uint8Array {
        assert(this.isV19)
        return this._chain.decodeEvent(this.event)
    }

    get isV101(): boolean {
        return this._chain.getEventHash('TFTPriceModule.PriceStored') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV101(): number {
        assert(this.isV101)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleEntityDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.EntityDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.EntityDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV9(): number {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleEntityStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.EntityStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.EntityStored') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
    }

    get asV9(): v9.Entity {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleEntityUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.EntityUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.EntityUpdated') === '9d6387c93300e77d2fc96af3ccb27b7eddb14f3768bdf0cf045995fc0be93d47'
    }

    get asV9(): v9.Entity {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmCertificationSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmCertificationSet')
        this._chain = ctx._chain
        this.event = event
    }

    get isV63(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmCertificationSet') === 'ffe62c890927616bc9d5af190bd4a3b2c69e29097ebc6ea5ee6a2e1e87ceb759'
    }

    get asV63(): [number, v63.FarmCertification] {
        assert(this.isV63)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV9(): number {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmPayoutV2AddressRegisteredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmPayoutV2AddressRegistered')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmPayoutV2AddressRegistered') === 'a0d19821e09bcebcf8e5acfe4b5eca3681c180d4c05c2f647fff4efbae5ffac9'
    }

    get asV9(): [number, Uint8Array] {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmStored') === '726b3750a3581693895b85199ef30539e39935122946406d4a41c5ceb64b5185'
    }

    get asV9(): v9.Farm {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV50(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmStored') === 'ec24dee4036a557d103cfa67fbde8a7758d4f82f2dc82e80a56b839aecd93ebb'
    }

    get asV50(): v50.Farm {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }

    get isV63(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmStored') === '74b71e5fe3d2ea0881a33f99511ab05ec0233a16d23bc46f38fa69f638b7abe8'
    }

    get asV63(): v63.Farm {
        assert(this.isV63)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmUpdated') === '726b3750a3581693895b85199ef30539e39935122946406d4a41c5ceb64b5185'
    }

    get asV9(): v9.Farm {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV50(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmUpdated') === 'ec24dee4036a557d103cfa67fbde8a7758d4f82f2dc82e80a56b839aecd93ebb'
    }

    get asV50(): v50.Farm {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }

    get isV63(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmUpdated') === '74b71e5fe3d2ea0881a33f99511ab05ec0233a16d23bc46f38fa69f638b7abe8'
    }

    get asV63(): v63.Farm {
        assert(this.isV63)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmingPolicyStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmingPolicyStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmingPolicyStored') === '889678f6393313871185e40b56e531f314bc024974797c3b92b40e732e7bffa8'
    }

    get asV9(): v9.FarmingPolicy {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV63(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmingPolicyStored') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
    }

    get asV63(): v63.FarmingPolicy {
        assert(this.isV63)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleFarmingPolicyUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.FarmingPolicyUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV63(): boolean {
        return this._chain.getEventHash('TfgridModule.FarmingPolicyUpdated') === 'e45f1ccb50e73b0f9a65c63399730f27041aa3b5c8347272bbbe01c3b66f5712'
    }

    get asV63(): v63.FarmingPolicy {
        assert(this.isV63)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeCertificationSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeCertificationSet')
        this._chain = ctx._chain
        this.event = event
    }

    get isV63(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeCertificationSet') === 'd4945d9aee3a9679b5626ad868873cd15d01a6eafb319306d7528643c7ab38d2'
    }

    get asV63(): [number, v63.NodeCertification] {
        assert(this.isV63)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV9(): number {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodePublicConfigStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodePublicConfigStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV12(): boolean {
        return this._chain.getEventHash('TfgridModule.NodePublicConfigStored') === '20643e6e9f19e9332d7341fb57361ee76e2353fc64d1b582212be20ca40e2a9d'
    }

    get asV12(): [number, v12.PublicConfig] {
        assert(this.isV12)
        return this._chain.decodeEvent(this.event)
    }

    get isV105(): boolean {
        return this._chain.getEventHash('TfgridModule.NodePublicConfigStored') === '3280822d064c517c372255a87e0f164783d75d41adc342fe0475179b687a0ad8'
    }

    get asV105(): [number, (v105.PublicConfig | undefined)] {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeStored') === '5bdfcccecb100fd5b88b3818d8a8bec1982a69c3a92acf8daf8337a0ee68b669'
    }

    get asV9(): v9.Node {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV28(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeStored') === '982aba94d3d3b471ee10bfa4df7b72cca9b69683a66700e80abd89dadf2cde35'
    }

    get asV28(): v28.Node {
        assert(this.isV28)
        return this._chain.decodeEvent(this.event)
    }

    get isV43(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeStored') === '62927e9ab82956f67cd8dc695c4306b7313ec903fd93bc8473e5944e59c16cdd'
    }

    get asV43(): v43.Node {
        assert(this.isV43)
        return this._chain.decodeEvent(this.event)
    }

    get isV63(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeStored') === '8c3fa509fc5a961d1224b0b04af3d8a581aa9f74c7430ec3aaabf187866587fa'
    }

    get asV63(): v63.Node {
        assert(this.isV63)
        return this._chain.decodeEvent(this.event)
    }

    get isV105(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeStored') === '050dcf105bd6f9b530372be57813e46ed54da9003777956afde8cea580623abf'
    }

    get asV105(): v105.Node {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }

    get isV118(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeStored') === 'f41f098c82aee52660133d1fb75d350fab4d99e9a67ba251b35e04ee4c292fb3'
    }

    get asV118(): v118.Node {
        assert(this.isV118)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeUpdated') === '5bdfcccecb100fd5b88b3818d8a8bec1982a69c3a92acf8daf8337a0ee68b669'
    }

    get asV9(): v9.Node {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV28(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeUpdated') === '982aba94d3d3b471ee10bfa4df7b72cca9b69683a66700e80abd89dadf2cde35'
    }

    get asV28(): v28.Node {
        assert(this.isV28)
        return this._chain.decodeEvent(this.event)
    }

    get isV43(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeUpdated') === '62927e9ab82956f67cd8dc695c4306b7313ec903fd93bc8473e5944e59c16cdd'
    }

    get asV43(): v43.Node {
        assert(this.isV43)
        return this._chain.decodeEvent(this.event)
    }

    get isV63(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeUpdated') === '8c3fa509fc5a961d1224b0b04af3d8a581aa9f74c7430ec3aaabf187866587fa'
    }

    get asV63(): v63.Node {
        assert(this.isV63)
        return this._chain.decodeEvent(this.event)
    }

    get isV105(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeUpdated') === '050dcf105bd6f9b530372be57813e46ed54da9003777956afde8cea580623abf'
    }

    get asV105(): v105.Node {
        assert(this.isV105)
        return this._chain.decodeEvent(this.event)
    }

    get isV118(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeUpdated') === 'f41f098c82aee52660133d1fb75d350fab4d99e9a67ba251b35e04ee4c292fb3'
    }

    get asV118(): v118.Node {
        assert(this.isV118)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleNodeUptimeReportedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.NodeUptimeReported')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.NodeUptimeReported') === '4a0c168b038c7fd8096026ff00cc3456827e0f2c507248ecfbcf2c4c07367288'
    }

    get asV9(): [number, bigint, bigint] {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModulePowerStateChangedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.PowerStateChanged')
        this._chain = ctx._chain
        this.event = event
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.PowerStateChanged') === 'd5322b23c8c357b4efd50099056dcfba214b94466b72d863ffc1ee8dbd90f80c'
    }

    get asV125(): {farmId: number, nodeId: number, powerState: v125.PowerState} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModulePowerTargetChangedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.PowerTargetChanged')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Send an event to zero os to change its state
     */
    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.PowerTargetChanged') === 'c1d738baed628d197d192e6970ff592c9dc24c34f8aebc19303672d3d54dec89'
    }

    /**
     * Send an event to zero os to change its state
     */
    get asV125(): {farmId: number, nodeId: number, powerTarget: v125.Power} {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModulePricingPolicyStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.PricingPolicyStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.PricingPolicyStored') === '51a9871b7eb0af7df112128d5a4ef3e2a744f5d88c627402bee9f91a7c25fab2'
    }

    get asV9(): v9.PricingPolicy {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV51(): boolean {
        return this._chain.getEventHash('TfgridModule.PricingPolicyStored') === '0f67e7bfdb642a68114325df76a8dc56ea54b43ae993499e316274c95e8cf8af'
    }

    get asV51(): v51.PricingPolicy {
        assert(this.isV51)
        return this._chain.decodeEvent(this.event)
    }

    get isV101(): boolean {
        return this._chain.getEventHash('TfgridModule.PricingPolicyStored') === '088c108804351450f3ff89c4217a7450b4d211e3f833d8ab4746d27624010cc0'
    }

    get asV101(): v101.PricingPolicy {
        assert(this.isV101)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinDeletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinDeleted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinDeleted') === '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    }

    get asV9(): number {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinEntityRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinEntityRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinEntityRemoved') === 'a09602e40984745a7411a1855af06d133893a422fd68f7bdc4fb6a56bf1a3645'
    }

    get asV9(): [number, number] {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinEntityStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinEntityStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinEntityStored') === 'f41c776f2baf981d5a0d5e9d89f98858c2cdd7ea515b3d32a99e45dcb2c7a185'
    }

    get asV9(): [number, number, Uint8Array] {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinStored')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinStored') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
    }

    get asV9(): v9.Twin {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinStored') === '5edc8ade70c90628071f6464e86d2592c5071cc8193049c2612ab70de6613b7a'
    }

    get asV125(): v125.Twin {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }

    get isV126(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinStored') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
    }

    get asV126(): v126.Twin {
        assert(this.isV126)
        return this._chain.decodeEvent(this.event)
    }

    get isV127(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinStored') === '5edc8ade70c90628071f6464e86d2592c5071cc8193049c2612ab70de6613b7a'
    }

    get asV127(): v127.Twin {
        assert(this.isV127)
        return this._chain.decodeEvent(this.event)
    }
}

export class TfgridModuleTwinUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TfgridModule.TwinUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    get isV9(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinUpdated') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
    }

    get asV9(): v9.Twin {
        assert(this.isV9)
        return this._chain.decodeEvent(this.event)
    }

    get isV125(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinUpdated') === '5edc8ade70c90628071f6464e86d2592c5071cc8193049c2612ab70de6613b7a'
    }

    get asV125(): v125.Twin {
        assert(this.isV125)
        return this._chain.decodeEvent(this.event)
    }

    get isV126(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinUpdated') === '5b6f435dfe1514ae00c046d4634f4246d82542de8da2b6937732aec521f3408a'
    }

    get asV126(): v126.Twin {
        assert(this.isV126)
        return this._chain.decodeEvent(this.event)
    }

    get isV127(): boolean {
        return this._chain.getEventHash('TfgridModule.TwinUpdated') === '5edc8ade70c90628071f6464e86d2592c5071cc8193049c2612ab70de6613b7a'
    }

    get asV127(): v127.Twin {
        assert(this.isV127)
        return this._chain.decodeEvent(this.event)
    }
}
