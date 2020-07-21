import React from 'react';
import Web3 from 'web3';
import Web3Provider, { Connectors } from 'web3-react';
import { Router } from '@reach/router';
import { Footer } from './components/organisms/Footer';
import NavBar from './components/organisms/NavBar';

import { IdentityProvider } from './context/IdentityContext';
import Home from './components/pages/Home';
import ThreeBoxPage from './components/pages/ThreeBoxPage';
import CeramicPage from './components/pages/CeramicPage';

const App: React.FC = () => {
  const { InjectedConnector } = Connectors;
  const MetaMask = new InjectedConnector({
    supportedNetworks: [1, 3, 4, 5, 7, 17],
  });
  const connectors = { MetaMask };

  return <Web3Provider connectors={connectors} libraryName="web3.js" web3Api={Web3}>
    <div className="main">
      <IdentityProvider>
        <NavBar />
        <Router>
          <Home path="/" />
          <CeramicPage path="ceramic" />
          <ThreeBoxPage path="3box" />
        </Router>
        <Footer />
      </IdentityProvider>
    </div>
  </Web3Provider>;
};

export default App;
