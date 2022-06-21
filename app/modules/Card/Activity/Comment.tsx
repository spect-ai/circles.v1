import { timeSince } from "@/app/common/utils/utils";
import { MemberDetails, UserType } from "@/app/types";
import { Avatar, Box, Button, Stack, Text } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useQuery } from "react-query";
import styled from "styled-components";
import { variants } from "..";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";

const TextArea = styled(ContentEditable)`
  color: rgb(255, 255, 255, 0.85);
  border: 2px solid rgb(255, 255, 255, 0.1);
  background: ${(props) =>
    props.disabled ? "rgb(255, 255, 255, 0)" : "rgb(20,20,20)"};
  border-radius: 1rem;
  width: 100%;
  overflow: hidden;
  resize: none;
  min-height: 40px;
  line-height: 20px;
  outline: none;
  padding: 1rem;
  &:focus {
    border: 2px solid rgb(175, 82, 222, 1);
  }
  &:hover {
    border: 2px solid rgb(175, 82, 222, 1);
  }
  transition: all 0.2s ease-in-out;
`;

interface Props {
  newComment: boolean;
  actorId?: string;
  commentContent?: string;
  commitId?: string;
  timestamp?: string;
}

export default function Comment({
  newComment,
  actorId,
  commentContent,
  commitId,
  timestamp,
}: Props) {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
  const { card, setCard } = useLocalCard();
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (commentContent) {
      setContent(commentContent);
    }
    if (newComment) {
      setIsDisabled(false);
    }
  }, [newComment, commentContent]);

  return (
    <motion.main
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      className=""
      key="editor"
    >
      <Stack space="1">
        <Stack direction="horizontal" align="center">
          {newComment ? (
            <Avatar
              label=""
              placeholder={!currentUser?.avatar}
              src={currentUser?.avatar}
              size="8"
            />
          ) : (
            <Avatar
              label=""
              placeholder={
                !(
                  memberDetails &&
                  memberDetails.memberDetails[actorId as string]?.avatar
                )
              }
              src={
                memberDetails &&
                memberDetails.memberDetails[actorId as string]?.avatar
              }
              size="8"
            />
          )}
          {/* <TextArea contentEditable role="textbox" /> */}
          <TextArea
            html={content}
            onChange={(evt) => {
              setContent(evt.target.value);
            }}
            disabled={isDisabled}
            onClick={() => {
              if (actorId === currentUser?.id) {
                setIsDisabled(false);
              }
            }}
          />
        </Stack>
        {newComment && (
          <Box marginLeft="12">
            <Button
              size="small"
              variant="secondary"
              loading={loading}
              onClick={() => {
                setLoading(true);
                fetch(`http://localhost:3000/card/${card?.id}/addComment`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    comment: content,
                  }),
                  credentials: "include",
                })
                  .then(async (res) => {
                    const data = await res.json();
                    setCard(data);
                    setContent("");
                    setLoading(false);
                  })
                  .catch((err) => {
                    setLoading(false);
                    console.log(err);
                  });
              }}
            >
              Add Comment
            </Button>
          </Box>
        )}
        {!newComment && timestamp && (
          <Box marginLeft="12">
            <Text variant="label">
              Posted {timeSince(new Date(timestamp))} ago
            </Text>
          </Box>
        )}
        {!newComment && !isDisabled && (
          <Stack direction="horizontal">
            <Box marginLeft="12">
              <Button
                size="small"
                variant="secondary"
                loading={loading}
                onClick={() => {
                  fetch(
                    `http://localhost:3000/card/${card?.id}/updateComment?commitId=${commitId}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        comment: content,
                      }),
                      credentials: "include",
                    }
                  )
                    .then(async (res) => {
                      const data = await res.json();
                      console.log({ data });
                      setCard(data);
                      setContent("");
                      setIsDisabled(true);
                      setLoading(false);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                Save
              </Button>
            </Box>
            <Button
              size="small"
              variant="secondary"
              onClick={() => {
                commentContent && setContent(commentContent);
                setIsDisabled(true);
              }}
            >
              Discard
            </Button>
          </Stack>
        )}
      </Stack>
    </motion.main>
  );
}
