import IPFS from 'ipfs';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Web3Provider, { Connectors } from 'web3-react';
import Ceramic from '@ceramicnetwork/ceramic-core';
import IdentityWallet from 'identity-wallet';
import Main from './components/Main';

const seed = '0x6872d6e0ae7347b72c9216db218ebbb9d9d0ae7ab818ead3557e8e78bf944184';

const App: React.FC = () => {
  const [ipfsNode, setIpfsNode] = useState<IPFS>();
  const [ceramic, setCeramic] = useState<Ceramic>();

  useEffect(() => {
    (async () => {
      const _ipfs = await IPFS.create({
        offline: false,
        config: {},
      });
      setIpfsNode(_ipfs);
      const _ceramic = await Ceramic.create(_ipfs, {
        ethereumRpcUrl: 'http://127.0.0.1:7545',
        stateStorePath: './ceramic.lvl',
      });
      const idWallet = new IdentityWallet(async () => true, { seed });
      await _ceramic.setDIDProvider(idWallet.get3idProvider());
      setCeramic(_ceramic);
    })();
  }, []);

  const { InjectedConnector } = Connectors;
  const MetaMask = new InjectedConnector({
    supportedNetworks: [1, 3, 4, 5, 7, 17],
  });
  const connectors = { MetaMask };

  return <Web3Provider connectors={connectors} libraryName="web3.js" web3Api={Web3}>
    {(ceramic && ipfsNode) ? <Main ipfs={ipfsNode} ceramic={ceramic}/> : <div>ipfs connecting...</div>}
  </Web3Provider>;
};

export default App;
