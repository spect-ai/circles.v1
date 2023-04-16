import { logError } from "@/app/common/utils/utils";
import { toast } from "react-toastify";

interface updateDTO {
  notificationIds: string[];
}

export async function updateNotificationStatus(body: updateDTO) {
  const res = await fetch(`${process.env.API_HOST}/user/readNotifications`, {
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
  logError("Error updating notification status");
  return null;
}
