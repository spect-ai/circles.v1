import { Permissions } from "@/app/types";

export const defaultPermissions: Permissions = {
  createNewCircle: false,
  manageCircleSettings: false,
  managePaymentOptions: false,
  makePayment: true,
  inviteMembers: true,
  manageRoles: false,
  manageMembers: false,
  createNewForm: true,
};

export const permissionText = {
  createNewCircle: "Create New Space",
  manageCircleSettings: "Manage Space Settings",
  managePaymentOptions: "Manage Payment Options",
  makePayment: "Make Payment",
  inviteMembers: "Invite Members",
  manageRoles: "Manage Roles",
  manageMembers: "Manage Members",
  createNewForm: "Create New Form",
};
