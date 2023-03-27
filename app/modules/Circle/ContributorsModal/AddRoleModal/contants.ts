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
  createNewCircle: "Create New Workstream",
  manageCircleSettings: "Manage Workstream Settings",
  createNewProject: "Create New Project",
  manageProjectSettings: "Manage Project Settings",
  managePaymentOptions: "Manage Payment Options",
  makePayment: "Make Payment",
  inviteMembers: "Invite Members",
  manageRoles: "Manage Roles",
  manageMembers: "Manage Members",
  createNewForm: "Create New Form",
  manageCardProperties: "Manage Card Properties",
  createNewCard: "Create New Card",
};
