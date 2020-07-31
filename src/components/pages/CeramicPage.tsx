import { Redirect, RouteComponentProps } from '@reach/router';
import { Header, Page } from 'decentraland-ui';
import React from 'react';
import { useIdentity } from '../../context/IdentityContext';
import DidDocWidget from '../organisms/DidDocWidget';
import TileDocWidget from '../organisms/TileDocWidget';
import VcDocWidget from '../organisms/VcDocWidget';

const CeramicPage = (props: RouteComponentProps) => {
  const { ceramic } = useIdentity();

  if (!ceramic) {
    return <Redirect to="/" noThrow />;
  }

  const did = ceramic?.context.user?.DID || '';

  return (<Page>
      {did && <>
        <Header sub>{did}</Header>
        <Header size="large">Ceramic</Header>
        <VcDocWidget ceramic={ceramic} did={did} />
        <TileDocWidget ceramic={ceramic} did={did} />
        <DidDocWidget ceramic={ceramic}did={did} />
      </>}
  </Page>);
};
export default CeramicPage;
