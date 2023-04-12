import { Action } from "@/app/types";

export function validateActions(actions: Action[]): {
  isValid: boolean;
  invalidActions: {
    [key: string]: {
      isValid: boolean;
      message: string;
    };
  };
  message: string;
} {
  if (actions.length === 0)
    return {
      isValid: false,
      invalidActions: {},
      message: "No actions were added",
    };
  const invalidActions = {} as {
    [key: string]: {
      isValid: boolean;
      message: string;
    };
  };
  actions.forEach((action) => {
    invalidActions[action.type] = validateAction(action);
  });
  return {
    invalidActions,
    isValid: Object.values(invalidActions).every((value) => value.isValid),
    message: "Some actions are invalid",
  };
}

export function validateAction(action: Action): {
  isValid: boolean;
  message: string;
} {
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
  } else if (action.type === "postOnDiscord") {
    return validatePostOnDiscordChannel(action);
  } else if (action.type === "postOnDiscordThread") {
    return validatePostOnDiscordThread(action);
  } else if (action.type === "initiatePendingPayment") {
    return validateInitiatePendingPayment(action);
  }
  return {
    isValid: true,
    message: "",
  };
}

export function validateSendEmailAction(action: Action): {
  isValid: boolean;
  message: string;
} {
  if (!action?.data || !action?.data?.toEmailProperties?.length) {
    return {
      isValid: false,
      message: "At least one recipient is required",
    };
  }
  if (!action?.data?.message) {
    return {
      isValid: false,
      message: "Message is required",
    };
  }
  return {
    isValid: true,
    message: "",
  };
}

export function validateGiveRoleAction(action: Action): {
  isValid: boolean;
  message: string;
} {
  let satisfied = false;
  for (const [role, giveAccess] of Object.entries(action.data?.roles)) {
    if (giveAccess) {
      satisfied = true;
      break;
    }
  }
  if (satisfied)
    return {
      isValid: true,
      message: "",
    };
  return {
    isValid: false,
    message: "At least one role must be selected",
  };
}

export function validateCreateDiscordChannel(action: Action): {
  isValid: boolean;
  message: string;
} {
  if (!action.data?.channelCategory) {
    return {
      isValid: false,
      message: "Channel category is required",
    };
  }
  if (!action.data?.channelName)
    return {
      isValid: false,
      message: "Channel name is required",
    };
  return {
    isValid: true,
    message: "",
  };
}

export function validateCreateCard(action: Action): {
  isValid: boolean;
  message: string;
} {
  if (
    !action.data?.selectedCollection ||
    Object.keys(action.data?.selectedCollection)?.length === 0
  )
    return {
      isValid: false,
      message: "Project is required",
    };
  if (action.data?.values?.length === 0)
    return {
      isValid: false,
      message: "At least one field is required",
    };
  return {
    isValid: true,
    message: "",
  };
}

export function validateCreateDiscordThread(action: Action): {
  isValid: boolean;
  message: string;
} {
  if (!action.data.threadName)
    return {
      isValid: false,
      message: "Thread name is required",
    };
  if (
    !action.data?.selectedChannel ||
    Object.keys(action.data?.selectedChannel)?.length === 0
  )
    return {
      isValid: false,
      message: "Channel is required",
    };

  return {
    isValid: true,
    message: "",
  };
}

export function validatePostOnDiscordChannel(action: Action): {
  isValid: boolean;
  message: string;
} {
  if (!action.data?.channel || Object.keys(action.data?.channel)?.length === 0)
    return {
      isValid: false,
      message: "Channel is required",
    };
  if (!action.data?.message)
    return {
      isValid: false,
      message: "Message is required",
    };
  return {
    isValid: true,
    message: "",
  };
}

export function validatePostOnDiscordThread(action: Action): {
  isValid: boolean;
  message: string;
} {
  if (!action.data?.channel)
    return {
      isValid: false,
      message: "Channel is required",
    };
  if (!action.data?.message)
    return {
      isValid: false,
      message: "Message is required",
    };
  return {
    isValid: true,
    message: "",
  };
}

export function validateInitiatePendingPayment(action: Action): {
  isValid: boolean;
  message: string;
} {
  if (!action.data?.payeeField?.value)
    return {
      isValid: false,
      message: "Payee is required",
    };
  if (!action.data?.rewardField?.value)
    return {
      isValid: false,
      message: "Reward is required",
    };
  return {
    isValid: true,
    message: "",
  };
}
