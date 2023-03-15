/* eslint-disable @typescript-eslint/no-explicit-any */
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { timeSince } from "@/app/common/utils/utils";
import { sendFormComment } from "@/app/services/Collection";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import {
  CollectionActivity,
  CollectionType,
  MappedItem,
  UserType,
} from "@/app/types";
import { SendOutlined } from "@ant-design/icons";
import { Avatar, Box, Button, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

type Props = {
  activities: MappedItem<CollectionActivity>;
  activityOrder: string[];
  getMemberDetails: (id: string) => UserType | undefined;
  dataId: string;
  collectionId: string;
  setForm: (form: any) => void;
  dataOwner: UserType;
  collection: any;
};

export default function DataActivity({
  activities,
  activityOrder,
  getMemberDetails,
  dataId,
  collectionId,
  setForm,
  dataOwner,
  collection,
}: Props) {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [comment, setComment] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);

  const { formActions } = useRoleGate();

  const router = useRouter();
  const { circle } = router.query;

  const anonActor = {
    id: "anon",
    avatar: "",
    ethAddress: undefined,
    username: "Responder",
  };
  console.log({ activities, activityOrder });

  return (
    <Box padding="4">
      <Stack>
        {activityOrder?.map((activityId) => {
          const activity = activities[activityId];
          const actor =
            collection.data?.[dataId]?.["anonymous"] === true &&
            dataOwner?.id === activity.ref?.actor?.id
              ? anonActor
              : getMemberDetails(activity.ref.actor?.id) || dataOwner;

          console.log({ actor });
          return (
            <Box key={activityId}>
              <Stack direction="horizontal" align="center" space="2">
                <Avatar
                  label=""
                  src={
                    actor?.avatar ||
                    `https://api.dicebear.com/5.x/thumbs/svg?seed=${actor?.id}`
                  }
                  address={actor?.ethAddress}
                  size="8"
                />
                <Stack
                  direction={activity.comment ? "vertical" : "horizontal"}
                  space="2"
                >
                  <Stack direction="horizontal">
                    <Text color="accentText" weight="semiBold">
                      {actor?.id === "anon" ? (
                        "Responder"
                      ) : (
                        <a
                          href={`/profile/${actor?.username}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {actor?.username}
                        </a>
                      )}
                    </Text>
                    <Box>
                      <Text variant="label">{activity.content}</Text>
                    </Box>
                    <Box>
                      <Text ellipsis size="label" color="textTertiary">
                        {timeSince(new Date(activity.timestamp))} ago
                      </Text>
                    </Box>
                  </Stack>

                  {/* {activity.comment ? (
                    <Editor value={activity.content} disabled />
                  ) : (
                    <Box marginTop="1">
                      <Text variant="label">{activity.content}</Text>
                    </Box>
                  )} */}
                </Stack>
              </Stack>
            </Box>
          );
        })}
        <Stack direction="horizontal" space="2">
          {/* <Avatar
            label=""
            placeholder={!currentUser?.avatar}
            src={currentUser?.avatar}
            address={currentUser?.ethAddress}
            size="8"
          /> */}
          <Box
            width="full"
            gap="2"
            marginBottom="4"
            display="flex"
            flexDirection="row"
          >
            {/* {!sendingComment && (
              <Box height="40" overflow="auto" width="full">
                <Editor
                  placeholder="Write a reply..."
                  value={comment}
                  onSave={(value) => {
                    setComment(value);
                  }}
                  isDirty={isDirty}
                  setIsDirty={setIsDirty}
                />
              </Box>
            )} */}
            {isDirty && currentUser && (
              <Button
                variant="secondary"
                size="small"
                shape="circle"
                loading={sendingComment}
                onClick={async () => {
                  if (
                    !(
                      formActions("addComments") ||
                      currentUser.id == dataOwner.id
                    )
                  ) {
                    toast.error(
                      "Your role(s) doesn't have permission to add comments on this form"
                    );
                    return;
                  }
                  setSendingComment(true);
                  const res = await sendFormComment(
                    collectionId,
                    dataId,
                    comment,
                    {
                      actor: {
                        id: currentUser.id,
                        refType: "user",
                      },
                    },
                    circle ? false : true
                  );
                  if (res.id) {
                    setForm(res);
                    setComment("");
                    setIsDirty(false);
                  } else toast.error("Something went wrong");
                  setSendingComment(false);
                }}
              >
                <SendOutlined style={{ fontSize: "1.3rem", padding: 2 }} />
              </Button>
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
