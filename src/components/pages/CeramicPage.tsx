import { ThreeIdDoctype } from '@ceramicnetwork/ceramic-doctype-three-id';
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
  const [ceramicDidDoc, setCeramicDidDoc] = useState<ThreeIdDoctype>();

  async function loadDIDDoc(did: string) {
    // todo: how to generically load my user's generic 3id doc?
    const cid = did.split(':')[2];

    const docId = `ceramic://${cid}`;
    const didDoc = await ceramic!.loadDocument(docId);
    setCeramicDidDoc(didDoc);
  }

  async function createVerifiableCredentialDoc(did: string) {
    const payload = createNewCredentialPayload(did);

    const doc: VerifiableCredentialDoctype = await ceramic!.createDocument('verifiable-credential', {
      owners: [did],
      content: payload,
    });

    setVcDoc(doc);
  }

  const did = ceramic?.context.user?.DID || '';

  return (<Page >
      {ceramic && <Header sub>{ceramic.context.user?.DID}</Header>}
      <Header size="large">Ceramic</Header>

    {ceramic
      && <Section>
        <Button onClick={() => loadDIDDoc(did)}>load DID doc</Button>
        <Button onClick={() => createVerifiableCredentialDoc(did)}>Create a VerifiableCredential</Button>
        </Section>
    }
    {ceramicDidDoc && <Section>

      <Header>DID doc contents</Header>
      <Header size="tiny">{ceramicDidDoc?.state?.anchorProof?.root.toString()}</Header>

        <code>
            {JSON.stringify(ceramicDidDoc.content, null, 2)}
        </code>

    </Section>
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
