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
