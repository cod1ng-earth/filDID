import { ThreeIdDoctype } from '@ceramicnetwork/ceramic-doctype-three-id';
import { TileDoctype } from '@ceramicnetwork/ceramic-doctype-tile';
import { VerifiableCredentialDoctype } from '@ceramicnetwork/ceramic-doctype-verifiable-credential';
import { RouteComponentProps, Redirect } from '@reach/router';
import {
  Button, Header, Page, Section, Form, Field,
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
  const [didDoc, setDidDoc] = useState<ThreeIdDoctype>();
  const [tileDoc, setTileDoc] = useState<any>();

  if (!ceramic) {
    return <Redirect to="/" />;
  }

  async function loadDIDDoc(did: string) {
    // todo: how to generically load my user's generic 3id doc?
    const cid = did.split(':')[2];

    const docId = `ceramic://${cid}`;
    const _didDoc = await ceramic!.loadDocument(docId);
    setDidDoc(_didDoc);
  }

  async function loadTileDoc(docId: string) {
    const _tileDoc = await ceramic!.loadDocument<TileDoctype>(docId);
    console.log(_tileDoc);
    setTileDoc({
      docId,
      head: _tileDoc.head.toString(),
      content: _tileDoc.content,
      _doc: _tileDoc,
    });

    const versions = await ceramic!.listVersions(docId);
    console.log(versions);
  }
  async function createTileDoc(did: string) {
    const currentDate = (new Date()).toISOString();
    const payload = {
      currentDate,
    };

    const _tileDoc: TileDoctype = await ceramic!.createDocument<TileDoctype>('tile', {
      owners: [did],
      content: payload,
    }, {
      owners: [did],
    });

    setTileDoc({
      docId: _tileDoc.id.toString(),
      head: _tileDoc.head.toString(),
      content: _tileDoc.content,
      _doc: _tileDoc,
    });
  }

  async function updateTileDoc(_tileDoc: TileDoctype) {
    const payload = {
      currentDate: (new Date()).toISOString(),
    };
    await _tileDoc.change({
      content: payload,
    });
    console.log('changed', _tileDoc);
    setTileDoc({
      docId: _tileDoc.id.toString(),
      head: _tileDoc.head.toString(),
      content: _tileDoc.content,
      _doc: _tileDoc,
    });
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
        <Button onClick={() => createTileDoc(did)}>create Tile doc</Button>
        <Button onClick={() => createVerifiableCredentialDoc(did)}>Create a VerifiableCredential</Button>
        </Section>
    }
    {didDoc && <Section>

      <Header>DID doc contents</Header>
      <Header size="tiny">{didDoc?.state?.anchorProof?.root.toString()}</Header>

        <code>
            {JSON.stringify(didDoc.content, null, 2)}
        </code>

    </Section>
    }

    <Section>
        <Header>Tile document</Header>
        <Form onSubmit={ (evt: any) => {
          evt.preventDefault();
          const tileDocId = evt.target[0].value;
          evt.target[0].value = '';
          loadTileDoc(tileDocId);
        } }>
          <Field label="Label" placeholder="load a ceramic doc id" />
        </Form>

    {tileDoc && <>
        <Header size="tiny">id: {tileDoc.docId}</Header>
        <Header size="tiny">head: {tileDoc.head}</Header>
        <code>
            {JSON.stringify(tileDoc.content, null, 2)}
        </code>
        <Button onClick={() => updateTileDoc(tileDoc._doc)}>update</Button>
        </>
    }
    </Section>

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
