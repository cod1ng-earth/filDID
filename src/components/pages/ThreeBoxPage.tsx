import { RouteComponentProps, Redirect } from '@reach/router';
import {
  Header, Page, Button, Section, Form, Field,
} from 'decentraland-ui';
import React, { useState } from 'react';
import Box from '3box';
import { toast } from 'react-semantic-toasts';
import { useIdentity } from '../../context/IdentityContext';

const Edit3boxData = ({ threeBox }: {threeBox: any}) => {
  async function onSubmit(evt: any) {
    evt.preventDefault();
    const newName = evt.target[0].value;
    const newEmail = evt.target[1].value;
    evt.target[0].value = '';
    evt.target[1].value = '';

    if (newName) {
      threeBox.public.set('name', newName);
      toast({
        type: 'success',
        title: 'name changed.',
      });
    }

    if (newEmail) {
      threeBox.public.set('mail', newEmail);
      threeBox.public.set('email', newEmail);
      toast({
        type: 'success',
        title: 'email changed.',
      });
    }
  }
  return <Form onSubmit={onSubmit}>
          <Field label="Name" placeholder="update your name" />
          <Field label="Email" placeholder="update your email address" />
          <Button type="submit">change 3box content</Button>

        </Form>;
};
const ThreeBoxPage = (props: RouteComponentProps) => {
  const { ipfsNode, threeBox } = useIdentity();

  const [didDoc, setDidDoc] = useState<object>();
  const [profileData, setProfileData] = useState<object>();
  const [publicData, setPublicData] = useState<object>();

  if (!threeBox) {
    return <Redirect to="/" noThrow />;
  }

  async function resolve3boxDidDoc(did: string) {
    const didDag = did.split(':')[2];

    const value = await ipfsNode!.dag.get(didDag);
    setDidDoc(value);
  }

  async function listContents() {
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
    <Edit3boxData threeBox={threeBox} />
  </Page>);
};
export default ThreeBoxPage;
