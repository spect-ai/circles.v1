import CheckBox from "@/app/common/components/Table/Checkbox";
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
  const [active, setActive] = useState(false);

  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { connectedUser } = useGlobal();

  useEffect(() => {
    setMultipleResponsesAllowed(collection.multipleResponsesAllowed);
    setUpdatingResponseAllowed(collection.updatingResponseAllowed);
    setActive(collection.active);
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
            <CheckBox
              isChecked={multipleResponsesAllowed}
              onClick={async () => {
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
                    updatingResponseAllowed: !updatingResponseAllowed,
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
                    active: a,
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
}
