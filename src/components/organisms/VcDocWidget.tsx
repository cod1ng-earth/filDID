import Ceramic from '@ceramicnetwork/ceramic-core';
import { VerifiableCredentialDoctype } from '@ceramicnetwork/ceramic-doctype-verifiable-credential';
import { Header, Section, Segment } from 'decentraland-ui';
import React, { useState } from 'react';
import { PublicKey } from 'did-resolver';
import CreateVCForm from '../molecules/CreateVCForm';
import DocumentMeta from '../molecules/DocumentMeta';
import RenderJson from '../atoms/RenderJson';
import VerifyVCForm from '../molecules/VerifyVCForm';
import VerifiedPublickKey from '../molecules/VerifiedPublickKey';

type Props = {
    ceramic: Ceramic,
    did: string
}

const VcDocWidget = (props: Props) => {
  const [vcDoc, setVcDoc] = useState<any>();
  const [publicKey, setPublicKey] = useState<PublicKey>();

  const onVcDocCreated = (createdDoc: VerifiableCredentialDoctype) => {
    console.debug(createdDoc);
    setVcDoc(createdDoc);
  };

  const onVcDocVerified = (_verification: any) => {
    console.debug(_verification);
    setPublicKey(_verification);
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
            && <>
            <Segment>
              {<DocumentMeta doc={vcDoc} />}
            </Segment>
            <RenderJson data={vcDoc.content} />
          </>
        }
        <Header>
            Verify any credential
        </Header>
        <Segment color={publicKey ? 'green' : undefined}>
          <VerifyVCForm onVcDocVerified={onVcDocVerified} onDocLoaded={onVcDocCreated} />
        </Segment>
        {publicKey && <VerifiedPublickKey publicKey={publicKey} />
        }
      </Section>
  );
};

export default VcDocWidget;
