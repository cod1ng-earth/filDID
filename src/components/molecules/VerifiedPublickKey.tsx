import React from 'react';
import { List, Label } from 'decentraland-ui';
import { PublicKey } from 'did-resolver';

export default function ({ publicKey }: {publicKey: PublicKey}) {
  return (
        <List divided selection>
            <List.Item>
                <Label horizontal>id</Label>
                <p>{publicKey.id}</p>
            </List.Item>
            <List.Item>
                <Label horizontal>owner</Label>
                <p>{publicKey.owner}</p>
            </List.Item>
            <List.Item>
                <Label horizontal>type</Label>
                <p>{publicKey.type}</p>
            </List.Item>
            <List.Item>
                <Label horizontal>hex</Label>
                <p>{publicKey.publicKeyHex}</p>
            </List.Item>
        </List>
  );
}
