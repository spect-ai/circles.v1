import { MemberDetails } from "@/app/types";
import { Avatar, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import { variants } from "..";
import Comment from "./Comment";

export default function Activity() {
  const { activity } = useLocalCard();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );
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
        <Comment editable />
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
                      placeholder={
                        !memberDetails?.memberDetails[item.actorId].avatar
                      }
                      src={memberDetails?.memberDetails[item.actorId].avatar}
                      size="8"
                    />
                    <Stack space="1">
                      <Stack direction="horizontal" align="baseline">
                        <Text variant="label">
                          {memberDetails?.memberDetails[item.actorId].username}
                        </Text>
                        <Text>{item.content}</Text>
                      </Stack>
                      <Text>{new Date(item.timestamp).toDateString()}</Text>
                    </Stack>
                  </Stack>
                </Stack>
              );
            } else {
              return <Comment editable={false} commentContent={item.content} />;
            }
          })}
        </Stack>
      </Stack>
    </motion.main>
  );
}
