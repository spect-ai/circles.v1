import { toast } from "react-toastify";

type GrantWorkflowDto = {
  name: string;
};

export async function createGrantWorkflow(
  circleId: string,
  template: GrantWorkflowDto
) {
  const res = await fetch(
    `${process.env.API_HOST}/collection/v1/${circleId}/useTemplate`,
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
    toast.success("Grant Workflow created successfully!")
    return res.json();
  }
}
