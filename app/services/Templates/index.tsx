import { OptionType } from "@/app/common/components/CreatableDropdown";

export async function getAllTemplates() {
  const res = await fetch(`${process.env.API_HOST}/templates/v1`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json();
}

export async function getATemplate(templateId: string) {
  const res = await fetch(`${process.env.API_HOST}/templates/v1/${templateId}`);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json();
}

export type CircleSpecificInfo = {
  roleIds?: string[];
  channel?: OptionType;
  category?: OptionType;
};

export type UseTemplateCircleSpecificInfoDto = {
  type: "automation";
  id: string;
  actions: {
    info?: CircleSpecificInfo;
    skip?: boolean;
  }[];
};

export async function useTemplate(
  templateId: string,
  destinationCircleId: string,
  useTemplateCircleSpecificInfoDtos?: UseTemplateCircleSpecificInfoDto[]
) {
  console.log({
    templateId,
    destinationCircleId,
  });
  const res = await fetch(
    `${process.env.API_HOST}/templates/v1/${templateId}/use?destinationCircleId=${destinationCircleId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ useTemplateCircleSpecificInfoDtos }),
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return await res.json();
}
