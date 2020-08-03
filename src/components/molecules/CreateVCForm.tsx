import { Button, Field, Form } from 'decentraland-ui';
import {
  JwtCredentialPayload, verifyCredential, CredentialPayload,
} from 'did-jwt-vc';
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

const makeCredentialSubject = ({
  subjectId, property, type, name,
}: {
  subjectId: string, property: string, type: string, name: string
}) => ({
  id: subjectId,
  [property]: {
    type,
    name,
  },
});

/**
 * used to build jwts.
 */
const transformFormStateToJwtPayload = (
  formState: VCFormState,
  issuer: string,
): JwtCredentialPayload => {
  const issuanceDate = Math.floor((new Date()).getTime() / 1000);
  const payload: JwtCredentialPayload = {
    iss: issuer,
    sub: formState.subjectId,
    iat: issuanceDate,
    nbf: issuanceDate,
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: makeCredentialSubject(formState),
    },
  };
  return payload;
};

const transformFormStateToCredentialPayload = (
  formState: VCFormState,
  issuer: string,
): CredentialPayload => ({
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential'],
  issuanceDate: (new Date()).toISOString(),
  issuer: {
    id: issuer,
  },
  credentialSubject: makeCredentialSubject(formState),
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
    const claim = transformFormStateToCredentialPayload(vcForm, ceramic.context.user.DID);
    const jwtPayload = transformFormStateToJwtPayload(vcForm, ceramic.context.user.DID);

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

    // --- method1: create a signed JWT, verifiable by did-jwt-vc:
    const jwt = await ceramic.context.user.sign(jwtPayload);
    console.log('jwt', jwt);
    const { resolver } = ceramic.context;
    const verified = await verifyCredential(jwt, resolver);
    console.log('verified jwt', verified);

    // --- method2: create a signed JWS proof, verifiable by did-jwt:
    const didProvider = identityWallet.getDidProvider();
    const jwsResult = await didProvider.send({
      jsonrpc: '2.0',
      id: 1,
      method: 'did_createJWS',
      params: {
        payload: claim,
      },
    });
    const { jws } = jwsResult.result;
    const pubKey = verifyJWS(jws, [{
      id: 'did:3:GENESIS#signingKey',
      type: 'Secp256k1SignatureAuthentication2018',
      owner: ceramic.context.user.DID,
      publicKeyHex: ceramic.context.user.publicKeys.signingKey,
    }]);

    console.log('verified jws', jws, pubKey);

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
