import Modal from "@/app/common/components/Modal";
import { Action } from "@/app/types";
import { Box, useTheme, Text } from "degen";
import { useState } from "react";
import styled from "styled-components";
import GiveRole from "./GiveRole";
import SendEmail from "./SendEmail";

type Props = {
  actionId: string;
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
};

export default function SingleAction({
  actionId,
  actionMode,
  action,
  setAction,
}: Props) {
  return (
    <>
      {actionId === "giveRole" && (
        <GiveRole
          action={action}
          actionMode={actionMode}
          setAction={setAction}
        />
      )}
      {actionId === "sendEmail" && (
        <SendEmail
          action={action}
          actionMode={actionMode}
          setAction={setAction}
        />
      )}
    </>
  );
}
