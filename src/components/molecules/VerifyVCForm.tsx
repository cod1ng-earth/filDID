import { VerifiableCredentialDoctype } from '@ceramicnetwork/ceramic-doctype-verifiable-credential';
import { Button, Field, Form } from 'decentraland-ui';
import React, { useState } from 'react';
import { toast } from 'react-semantic-toasts';

import { useIdentity } from '../../context/IdentityContext';

interface Props {
  onVcDocVerified: Function,
  onDocLoaded: Function,
}

export default function VerifyVCForm({ onVcDocVerified, onDocLoaded }: Props) {
  const { ceramic } = useIdentity();
  const [documentId, setDocumentId] = useState<string>();

  async function onSubmit(evt: any) {
    evt.preventDefault();

    const vcDoc = await ceramic.loadDocument<VerifiableCredentialDoctype>(documentId);
    if (vcDoc.doctype !== 'verifiable-credential') {
      throw new Error('only vc docs are allowed here.');
    }
    onDocLoaded(vcDoc);

    const verificationResult = vcDoc.verify();
    if (!verificationResult) {
      return toast({
        type: 'error',
        title: 'could not prove the credential\'s  validity',
      });
    }
    onVcDocVerified(verificationResult);
    return true;
  }

  const inputChange = () => (evt: React.FormEvent<HTMLInputElement>) => {
    setDocumentId(evt.currentTarget.value);
  };

  return (
        <Form onSubmit={onSubmit}>
            <Field label="a credential's document id"
              value={documentId}
              placeholder="ceramic://"
              onChange={inputChange()}
            />
            <Button type="submit">verify credential</Button>
        </Form>
  );
}
