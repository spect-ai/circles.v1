import { Permissions } from "@/app/types";

export const defaultPermissions: Permissions = {
  createNewCircle: false,
  manageCircleSettings: false,
  createNewProject: true,
  manageProjectSettings: true,
  createNewRetro: true,
  endRetroManually: false,
  managePaymentOptions: false,
  makePayment: true,
  inviteMembers: true,
  manageRoles: false,
  manageMembers: false,
  distributeCredentials: false,
  createNewForm: true,
  manageCardProperties: {
    Task: true,
    Bounty: false,
  },
  createNewCard: {
    Task: true,
    Bounty: false,
  },
  manageRewards: {
    Task: true,
    Bounty: false,
  },
  reviewWork: {
    Task: true,
    Bounty: false,
  },
  canClaim: {
    Task: true,
    Bounty: false,
  },
};

export const permissionText = {
  createNewCircle: "Create New Circle",
  manageCircleSettings: "Manage Circle Settings",
  createNewProject: "Create New Project",
  manageProjectSettings: "Manage Project Settings",
  createNewRetro: "Create New Retro",
  endRetroManually: "End Retro Manually",
  managePaymentOptions: "Manage Payment Options",
  makePayment: "Make Payment",
  inviteMembers: "Invite Members",
  manageRoles: "Manage Roles",
  manageMembers: "Manage Members",
  distributeCredentials: "Distribute Credentials",
  createNewForm: "Create New Form",
  manageCardProperties: "Manage Card Properties",
  createNewCard: "Create New Card",
  manageRewards: "Manage Rewards",
  reviewWork: "Review Work",
  canClaim: "Can Claim",
};
