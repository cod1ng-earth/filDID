import Ceramic from '@ceramicnetwork/ceramic-core';
import { VerifiableCredentialDoctype } from '@ceramicnetwork/ceramic-doctype-verifiable-credential';
import { Header, Section, Segment } from 'decentraland-ui';
import React, { useState } from 'react';
import CreateVCForm from '../molecules/CreateVCForm';
import DocumentMeta from '../molecules/DocumentMeta';
import RenderJson from '../atoms/RenderJson';

type Props = {
    ceramic: Ceramic,
    did: string
}

const VcDocWidget = (props: Props) => {
  const [vcDoc, setVcDoc] = useState<any>();

  const onVcDocCreated = (createdDoc: VerifiableCredentialDoctype) => {
    console.debug(createdDoc);
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
            && <>
            <Segment>
              {<DocumentMeta doc={vcDoc} />}
            </Segment>
            <RenderJson data={vcDoc.content} />
          </>
        }
      </Section>
  );
};

export default VcDocWidget;
