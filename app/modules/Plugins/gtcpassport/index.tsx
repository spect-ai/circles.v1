import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  Box,
  Button,
  IconUserSolid,
  Input,
  Stack,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import styled from "styled-components";
import { getAllCredentials } from "@/app/services/Credentials/AggregatedCredentials";
import { Stamp, UserType } from "@/app/types";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import { toast } from "react-toastify";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";
import Editor from "@/app/common/components/Editor";
import { updateFormCollection } from "@/app/services/Collection";
import { logError } from "@/app/common/utils/utils";

type Props = {
  handleClose: () => void;
};

export default function SybilResistance({ handleClose }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [stamps, setStamps] = useState([] as Stamp[]);
  const [allocations, setAllocations] = useState([] as number[]);
  const [minAllocationNotMet, setMinAllocationNotMet] = useState(false);
  const { mode } = useTheme();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const useDefaults = () => {
    setAllocations(stamps?.map((stamp) => stamp.defaultScore * 100));
  };

  useEffect(() => {
    if (collection) {
      getAllCredentials()
        .then((res) => {
          setStamps(res);
          const allocs = [];
          if (!collection.formMetadata.sybilProtectionScores)
            collection.formMetadata.sybilProtectionScores = {};
          for (const stamp of res) {
            if (
              collection.formMetadata.sybilProtectionScores[stamp.id] ||
              collection.formMetadata.sybilProtectionScores[stamp.id] === 0
            )
              allocs.push(
                collection.formMetadata.sybilProtectionScores[stamp.id]
              );
            else allocs.push(stamp.defaultScore * 100);
          }
          setAllocations(allocs as number[]);
        })
        .catch((err) => console.log(err));
    }
  }, [collection]);

  useEffect(() => {
    const total = allocations.reduce((a, b) => a + b, 0);
    if (total < 100) setMinAllocationNotMet(true);
    else setMinAllocationNotMet(false);
  }, [allocations]);

  return (
    <Modal
      title="Sybil Resistance"
      handleClose={handleClose}
      size="medium"
      height="40rem"
    >
      <Box padding="8" width="full">
        <Box width="full">
          {/* <Box display="flex" flexDirection="row" alignItems="center">
                  <Text>
                    {`Add scores to the following stamps. A responder to this form would require a total score of 100% to fill out the form.`}{" "}
                  </Text>
                </Box> */}
          <Box marginTop="-4" marginBottom="-4">
            <Editor
              value={
                ":::tip\nAdd scores to the following stamps. A responder to this form would require a total score of 100% to fill out the form"
              }
              disabled={true}
              version={1}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            marginTop="2"
            cursor="pointer"
          >
            <a
              href="https://docs.passport.gitcoin.co/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Text variant="label">Learn More</Text>
            </a>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-end"
            marginRight="4"
          >
            <Button
              variant="tertiary"
              size="small"
              onClick={useDefaults}
            >{`Use Defaults`}</Button>
          </Box>
        </Box>
        <ScrollContainer>
          {stamps?.map((stamp, index) => {
            return (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                padding="4"
                width="full"
                key={index}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  width="full"
                  alignItems="center"
                >
                  <Box
                    display="flex"
                    flexDirection={{
                      xs: "column",
                      md: "row",
                    }}
                    alignItems={{
                      md: "center",
                    }}
                    width="full"
                    paddingRight={{
                      xs: "1",
                      md: "4",
                    }}
                    justifyContent="flex-start"
                  >
                    <Box
                      paddingRight="4"
                      display="flex"
                      flexDirection="row"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Box
                        width="8"
                        height="8"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        {mode === "dark"
                          ? PassportStampIcons[stamp.providerName]
                          : PassportStampIconsLightMode[stamp.providerName]}
                      </Box>
                    </Box>
                    <Box>
                      <Text as="h1">{stamp.stampName}</Text>
                      <Text variant="small">{stamp.stampDescription}</Text>
                    </Box>
                  </Box>
                  <Input
                    label=""
                    type="number"
                    units="%"
                    placeholder="0"
                    width={{
                      xs: "3/4",
                      md: "1/4",
                    }}
                    max={100}
                    min={0}
                    value={allocations[index]}
                    onChange={(e) => {
                      const newAllocations = [...allocations];
                      newAllocations[index] = parseInt(e.target.value);
                      setAllocations(newAllocations);
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </ScrollContainer>

        <Box width="full" paddingTop="8">
          {minAllocationNotMet && (
            <Text color="red" variant="base">
              {" "}
              Total allocated score must be higher than 100%{" "}
            </Text>
          )}

          <Box
            display="flex"
            flexDirection="row"
            width="full"
            gap="4"
            justifyContent="flex-end"
          >
            {collection.formMetadata.sybilProtectionEnabled && (
              <Button
                width="1/2"
                loading={loading}
                disabled={minAllocationNotMet}
                variant="tertiary"
                size="small"
                onClick={async () => {
                  setLoading(true);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      sybilProtectionEnabled: false,
                    },
                  });
                  if (res.id) {
                    updateCollection(res);
                    handleClose();
                    setLoading(false);
                  } else logError("Update collection failed");
                }}
              >
                Disable Sybil Protection
              </Button>
            )}
            <Box width="1/2">
              <PrimaryButton
                loading={loading}
                disabled={minAllocationNotMet}
                onClick={async () => {
                  setLoading(true);
                  process.env.NODE_ENV === "production" &&
                    mixpanel.track("Form Sybil Protection", {
                      user: currentUser?.username,
                      form: collection.name,
                    });
                  const sybilProtectionScores = {} as {
                    [id: string]: number;
                  };
                  for (let i = 0; i < stamps.length; i++) {
                    sybilProtectionScores[stamps[i].id] = allocations[i];
                  }
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      sybilProtectionEnabled: true,
                      sybilProtectionScores,
                      walletConnectionRequired: true,
                    },
                  });
                  if (res.id) {
                    updateCollection(res);
                  } else {
                    logError(res.message);
                  }
                  handleClose();
                  setLoading(false);
                }}
              >
                Save
              </PrimaryButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

const ScrollContainer = styled(Box)``;
