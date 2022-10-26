export const labels = [
  "Design",
  "Testing",
  "Deployment",
  "Maintenance",
  "Feature",
  "Bug",
  "Chore",
  "Documentation",
  "Refactoring",
  "Research",
  "POC",
  "Frontend",
  "Backend",
  "Mobile",
  "Web",
  "API",
  "Database",
  "DevOps",
  "Security",
  "UX",
  "UI",
  "QA",
  "Good first issue",
  "Help wanted",
  "Blocking",
  "Production",
  "Staging",
  "Development",
  "Needs Discussion",
  "Needs Review",
];

export const monthMap = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "June",
  6: "July",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

export const Priority = {
  0: "no_priority",
  1: "low",
  2: "medium",
  3: "high",
  4: "urgent",
};

export const gasLimits = {
  "1": 30000000,
  "137": 30000000,
  "4": 30000000,
} as { [chainId: string]: number };

// export const kudosTypes = {
//   Kudos: [
//     { name: "headline", type: "string" },
//     { name: "description", type: "string" },
//     // { name: "communityUniqId", type: "string" },
//     //{ name: "communityId", type: "string" },
//     //{ name: "creator", type: "string" },
//     { name: "startDateTimestamp", type: "uint256" },
//     { name: "endDateTimestamp", type: "uint256" },
//     { name: "expirationTimestamp", type: "uint256" },
//     { name: "isSignatureRequired", type: "bool" },
//     { name: "isAllowlistRequired", type: "bool" },
//     { name: "links", type: "string[]" },
//     { name: "contributors", type: "string[]" },
//     { name: "nftTypeId", type: "string" },
//     // { name: "totalClaimCount", type: "int256" },
//   ],
// };

export const kudosTypes = {
  Kudos: [
    { name: "headline", type: "string" },
    { name: "description", type: "string" },
    { name: "startDateTimestamp", type: "uint256" },
    { name: "endDateTimestamp", type: "uint256" },
    { name: "links", type: "string[]" },
    { name: "communityUniqId", type: "string" },
    { name: "isSignatureRequired", type: "bool" },
    { name: "isAllowlistRequired", type: "bool" },
    { name: "totalClaimCount", type: "int256" },
    { name: "expirationTimestamp", type: "uint256" },
  ],
};

export const kudosTokenTypes = {
  Claim: [{ name: "tokenId", type: "uint256" }],
};

export const prevPropertyTypeToNewPropertyTypeThatDoesntRequiresClarance = {
  shortText: ["shortText", "longText"],
  longText: ["shortText", "longText"],
  number: ["number", "shortText", "longText"],
  ethAddress: ["ethAddress", "shortText", "longText"],
  email: ["email", "shortText", "longText"],
  date: ["date", "shortText", "longText"],
  singleSelect: ["singleSelect", "multiSelect"],
  multiSelect: ["multiSelect"],
  user: ["user", "user[]"],
  "user[]": ["user[]"],
  reward: ["reward"],
  milestone: ["milestone"],
};
