import Box from '3box';
import IPFS from 'ipfs';

import EthrDID from 'ethr-did';

import { Issuer, JwtCredentialPayload, createVerifiableCredentialJwt } from 'did-jwt-vc';

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useWeb3Context } from 'web3-react';
import Ceramic from '@ceramicnetwork/ceramic-core';

const SOME_ETH_ADDRESS = '0x4f34eF8a549dbB6D00D562A55919a8aE66a16F1C';
const Main = ({ ipfs, ceramic }: { ipfs: IPFS, ceramic: Ceramic }) => {
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

  async function createCidDoc() {
    const doc = await ceramic.createDocument('tile', {
      owners: [SOME_ETH_ADDRESS],
      content: {
        some: 'content',
      },
    });
    console.log(doc);
  }

  async function createNewCredentialPayload(issuer: Issuer, forAddress: string) {
    const vcPayload: JwtCredentialPayload = {
      sub: `did:ethr:${forAddress}`,
      nbf: 1562950282,
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: {
          degree: {
            type: 'HackFS FilDID user',
            name: 'This user worked on FilDID',
          },
        },
      },
    };

    const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
    return vcJwt;
  }

  function createNewIssuer() {
    const aNewAccount = web3.eth.accounts.create();

    const issuer: Issuer = new EthrDID({
      address: aNewAccount.address,
      privateKey: aNewAccount.privateKey,
    });
    return issuer;
  }

  async function createNewJwtCredential(forAddress: string) {
    const issuer = createNewIssuer();
    const vcJwt = await createNewCredentialPayload(issuer, forAddress);
    console.log(vcJwt);
  }

  return <div>test{ethBalance}
    {web3 && <div><button onClick={connectTo3box}>connect 3box</button></div>}
    {box && <div><button onClick={listContents}>list content</button></div>}
    <div><button onClick={createCidDoc}>create doc</button></div>
    {account && <div>
      <button onClick={() => createNewJwtCredential(account)}>create VC JWT</button>
    </div>}
  </div>;
};

export default Main;
