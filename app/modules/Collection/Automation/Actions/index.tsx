import { Action, CollectionType } from "@/app/types";
import { Box, Text } from "degen";
import CloseCard from "./CloseCard";
import CreateCard from "./CreateCard";
import CreateDiscordChannel from "./CreateDiscordChannel";
import CreateDiscordThread from "./CreateDiscordThread";
import GiveDiscordRole from "./GiveDiscordRole";
import GiveRole from "./GiveRole";
import InitiatePendingPayment from "./InitiatePendingPayment";
import PostCardOnDiscord from "./PostOnDiscord";
import PostCardOnDiscordThread from "./PostOnDiscordThread";
import SendEmail from "./SendEmail";

type Props = {
  actionType: string;
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
  invalidActions: {
    [key: string]: {
      isValid: boolean;
      message: string;
    };
  };
};

const SingleAction = ({
  actionType,
  actionMode,
  action,
  setAction,
  collection,
  invalidActions,
}: Props) => (
  <Box paddingX="1" width="full">
    {actionType === "giveRole" && (
      <GiveRole action={action} setAction={setAction} />
    )}
    {actionType === "sendEmail" && (
      <SendEmail
        action={action}
        setAction={setAction}
        collection={collection}
      />
    )}
    {actionType === "createDiscordChannel" && (
      <CreateDiscordChannel
        action={action}
        actionMode={actionMode}
        setAction={setAction}
        collection={collection}
      />
    )}
    {actionType === "createDiscordThread" && (
      <CreateDiscordThread
        action={action}
        setAction={setAction}
        collection={collection}
      />
    )}
    {actionType === "giveDiscordRole" && (
      <GiveDiscordRole
        action={action}
        setAction={setAction}
        collection={collection}
      />
    )}
    {actionType === "createCard" && (
      <CreateCard
        action={action}
        actionMode={actionMode}
        setAction={setAction}
        collection={collection}
      />
    )}
    {actionType === "postOnDiscord" && (
      <PostCardOnDiscord
        action={action}
        setAction={setAction}
        collection={collection}
      />
    )}
    {actionType === "closeCard" && (
      <CloseCard
        action={action}
        actionMode={actionMode}
        setAction={setAction}
        collection={collection}
      />
    )}
    {actionType === "initiatePendingPayment" && (
      <InitiatePendingPayment
        action={action}
        setAction={setAction}
        collection={collection}
      />
    )}
    {actionType === "postOnDiscordThread" && (
      <PostCardOnDiscordThread
        action={action}
        setAction={setAction}
        collection={collection}
      />
    )}
    <Box marginTop="4">
      {invalidActions[actionType]?.isValid === false && (
        <Text color="red">{invalidActions[actionType].message}</Text>
      )}
    </Box>
  </Box>
);

export default SingleAction;
