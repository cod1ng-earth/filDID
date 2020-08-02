import { Button, Field, Form } from 'decentraland-ui';
import { JwtCredentialPayload, verifyCredential } from 'did-jwt-vc';
import React, { useReducer } from 'react';
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

const transformToJwtCredentialPayload = (claim: any, formState: VCFormState): JwtCredentialPayload => {
  const issuanceDate = Math.floor((new Date()).getTime() / 1000);
  return {
    sub: formState.subjectId,
    iat: issuanceDate,
    nbf: issuanceDate,
    vc: claim,
  };
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

export default function CreateVCForm() {
  const { ceramic } = useIdentity();

  const [vcForm, dispatchVc] = useReducer(reducer, initialState, () => ({
    ...initialState,
    subjectId: ceramic.context.user.DID,
  }));

  async function onSubmit(evt: any) {
    const claim = transformFormStateToVerifiableClaim(vcForm, ceramic.context.user.DID);
    const jwtClaim = transformToJwtCredentialPayload(claim, vcForm);

    console.log(claim);
    console.log(jwtClaim);

    /* const issuer: Issuer = {
      did: ceramic.context.user.DID,
      signer: (data: string) => ceramic.context.user.sign(data),
    };

    const jwt = createVerifiableCredentialJwt(jwtClaim, issuer);
    const signedClaim = await identityWallet.signClaim(jwtClaim);
    console.log(signedClaim);
    */
    const signedJwt = await ceramic.context.user.sign(jwtClaim);
    console.log('signed', signedJwt);

    const { resolver } = ceramic.context;
    const verified = await verifyCredential(signedJwt, resolver);

    console.log('verified', verified);

    dispatchVc({ type: 'reset' });
  }

  const inputChange = (field: string) => (evt: React.FormEvent<HTMLInputElement>) => {
    dispatchVc({
      type: 'update',
      field,
      value: evt.currentTarget.value,
    });
  };

  return (
        <Form onSubmit={onSubmit}>
            <Field label="Property" value={vcForm.property} placeholder="degree" onChange={inputChange('property')} />
            <Field label="Type" value={vcForm.type} placeholder="BachelorDegree" onChange={inputChange('type')}/>
            <Field label="Name" value={vcForm.name} placeholder="Bachelor of Science" onChange={inputChange('name')} />
            <Field label="Subject" value={vcForm.subjectId} placeholder="did" onChange={inputChange('subjectId')} />
            <Button type="submit">create verifiable credential</Button>
        </Form>
  );
}
