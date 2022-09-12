import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { useGlobal } from "@/app/context/globalContext";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { IconButton } from "@/app/modules/Project/ProjectHeading";
import { useEffect, useState } from "react";

export default function Bookmark() {
  const { cardId } = useLocalCard();
  const { connectedUser } = useGlobal();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data: currentUser, refetch } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const createBookmark = async () => {
    await fetch(`${process.env.API_HOST}/user/addBookmark/${cardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setIsBookmarked(true);
  };

  const removeBookmark = async () => {
    await fetch(`${process.env.API_HOST}/user/removeBookmark/${cardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    setIsBookmarked(false);
  };

  useEffect(() => {
    void refetch();
    if (currentUser?.bookmarks.includes(cardId)) {
      setIsBookmarked(true);
    }
  }, [currentUser?.bookmarks, cardId, refetch]);

  if (!connectedUser) return null;

  return (
    <IconButton
      color="textSecondary"
      paddingX="2"
      onClick={() => {
        if (!isBookmarked) void createBookmark();
        if (isBookmarked) void removeBookmark();
      }}
    >
      {isBookmarked ? <StarFilled /> : <StarOutlined />}
    </IconButton>
  );
}
