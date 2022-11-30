import Editor from "@/app/common/components/Editor";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { Action } from "@/app/types";
import { Box, Input, Text, Textarea } from "degen";
import { useEffect, useState } from "react";

type Props = {
  actionMode: "edit" | "create";
  action: Action;
  setAction: (action: Action) => void;
};

export default function SendEmail({ setAction, actionMode, action }: Props) {
  const [message, setMessage] = useState(action.data?.message || "");
  const { circle } = useCircle();

  useEffect(() => {
    setMessage(action.data?.message || "");
  }, [action]);

  return (
    <Box
      marginTop="2"
      width="full"
      onBlur={() => {
        setAction({
          ...action,
          data: {
            message: message,
            circleId: circle.id,
          },
        });
      }}
    >
      {" "}
      <Box
        marginBottom="4"
        width="full"
        display="flex"
        flexDirection="column"
        gap="2"
      >
        <Text variant="label">Message to responder</Text>
        <Textarea
          label
          hideLabel
          maxLength={500}
          rows={3}
          placeholder="Message to send in email"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
      </Box>
    </Box>
  );
}
