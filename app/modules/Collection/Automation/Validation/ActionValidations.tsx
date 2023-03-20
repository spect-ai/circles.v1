import { Action } from "@/app/types";

export function validateActions(actions: Action[]): boolean {
  if (actions.length === 0) return false;
  return actions.every((action) => validateAction(action));
}

export function validateAction(action: Action): boolean {
  if (action.type === "sendEmail") {
    return validateSendEmailAction(action);
  } else if (action.type === "giveRole" || action.type === "giveDiscordRole") {
    return validateGiveRoleAction(action);
  } else if (action.type === "createDiscordChannel") {
    return validateCreateDiscordChannel(action);
  } else if (action.type === "createCard") {
    return validateCreateCard(action);
  } else if (action.type === "createDiscordThread") {
    return validateCreateDiscordThread(action);
  }

  return true;
}

export function validateSendEmailAction(action: Action): boolean {
  if (!action?.data?.message || action?.data?.toEmailProperties?.length === 0) {
    return false;
  }
  return true;
}

export function validateGiveRoleAction(action: Action): boolean {
  if (!action.data?.circleId) return false;
  let satisfied = false;
  for (const [role, giveAccess] of Object.entries(action.data?.roles)) {
    if (giveAccess) {
      satisfied = true;
      break;
    }
  }
  return satisfied;
}

export function validateCreateDiscordChannel(action: Action): boolean {
  if (!action.data?.channelCategory || !action.data?.channelName) return false;
  return true;
}

export function validateCreateCard(action: Action): boolean {
  if (
    !action.data?.selectedCollection ||
    Object.keys(action.data?.selectedCollection)?.length === 0
  )
    return false;
  if (action.data?.values?.length === 0) return false;
  return true;
}

export function validateCreateDiscordThread(action: Action): boolean {
  if (
    !action.data?.threadNameType ||
    !action.data?.selectedChannel ||
    !action.data.threadName
  )
    return false;
  return true;
}
