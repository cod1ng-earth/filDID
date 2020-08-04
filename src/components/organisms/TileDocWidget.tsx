import { Doctype } from '@ceramicnetwork/ceramic-common';
import Ceramic from '@ceramicnetwork/ceramic-core';
import { TileDoctype } from '@ceramicnetwork/ceramic-doctype-tile';
import {
  Button, Field, Form, Grid, Header, Icon, Section, Segment,
} from 'decentraland-ui';
import React, { useState } from 'react';
import RenderJson from '../atoms/RenderJson';
import DocumentMeta from '../molecules/DocumentMeta';

type Props = {
    ceramic: Ceramic,
    did: string
}
const TileDocWidget = (props: Props) => {
  const { ceramic, did } = props;

  const [doc, setDoc] = useState({
    content: null,
    doc: null,
  });

  async function loadDoc(docId: string) {
    const _doc = await ceramic!.loadDocument<Doctype>(docId);
    console.log(_doc);
    setDoc({
      content: _doc.content,
      doc: _doc,
    });

    const versions = await ceramic!.listVersions(docId);
    console.log(versions);
  }

  async function createTileDoc(_did: string) {
    const currentDate = (new Date()).toISOString();
    const payload = {
      currentDate,
    };

    const _tileDoc: TileDoctype = await ceramic!.createDocument<TileDoctype>('tile', {
      owners: [_did],
      content: payload,
    });
    setDoc({
      content: _tileDoc.content,
      doc: _tileDoc,
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
    setDoc({
      content: _tileDoc.content,
      doc: _tileDoc,
    });
  }

  function onSubmit(evt: any) {
    evt.preventDefault();
    const ceramicId = evt.target[0].value;
    evt.target[0].value = '';
    loadDoc(ceramicId);
  }

  return (
    <Section>
        <Header>
            Tile documents

            <Button basic size="tiny" onClick={() => createTileDoc(did)} className="mx-2">
                <Icon name="add" /> create tile
            </Button>
        </Header>
        <Form onSubmit={onSubmit}>
            <Grid columns={2} >
                <Grid.Row>
                    <Grid.Column>
                            <Field label="load a ceramic doc id" placeholder="ceramic://ba..." />
                    </Grid.Column>
                    <Grid.Column>
                        <Button primary>load</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form>

    {doc.doc && <>
        <Segment>
          <DocumentMeta doc={doc.doc} />
        </Segment>
        <RenderJson data={doc.content} />
        { doc.doc.doctype === 'tile'
            && <Button onClick={() => updateTileDoc(doc.doc)}>update</Button>
        }
        </>
    }
    </Section>
  );
};

export default TileDocWidget;
