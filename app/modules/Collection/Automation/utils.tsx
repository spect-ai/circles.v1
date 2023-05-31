import { CollectionType, Option } from "@/app/types";
import { automationActionOptions } from "../Constants";

export const getAutomationActionOptions = (
  collection: CollectionType,
  trigger: Option
) => {
  const thenOptions = [];

  for (const group of automationActionOptions) {
    const groupOptions = [];
    for (const option of group.options) {
      if (collection?.collectionType === 0) {
        if (
          [
            "createCard",
            "createDiscordChannel",
            "giveDiscordRole",
            "giveRole",
            "postOnDiscord",
            "postOnDiscordThread",
            "sendEmail",
            "initiatePendingPayment",
            "createDiscordThread",
          ].includes(option.type)
        ) {
          groupOptions.push(option);
        }
      } else if (collection?.collectionType === 1) {
        if (
          [
            "closeCard",
            "createCard",
            "postOnDiscord",
            "giveDiscordRole",
            "createDiscordThread",
            "createDiscordChannel",
            "postOnDiscordThread",
          ].includes(option.type) ||
          (!["completedPayment", "cancelledPayment"].includes(trigger.value) &&
            option.type === "initiatePendingPayment")
        ) {
          groupOptions.push(option);
        }
      }
    }

    if (groupOptions.length > 0) {
      thenOptions.push({ label: group.label, options: groupOptions });
    }
  }

  return thenOptions;
};
