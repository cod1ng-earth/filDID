import { Button, Field, Form } from 'decentraland-ui';
import { JwtCredentialPayload, verifyCredential } from 'did-jwt-vc';
import { verifyJWS } from 'did-jwt';

import React, { useReducer } from 'react';
import { VerifiableCredentialDoctype } from '@ceramicnetwork/ceramic-doctype-verifiable-credential';
import { useIdentity } from '../../context/IdentityContext';

interface VCFormState {
    property: string;
    type: string;
    name: string;
    subjectId: string;
}

interface Action {
    type: string,
    field?: string,
    value?: string,
}

const initialState: VCFormState = {
  property: '',
  type: '',
  name: '',
  subjectId: '',
};

function reset() {
  return initialState;
}

function reducer(state: VCFormState, action: Action) {
  if (action.type === 'reset') {
    return reset();
  }

  return {
    ...state,
    [action.field]: action.value,
  };
}

const makeJwtPayload = (claim: any, formState: VCFormState): JwtCredentialPayload => {
  const issuanceDate = Math.floor((new Date()).getTime() / 1000);
  const payload: JwtCredentialPayload = {
    sub: formState.subjectId,
    iat: issuanceDate,
    nbf: issuanceDate,
    vc: claim,
  };
  return payload;
};

const transformFormStateToVerifiableClaim = (formState: VCFormState, issuer: string) => ({
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential'],
  issuer,
  credentialSubject: {
    id: formState.subjectId,
    [formState.property]: {
      type: formState.type,
      name: formState.name,
    },
  },
});

type Props = {
    onVcDocCreated: (vcDoc: VerifiableCredentialDoctype) => any
}

export default function CreateVCForm({ onVcDocCreated }: Props) {
  const { ceramic, identityWallet } = useIdentity();

  const [vcForm, dispatchVc] = useReducer(reducer, initialState, () => ({
    ...initialState,
    subjectId: ceramic.context.user.DID,
  }));

  async function createVerifiableCredentialDocument(payload: any) {
    const vcParams = {
      content: {
        claims: payload,
      },
      owners: [ceramic.context.user.DID],
    };

    const doc: VerifiableCredentialDoctype = await ceramic.createDocument(
      'verifiable-credential',
      vcParams,
    );
    return doc;
  }

  async function onSubmit(evt: any) {
    const claim = transformFormStateToVerifiableClaim(vcForm, ceramic.context.user.DID);
    const jwtPayload = makeJwtPayload(claim, vcForm);

    console.debug('claim', claim);
    console.debug('payload', jwtPayload);

    /* const issuer: Issuer = {
      did: ceramic.context.user.DID,
      signer: (data: string) => ceramic.context.user.sign(data),
    };

    const jwt = createVerifiableCredentialJwt(jwtClaim, issuer);
    const signedClaim = await identityWallet.signClaim(jwtClaim);
    console.log(signedClaim);
    */
    const jwt = await ceramic.context.user.sign(jwtPayload);
    console.log('jwt', jwt);

    const didProvider = identityWallet.getDidProvider();
    const jwsResult = await didProvider.send({
      jsonrpc: '2.0',
      id: 1,
      method: 'did_createJWS',
      params: {
        payload: jwtPayload,
      },
    });
    const { jws } = jwsResult.result;

    const { resolver } = ceramic.context;
    const verified = await verifyCredential(jwt, resolver);
    console.log('verified jwt', verified);

    const { signingKey } = ceramic.context.user.publicKeys; // managementKey

    console.log(signingKey);

    const pubKey = verifyJWS(jws, [{
      id: 'did:3:GENESIS#signingKey',
      type: 'Secp256k1SignatureAuthentication2018',
      owner: ceramic.context.user.DID,
      publicKeyHex: signingKey,
    }]);
    console.log('verified jws', pubKey);

    const doc = await createVerifiableCredentialDocument(verified);
    onVcDocCreated(doc);

    dispatchVc({ type: 'reset' });
  }

  const inputChanged = (field: string) => (evt: React.FormEvent<HTMLInputElement>) => {
    dispatchVc({
      type: 'update',
      field,
      value: evt.currentTarget.value,
    });
  };

  return (
        <Form onSubmit={onSubmit}>
            <Field label="Property" value={vcForm.property} placeholder="degree" onChange={inputChanged('property')} />
            <Field label="Type" value={vcForm.type} placeholder="BachelorDegree" onChange={inputChanged('type')}/>
            <Field label="Name" value={vcForm.name} placeholder="Bachelor of Science" onChange={inputChanged('name')} />
            <Field label="Subject" value={vcForm.subjectId} placeholder="did" onChange={inputChanged('subjectId')} />
            <Button type="submit">create verifiable credential</Button>
        </Form>
  );
}
