import React, { useState, useEffect } from 'react';
import Ceramic from '@ceramicnetwork/ceramic-core';
import { ThreeIdDoctype } from '@ceramicnetwork/ceramic-doctype-three-id';
import { Section, Header } from 'decentraland-ui';
import RenderJson from '../atoms/RenderJson';

type Props = {
    ceramic: Ceramic,
    did: string
}
const DidDocWidget = (props: Props) => {
  const { ceramic, did } = props;
  const [didDoc, setDidDoc] = useState<ThreeIdDoctype>();

  function didRoot(_didDoc: ThreeIdDoctype) {
    return _didDoc.state?.anchorProof?.root.toString();
  }

  useEffect(() => {
    (async function loadDIDDoc() {
      // todo: how to generically load my user's generic 3id doc?
      const cid = did.split(':')[2];

      const docId = `ceramic://${cid}`;
      const _didDoc = await ceramic!.loadDocument(docId);
      setDidDoc(_didDoc);
    }());
  }, [did, ceramic]);

  return (
      <Section>
        <Header>DID</Header>
        {didDoc && <>
            <p>{did}</p>
            <p>{didRoot(didDoc)}</p>
            <RenderJson data={didDoc.content} />
        </>
        }
  </Section>
  );
};

export default DidDocWidget;
