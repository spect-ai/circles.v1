import CheckBox from "@/app/common/components/Table/Checkbox";
import { updateFormCollection } from "@/app/services/Collection";
import { connectedUserAtom } from "@/app/state/global";
import { Box, Stack, Text } from "degen";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

const AdditionalSettings = () => {
  const [multipleResponsesAllowed, setMultipleResponsesAllowed] =
    useState(false);
  const [, setAnonymousResponsesAllowed] = useState(false);
  const [updatingResponseAllowed, setUpdatingResponseAllowed] = useState(false);
  const [active, setActive] = useState(false);
  const [, setWalletConnectionRequired] = useState(true);

  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [connectedUser] = useAtom(connectedUserAtom);

  useEffect(() => {
    setMultipleResponsesAllowed(
      collection.formMetadata.multipleResponsesAllowed
    );
    setUpdatingResponseAllowed(collection.formMetadata.updatingResponseAllowed);
    setActive(collection.formMetadata.active);
    setAnonymousResponsesAllowed(
      collection.formMetadata.allowAnonymousResponses === undefined
        ? false
        : collection.formMetadata.allowAnonymousResponses
    );
    setWalletConnectionRequired(
      collection.formMetadata.walletConnectionRequired
    );
  }, [collection]);

  return (
    <>
      <Text variant="label">Form Settings</Text>
      <Stack direction="vertical" space="4">
        <Box display="flex" flexDirection="column" gap="1">
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <CheckBox
              isChecked={multipleResponsesAllowed}
              onClick={async () => {
                if (connectedUser) {
                  setMultipleResponsesAllowed(!multipleResponsesAllowed);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      multipleResponsesAllowed: !multipleResponsesAllowed,
                    },
                  });

                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
            />
            <Text variant="base">Allow multiple responses</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <CheckBox
              isChecked={updatingResponseAllowed}
              onClick={async () => {
                if (connectedUser) {
                  setUpdatingResponseAllowed(!updatingResponseAllowed);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      updatingResponseAllowed: !updatingResponseAllowed,
                    },
                  });
                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
            />
            <Text variant="base">
              Allow changing responses after submission
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <CheckBox
              // Necessary for backward compatibility
              isChecked={active === false}
              onClick={async () => {
                if (connectedUser) {
                  const a = !active;
                  setActive(a);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      active: a,
                    },
                  });
                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
            />
            <Text variant="base">Stop accepting responses on this form</Text>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default AdditionalSettings;
