import Editor from "@/app/common/components/Editor";
import { Action } from "@/app/types";
import { Box, Text } from "degen";
import { useEffect, useState } from "react";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
};

export default function SendEmail({ setAction, actionMode, action }: Props) {
  const [message, setMessage] = useState(action.data?.message || "");

  useEffect(() => {
    setMessage(action.data?.message || "");
  }, [action]);

  return (
    <Box
      marginTop="4"
      onBlur={() => {
        console.log({ message });
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
          onChange={(value) => {
            setMessage(value);
          }}
          placeholder={"Set email message..."}
        />
      </Box>
    </Box>
  );
}
