import { logError } from "@/app/common/utils/utils";
import { toast } from "react-toastify";

type UpdateRoleDTO = {
  roles: string[];
};

export async function addRole(circleId: string, body: any) {
  try {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/addRole`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );
    if (res.ok) {
      const response = await res.json();
      toast("Role added successfully", { theme: "dark" });
      return response;
    } else {
      logError("Error adding role");
    }
  } catch (error) {
    logError("Error adding role");
    return error;
  }
}

export async function updateRole(circleId: string, role: string, body: any) {
  try {
    const res = await fetch(
      `${process.env.API_HOST}/circle/v1/${circleId}/updateRole?role=${role}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );
    if (res.ok) {
      const response = await res.json();
      return response;
    } else {
      logError("Error updating role");
    }
  } catch (error) {
    logError("Error updating role");
    return error;
  }
}

export async function updateMemberRole(
  circleId: string,
  member: string,
  body: UpdateRoleDTO
) {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/updateMemberRoles?member=${member}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    console.log({ data });
    return data;
  } else {
    logError("Something went wrong updating the member role");
    return null;
  }
}

export async function removeMember(circleId: string, member: string) {
  const res = await fetch(
    `${process.env.API_HOST}/circle/v1/${circleId}/removeMember?member=${member}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    console.log({ data });
    return data;
  } else {
    logError("Something went wrong removing the member");
    return null;
  }
}
