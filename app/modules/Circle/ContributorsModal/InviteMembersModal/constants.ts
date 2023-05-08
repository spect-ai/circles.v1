export const expiryOptions = [
  {
    name: "1 hr",
    expiry: 3600,
  },
  {
    name: "12 hrs",
    expiry: 43200,
  },
  {
    name: "1 Day",
    expiry: 86400,
  },
  {
    name: "7 Days",
    expiry: 604800,
  },
  {
    name: "Never",
    expiry: 2147483647,
  },
];

export const usesOptions = [
  {
    name: "1 use",
    uses: 1,
  },
  {
    name: "5 uses",
    uses: 5,
  },
  {
    name: "10 uses",
    uses: 10,
  },
  {
    name: "50 uses",
    uses: 50,
  },
  {
    name: "No Limit",
    uses: 1000,
  },
];

export const reservedRoles = ["applicant", "voter", "__removed__", "__left__"];
