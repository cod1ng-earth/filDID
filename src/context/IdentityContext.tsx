import React, {
  createContext, useState, useContext, useEffect,
} from 'react';
import IPFS from 'ipfs';
import Ceramic from '@ceramicnetwork/ceramic-core';
import IdentityWallet from 'identity-wallet';
import { useWeb3Context } from 'web3-react';
import Box from '3box';
import { VerifiableCredentialDoctypeHandler } from '@ceramicnetwork/ceramic-doctype-verifiable-credential';
import { toast } from 'react-semantic-toasts';
import Keyring from 'identity-wallet/lib/keyring';

// const seed = '0x7872d6e0ae7347b72c9216db218ebbb9d9d0ae7ab818ead3557e8e78bf944184';
// const DEFAULT_ANCHOR_SERVICE_URL = 'https://cas.3box.io:8081/api/v0/requests';

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
  threeBoxLoading: boolean,
  connectTo3box: (box: any) => void
}

const IdentityContext = createContext<IIdentityContext>({
  ipfsNode: null,
  ceramic: null,
  identityWallet: null,
  threeBox: null,
  threeBoxLoading: false,
  connectTo3box: () => { },
});

export const useIdentity = () => useContext(IdentityContext);

export const IdentityProvider = ({
  children,
  ipfsConfig = {},
  ceramicConfig = {
    //anchorServiceUrl: DEFAULT_ANCHOR_SERVICE_URL,
    ethereumRpcUrl: 'http://127.0.0.1:7545',
    stateStorePath: './ceramic.lvl',
  },
}: IIdentityProviderProps) => {
  const { account, library: web3 } = useWeb3Context();

  const [ipfsNode, setIpfsNode] = useState<IPFS | null>(null);
  const [ceramic, setCeramic] = useState<Ceramic | null>(null);
  const [identityWallet, setIdentityWallet] = useState<IdentityWallet | null>(null);
  const [threeBox, set3Box] = useState();
  const [threeBoxLoading, set3BoxLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const _ipfs = await IPFS.create({
        offline: false,
        config: ipfsConfig,
      });
      // _ipfs.swarm.connect('/ip4/127.0.0.1/tcp/4002/ws/ipfs/QmRZgtRrc4d1FX67ddGWWyabUQZxjZi8Tp1exu98mfGTvQ');
      setIpfsNode(_ipfs);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createNewSeed = () => {
    // crypto is a global browser object
    // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return `0x${Buffer.from(randomBytes).toString('hex')}`;
  };

  function makeIdentityWallet(seed: string) : IdentityWallet {
    return new IdentityWallet((request) => Promise.resolve(true), {
      seed,
      // ethereumAddress: account,
      // externalAuth,
    });
  }

  async function connectTo3box() {
    try {
      set3BoxLoading(true);
      const _box = await Box.openBox(account, web3.eth.currentProvider, {
        ipfs: ipfsNode,
      });

      set3Box(_box);
      await _box.syncDone;

      set3BoxLoading(false);
      toast({
        type: 'success',
        title: '3box loaded.',
      });
      let ceramicSeed = await _box.private.get('ceramic_seed');

      if (!ceramicSeed) {
        ceramicSeed = createNewSeed();
        _box.private.set('ceramic_seed', ceramicSeed);
      }
      const keyring = new Keyring(ceramicSeed);
      const signer = keyring.getRootSigner('managementKey');

      const signed = await signer('sign this!');
      console.log(signed);
      const idWallet = makeIdentityWallet(ceramicSeed);
      setIdentityWallet(idWallet);

      const _ceramic = await Ceramic.create(ipfsNode, {
        ...ceramicConfig,
        didProvider: idWallet.get3idProvider(),
      });

      // idWallet.linkAddress(account!, web3.eth.currentProvider);
      _ceramic.addDoctypeHandler(new VerifiableCredentialDoctypeHandler());
      setCeramic(_ceramic);
    } catch (e) {
      console.error(e);
    }
  }

  return (
      <IdentityContext.Provider value={{
        ipfsNode, ceramic, threeBox, connectTo3box, identityWallet, threeBoxLoading,
      }} >
          {children}
      </IdentityContext.Provider>
  );
};
