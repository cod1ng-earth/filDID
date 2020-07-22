import { RouteComponentProps, Redirect } from '@reach/router';
import {
  Header, Page, Button, Section,
} from 'decentraland-ui';
import React, { useState } from 'react';
import Box from '3box';
import { useIdentity } from '../../context/IdentityContext';

const ThreeBoxPage = (props: RouteComponentProps) => {
  const { ipfsNode, threeBox } = useIdentity();

  const [didDoc, setDidDoc] = useState<object>();
  const [profileData, setProfileData] = useState<object>();
  const [publicData, setPublicData] = useState<object>();

  if (!threeBox) {
    return <Redirect to="/" />;
  }

  async function resolve3boxDidDoc(did: string) {
    const didDag = did.split(':')[2];

    const value = await ipfsNode!.dag.get(didDag);
    setDidDoc(value);
    console.log(value);
  }

  async function listContents() {
    await threeBox.syncDone;

    resolve3boxDidDoc(threeBox.DID);

    const profile = await Box.getProfile(threeBox.DID);
    setProfileData(profile);

    const _publicData = await threeBox.public.all();
    setPublicData(_publicData);
  }

  return (<Page >
    <Header>DID: {threeBox.DID}</Header>
    <Button onClick={listContents}>list 3box contents</Button>
    {didDoc
        && <Section>
            <Header>DID document</Header>
            <code>
                {JSON.stringify(didDoc, null, 2)}
            </code>
        </Section>
    }
    {profileData
        && <Section>
        <Header>Profile Data</Header>
        <code>
            {JSON.stringify(profileData, null, 2)}
        </code>
    </Section>
    }
    {publicData
        && <Section>
        <Header>Public Data</Header>
        <code>
            {JSON.stringify(publicData, null, 2)}
        </code>
    </Section>
    }
  </Page>);
};
export default ThreeBoxPage;
