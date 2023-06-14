/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserType {
  accounts: string[];
  createdAt: string;
  ethAddress: string;
  id: string;
  updatedAt: string;
  username: string;
  avatar: string;
  bio: string;
  email: string;
  discordId?: string;
  discordUsername?: string;
  discordAvatar?: string;
  githubId?: string;
  githubUsername?: string;
  githubAvatar?: string;
  telegramId?: string;
  telegramUsername?: string;
  _id: string;
  circles: string[];
  activities: string[];
  notifications: Notification[];
  userDetails: any;
  circleDetails: {
    [key: string]: {
      slug: string;
      avatar: string;
    };
  };
  collections: CollectionType;
  collectionsSubmittedTo: CollectionType[];
  apiKeys: string[];
  firstLogin?: boolean;
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
  retro?: RetroType;
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

export type PermissionString =
  | "createNewCircle"
  | "createNewForm"
  | "inviteMembers"
  | "makePayment"
  | "manageCircleSettings"
  | "manageMembers"
  | "managePaymentOptions"
  | "manageRoles";

export interface Permissions {
  createNewCircle: boolean;
  createNewForm: boolean;
  inviteMembers: boolean;
  makePayment: boolean;
  manageCircleSettings: boolean;
  manageMembers: boolean;
  managePaymentOptions: boolean;
  manageRoles: boolean;
}

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
  collections: {
    [key: string]: {
      id: string;
      name: string;
      slug: string;
      viewType?: string;
      collectionType: 0 | 1;
      archived: boolean;
    };
  };
  slug: string;
  updatedAt: string;
  whitelistedTokens: any;
  memberRoles: {
    [key: string]: string[];
  };
  roles: {
    [role: string]: {
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
  retro: {
    [key: string]: RetroType;
  };
  safeAddresses: SafeAddresses;
  whitelistedAddresses: SafeAddresses;
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
  paymentAddress: string;
  automations: AutomationType;
  automationsIndexedByCollection: AutomationsIndexedByCollectionSlugType;
  rootAutomations: RootAutomationsType;
  automationCount: number;
  pendingPayments: string[];
  pendingSignaturePayments: string[];
  completedPayments: string[];
  cancelledPayments: string[];
  paymentDetails: { [key: string]: PaymentDetails };
  paymentLabelOptions: Option[];
  snapshot: {
    name: string;
    id: string;
    network: string;
    symbol: string;
  };
  sidebarConfig?: SidebarConfig;
  hasSetupZealy?: boolean;
}

export type CirclePrivate = {
  zealyApiKey?: string;
  zealySubdomain?: string;
  mintkudosApiKey?: string;
  mintkudosCommunityId?: string;
};

export type SidebarConfig = {
  showPayment?: boolean;
  showAutomation?: boolean;
  showGovernance?: boolean;
  showMembership?: boolean;
  showDiscussion?: boolean;
};

export type ViewType = "List" | "Board" | "Table";

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
  coinGeckoCurrencyId: string;
  coinGeckoPlatformId: string;
  surveyHubAddress: string;
  chainlinkVRFConsumerAddress: string;
};

export interface MemberDetails {
  memberDetails: {
    [key: string]: UserType;
  };
  members: string[];
}

export interface CollectionActivity {
  content: string;
  ref: {
    actor: {
      id: string;
      type?: string;
      refType?: string;
    };
  };
  timestamp: Date;
  comment: boolean;
  owner?: string;
  imageRef?: string;
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
    ethAddress: string | undefined;
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

export type Notification = {
  content: string;
  avatar: string;
  redirect: string;
  timestamp: string;
  read: boolean;
};

export type SafeAddresses = {
  [chaninId: string]: string[];
};

export type ContentPlaceholder = {
  [key: string]: string;
};

export type KudosAttribute = {
  fieldName: string;
  value: string;
  type: string;
};

export type KudosRequestType = {
  creator: string;
  headline: string;
  description?: string;
  startDateTimestamp?: number;
  endDateTimestamp?: number;
  links?: string[];
  communityUniqId?: string;
  isSignatureRequired: boolean;
  isAllowlistRequired: boolean;
  totalClaimCount?: number;
  expirationTimestamp?: number;
  contributors?: string[];
  customAttributes?: KudosAttribute[];
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

export type POAPEventType = {
  id: number;
  fancey_id: string;
  name: string;
  description: string;
  city: string;
  country: string;
  event_url: string;
  image_url: string;
  year: number;
  start_date: string;
  end_date: string;
  expiry_date: string;
  from_admin: boolean;
  virtual_event: boolean;
  event_template_id: number;
  private_event: boolean;
  claimed?: boolean;
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

export type CommunityKudosType = {
  name: string;
  nftTypeId: string;
  previewAssetUrl: string;
  isUserAdded: boolean;
};

export interface DistributeEtherParams {
  contributors: any;
  values: any[];
  chainId: string;
  cardIds: string[];
  circleId: string;
  type: string;
  callerId: string;
  nonce?: number;
  paymentMethod: "wallet" | "gnosis" | "gasless";
  circleRegistry?: Registry;
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
  description: string;
  slug: string;
  creator: string;
  properties: { [id: string]: Property };
  propertyOrder: string[];
  createdAt: string;
  updatedAt: string;
  private: boolean;
  parents: CircleType[];
  data?: MappedItem<any>;
  archivedData: MappedItem<any>;
  indexes: MappedItem<string[]>;
  defaultView: DefaultViewType;
  unauthorized?: boolean;
  permissions: FormPermissions;
  dataOwner: MappedItem<string>;
  profiles: { [key: string]: UserType };
  voting: Voting;
  dataActivities?: MappedItem<MappedItem<CollectionActivity>>;
  dataActivityOrder?: MappedItem<string[]>;
  collectionType: 0 | 1;
  editorVersion: 1 | 2;
  formMetadata: FormMetadata;
  projectMetadata: ProjectMetadata;
  archived: boolean;
  circleRolesToNotifyUponUpdatedResponse?: string[];
  circleRolesToNotifyUponNewResponse?: string[];
  activity: MappedItem<CollectionActivity>;
  activityOrder: string[];
  viewConditions: Condition[];
  discordThreadRef: {
    [key: string]: {
      threadId: string;
      channelId: string;
      guildId: string;
      private: boolean;
    };
  };
}

export type PaymentConfig = {
  required: boolean;
  type: "paywall" | "donation";
  networks: {
    [chainId: string]: {
      chainId: string;
      chainName: string;
      receiverAddress: string;
      tokens: {
        [tokenAddress: string]: {
          address: string;
          symbol: string;
          tokenAmount?: string;
          dollarAmount?: string;
        };
      };
    };
  };
};

export type FormMetadata = {
  cover?: string;
  logo: string;
  formRoleGating?: GuildRole[];
  sybilProtectionEnabled?: boolean;
  sybilProtectionScores?: MappedItem<number>;
  mintkudosTokenId?: number;
  messageOnSubmission: string;
  multipleResponsesAllowed: boolean;
  updatingResponseAllowed: boolean;
  numOfKudos?: number;
  credentialCurationEnabled?: boolean;
  active: boolean;
  hasPassedSybilCheck: boolean;
  previousResponses: any[];
  hasClaimedKudos: boolean;
  hasRole: boolean;
  canClaimKudos: boolean;
  allowAnonymousResponses: boolean;
  paymentConfig?: PaymentConfig;
  surveyTokenId?: number;
  surveyTokenClaimedByUser: boolean;
  canClaimSurveyToken: boolean;
  surveyChain?: Option;
  surveyToken?: Option;
  surveyTotalValue?: number;
  surveyVRFRequestId?: string;
  surveyLotteryWinner?: number;
  surveyDistributionType?: number;
  ceramicEnabled?: boolean;
  captchaEnabled?: boolean;
  poapEventId?: string;
  poapEditCode?: string;
  transactionHashes?: {
    [userAddress: string]: {
      [transactionType: "surveyTokenClaim"]: string;
    };
  };
  transactionHashesOfUser?: {
    [transactionType: string]: string;
  };
  minimumNumberOfAnswersThatNeedToMatchForPoap: number;
  responseDataForPoap: MappedItem<any>;
  minimumNumberOfAnswersThatNeedToMatchForMintkudos: number;
  responseDataForMintkudos: MappedItem<any>;
  canClaimPoap: boolean;
  matchCountForPoap?: number;
  matchCountForKudos?: number;
  pages: {
    [pageId: string]: {
      id: string;
      name: string;
      properties: string[];
      movable?: boolean;
    };
  };
  pageOrder: string[];
  lookup?: {
    tokens: LookupToken[];
    snapshot: number;
    verifiedAddress: boolean;
    communities: boolean;
  };
  discordRoleGating?: {
    id: string;
    name: string;
  }[];
  charts?: {
    [chartId: string]: Chart;
  };

  chartOrder?: string[];
  zealyXP?: number;
  zealyXpPerField?: MappedItem<number>;
  responseDataForZealy?: MappedItem<any>;
  totalClaimableXP?: number;
  canClaimZealy?: number;
  hasClaimedZealy?: boolean;
  zealySubdomain?: string;
};

export type Chart = {
  id: string;
  name: string;
  type: "bar" | "pie" | "line" | "doughnut";
  fields: string[];
  filters?: Condition[];
  advancedFilters?: ConditionGroup;
};

export type LookupToken = {
  tokenType: "erc20" | "erc721" | "erc1155" | "kudos" | "poap";
  contractAddress: string;
  metadata: {
    name: string;
    image?: string;
    symbol: string;
  };
  chainId: number;
  chainName?: string;
  tokenId?: string;
  tokenAttributes?: {
    key: string;
    value: string;
  }[];
};

export type ProjectMetadata = {
  viewOrder: string[];
  views: {
    [key: string]: {
      name: string;
      type: "grid" | "kanban" | "gantt" | "list";
      filters?: Condition[];
      sort?: {
        property: string;
        direction: "asc" | "desc";
      };
      groupByColumn: string;
      advancedFilters?: ConditionGroup;
    };
  };
  cardOrders: {
    [groupByColumn: string]: string[][];
  };
  payments?: {
    rewardField: string;
    payeeField: string;
  };
  paymentStatus?: {
    [dataSlug: string]: "pending" | "completed" | "pendingSignature";
  };
  paymentIds?: {
    [dataSlug: string]: string;
  };
};

export type FormPermissions = {
  manageSettings: string[];
  updateResponsesManually: string[];
  viewResponses: string[];
  addComments: string[];
};

export type CollectionPermissions =
  | "manageSettings"
  | "updateResponsesManually"
  | "viewResponses"
  | "addComments";

export type PayWallOptions = {
  network: Registry;
  value: number;
  receiver: string;
  paid?: boolean;
};

export type PaymentData = {
  chain: OptionType;
  token: OptionType;
  value: number;
  txnHash: string;
};

export type Property = {
  id: string;
  name: string;
  type: PropertyType;
  isPartOfFormView: boolean;
  default?: any;
  condition?: any; // Show property only when condition is met
  options?: Option[];
  rewardOptions?: Registry;
  userType?: FormUserType; // user type only relevant when type is user or user[]
  onUpdateNotifyUserTypes?: FormUserType[];
  required?: boolean;
  description?: string;
  // viewConditions?: Condition[];
  advancedConditions?: ConditionGroup;
  payWallOptions?: PayWallOptions;
  internal?: boolean;
  maxSelections?: number;
  allowCustom?: boolean;
  milestoneFields?: string[];
  immutable?: boolean;
  sliderOptions?: SliderOptions;
};

export type SliderOptions = {
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
};

export type PropertyType =
  | "shortText"
  | "email"
  | "longText"
  | "number"
  | "user[]"
  | "user"
  | "reward"
  | "date"
  | "singleSelect"
  | "multiSelect"
  | "slider"
  | "ethAddress"
  | "milestone"
  | "singleURL"
  | "multiURL"
  | "payWall"
  | "cardStatus"
  | "discord"
  | "twitter"
  | "github"
  | "telegram"
  | "readonly";

export type Option = {
  label: string;
  value: string;
  data?: any;
  color?: string;
  satisfiesCondition?: boolean;
};

export type FormUserType = "assignee" | "reviewer" | "grantee" | "applicant";

export type Reward = {
  chain: Option;
  token: Option;
  value: number;
};

export type Milestone = {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  reward: {
    chain: Option;
    token: Option;
    value: number;
  };
};

export type GuildRole = {
  id: number;
  name: string;
};

export interface FormType {
  activity: MappedItem<CollectionActivity>;
  activityOrder: string[];
  name: string;
  slug: string;
  private: boolean;
  description: string;
  editorVersion: 1 | 2;
  properties: {
    [key: string]: Property;
  };
  propertyOrder: string[];
  creator: string;
  parents: {
    id: string;
    name: string;
    slug: string;
  }[];
  defaultView: string;
  viewConditions: Condition[];
  createdAt: string;
  updatedAt: string;
  id: string;
  formMetadata: FormMetadata;
}

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

type ClaimabilityAttributes = {
  isSignatureRequired: boolean;
  isAllowlistRequired: boolean;
  totalClaimCount: number;
  remainingClaimCount?: number;
  expirationTimestamp?: number;
};

export type GitcoinScoreType = {
  score: number;
  provider: string;
  issuer: string;
};

export type Stamp = {
  id: string;
  provider: string;
  providerName:
    | "Gitcoin"
    | "Discord"
    | "Twitter"
    | "Github"
    | "Linkedin"
    | "Lens"
    | "Google"
    | "Facebook"
    | "Poh"
    | "Brightid"
    | "POAP"
    | "ETH"
    | "NFT"
    | "GnosisSafe"
    | "Snapshot";
  providerUrl: string;
  providerImage: string;
  issuer: string;
  issuerName: string;
  defaultScore: number;
  stampName: string;
  stampDescription: string;
};

export type StampWithScore = Stamp & {
  score: number;
};

export type StampWithVerification = Stamp & {
  verified: boolean;
};

export type StampWithScoreAndVerification = StampWithScore & {
  verified: boolean;
};

export interface MappedItem<T> {
  [id: string]: T;
}

export type VotingPeriod = {
  votingType: Option;
  active: boolean;
  message?: string;
  options?: Option[];
  votesArePublic?: boolean;
  votesAreWeightedByTokens?: boolean;
  endsOn?: Date;
  startedOn?: Date;
  snapshot?: SnapshotVoting;
  votes?: MappedItem<number>;
};

export type SnapshotVoting = {
  onSnapshot?: boolean;
  space?: string;
  proposalId?: string;
};

export type SnapshotSpace = {
  name: string;
  id: string;
  network: string;
  symbol: string;
};

export type Voting = {
  enabled: boolean;
  message?: string;
  options?: Option[];
  votingType?: Option;
  votesArePublic?: boolean;
  votesAreWeightedByTokens?: boolean;
  tokensWeightedWith?: {
    chain: Option;
    token: Option;
    weight: number;
  }[];
  snapshot?: {
    [key: string]: { space?: string; proposalId?: string };
  };
  periods?: MappedItem<VotingPeriod>;
  periodsOnCollection?: MappedItem<VotingPeriod>;
};

export type NFT = {
  contractName: string;
  contractAddress: string;
  tokenId: string;
  symbol: string;
  name: string;
  description: string;
  contentURI: string;
  chainId: string;
  collectionName: string;
  ercType: string;
  originalContent: {
    uri: string;
    metaType: string;
  };
};

export type VerifiableCredential = {
  ceramicStreamId?: string;
  providerName: string;
};

export type SoulboundCredential = {
  contractAddress?: string;
  tokenId?: string;
  chainId?: string;
  type?: "erc721" | "erc1155";
};

export type LensDate = {
  day: number;
  month: number;
  year: number;
};

export type Credential = {
  id: string;
  name: string;
  description: string;
  imageUri: string;
  type: "vc" | "soulbound" | "poap";
  service: string;
  metadata?: VerifiableCredential | SoulboundCredential;
};

export type PoapCredential = {
  tokenId?: string;
  owner?: string;
  chain: string;
  created?: string;
  event: POAPEventType;
};

// TODO: Remove "any" types
export type Action = {
  id: string;
  type: string;
  subType?: string;
  name: string;
  service: string;
  group: string;
  data: any;
  value: any;
  icon: string;
  label: string;
};

export type CreateCardActionData = {
  selectedCollection: Option;
  values: CreateCardActionDataValue[];
};

export type CreateCardActionDataValue = {
  type: "mapping" | "default" | "responder";
  default?: Default;
  mapping?: Mapping;
};

type Mapping = {
  from?: Option;
  to?: Option;
};

type Default = {
  field?: Option;
  value?: any;
};

export type Trigger = {
  id: string;
  type: string;
  subType?: string;
  name: string;
  service: string;
  data: any;
};

export type Condition = {
  id: string;
  type: string;
  service: string;
  data: any;
};
export type ConditionGroup = {
  id: string;
  operator: "and" | "or";
  conditions: { [id: string]: Condition };
  conditionGroups?: { [id: string]: ConditionGroup };
  order: string[];
};

export type Automation = {
  id: string;
  name: string;
  description: string;
  trigger: Trigger;
  conditions?: Condition[];
  advancedConditions?: ConditionGroup;
  actions: Action[];
  triggerCategory: "collection" | "root";
  triggerCollectionSlug?: string;
  disabled?: boolean;
};

export type AutomationType = {
  [id: string]: Automation;
};

export type AutomationsIndexedByCollectionSlugType = {
  [id: string]: string[];
};

export type RootAutomationsType = string[];

export type PaymentDetails = {
  id: string;
  chain: Option;
  token: Option;
  value: number;
  paidTo: {
    propertyType: string;
    value: any;
    reward: {
      chain: Option;
      token: Option;
      value: number;
    };
  }[];
  type: "Manually Added" | "Added From Card";
  title: string;
  description?: string;
  paidOn?: Date;
  transactionHash?: string;
  status?: "Pending" | "Pending Signature" | "Completed" | "Cancelled";
  transactionCreatedBy?: {
    propertyType: "ethAddress" | "user";
    value: any;
  };
  transactionSignedBy?: {
    propertyType: "ethAddress" | "user";
    value: any;
  }[];
  labels?: Option[];
  collection?: Option;
  data?: Option;
};

export type NFTFromAlchemy = {
  balance?: number;
  contract: {
    address: string;
    name: string;
    symbol: string;
    totalSupply?: number;
  };
  description?: string;
  media?: {
    bytes: number;
    format: string;
    gateway: string;
    raw: string;
    thumbnail: string;
  }[];
  rawMetadata: {
    name: string;
    image?: string;
    description?: string;
    attributes?: {
      trait_type: string;
      display_type: string;
      value: string;
    }[];
  };
  timeLastUpdated?: string;
  title?: string;
  tokenId?: string;
  tokenType: string;
  tokenUri?: {
    gateway: string;
    raw: string;
  };
  chainId: number;
};

export type NFTFromAnkr = {
  contractAddress: string;
  blockchain: string;
  collectionName?: string;
  symbol: string;
  tokenId?: string;
  contractType: string;
  tokenUrl?: string;
  name: string;
  imageUrl?: string;
  quantity?: string;
};

export declare enum NftTokenType {
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
  UNKNOWN = "UNKNOWN",
}

export declare enum OpenSeaSafelistRequestStatus {
  /** Verified collection. */
  VERIFIED = "verified",
  /** Collections that are approved on open sea and can be found in search results. */
  APPROVED = "approved",
  /** Collections that requested safelisting on OpenSea. */
  REQUESTED = "requested",
  /** Brand new collections. */
  NOT_REQUESTED = "not_requested",
}

export type AlchemyNftContract = {
  /** The type of the token in the contract. */
  tokenType: NftTokenType;
  /** The name of the contract. */
  name?: string;
  /** The symbol of the contract. */
  symbol?: string;
  /** The number of NFTs in the contract as an integer string. */
  totalSupply?: string;
  /** OpenSea's metadata for the contract. */
  openSea?: {
    floorPrice?: number;
    /** The name of the collection on OpenSea. */
    collectionName?: string;
    /** The approval status of the collection on OpenSea. */
    safelistRequestStatus?: OpenSeaSafelistRequestStatus;
    /** The image URL determined by OpenSea. */
    imageUrl?: string;
    /** The description of the collection on OpenSea. */
    description?: string;
    /** The homepage of the collection as determined by OpenSea. */
    externalUrl?: string;
    /** The Twitter handle of the collection. */
    twitterUsername?: string;
    /** The Discord URL of the collection. */
    discordUrl?: string;
    /** Timestamp of when the OpenSea metadata was last ingested by Alchemy. */
    lastIngestedAt?: string;
  };
  address: string;
};

export interface LookupTokenWithBalance extends LookupToken {
  balance: string;
}
