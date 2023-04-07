import { Registry } from "@/app/types";
import { toast } from "react-toastify";

type GrantWorkflowDto = {
  channelCategory?: {
    label: string;
    value: string;
  };
  roles?: {
    [k: string]: boolean;
  };
  registry?: Registry;
};

async function createTemplateFlow(
  circleId: string,
  template: GrantWorkflowDto,
  templateId: 1 | 2 | 3
) {
  const res = await fetch(
    `${process.env.API_HOST}/collection/v1/${circleId}/useTemplate?templateId=${templateId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(template),
      credentials: "include",
    }
  );

  if (res.ok) {
    toast.success("Created from template successfully!");
    return res.json();
  }
  return false;
}

export default createTemplateFlow;
