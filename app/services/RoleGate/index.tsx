import { Permissions } from "@/app/types";

export const getMyCirclePermissions = async (
  circleIds: string[]
): Promise<Permissions | boolean> => {
  const ids = circleIds.map((circleId) => `circleIds=${circleId}`).join("&");
  console.log(ids);
  const res = await fetch(
    `${process.env.API_HOST}/circle/myPermissions?circleIds=${ids}`,
    {
      credentials: "include",
    }
  );
  if (res.ok) {
    const data = await res.json();
    console.log(data);
    return data;
  } else {
    console.log(res);
    return false;
  }
};
