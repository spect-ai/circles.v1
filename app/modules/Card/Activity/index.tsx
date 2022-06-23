import { Avatar, Stack, Text } from "degen";
import React from "react";
import { motion } from "framer-motion";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { variants } from "..";
import Comment from "./Comment";
import { timeSince } from "@/app/common/utils/utils";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";

export default function Activity() {
  const { activity } = useLocalCard();
  const { getMemberDetails } = useModalOptions();

  const { canTakeAction } = useRoleGate();
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
      <Stack>
        {canTakeAction("cardComment") && <Comment newComment />}
        <Stack>
          {activity.map((item) => {
            if (!item.comment) {
              return (
                <Stack>
                  <Stack
                    direction="horizontal"
                    key={item.commitId}
                    align="center"
                  >
                    <Avatar
                      label=""
                      placeholder={!getMemberDetails(item.actorId)?.avatar}
                      src={getMemberDetails(item.actorId)?.avatar}
                      size="8"
                    />
                    <Stack space="1">
                      <Stack direction="horizontal" align="baseline" space="2">
                        <Text>{getMemberDetails(item.actorId)?.username}</Text>
                        <Text color="textSecondary">{item.content}</Text>
                        <Text variant="label">
                          {timeSince(new Date(item.timestamp))} ago
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              );
            } else {
              return (
                <Comment
                  newComment={false}
                  commentContent={item.content}
                  actorId={item.actorId}
                  commitId={item.commitId}
                  timestamp={item.timestamp}
                />
              );
            }
          })}
        </Stack>
      </Stack>
    </motion.main>
  );
}
