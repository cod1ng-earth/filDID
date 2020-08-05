import { Link, navigate } from '@reach/router';
import {
  Blockie, Column, Container, Header, Image, Loader, Menu, Responsive, Row, Grid,
} from 'decentraland-ui';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWeb3Context } from 'web3-react';
import { useIdentity } from '../../context/IdentityContext';
import eridanosLogo from '../../img/eridanos.svg';

const UserMenu = () => {
  const { threeBox, threeBoxLoading } = useIdentity();

  const [threeBoxUserName, set3boxUserName] = useState<string>();

  useEffect(() => {
    if (!threeBox) return;
    (async () => {
      const _publicData = await threeBox.public.all();
      set3boxUserName(_publicData.name);
    })();
  }, [threeBox]);

  return <Grid padded="horizontally">
      <Row>
        <Column align="right" >
        {threeBoxLoading
          ? <>
              <Loader active size="tiny" />
              <span>opening 3box</span>
            </>
          : threeBox && <Row onClick={() => navigate('/3box')}>
                <Column><p style={{ padding: '4px' }}>{threeBoxUserName || threeBox.DID}</p></Column>
                <Column><Blockie seed={threeBox.DID} /></Column>
              </Row>
          }
        </Column>
      </Row>
    </Grid>;
};

const SignInMenu = ({ onSignIn }: any) => <Menu secondary>
        <Menu.Item className="sign-in-button" onClick={onSignIn}>
          Sign in
        </Menu.Item>
      </Menu>;

const NavbarBase = (props: any) => {
  const [toggle, setToggle] = useState<boolean>(false);

  const {
    activePage,
    className,
    isSignIn,
    isFullscreen,
    isOverlay,
  } = props;

  let classes = 'dcl navbar';

  if (toggle) {
    classes += ' open';
  }

  if (isSignIn) {
    classes += ' sign-in';
  }

  if (isFullscreen) {
    classes += ' fullscreen';
  }

  if (isOverlay) {
    classes += ' overlay';
  }

  if (className) {
    classes += ` ${className}`;
  }

  const Logo = () => <Link className="dcl navbar-logo" to="/" >
    <Image src={eridanosLogo} size='mini' />
  </Link>;

  return <div className={classes} role="navigation">
  <Container>
    <div className="dcl navbar-menu">
      <Responsive
        as={Menu}
        secondary
        stackable
        minWidth={Responsive.onlyTablet.minWidth}
      >
        <Logo />
        {props.leftMenu}
      </Responsive>
      <Responsive
        {...Responsive.onlyMobile}
        className="dcl navbar-mobile-menu"
      >

        <Logo />
        <Header
          size="small"
          className={`dcl active-page ${
            toggle ? 'caret-up' : 'caret-down'
          }`}
          onClick={() => setToggle(!toggle)}
        >
          {activePage}
        </Header>
      </Responsive>
    </div>

    <div className="dcl navbar-account">{props.rightMenu}</div>
  </Container>
<div className="mobile-menu" onClick={() => setToggle(false)}>{props.leftMenu}</div>
</div>;
};

const NavBar = (props:any) => {
  const {
    account, library: web3, setConnector, unsetConnector, error,
  } = useWeb3Context();

  const { threeBox, connectTo3box } = useIdentity();

  const [ethBalance, setEthBalance] = useState<number>();

  const connect = () => {
    if (error) { unsetConnector(); }
    setConnector('MetaMask');
  };

  useEffect(() => {
    if (!account) return;
    (async () => {
      const _ethBalance = await web3.eth.getBalance(account);
      const readableEthBalance = Web3.utils.fromWei(_ethBalance);

      setEthBalance(parseFloat(readableEthBalance));
      connectTo3box();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return <NavbarBase
    isConnected={!!account}
    address={account || ''}
    mana={ethBalance}
    onClickAccount={() => console.log('Clicked on account menu')}
    rightMenu={account ? <UserMenu /> : <SignInMenu onSignIn={connect}/>}
    leftMenu={
      <>
        <Menu.Item as={Link} to="/">Home</Menu.Item>
        { threeBox && <>
            <Menu.Item as={Link} to="/ceramic">Ceramic</Menu.Item>
        </>}
        { threeBox && <>
            <Menu.Item as={Link} to="/3box">3box</Menu.Item>
        </>
        }
      </>
    }

  />;
};

export default NavBar;
