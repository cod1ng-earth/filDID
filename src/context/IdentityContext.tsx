import React, {
  createContext, useState, useContext, useEffect,
} from 'react';
import IPFS from 'ipfs';
import Ceramic from '@ceramicnetwork/ceramic-core';
import IdentityWallet, { IConsentRequest } from 'identity-wallet';
import { useWeb3Context } from 'web3-react';
import Box from '3box';

// const seed = '0x7872d6e0ae7347b72c9216db218ebbb9d9d0ae7ab818ead3557e8e78bf944184';
const DEFAULT_ANCHOR_SERVICE_URL = 'https://cas.3box.io:8081/api/v0/requests';

interface IIdentityProviderProps {
    children: any;
    ipfsConfig?: any;
    ceramicConfig?: any;
}

export interface IIdentityContext {
  ipfsNode: IPFS | null;
  ceramic: Ceramic | null;
  identityWallet: IdentityWallet | null;
  threeBox: any,
  connectTo3box: (box: any) => void
}

const IdentityContext = createContext<IIdentityContext>({
  ipfsNode: null,
  ceramic: null,
  identityWallet: null,
  threeBox: null,
  connectTo3box: () => { },
});

export const useIdentity = () => useContext(IdentityContext);

export const IdentityProvider = ({
  children,
  ipfsConfig = {},
  ceramicConfig = {
    // anchorServiceUrl: DEFAULT_ANCHOR_SERVICE_URL,
    ethereumRpcUrl: 'http://127.0.0.1:7545',
    stateStorePath: './ceramic.lvl',
  },
}: IIdentityProviderProps) => {
  const { account, library: web3 } = useWeb3Context();

  const [ipfsNode, setIpfsNode] = useState<IPFS | null>(null);
  const [ceramic, setCeramic] = useState<Ceramic | null>(null);
  const [identityWallet, setIdentityWallet] = useState<IdentityWallet | null>(null);
  const [threeBox, set3Box] = useState();

  useEffect(() => {
    (async () => {
      const _ipfs = await IPFS.create({
        offline: false,
        config: ipfsConfig,
      });

      setIpfsNode(_ipfs);
    })();
  }, []);

  const createNewSeed = () => {
    // crypto is a global browser object
    // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return `0x${Buffer.from(randomBytes).toString('hex')}`;
  };

  function makeIdentityWallet(seed: string) : IdentityWallet {
    return new IdentityWallet((request: IConsentRequest) => true, {
      seed,
      // ethereumAddress: account,
      // externalAuth,
    });
  }

  async function connectTo3box() {
    try {
      const _box = await Box.openBox(account, web3.eth.currentProvider, {
        ipfs: ipfsNode,
      });

      set3Box(_box);
      await _box.syncDone;

      let ceramicSeed = await _box.private.get('ceramic_seed');
      if (!ceramicSeed) {
        ceramicSeed = createNewSeed();
        _box.private.set('ceramic_seed', ceramicSeed);
      }

      const _ceramic = await Ceramic.create(ipfsNode, {
        ...ceramicConfig,
      });

      const idWallet = makeIdentityWallet(ceramicSeed);
      setIdentityWallet(idWallet);
      // idWallet.linkAddress(account!, web3.eth.currentProvider);
      await _ceramic.setDIDProvider(idWallet.get3idProvider());
      setCeramic(_ceramic);
    } catch (e) {
      console.error(e);
    }
  }

  return (
      <IdentityContext.Provider value={{
        ipfsNode, ceramic, threeBox, connectTo3box, identityWallet,
      }} >
          {children}
      </IdentityContext.Provider>
  );
};
