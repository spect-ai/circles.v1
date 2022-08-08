import { Views } from "@/app/types";
import { toast } from "react-toastify";

// http://localhost:8080/project/62d35ad1f0e56c8baf31a1c9/view/0fb5f53a-675c-4b72-9e88-38d5f5561d9c/update

export const createViews = async (body: Views, projectId: string) => {
  const res = await fetch(`${process.env.API_HOST}/project/${projectId}/view/add`, {
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
  toast.error("Error creating views");
  return null;
}

export const editViews = async (body: Views, projectId: string, viewId: string) => {
  const res = await fetch(`${process.env.API_HOST}/project/${projectId}/view/${viewId}/update`, {
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
  toast.error("Error updating views");
  return null;
}

export const deleteViews = async (projectId: string, viewId: string) => {
  const res = await fetch(`${process.env.API_HOST}/project/${projectId}/view/${viewId}/delete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  toast.error("Error deleting views");
  return null;
}