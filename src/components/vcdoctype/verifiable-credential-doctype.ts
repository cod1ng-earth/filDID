import jsonpatch from 'fast-json-patch'
import { Doctype, DoctypeConstructor, DoctypeStatic, DocOpts } from "@ceramicnetwork/ceramic-common"
import { Context, User } from "@ceramicnetwork/ceramic-common"

const DOCTYPE = 'verifiable-credential'

/**
 * content: Verifiable credential content
 * owners: List of owner Ids
 */
export interface VerifiableCredentialParams {
    content: {
        claims: object
        claimsHash?: string
    }
    owners: Array<string>;
}

@DoctypeStatic<DoctypeConstructor<VerifiableCredentialDoctype>>()
export class VerifiableCredentialDoctype extends Doctype {

    /**
     * Change existing Verifiable Credential doctype
     * @param params - Change parameters
     * @param opts - Initialization options
     */
    async change(params: VerifiableCredentialParams, opts: DocOpts = {}): Promise<void> {
        if (this.context.user == null) {
            throw new Error('No user authenticated')
        }

        const { content, owners } = params
        const updateRecord = await VerifiableCredentialDoctype._makeRecord(this, this.context.user, content, owners)
        const updated = await this.context.api.applyRecord(this.id, updateRecord, opts)
        this.state = updated.state
    }

    /**
     * Create Verifiable Credential doctype
     * @param params - Create parameters
     * @param context - Ceramic context
     * @param opts - Initialization options
     */
    static async create(params: VerifiableCredentialParams, context: Context, opts?: DocOpts): Promise<VerifiableCredentialDoctype> {
        if (context.user == null) {
            throw new Error('No user authenticated')
        }

        const { content, owners } = params
        const record = await VerifiableCredentialDoctype.makeGenesis({ content, owners }, context, opts)
        return context.api.createDocumentFromGenesis(record, opts)
    }

    /**
     * Creates a genesis record
     * @param params - Create parameters
     * @param context - Ceramic context
     * @param opts - Initialization options
     */
    static async makeGenesis(params: Record<string, any>, context? : Context, opts: DocOpts = {}): Promise<Record<string, any>> {
        if (!context.user) {
            throw new Error('No user authenticated')
        }

        let { owners, content } = params

        if (!owners) {
            owners = [context.user.DID]
        }

        if (!content) {
            throw new Error('Content needs to be specified')
        }

        if (!content.claims) {
            throw new Error('Claims needs to be specified in contents')
        }

        if (!content.claimsHash) {
            content.claimsHash = (await context.ipfs.dag.put(content.claims)).toString()
        }

        const record = { doctype: DOCTYPE, owners, content: content }
        return VerifiableCredentialDoctype._signRecord(record, context.user)
    }

    /**
     * Make change record
     * @param doctype - Verifiable credential doctype instances
     * @param user - User instance
     * @param newContent - New content
     * @param newOwners - New owners
     */
    static async _makeRecord(doctype: Doctype, user: User, newContent: any, newOwners?: string[]): Promise<any> {
        if (!user) {
            throw new Error('No user authenticated')
        }

        let owners = newOwners;

        if (!owners) {
            owners = doctype.owners
        }

        const patch = jsonpatch.compare(doctype.content, newContent)
        const record = { owners: doctype.owners, content: patch, prev: doctype.head, id: doctype.state.log[0] }

        return VerifiableCredentialDoctype._signRecord(record, user)
    }

    /**
     * Sign Verifiable credential record
     * @param record Record to be signed
     * @param user Authenticated user instance
     */
    static async _signRecord(record: any, user: User): Promise<any> {
        if (user == null) {
            throw new Error('No user authenticated')
        }
        // TODO - use the dag-jose library for properly encoded signed records
        // The way we use did-jwts right now are quite hacky
        record.iss = user.DID
        // convert CID to string for signing
        const tmpCID = record.prev
        const tmpId = record.id
        if (tmpCID) {
            record.prev = { '/': tmpCID.toString() }
        }
        if (tmpId) {
            record.id = { '/': tmpId.toString() }
        }
        const jwt = await user.sign(record)
        const [header, payload, signature] = jwt.split('.') // eslint-disable-line @typescript-eslint/no-unused-vars
        if (tmpCID) {
            record.prev = tmpCID
        }
        if (tmpId) {
            record.id = tmpId
        }
        return { ...record, header, signature }
    }
}
