import React, { useState } from 'react';
import Ceramic from '@ceramicnetwork/ceramic-core';
import { TileDoctype } from '@ceramicnetwork/ceramic-doctype-tile';
import {
  Button, Section, Header, Form, Field, Segment, List, Grid, Label, Icon, Divider,
} from 'decentraland-ui';

type Props = {
    ceramic: Ceramic,
    did: string
}
const TileDocWidget = (props: Props) => {
  const { ceramic, did } = props;

  const [tileDoc, setTileDoc] = useState<any>();

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

  async function createTileDoc(_did: string) {
    const currentDate = (new Date()).toISOString();
    const payload = {
      currentDate,
    };

    const _tileDoc: TileDoctype = await ceramic!.createDocument<TileDoctype>('tile', {
      owners: [did],
      content: payload,
    }, {
      owners: [_did],
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

  function onSubmit(evt: any) {
    evt.preventDefault();
    const tileDocId = evt.target[0].value;
    evt.target[0].value = '';
    loadTileDoc(tileDocId);
  }

  return (
    <Section>
        <Header>
            Tile documents

            <Button basic size="tiny" onClick={() => createTileDoc(did)} className="mx-2">
                <Icon name="add" /> add
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

    {tileDoc && <>
        <Segment>
        <List divided selection>
            <List.Item>
                <Label horizontal>id</Label>
                <p>{tileDoc.docId}</p>
            </List.Item>
            <List.Item>
                <Label horizontal>head</Label>
                <p>{tileDoc.head}</p>
            </List.Item>
        </List>
        </Segment>
        <code>
            {JSON.stringify(tileDoc.content, null, 2)}
        </code>
        <Button onClick={() => updateTileDoc(tileDoc._doc)}>update</Button>
        </>
    }
    </Section>
  );
};

export default TileDocWidget;
