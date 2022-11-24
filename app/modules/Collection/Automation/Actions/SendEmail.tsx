import Editor from "@/app/common/components/Editor";
import { Action } from "@/app/types";
import { Box, Text } from "degen";
import { useState } from "react";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
};

export default function SendEmail({ setAction, actionMode, action }: Props) {
  const [message, setMessage] = useState(action.data?.message || "");

  return (
    <Box
      marginTop="4"
      onMouseLeave={() => {
        setAction({
          ...action,
          data: {
            message: message,
          },
        });
      }}
    >
      {" "}
      <Box marginBottom="4">
        <Editor
          value={message}
          onChange={setMessage}
          placeholder={"Set email message..."}
        />
      </Box>
    </Box>
  );
}
