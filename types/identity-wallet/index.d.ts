//import { DIDProvider } from "@ceramicnetwork/ceramic-common";

declare module 'identity-wallet' {

    export interface IConsentRequest {
        type: string;
        origin: string;
        spaces: string[];
      }

    export interface SignClaimOpts {
        DID: string;
        space: string;
        expiresIn: string;
    }

    export default class IdentityWallet {
        constructor(getConsent: (request: IConsentRequest) => boolean, config: any);
        linkAddress: (address: string, provider: any) => object;
        get3idProvider: () => any;
        signClaim: (payload: object, opts?: SignClaimOpts) => Promise<string>;
    }

}
