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
  activeApplications: {
    cardId: string;
    applicationTitle: string;
  }[];
  cardDetails: any;
  activities: string[];
  notifications: Notification[];
  retro: string[];
  retroDetails: any;
  bookmarks: string[];
  followedCircles: string[];
  followedUsers: string[];
  followedByUsers: string[];
  userDetails: any;
}

export interface Payment {
  chain: Chain;
  token: Token;
}

type BatchPayInfo = {
  payCircle: boolean;
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
  chainId: string;
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
  distributeCredentials: boolean;
  manageCardProperties: {
    Task: boolean;
    Bounty: boolean;
  };
  createNewCard: {
    Task: boolean;
    Bounty: boolean;
  };
  manageRewards: {
    Task: boolean;
    Bounty: boolean;
  };
  reviewWork: {
    Task: boolean;
    Bounty: boolean;
  };
  canClaim: {
    Task: boolean;
    Bounty: boolean;
  };
}

export type Permission =
  | "createNewCircle"
  | "createNewProject"
  | "createNewRetro"
  | "endRetroManually"
  | "inviteMembers"
  | "makePayment"
  | "manageCircleSettings"
  | "manageMembers"
  | "managePaymentOptions"
  | "manageProjectSettings"
  | "manageRoles"
  | "distributeCredentials"
  | "manageCardProperties"
  | "createNewCard"
  | "manageRewards"
  | "reviewWork"
  | "canClaim";

export interface DiscordRoleMappingType {
  [roleId: string]: {
    circleRole: string[];
    name: string;
  };
}

export type GuildxyzToCircleRoles = {
  [role: number]: {
    circleRole: string[];
    name: string;
    id: number;
  };
};

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

export interface BucketizedCircleType {
  memberOf: CircleType[];
  claimable: CircleType[];
  joinable: CircleType[];
}

export interface CircleType {
  activity: string[];
  archived: boolean;
  avatar: string;
  children: {
    [key: string]: CircleType;
  };
  createdAt: string;
  defaultPayment: Payment;
  description: string;
  id: string;
  members: string[];
  name: string;
  parents: CircleType[];
  private: boolean;
  projects: {
    [key: string]: ProjectType;
  };
  collections: CollectionType[];
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
  unauthorized?: boolean;
  labels: string[];
  folderOrder: string[];
  folderDetails: {
    [key: string]: {
      name: string;
      avatar: string;
      contentIds: string[];
      id: string;
    };
  };
  guildxyzId: number;
  guildxyzToCircleRoles: GuildxyzToCircleRoles;
  questbookWorkspaceUrl?: string;
  questbookWorkspaceId?: string;
  grantMilestoneProject?: string;
  grantApplicantProject?: string;
  paymentAddress: string;
  grantNotificationChannel?: DiscordChannel;
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
    transactionHash?: string;
  };
  type: "Task" | "Bounty";
  deadline: string;
  startDate: string;
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
  kudosMinted: KudosForType;
  kudosClaimedBy: KudosClaimedType;
  eligibleToClaimKudos: KudosClaimedType;
  unauthorized?: boolean;
  assignedCircle: string;
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
  unauthorized?: boolean;
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
  updateStartDate: ActionValidation;
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
  assignedCircle: string[];
};

export type CardsType = {
  [key: string]: CardType;
};

export type Views = {
  type: "List" | "Board" | "Gantt" | "Table";
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

export type Notification = {
  id: string;
  content: string;
  type: "card" | "project" | "circle" | "retro";
  linkPath: string[];
  actor: string;
  timestamp: Date;
  entityId?: string;
  ref: {
    cards?: ContentPlaceholder;
    users?: ContentPlaceholder;
    circles?: ContentPlaceholder;
    projects?: ContentPlaceholder;
  };
  read: boolean;
};

export type SafeAddresses = {
  [chaninId: string]: string[];
};

export type ContentPlaceholder = {
  [key: string]: string;
};

export type AdvancedFilters = {
  inputTitle: string;
  groupBy: "Status" | "Assignee";
  sortBy: "none" | "Priority" | "Deadline";
  order: "asc" | "des";
};

export type KudosRequestType = {
  creator: string;
  headline: string;
  description: string;
  startDateTimestamp?: number;
  endDateTimestamp?: number;
  links: string[];
  communityUniqId?: string;
  isSignatureRequired?: boolean;
  isAllowlistRequired?: boolean;
  totalClaimCount: number;
  expirationTimestamp: number;
  contributors: string[];
};

export type KudosType = {
  tokenId: number;
  headline: string;
  description: string;
  startDateTimestamp?: number;
  endDateTimestamp?: number;
  links: string[];
  communityId?: string;
  createdByAddress?: boolean;
  createdAtTimestamp?: boolean;
  imageUrl: string;
  claimabilityAttributes: ClaimabilityAttributes;
};

export type KudosForType = {
  [kudosFor: "assignee" | "reviewer"]: string;
};

export type KudosClaimedType = {
  [tokenId: string]: string[];
};

type ClaimabilityAttributes = {
  isSignatureRequired: boolean;
  isAllowlistRequired: boolean;
  totalClaimCount: number;
  remainingClaimCount?: number;
  expirationTimestamp?: number;
};

export type KudoOfUserType = {
  kudosTokenId: number;
  headline: string;
  createdAt: string;
  assetUrl: string;
  claimStatus: string;
  communityId: string;
};

export interface DistributeEtherParams {
  contributors: any;
  values: any[];
  chainId: string;
  cardIds: string[];
  circleId: string;
  type: "card" | "retro";
  callerId: string;
  nonce?: number;
  paymentMethod: "wallet" | "gnosis" | "gasless";
}

export interface DistributeTokenParams extends DistributeEtherParams {
  tokenAddresses: string[];
}

export type ExternalProvider = {
  isMetaMask?: boolean;
  isStatus?: boolean;
  host?: string;
  path?: string;
  sendAsync?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void;
  send?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void;
  request?: (request: { method: string; params?: Array<any> }) => Promise<any>;
};

export type DiscordChannel = {
  id: string;
  name: string;
};

export interface CollectionType {
  id: string;
  name: string;
  slug: string;
  properties: { [id: string]: Property };
  propertyOrder: string[];
  createdAt: string;
  updatedAt: string;
  purpose: string;
  private: boolean;
  parents: CircleType[];
  unauthorized?: boolean;
}

export type Property = {
  name: string;
  type: PropertyType;
  value: any;
  default?: any;
  condition?: any; // Show property only when condition is met
  options?: Option[];
};

export type PropertyType =
  | "shortText"
  | "longText"
  | "number"
  | "user[]"
  | "user"
  | "reward"
  | "date"
  | "singleSelect"
  | "multiSelect"
  | "ethAddress";

export type Option = {
  label: string;
  value: string | number;
};

export type Conditions = Condition[];

export type Condition = DateConditions;

export type DateConditions = {
  propertyId: string;
  condition: ComparisonCondition;
  feedback: string;
};

export type ComparisonCondition = "greaterThanOrEqualTo" | "lessThanOrEqualTo";
