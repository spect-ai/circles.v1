import { toast } from "react-toastify";

type UpdateRoleDTO = {
  roles: string[];
};

export async function updateRole(
  circleId: string,
  member: string,
  body: UpdateRoleDTO
) {
  const res = await fetch(
    `${process.env.API_HOST}/circle/${circleId}/updateMemberRoles?member=${member}`,
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
    toast.error("Something went wrong updating the role");
    return null;
  }
}

export async function removeMember(circleId: string, member: string) {
  const res = await fetch(
    `${process.env.API_HOST}/circle/${circleId}/removeMember?member=${member}`,
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
    toast.error("Something went wrong removing the member");
    return null;
  }
}
