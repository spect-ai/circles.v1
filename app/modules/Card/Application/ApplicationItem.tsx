import ClickableAvatar from "@/app/common/components/Avatar";
import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useApplication from "@/app/services/Apply/useApplication";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { ApplicationType } from "@/app/types";
import { Box, IconCheck, Stack } from "degen";
import React, { useState } from "react";

type Props = {
  application: ApplicationType;
};

export default function ApplicationItem({ application }: Props) {
  const { getMemberDetails } = useModalOptions();
  const [content, setContent] = useState(application.content);
  const { canTakeAction } = useRoleGate();
  const { pickApplications } = useApplication();
  return (
    <Box marginBottom="8">
      <Stack direction="horizontal" space="6">
        <ClickableAvatar
          src={getMemberDetails(application.user)?.avatar as string}
          label=""
          size="8"
          placeholder={!getMemberDetails(application.user)?.avatar}
          address={getMemberDetails(application.user)?.ethAddress}
          username={
            getMemberDetails(application.user)?.username as string
          }
          userId={getMemberDetails(application.user)?.id as string}
        />
        <Box
          style={{
            minHeight: "5rem",
          }}
          marginRight="2"
          paddingLeft="4"
          marginBottom="4"
        >
          <Editor
            value={content}
            onChange={(txt) => {
              setContent(txt);
            }}
            placeholder="Add your submission"
            disabled
            // disabled={!canTakeAction("cardSubmission") || isDisabled}
          />
        </Box>
      </Stack>
      {canTakeAction("acceptApplication") && (
        <Box width="1/3">
          <PrimaryButton
            icon={<IconCheck />}
            onClick={() => {
              void pickApplications({
                applicationIds: [application.applicationId],
              });
            }}
          >
            Accept
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );
}
