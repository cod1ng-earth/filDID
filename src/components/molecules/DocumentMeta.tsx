import React from 'react';
import { List, Label } from 'decentraland-ui';
import {
  Doctype,
} from '@ceramicnetwork/ceramic-common';

export default function ({ doc }: {doc: Doctype}) {
  return (
        <List divided selection>
            <List.Item>
                <Label horizontal>id</Label>
                <p>{doc.id}</p>
            </List.Item>
            <List.Item>
                <Label horizontal>head</Label>
                <p>{doc.head.toString()}</p>
            </List.Item>
        </List>
  );
}
