import { Box, Avatar, Text } from "degen";
import { UserType } from "@/app/types";
import Link from "next/link";
import { useQuery } from "react-query";
import { updateNotificationStatus } from "@/app/services/ProfileNotifications";
import { useGlobal } from "@/app/context/globalContext";

interface NotifProps {
  notifIds: string[];
}

const Notifications = ({ notifIds }: NotifProps) => {
  const { setNotifSeen } = useGlobal();
  setNotifSeen(true);

  const { data: userData } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  if (notifIds.length > 0) {
    const update = async () => {
      await updateNotificationStatus({ notificationIds: notifIds });
    };
    void update();
  }

  return (
    <Box gap="0.5" display="flex" flexDirection="column" marginTop="5">
      {userData?.notifications?.length == 0 && (
        <Box style={{ margin: "14rem 14rem" }}>
          <Text color="accent" align="center">
            No Notifications as of now.
          </Text>
        </Box>
      )}
      {userData?.notifications
        ?.slice(0)
        .reverse()
        .map((notif) => {
          let link = "";
          if (notif.type == "circle") {
            link = `/${notif?.linkPath?.[0]}`;
          } else if (notif.type == "project") {
            link = `/${notif?.linkPath?.[0]}/${notif?.linkPath?.[1]}`;
          } else if (notif.type == "card") {
            const card = userData?.cardDetails?.[notif?.entityId as string];
            link = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
          } else if (notif.type == "retro") {
            link = `/${notif?.linkPath?.[0]}?retroSlug=${notif?.linkPath?.[1]}`;
          }
          return (
            <Link href={link} key={notif?.id}>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "1rem",
                  width: "39rem",
                  borderRadius: "0.5rem",
                }}
                backgroundColor={
                  notif?.read == false ? "accentTertiary" : "transparent"
                }
              >
                {notif?.actor && userData?.userDetails?.[notif?.actor] && (
                  <Avatar
                    label="profile-pic"
                    src={userData?.userDetails[notif?.actor]?.avatar}
                    address={userData?.userDetails[notif?.actor]?.ethAddress}
                    size="5"
                  />
                )}
                <Text>{notif?.content}</Text>
                <Text variant="label">
                  {new Date(notif?.timestamp).toLocaleDateString() ==
                  new Date().toLocaleDateString()
                    ? new Date(notif?.timestamp).toLocaleTimeString()
                    : new Date(notif?.timestamp).toLocaleDateString()}
                </Text>
              </Box>
            </Link>
          );
        })}
    </Box>
  );
};

export default Notifications;