interface UserType {
  accounts: string[];
  createdAt: string;
  ethAddress: string;
  id: string;
  updatedAt: string;
  username: string;
  avatar: string;
  _id: string;
}
interface Payment {
  chain: {
    chainId: string;
    name: string;
  };
  token: {
    address: string;
    symbol: string;
  };
}

interface CircleType {
  activity: string[];
  archived: boolean;
  avatar: string;
  children: Circle[];
  createdAt: string;
  defaultPayment: Payment;
  description: string;
  id: string;
  members: any[];
  name: string;
  parents: Circle[];
  private: boolean;
  projects: Project[];
  roles: any[];
  slug: string;
  templates: any[];
  updatedAt: string;
  whitelistedTokens: any;
}

// interface ProjectType {
//   archived: boolean;
//   columnOrder: string[];
//   createdAt: string;
//   id: string;
//   name: string;
//   parents: Circle[];
//   private: boolean;
//   slug: string;
//   templates: any[];
//   updatedAt: string;
// }

//temp
export interface ProjectType {
  objectId: string;
  name: string;
  tasks: {
    [key: string]: Task;
  };
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
  teamId: string;
  createdAt: string;
  updatedAt: string;
  statusList: string[];
  members: string[];
  memberDetails: MemberDetails;
  access: string;
  roles: {
    [key: string]: number;
  };
  roleMapping: {
    [key: string]: number;
  };
  userRole: number;
  epochs: Epoch[];
  _id: string;
  _createdAt: string;
  // eslint-disable-next-line no-use-before-define
  team: Team[];
  defaultPayment: DefaultPayment;
  tokenGating: TokenGate;
  description: string;
  private: boolean;
  creatingEpoch: boolean;
  guildId: string;
  discussionChannel: Channel;
  githubRepos: string[];
}

export interface Chain {
  chainId: string;
  name: string;
}

export interface Token {
  address: string;
  symbol: string;
}

export type Registry = {
  [chainId: string]: NetworkInfo;
};

export type NetworkInfo = {
  tokenAddresses: string[];
  distributorAddress?: string;
  name: string;
  mainnet: boolean;
  chainId: string;
  nativeCurrency: string;
  pictureUrl: string;
  blockExplorer?: string;
  provider: string;
  tokens: { [tokenAddress: string]: TokenInfo };
};
