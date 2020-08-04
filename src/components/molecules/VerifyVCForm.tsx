import { Button, Field, Form } from 'decentraland-ui';
import { JwtCredentialPayload, verifyCredential } from 'did-jwt-vc';
import React, { useReducer, useState } from 'react';
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

export default function VerifyVCForm() {
  const { ceramic } = useIdentity();

  const [documentId, setDocumentId] = useState<string>();

  async function onSubmit(evt: any) {

  }

  const inputChange = (field: string) => (evt: React.FormEvent<HTMLInputElement>) => {
    setDocumentId(evt.currentTarget.value);
  };

  return (
        <Form onSubmit={onSubmit}>
            <Field label="document id" value={documentId} placeholder="ceramic://" onChange={inputChange('documentId')} />
            <Button type="submit">verify verifiable credential</Button>
        </Form>
  );
}
