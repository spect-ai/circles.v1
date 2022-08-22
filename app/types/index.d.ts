interface UserType {
  accounts: string[];
  createdAt: string;
  ethAddress: string;
  id: string;
  updatedAt: string;
  username: string;
  avatar: string;
  bio: string;
  skills: string[];
  discordId?: string;
  githubId?: string;
  twitterId?: string;
  _id: string;
  circles: string[];
  projects: string[];
  assignedCards: string[];
  reviewingCards: string[];
  assignedClosedCards: string[];
  reviewingClosedCards: string[];
  cardDetails: any;
  activities: string[];
  notifications: string[];
  bookmarks: string[];
  followedCircles: string[];
  followedUsers: string[];
  followedByUsers: string[];
}

export interface Payment {
  chain: Chain;
  token: Token;
}

type BatchPayInfo = {
  retroId?: string;
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
  manageCardProperties: {
    Task: true;
    Bounty: false;
  };
  createNewCard: {
    Task: true;
    Bounty: false;
  };
  manageRewards: {
    Task: true;
    Bounty: false;
  };
  reviewWork: {
    Task: true;
    Bounty: false;
  };
  canClaim: {
    Task: true;
    Bounty: false;
  };
}

export interface DiscordRoleMappingType {
  [roleId: string]: {
    circleRole: string[];
    name: string;
  };
}

export interface RetroType {
  circle: string;
  createdAt: string;
  creator: string;
  description: string;
  duration: number;
  id: string;
  members: string[];
  reward: {
    chain: Chain;
    token: Token;
    value: number;
  };
  slug: string;
  stats: {
    [userId: string]: {
      canGive: boolean;
      canReceive: boolean;
      owner: string;
      votesAllocated: number;
      votesGiven: {
        [userId: string]: number;
      };
      votesRemaining: number;
      feedbackGiven: {
        [userId: string]: string;
      };
    };
  };
  feedbackGiven: {
    [key: string]: string;
  };
  feedbackReceived: {
    [key: string]: string;
  };
  strategy: "Quadratic Voting" | "Normal Voting";
  distribution: {
    [userId: string]: number;
  };
  status: {
    active: boolean;
    paid: boolean;
    archived: boolean;
  };
  title: string;
  updatedtAt: string;
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
      mutable: boolean;
    };
  };
  localRegistry: Registry;
  discordGuildId: string;
  discordToCircleRoles: DiscordRoleMappingType;
  githubRepos: string[];
  gradient: string;
  retro: RetroType[];
  safeAddresses: SafeAddresses;
  toBeClaimed: boolean;
  qualifiedClaimee: string[];
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
  status: Status;
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
  pr: string;
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
  viewOrder?: string[];
  viewDetails?: {
    [key: string]: Views;
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

export interface CardDetails {
  id: string;
  title: string;
  slug: string;
  deadline: string;
  priority: number;
  labels: string[];
  reviewer: {
    ethAddress: string | undefined;
    username: string;
    avatar: string;
    id: string;
  }[];
  assignee: {
    username: string;
    avatar: string;
    id: string;
  }[];
  project: {
    name: string;
    slug: string;
    id: string;
  };
  circle: {
    avatar: string;
    name: string;
    slug: string;
    id: string;
  };
  status: {
    active: boolean;
    archived: boolean;
    paid: boolean;
  };
}

export type Filter = {
  assignee: string[];
  reviewer: string[];
  column: string[];
  label: string[];
  status: string[];
  title: string;
  type: string[];
  priority: string[];
  deadline: string;
};

export type CardsType = {
  [key: string]: CardType;
};

export type Views = {
  type: "List" | "Board";
  hidden: boolean;
  filters: Filter;
  slug?: string;
  name: string;
};

export type Status = {
  active: boolean;
  paid: boolean;
  archived: boolean;
};

export type SafeAddresses = {
  [chaninId: string]: string[];
};
