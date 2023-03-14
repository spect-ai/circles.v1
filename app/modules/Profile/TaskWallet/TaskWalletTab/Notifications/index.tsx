import { Box, Text, useTheme } from "degen";
import { useState, useEffect } from "react";
import { UserType } from "@/app/types";
import Link from "next/link";
import styled from "styled-components";
import { useQuery } from "react-query";
import { updateNotificationStatus } from "@/app/services/ProfileNotifications";
import { ScrollContainer } from "../index";
import ReactPaginate from "react-paginate";

export const Paginate = styled(ReactPaginate)<{ mode: string }>`
  display: flex;
  flex-direction: row;
  width: 20rem;
  justify-content: space-between;
  list-style-type: none;
  li a {
    border-radius: 7px;
    padding: 0.1rem 0.5rem;
    border: ${(props) =>
        props.mode === "dark"
          ? "rgb(255, 255, 255, 0.02)"
          : "rgb(20, 20, 20, 0.2)"}
      1px solid;
    cursor: pointer;
    color: ${({ mode }) =>
      mode === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(20, 20, 20, 0.5)"};
  }
  li.selected a {
    color: rgb(191, 90, 242, 1);
    border-color: rgb(191, 90, 242, 0.2);
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    border-color: transparent;
    color: rgb(191, 90, 242, 1);
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;

interface NotifProps {
  notifIds: string[];
}

const Notifications = ({ notifIds }: NotifProps) => {
  const { mode } = useTheme();
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [endOffset, setEndOffset] = useState(0);

  const { data: userData } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  if (notifIds.length > 0) {
    const update = async () => {
      await updateNotificationStatus({ notificationIds: notifIds });
    };
    void update();
  }

  console.log({ userDataInNotif: userData });

  useEffect(() => {
    setEndOffset(itemOffset + 8);
    if ((userData?.notifications?.length as number) < 9) {
      setPageCount(Math.floor((userData?.notifications?.length as number) / 8));
    } else {
      setPageCount(Math.ceil((userData?.notifications?.length as number) / 8));
    }
  }, [endOffset, itemOffset, userData]);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset =
      (event.selected * 8) % (userData as UserType)?.notifications?.length;
    setItemOffset(newOffset);
  };

  return (
    <Box
      gap="0.5"
      display="flex"
      flexDirection="column"
      marginTop="5"
      style={{
        position: "relative",
        height: "75vh",
        alignItems: "center",
      }}
    >
      {userData?.notifications?.length == 0 && (
        <Box style={{ margin: "14rem 14rem" }}>
          <Text color="accent" align="center">
            No Notifications as of now.
          </Text>
        </Box>
      )}
      <ScrollContainer>
        {userData?.notifications
          ?.slice(0)
          .reverse()
          .slice(itemOffset, endOffset)
          .map((notif) => {
            // let link = "";
            // if (notif.type == "circle") {
            //   link = `/${notif?.linkPath?.[0]}`;
            // } else if (notif.type == "project") {
            //   link = `/${notif?.linkPath?.[0]}/${notif?.linkPath?.[1]}`;
            // } else if (notif.type == "card") {
            //   const card = userData?.cardDetails?.[notif?.entityId as string];
            //   link = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
            // } else if (notif.type == "retro") {
            //   link = `/${notif?.linkPath?.[0]}?retroSlug=${notif?.linkPath?.[1]}`;
            // }
            return (
              <Link href={"/"} key={notif?.timestamp}>
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
      </ScrollContainer>
      <Box position="absolute" bottom="2">
        <Paginate
          breakLabel=".."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={1}
          pageCount={pageCount}
          previousLabel="Previous"
          renderOnZeroPageCount={() => null}
          mode={mode}
          key="Notifications"
        />
      </Box>
    </Box>
  );
};

export default Notifications;
