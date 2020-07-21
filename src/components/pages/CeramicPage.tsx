import Ceramic from '@ceramicnetwork/ceramic-core';
import { VerifiableCredentialDoctype } from '@ceramicnetwork/ceramic-doctype-verifiable-credential';
import { RouteComponentProps } from '@reach/router';
import {
  Button, Header, Page, Section,
} from 'decentraland-ui';
import { JwtCredentialPayload } from 'did-jwt-vc';
import React, { useState } from 'react';
import { useIdentity } from '../../context/IdentityContext';

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

const CeramicPage = (props: RouteComponentProps) => {
  const { ceramic } = useIdentity();
  const [vcDoc, setVcDoc] = useState<VerifiableCredentialDoctype>();

  async function createVerifiableCredentialDoc(_ceramic: Ceramic) {
    const { DID } = _ceramic.context.user!;
    const payload = createNewCredentialPayload(DID);

    const doc: VerifiableCredentialDoctype = await ceramic!.createDocument('verifiable-credential', {
      owners: [DID],
      content: payload,
    });
    console.log(doc);
    setVcDoc(doc);
  }

  return (<Page >
    <Header>Ceramic</Header>
    {ceramic
      && <Button onClick={() => createVerifiableCredentialDoc(ceramic)}>Create a VerifiableCredential</Button>
    }

    {vcDoc && <Section>
        <Header>Verifiable Credential</Header>
        <code>
            {JSON.stringify(vcDoc.content, null, 2)}
        </code>
    </Section>
    }
  </Page>);
};
export default CeramicPage;
