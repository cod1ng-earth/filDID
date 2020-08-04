import {
  makeCredentialSubject, VerifiableCredentialDoctype, VerifiableCredentialParams,
} from '@ceramicnetwork/ceramic-doctype-verifiable-credential';
import { Button, Field, Form } from 'decentraland-ui';
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

type Props = {
    onVcDocCreated: (vcDoc: VerifiableCredentialDoctype) => any
}

export default function CreateVCForm({ onVcDocCreated }: Props) {
  const { ceramic } = useIdentity();

  const [vcForm, dispatchVc] = useReducer(reducer, initialState, () => ({
    ...initialState,
    subjectId: ceramic.context.user.DID,
  }));

  async function onSubmit(evt: any) {
    const credentialSubject = makeCredentialSubject(vcForm);
    const params: VerifiableCredentialParams = {
      content: credentialSubject,
      owners: [ceramic.context.user.DID],
    };

    const doc: VerifiableCredentialDoctype = await ceramic.createDocument(
      'verifiable-credential',
      params,
    );

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
