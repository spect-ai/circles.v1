import Editor from "@/app/common/components/Editor";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { WorkUnitType } from "@/app/types";
import { Box, Button, IconCheck } from "degen";
import React, { useEffect, useState } from "react";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";

type Props = {
  workUnit: WorkUnitType;
  workUnitId: string;
  workThreadId: string;
};

export default function WorkUnit({
  workUnit,
  workUnitId,
  workThreadId,
}: Props) {
  const [content, setContent] = useState(workUnit.content);
  const { card, setCard } = useLocalCard();

  const { canTakeAction } = useRoleGate();
  return (
    <Box
      style={{
        minHeight: "10rem",
        maxHeight: "25rem",
        overflowY: "auto",
      }}
      marginRight="4"
      paddingLeft="4"
    >
      <Editor
        value={content}
        onChange={(txt) => {
          setContent(txt);
        }}
        placeholder="Add your submission"
        disabled={!canTakeAction("cardSubmission")}
      />
      {canTakeAction("cardSubmission") && (
        <Button
          prefix={<IconCheck />}
          size="small"
          variant="secondary"
          disabled={!content}
          onClick={() => {
            fetch(
              `http://localhost:3000/card/${card?.id}/updateWorkUnit?threadId=${workThreadId}&workUnitId=${workUnitId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  type: "submission",
                  content,
                }),
                credentials: "include",
              }
            )
              .then(async (res) => {
                const data = await res.json();
                console.log({ data });
                setCard(data);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          Submit
        </Button>
      )}
    </Box>
  );
}
