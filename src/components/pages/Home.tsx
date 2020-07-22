import React from 'react';
import {
  Page, Header, Image, Grid,
} from 'decentraland-ui';
import { RouteComponentProps } from '@reach/router';
import eridanosLogo from '../../img/eridanos.svg';

const Home = (props: RouteComponentProps) => (
    <Page>
        <Grid verticalAlign='middle' centered >
            <Grid.Row columns={2}>
                <Grid.Column align="right" width={3}>
                    <Image src={eridanosLogo} wrapped />
                </Grid.Column>
                <Grid.Column width={3} >
                    <Header size="large">
                        eridanos.
                    </Header>
                    <Header size="small" >
                        verifiable claims on ceramic.
                    </Header>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Page>
);

export default Home;
