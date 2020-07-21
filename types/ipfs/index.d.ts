// inspired by https://github.com/reasv/types-ipfs/blob/master/index.d.ts
// eslint-disable-next-line max-classes-per-file
declare module 'ipfs'

declare class IPFS {
  create(any): IPFS

  ls: Function;

  add: Function;

  cat: Function;

  ls: Function;

  get: Function;

  stat: Function;

  stop: Function;

  pin: any;

  pubsub: any;

  files: any;

  dag: any;

  version: Function;

  swarm: IPFS.SwarmAPI;

  bootstrap: {
    add: (addr: string, options?: any) => Promise<Object>,
    list: () => Promise<Object>,
    rm: (peer: string, options?: any) => Promise<Object>
  };

  id: () => Promise<object>;
}

declare namespace IPFS {
  export interface IPFSFile {
    path: string;
    hash: string;
    size: number;
    content?: FileContent;
  }

  export type Multihash = any | string;
  export type CID = any;

  export interface PeersOptions {
    v?: boolean;
    verbose?: boolean;
  }

  export type PeerId = any;

  export interface PeerInfo {
    id: PeerId;
    multiaddr: Multiaddr;
    multiaddrs: Multiaddr[];
    addrs: Multiaddr[];
    distinctMultiaddr(): Multiaddr[];
  }

  export interface Peer {
    addr: Multiaddr;
    peer: PeerInfo;
  }

  export interface SwarmAPI {
    peers(options: PeersOptions, callback: Callback<Peer[]>): void;
    peers(options: PeersOptions): Promise<Peer[]>;
    peers(callback: Callback<Peer[]>): void;
    peers(): Promise<Peer[]>;

    addrs(callback: Callback<PeerInfo[]>): void;
    addrs(): Promise<PeerInfo[]>;

    localAddrs(callback: Callback<Multiaddr[]>): void;
    localAddrs(): Promise<Multiaddr[]>;

    connect(maddr: Multiaddr | string, callback: Callback<any>): void;
    connect(maddr: Multiaddr | string): Promise<any>;

    disconnect(maddr: Multiaddr | string, callback: Callback<any>): void;
    disconnect(maddr: Multiaddr | string): Promise<any>;

    filters(callback: Callback<void>): never;
  }
}

declare class CID {
  buffer: Uint8Array;
}

declare class multihash {
  fromB58String(hash: (string | Buffer)): Buffer
}
