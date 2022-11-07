import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box } from "degen";
import React from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

export default function CredentialCuration() {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  return (
    <Box
      width={{
        xs: "full",
        md: "1/2",
      }}
    >
      <PrimaryButton
        variant={
          collection.credentialCurationEnabled ? "tertiary" : "secondary"
        }
        onClick={async () => {
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
  );
}
