import {
  Blockie, Dropdown, Menu, Row, Column, Container, Responsive, Header, Image,
} from 'decentraland-ui';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWeb3Context } from 'web3-react';
import { Link } from '@reach/router';
import { useIdentity } from '../../context/IdentityContext';
import eridanosLogo from '../../img/eridanos.svg';

const UserMenu = ({ account }: {account: string}) => {
  const { connectTo3box, threeBox } = useIdentity();

  return <Row>
      <Column align="right" >
        <span>{account}</span>
        {threeBox && <span>{threeBox.DID}</span>}
      </Column>
      <Column>
        <Dropdown trigger={<Blockie seed={account} />} direction="left">
        <Dropdown.Menu>
            <Dropdown.Item text="connect 3box" onClick={connectTo3box} />
        </Dropdown.Menu>
        </Dropdown>
      </Column>
    </Row>;
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

  const Logo = () => <Image src={eridanosLogo} size='mini' />;

  return <div className={classes} role="navigation">
  <Container>
    <div className="dcl navbar-menu">
      <Responsive
        as={Menu}
        secondary
        stackable
        minWidth={Responsive.onlyTablet.minWidth}
      >
        <a className="dcl navbar-logo" href="/" >
          <Logo />
        </a>
        {props.leftMenu}
      </Responsive>
      <Responsive
        {...Responsive.onlyMobile}
        className="dcl navbar-mobile-menu"
      >
        <a className="dcl navbar-logo" href="/">
        <Logo />
        </a>
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
  <div className="mobile-menu">{props.leftMenu}</div>
</div>;
};

const NavBar = (props:any) => {
  const {
    account, library: web3, setConnector, unsetConnector, error,
  } = useWeb3Context();

  const { threeBox } = useIdentity();

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
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return <NavbarBase
    isConnected={!!account}
    address={account || ''}
    mana={ethBalance}
    onClickAccount={() => console.log('Clicked on account menu')}
    rightMenu={account ? <UserMenu account={account} /> : <SignInMenu onSignIn={connect}/>}
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
