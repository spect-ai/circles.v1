import { UserType } from "@/app/types";
import { Avatar, Box, Button, Stack } from "degen";
import { motion } from "framer-motion";

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
  transition: all 0.2s ease-in-out;
`;

interface Props {
  editable: boolean;
  commentContent?: string;
}

export default function Comment({ editable, commentContent }: Props) {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { card, setCard } = useLocalCard();
  const [loading, setLoading] = useState(false);

  //   const content = useRef("");

  //   const handleChange = (evt: any) => {
  //     content.current = evt.target.value;
  //   };
  const [content, setContent] = useState("");
  useEffect(() => {
    if (commentContent) {
      setContent(commentContent);
    }
  }, [commentContent]);

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
          <Avatar
            label=""
            placeholder={!currentUser?.avatar}
            src={currentUser?.avatar}
            size="8"
          />
          {/* <TextArea contentEditable role="textbox" /> */}
          <TextArea
            html={content}
            onChange={(evt) => {
              setContent(evt.target.value);
            }}
            disabled={!editable}
          />
        </Stack>
        {editable && (
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
      </Stack>
    </motion.main>
  );
}
