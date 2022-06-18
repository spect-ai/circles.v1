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

export interface ColumnType {
  columnId: string;
  name: string;
  cards: string[];
  defaultCardType: "Task" | "Bounty";
  access: {
    canCreateCard: string;
  };
}

export interface CircleType {
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
  projects: ProjectType[];
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

export interface CardType {
  issuer: string;
  id: string;
  slug: string;
  title: string;
  description: any;
  submission: {
    link: string;
    name: string;
  };
  deadline: Date | null;
  labels: string[];
  assignee: Array<string>;
  reviewer: Array<string>;
  creator: string;
  chain: Chain;
  value: number;
  token: Token;
  activity: [
    {
      actor: string;
      action: number;
      timestamp: Date;
      username: string;
      profilePicture: any;
    }
  ];
  status: number;
  members: Member[];
  access: {
    creator: boolean;
    reviewer: boolean;
    assignee: boolean;
    applicant: boolean;
    canApply: boolean;
  };
  issueLink?: string;
  boardId: string;
  createdAt: string;
  type: string;
  submissions: Array<SubmissionData>;
  proposals: Array<Proposal>;
  numProposals: number;
  selectedProposals: Array<string>;
  updates: Array<object>;
  columnId: string;
  comments: Array<Comment>;
  votes: string[];
  subTasks: {
    title: string;
    assignee: string;
  }[];
  onChainBountyId?: number;
  nftAddress?: string;
  attested?: boolean;
  ipfsUrl?: string;
  claimedBy?: string[];
  issuer?: string;
  priority?: number;
}

export interface ProjectType {
  id: string;
  name: string;
  cards: {
    [key: string]: CardType;
  };
  columnDetails: {
    [key: string]: ColumnType;
  };
  columnOrder: string[];
  createdAt: string;
  updatedAt: string;
  description: string;
  archived: boolean;
  slug: string;
  private: boolean;
  parents: CircleType[];
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

export interface Template {
  _id: string;
  name: string;
  type: string;
  data: {
    columnOrder: string[];
    columnDetails: {
      [key: string]: Column;
    };
  };
}
