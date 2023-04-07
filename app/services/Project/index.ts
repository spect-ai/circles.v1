import { ProjectType } from "@/app/types";
import { toast } from "react-toastify";

type CreateProjectDto = {
  name: string;
  circleId: string;
  fromTemplateId: string;
  description: string;
  trelloId?: string;
};

export const createProject = async (body: CreateProjectDto) => {
  const res = await fetch(`${process.env.API_HOST}/project/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  toast.error("Error updating project");
  return null;
};

export const patchProject = async (
  projectId: string,
  body: Partial<ProjectType>,
) => {
  const res = await fetch(`${process.env.API_HOST}/project/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  toast.error("Error updating project");
  return null;
};

export const archiveProject = async (projectId: string) => {
  const res = await fetch(
    `${process.env.API_HOST}/project/v1/${projectId}/archive`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  toast.error("Error updating project");
  return null;
};
