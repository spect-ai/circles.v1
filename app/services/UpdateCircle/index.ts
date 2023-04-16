import { logError } from "@/app/common/utils/utils";
import {
  Action,
  DiscordChannel,
  DiscordRoleMappingType,
  GuildxyzToCircleRoles,
  Option,
  Payment,
  SafeAddresses,
  SidebarConfig,
  Trigger,
} from "@/app/types";
import { toast } from "react-toastify";

type CircleUpdateDTO = {
  name: string;
  description: string;
  avatar: string;
  private: boolean;
  defaultPayment: Payment;
  discordGuildId: string;
  discordToCircleRoles: DiscordRoleMappingType;
  githubRepos: string[];
  gradient: string;
  safeAddresses: SafeAddresses;
  labels: string[];
  guildxyzId: number;
  guildxyzToCircleRoles: GuildxyzToCircleRoles;
  paymentAddress: string;
  questbookWorkspaceId: string;
  questbookWorkspaceUrl: string;
  grantMilestoneProject: string;
  grantApplicantProject: string;
  grantNotificationChannel: DiscordChannel;
  paymentLabelOptions: Option[];
  snapshot: {
    name: string;
    id: string;
    network: string;
    symbol: string;
  };
  sidebarConfig?: SidebarConfig;
};

type AddAutomationDto = {
  name: string;
  description: string;
  trigger: Trigger;
  actions: Action[];
  triggerCategory: "collection" | "root";
  triggerCollectionSlug?: string;
};

type UpdateAutomationDto = {
  name: string;
  description: string;
  trigger: Trigger;
  actions: Action[];
  disabled?: boolean;
};

export const updateCircle = async (
  circleUpdate: Partial<CircleUpdateDTO>,
  circleId: string
) => {
  const res = await fetch(`${process.env.API_HOST}/circle/v1/${circleId}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(circleUpdate),
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    toast("Updated successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error updating", {
      theme: "dark",
    });
    return false;
  }
};

export const deleteCircle = async (circleId: string) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/archive`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    toast("Circle deleted successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error deleting circle", {
      theme: "dark",
    });
    return false;
  }
};

type SafeDto = {
  chainId: string;
  address: string;
};

export const addSafe = async (safeDto: SafeDto, circleId: string) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/addSafe`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(safeDto),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    toast("Circle updated successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error updating circle", {
      theme: "dark",
    });
    return false;
  }
};

export const removeSafe = async (safeDto: SafeDto, circleId: string) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/removeSafe`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(safeDto),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    toast("Circle updated successfully", {
      theme: "dark",
    });
    return data;
  } else {
    toast("Error updating circle", {
      theme: "dark",
    });
    return false;
  }
};

export const addAutomation = async (
  circleId: string,
  automation: AddAutomationDto
) => {
  console.log({ automation });
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/addAutomation`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(automation),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();

    return data;
  } else {
    logError("Error adding automation");
    return false;
  }
};

export const updateAutomation = async (
  circleId: string,
  automationId: string,
  automation: UpdateAutomationDto
) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/updateAutomation?automationId=${automationId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(automation),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();

    return data;
  } else {
    logError("Error updating automation");
    return false;
  }
};

export const removeAutomation = async (
  automationId: string,
  circleId: string
) => {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/removeAutomation?automationId=${automationId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();

    return data;
  } else {
    logError("Error updating automation");
    return false;
  }
};
