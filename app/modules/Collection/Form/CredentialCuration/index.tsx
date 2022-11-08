import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Stack, Text } from "degen";
import React from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";

export default function CredentialCuration() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  return (
    <Box
      width={{
        xs: "full",
        md: "1/2",
      }}
    >
      <Stack direction="vertical">
        {collection.isAnOpportunity && (
          <Text variant="small">{`Credential curation is enabled`}</Text>
        )}
        {!collection.isAnOpportunity && (
          <Text variant="small">{`Receive responders previous work, education and credentials with the form response`}</Text>
        )}
      </Stack>
      <Box marginTop="4">
        <PrimaryButton
          variant={
            collection.credentialCurationEnabled ? "tertiary" : "secondary"
          }
          onClick={async () => {
            process.env.NODE_ENV === "production" &&
              mixpanel.track("Form Credential Curation", {
                user: currentUser?.username,
                form: collection.name,
              });
            const res = await (
              await fetch(
                `${process.env.API_HOST}/collection/v1/${collection.id}`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    credentialCurationEnabled:
                      !collection.credentialCurationEnabled,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              )
            ).json();
            if (res.id) updateCollection(res);
            else toast.error("Something went wrong");
          }}
        >
          {collection.credentialCurationEnabled
            ? `Disable Credential Curation`
            : `Enable Credential Curation`}
        </PrimaryButton>
      </Box>
    </Box>
  );
}
