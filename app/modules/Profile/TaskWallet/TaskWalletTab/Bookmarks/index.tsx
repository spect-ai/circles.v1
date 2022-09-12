import { useState, useEffect } from "react";
import { Box, Avatar, Text, useTheme } from "degen";
import { IconButton } from "@/app/modules/Project/ProjectHeading";
import { StarFilled } from "@ant-design/icons";
import { Card, GigInfo } from "../index";
import { UserType } from "@/app/types";
import { useQuery } from "react-query";
import Link from "next/link";

const BookMarks = () => {
  const { mode } = useTheme();
  const [isDirty, setIsDirty] = useState(false);

  const { data: userData, refetch } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const removeBookmark = async (cardId: string) => {
    await fetch(`${process.env.API_HOST}/user/removeBookmark/${cardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setIsDirty(!isDirty);
  };

  useEffect(() => {
    void refetch();
  }, [isDirty, refetch]);

  return (
    <Box marginTop="4" cursor="pointer">
      {userData?.bookmarks?.length == 0 && (
        <Box style={{ margin: "15rem 16rem" }}>
          <Text color="accent" align="center">
            No Bookmarks.
          </Text>
        </Box>
      )}
      {userData?.bookmarks?.map((book) => {
        const card = userData?.cardDetails?.[book];
        const cardLink = `/${card?.circle?.slug}/${card?.project?.slug}/${card?.slug}`;
        return (
          <Link href={cardLink} key={book}>
            <Card mode={mode} marginBottom="2">
              <Text weight="semiBold" variant="large">
                {card?.title}
              </Text>
              <GigInfo>
                <Avatar
                  label="circle-pic"
                  src={card?.circle?.avatar}
                  size="6"
                />
                <IconButton
                  color="textSecondary"
                  onClick={() => {
                    void removeBookmark(book);
                  }}
                >
                  <StarFilled />
                </IconButton>
              </GigInfo>
            </Card>
          </Link>
        );
      })}
    </Box>
  );
};

export default BookMarks;
