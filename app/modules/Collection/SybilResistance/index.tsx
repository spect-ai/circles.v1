import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Button, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import Logo from "@/app/common/components/Logo";
import styled from "styled-components";
import { getAllCredentials } from "@/app/services/Credentials/AggregatedCredentials";
import { Stamp } from "@/app/types";

export default function SybilResistance() {
  const [isOpen, setIsOpen] = useState(false);
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [stamps, setStamps] = useState([] as Stamp[]);
  const [allocations, setAllocations] = useState([] as number[]);
  const [minAllocationNotMet, setMinAllocationNotMet] = useState(false);

  const useDefaults = () => {
    setAllocations(stamps.map((stamp) => stamp.defaultScore * 100));
  };

  useEffect(() => {
    if (collection) {
      getAllCredentials()
        .then((res) => {
          console.log({ res });
          setStamps(res);
          const allocs = [];
          for (const stamp of res) {
            if (collection.sybilProtectionScores)
              allocs.push(
                collection.sybilProtectionScores[stamp.id] ||
                  stamp.defaultScore * 100
              );
            else allocs.push(stamp.defaultScore * 100);
          }
          setAllocations(allocs);
          console.log({ allocs });
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
    <>
      <Stack direction="vertical">
        {collection.sybilProtectionEnabled && (
          <Text variant="small">{`This form is sybil protected!`}</Text>
        )}
        {!collection.sybilProtectionEnabled && (
          <Text variant="small">{`Protect your form against sybil attacks`}</Text>
        )}
      </Stack>
      <PrimaryButton
        variant={collection.sybilProtectionEnabled ? "tertiary" : "secondary"}
        onClick={() => setIsOpen(true)}
      >
        {collection.sybilProtectionEnabled
          ? `Update Sybil Protection`
          : `Enable Sybil Protection`}
      </PrimaryButton>

      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Sybil Resistance"
            handleClose={() => setIsOpen(false)}
            size="medium"
          >
            <Box padding="8" width="full">
              <Box width="full">
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Text>
                    {`Add scores to the following stamps. A responder to this form would require a total score of 100% to fill out the form.`}{" "}
                  </Text>
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
                {stamps.map((stamp, index) => {
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
                          >
                            <Logo
                              src={stamp.providerImage}
                              href={"/"}
                              gradient={""}
                            />
                          </Box>
                          <Box>
                            <Text as="h1">{stamp.stampName}</Text>
                            <Text variant="small">
                              {stamp.stampDescription}
                            </Text>
                          </Box>
                        </Box>
                        <Input
                          label=""
                          type="number"
                          units="%"
                          placeholder="0"
                          width={{
                            xs: "3/4",
                            md: "auto",
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
                  {collection.sybilProtectionEnabled && (
                    <Button
                      width="1/2"
                      loading={loading}
                      disabled={minAllocationNotMet}
                      variant="tertiary"
                      size="small"
                      onClick={async () => {
                        setLoading(true);
                        const res = await (
                          await fetch(
                            `${process.env.API_HOST}/collection/v1/${collection.id}`,
                            {
                              method: "PATCH",
                              body: JSON.stringify({
                                sybilProtectionEnabled: false,
                              }),
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                            }
                          )
                        ).json();
                        updateCollection(res);
                        setIsOpen(false);
                        setLoading(false);
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
                        const sybilProtectionScores = {} as {
                          [id: string]: number;
                        };
                        for (let i = 0; i < stamps.length; i++) {
                          sybilProtectionScores[stamps[i].id] = allocations[i];
                        }
                        const res = await (
                          await fetch(
                            `${process.env.API_HOST}/collection/v1/${collection.id}`,
                            {
                              method: "PATCH",
                              body: JSON.stringify({
                                sybilProtectionEnabled: true,
                                sybilProtectionScores,
                              }),
                              headers: {
                                "Content-Type": "application/json",
                              },
                              credentials: "include",
                            }
                          )
                        ).json();
                        updateCollection(res);
                        setIsOpen(false);
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
        )}
      </AnimatePresence>
    </>
  );
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  height: calc(100vh - 25rem);
  ::-webkit-scrollbar {
    width: 5px;
  }
`;
