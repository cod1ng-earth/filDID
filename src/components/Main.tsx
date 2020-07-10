import Box from '3box';
import IPFS from 'ipfs';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWeb3Context } from 'web3-react';

const Main = ({ ipfs }: { ipfs: IPFS }) => {
  const { account, library: web3, setConnector } = useWeb3Context();
  const [box, setBox] = useState<any>();

  const [ethBalance, setEthBalance] = useState<string>();

  useEffect(() => {
    setConnector('MetaMask');
  }, [setConnector]);

  useEffect(() => {
    if (!account) return;
    (async () => {
      const _ethBalance = await web3.eth.getBalance(account);
      const readableEthBalance = Web3.utils.fromWei(_ethBalance);
      setEthBalance(readableEthBalance);
    })();
  }, [web3, account]);

  async function connectTo3box() {
    try {
      const _box = await Box.openBox(account, web3.eth.currentProvider, {
        ipfs,
      });
      await _box.syncDone;
      console.log('box sync done', _box);
      setBox(_box);
    } catch (e) {
      console.error(e);
    }
  }

  async function listContents() {
    const rootDID = box.DID;
    console.log(rootDID);

    const profile = await Box.getProfile(rootDID);
    console.log('profile', profile);

    const publicData = await box.public.all();
    console.log(publicData);
  }
  return <div>test{ethBalance}
    {web3 && <div><button onClick={connectTo3box}>connect 3box</button></div>}
    {box && <div><button onClick={listContents}>list content</button></div>}
  </div>;
};

export default Main;
