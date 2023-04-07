import { Permissions } from "@/app/types";

const getMyCirclePermissions = async (
  circleIds: string[]
): Promise<Permissions | boolean> => {
  const ids = circleIds.map((circleId) => `circleIds=${circleId}`).join("&");
  const res = await fetch(
    `${process.env.API_HOST}/circle/myPermissions?circleIds=${ids}`,
    {
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return false;
};

export default getMyCirclePermissions;
