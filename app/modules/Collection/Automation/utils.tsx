import { CollectionType, Option } from "@/app/types";
import { automationActionOptions } from "../Constants";

type AutomationActionOption = {
  label: string;
  value: string;
  id: string;
  name: string;
  service: string;
  type: string;
  group?: string;
  data: Record<string, unknown>;
};

const getAutomationActionOptions = (
  collection: CollectionType,
  trigger: Option
) => {
  const thenOptions: {
    label: string;
    options: AutomationActionOption[];
  }[] = [];
  automationActionOptions.forEach((group) => {
    const groupOptions: AutomationActionOption[] = [];
    group.options.forEach((option) => {
      if (collection?.collectionType === 0) {
        if (
          [
            "createCard",
            "createDiscordChannel",
            "giveDiscordRole",
            "giveRole",
            "postOnDiscord",
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
    });

    if (groupOptions.length > 0) {
      thenOptions.push({ label: group.label, options: groupOptions });
    }
  });

  return thenOptions;
};

export default getAutomationActionOptions;
