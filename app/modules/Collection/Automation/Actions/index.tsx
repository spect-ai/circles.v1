import { Action, CollectionType } from "@/app/types";
import CloseCard from "./CloseCard";
import CreateCard from "./CreateCard";
import CreateDiscordChannel from "./CreateDiscordChannel";
import CreateDiscordThread from "./CreateDiscordThread";
import GiveDiscordRole from "./GiveDiscordRole";
import GiveRole from "./GiveRole";
import InitiatePendingPayment from "./InitiatePendingPayment";
import PostCardOnDiscord from "./PostOnDiscord";
import SendEmail from "./SendEmail";

type Props = {
  actionType: string;
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
  collection: CollectionType;
};

export default function SingleAction({
  actionType,
  actionMode,
  action,
  setAction,
  collection,
}: Props) {
  return (
    <>
      {actionType === "giveRole" && (
        <GiveRole
          action={action}
          actionMode={actionMode}
          setAction={setAction}
        />
      )}
      {actionType === "sendEmail" && (
        <SendEmail
          action={action}
          actionMode={actionMode}
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
          actionMode={actionMode}
          setAction={setAction}
          collection={collection}
        />
      )}
      {actionType === "giveDiscordRole" && (
        <GiveDiscordRole
          action={action}
          actionMode={actionMode}
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
          actionMode={actionMode}
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
          actionMode={actionMode}
          setAction={setAction}
          collection={collection}
        />
      )}
    </>
  );
}
