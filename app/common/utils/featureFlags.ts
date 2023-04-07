const flags = [
  {
    name: "ProjectV2",
    isActive: process.env.NEXT_PUBLIC_PROJECT_V2 === "true",
  },
  {
    name: "ProjectV1",
    isActive: process.env.NEXT_PUBLIC_PROJECT_V1 === "true",
  },
];

export default flags;
