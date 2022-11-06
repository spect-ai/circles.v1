import { useGlobal } from "@/app/context/globalContext";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

const Input = styled.input`
  background-color: transparent;
  border: none;
  margin: 0.4rem;
  padding: 0.4rem;
  display: flex;
  border-style: none;
  border-color: transparent;
  border-radius: 0.4rem;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 400;
  opacity: "40%";
`;

export function AdditionalSettings() {
  const [multipleResponsesAllowed, setMultipleResponsesAllowed] =
    useState(false);
  const [updatingResponseAllowed, setUpdatingResponseAllowed] = useState(false);

  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { connectedUser } = useGlobal();

  useEffect(() => {
    setMultipleResponsesAllowed(collection.multipleResponsesAllowed);
    setUpdatingResponseAllowed(collection.updatingResponseAllowed);
  }, [collection]);

  return (
    <>
      <Text variant="label">Additional Settings</Text>
      <Stack direction="vertical" space="4">
        <Box display="flex" flexDirection="column" gap="1">
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Input
              type="checkbox"
              checked={multipleResponsesAllowed}
              onChange={async () => {
                if (connectedUser) {
                  setMultipleResponsesAllowed(!multipleResponsesAllowed);
                  const res = await updateFormCollection(collection.id, {
                    multipleResponsesAllowed: !multipleResponsesAllowed,
                  });

                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
            />
            <Text variant="small">Allow multiple responses</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="2"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Input
              type="checkbox"
              checked={updatingResponseAllowed}
              onChange={async (e) => {
                if (connectedUser) {
                  setUpdatingResponseAllowed(!updatingResponseAllowed);
                  const res = await updateFormCollection(collection.id, {
                    updatingResponseAllowed: !updatingResponseAllowed,
                  });
                  if (res.id) updateCollection(res);
                  else toast.error("Something went wrong");
                }
              }}
            />
            <Text variant="small">
              Allow changing responses after submission
            </Text>
          </Box>
        </Box>
      </Stack>
    </>
  );
}
