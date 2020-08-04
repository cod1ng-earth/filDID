import Ceramic from '@ceramicnetwork/ceramic-core';
import {
  VerifiableCredentialDoctype, VerifiableCredentialParams,
} from '@ceramicnetwork/ceramic-doctype-verifiable-credential';
import {
  Button, Header, Icon, Section, Segment,
} from 'decentraland-ui';
import { JwtCredentialPayload } from 'did-jwt-vc';
import React, { useState } from 'react';
import CreateVCForm from '../molecules/CreateVCForm';

type Props = {
    ceramic: Ceramic,
    did: string
}

function createNewCredentialPayload(subject: string) {
  const issuanceDate = Math.floor((new Date()).getTime() / 1000);
  const vcPayload: JwtCredentialPayload = {
    sub: subject,
    iat: issuanceDate,
    nbf: issuanceDate,
    vc: {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential'],
      credentialSubject: {
        degree: {
          type: 'HackFS FilDID user',
          name: 'This user worked on FilDID',
        },
      },
    },
  };

  return vcPayload;
}

const VcDocWidget = (props: Props) => {
  const { ceramic, did } = props;

  const [vcDoc, setVcDoc] = useState<any>();

  /* function onSubmit(evt: any) {
    evt.preventDefault();
    const tileDocId = evt.target[0].value;
    evt.target[0].value = '';
  }
  */

  const onVcDocCreated = (createdDoc: VerifiableCredentialDoctype) => {
    setVcDoc(createdDoc);
  };

  return (
    <Section>
      <Header>
            VerifiableCredentials
        </Header>
        <Segment>
          <CreateVCForm onVcDocCreated={onVcDocCreated} />
        </Segment>
        {vcDoc
            && <code>
                {JSON.stringify(vcDoc.content, null, 2)}
            </code>
        }
      </Section>
  );
};

export default VcDocWidget;
