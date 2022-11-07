import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, IconUserGroup, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import AddOptions from "../AddField/AddOptions";
import { useLocalCollection } from "../Context/LocalCollectionContext";

export default function VotingModule() {
  const [isOpen, setIsOpen] = useState(false);
  const [votingOptions, setVotingOptions] = useState([
    {
      label: "For",
      value: `option-${uuid()}`,
    },
    {
      label: "Against",
      value: `option-${uuid()}`,
    },
    {
      label: "Abstain",
      value: `option-${uuid()}`,
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();

  useEffect(() => {
    if (
      collection?.voting &&
      collection.voting.enabled &&
      collection.voting.options
    ) {
      setVotingOptions(collection.voting.options);
      setMessage(collection.voting.message || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  return (
    <>
      <Text variant="label">Allow members to vote on responses</Text>
      <Box
        width={{
          xs: "full",
          md: "1/2",
        }}
      >
        <PrimaryButton
          onClick={() => setIsOpen(true)}
          icon={<IconUserGroup />}
          variant={collection?.voting?.enabled ? "tertiary" : "secondary"}
        >
          {collection?.voting?.enabled ? "Edit" : "Enable"} Voting
        </PrimaryButton>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Voting Module" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Stack space="1">
                  <Text variant="label">Message</Text>
                  <Input
                    label=""
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Stack>
                <Stack space="1">
                  <AddOptions
                    fieldOptions={votingOptions}
                    setFieldOptions={setVotingOptions}
                    label="Voting Options"
                  />
                </Stack>
                <Stack
                  direction={{
                    xs: "vertical",
                    md: "horizontal",
                  }}
                >
                  {collection.voting.enabled && (
                    <Box width="full">
                      <PrimaryButton
                        variant="secondary"
                        tone="red"
                        loading={loading}
                        onClick={async () => {
                          setLoading(true);
                          const res = await updateFormCollection(
                            collection.id,
                            {
                              voting: {
                                enabled: false,
                              },
                            }
                          );
                          setLoading(false);
                          if (res.id) {
                            setIsOpen(false);
                            setLocalCollection(res);
                          } else toast.error("Something went wrong");
                        }}
                      >
                        Disable Voting
                      </PrimaryButton>
                    </Box>
                  )}
                  <Box width="full">
                    <PrimaryButton
                      loading={loading}
                      onClick={async () => {
                        setLoading(true);
                        const res = await updateFormCollection(collection.id, {
                          voting: {
                            enabled: true,
                            options: votingOptions,
                            message,
                          },
                        });
                        setLoading(false);
                        if (res.id) {
                          setIsOpen(false);
                          setLocalCollection(res);
                        } else toast.error("Something went wrong");
                      }}
                    >
                      {collection?.voting?.enabled ? "Update" : "Enable"} Voting
                    </PrimaryButton>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
