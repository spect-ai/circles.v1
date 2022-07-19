interface UserType {
  accounts: string[];
  createdAt: string;
  ethAddress: string;
  id: string;
  updatedAt: string;
  username: string;
  avatar: string;
  discordId?: string;
  githubId?: string;
  _id: string;
}
interface Payment {
  chain: Chain;
  token: Token;
}

type BatchPayInfo = {
  approval: {
    tokenAddresses: string[];
    values: number[];
  };
  currency: {
    userIds: string[];
    values: number[];
  };
  tokens: {
    tokenAddresses: string[];
    userIds: string[];
    values: number[];
  };
};

export interface ColumnType {
  columnId: string;
  name: string;
  cards: string[];
  defaultCardType: "Task" | "Bounty";
  access: {
    canCreateCard: string;
  };
}

export interface Permissions {
  createNewCircle: boolean;
  createNewProject: boolean;
  createNewRetro: boolean;
  endRetroManually: boolean;
  inviteMembers: boolean;
  makePayment: boolean;
  manageCircleSettings: boolean;
  manageMembers: boolean;
  managePaymentOptions: boolean;
  manageProjectSettings: boolean;
  manageRoles: boolean;
}

export interface DiscordRoleMappingType {
  [roleId: string]: {
    circleRole: string[];
    name: string;
  };
}

export interface CircleType {
  activity: string[];
  archived: boolean;
  avatar: string;
  children: CircleType[];
  createdAt: string;
  defaultPayment: Payment;
  description: string;
  id: string;
  members: string[];
  name: string;
  parents: CircleType[];
  private: boolean;
  projects: ProjectType[];
  slug: string;
  templates: any[];
  updatedAt: string;
  whitelistedTokens: any;
  memberRoles: {
    [key: string]: string[];
  };
  roles: {
    [name: string]: {
      name: string;
      description: string;
      permissions: Permissions;
      selfAssignable: boolean;
    };
  };
  localRegistry: Registry;
  discordGuildId: string;
  discordToCircleRoles: DiscordRoleMappingType;
  githubRepos: string[];
  gradient: string;
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
  id: string;
  title: string;
  slug: string;
  description: string;
  creator: string;
  reviewer: string[];
  assignee: string[];
  project: ProjectType;
  circle: string;
  reward: {
    chain: Chain;
    token: Token;
    value: number;
    transactionHash: string;
  };
  type: "Task" | "Bounty";
  deadline: string;
  labels: string[];
  priority: number;
  columnId: string;
  activity: Activity[];
  status: {
    active: boolean;
    archived: boolean;
    paid: boolean;
  };
  workThreadOrder: string[];
  workThreads: {
    [key: string]: WorkThreadType;
  };
  application: {
    [applicationId: string]: ApplicationType;
  };
  applicationOrder: string[];
  myApplication?: ApplicationType;
  children: CardType[];
  parent: CardType;
}

export interface ApplicationType {
  applicationId: string;
  content: string;
  createdAt: string;
  sstatus: "active" | "rejected" | "picked";
  updatedAt: string;
  user: string;
  title: string;
}

export interface WorkThreadType {
  workUnitOrder: string[];
  workUnits: {
    [key: string]: WorkUnitType;
  };
  active: boolean;
  status: "accepted" | "inRevision" | "inReview" | "draft";
  threadId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkUnitType {
  user: string;
  content: string;
  workUnitId: string;
  createdAt: string;
  updatedAt: string;
  type: "submission" | "revision" | "feedback";
  workUnitId: string;
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
  discordDiscussionChannel: {
    id: string;
    name: string;
  };
}

interface ActionValidation {
  valid: boolean;
  reason: string;
}
export interface CardActions {
  addFeedback: ActionValidation;
  addRevisionInstruction: ActionValidation;
  applyToBounty: ActionValidation;
  archive: ActionValidation;
  canCreateCard: ActionValidation;
  close: ActionValidation;
  createDiscordThread: ActionValidation;
  duplicate: ActionValidation;
  pay: ActionValidation;
  submit: ActionValidation;
  updateAssignee: ActionValidation;
  updateColumn: ActionValidation;
  updateDeadline: ActionValidation;
  updateGeneralCardInfo: ActionValidation;
  claim: ActionValidation;
}

export interface ProjectCardActionsType {
  [cardId: string]: CardActions;
}

export interface Chain {
  chainId: string;
  name: string;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
}

export type Registry = {
  [chainId: string]: NetworkInfo;
};

export type NetworkInfo = {
  distributorAddress?: string;
  name: string;
  mainnet: boolean;
  chainId: string;
  nativeCurrency: string;
  pictureUrl: string;
  blockExplorer?: string;
  provider: string;
  tokenDetails: { [tokenAddress: string]: Token };
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

export interface MemberDetails {
  memberDetails: {
    [key: string]: UserType;
  };
  members: string[];
}

export interface Activity {
  content: string;
  timestamp: string;
  actorId: string;
  commitId: string;
  comment: boolean;
}
