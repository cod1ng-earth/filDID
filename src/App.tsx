import IPFS from 'ipfs';
import React from 'react';
import Web3 from 'web3';
import Web3Provider, { Connectors } from 'web3-react';
import Main from './components/Main';

const App: React.FC = () => {
  const ipfsNode = IPFS.create({
    offline: false,
    config: {},
  });

  const { InjectedConnector } = Connectors;
  const MetaMask = new InjectedConnector({
    supportedNetworks: [1, 3, 4, 5, 7, 17],
  });
  const connectors = { MetaMask };

  return <Web3Provider connectors={connectors} libraryName="web3.js" web3Api={Web3}>
    {ipfsNode ? <Main ipfs={ipfsNode} /> : <div>ipfs connecting...</div>}
  </Web3Provider>;
};

export default App;
