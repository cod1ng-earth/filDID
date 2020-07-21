import {
  Blockie, Dropdown, Menu, Navbar, Row, Column,
} from 'decentraland-ui';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWeb3Context } from 'web3-react';
import { Link } from '@reach/router';
import { useIdentity } from '../../context/IdentityContext';

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

const NavBar = () => {
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

  return <Navbar

    onSignIn={connect}
    isConnected={!!account}
    address={account || ''}
    mana={ethBalance}
    onClickAccount={() => console.log('Clicked on account menu')}
    rightMenu={account ? <UserMenu account={account} /> : null}
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
