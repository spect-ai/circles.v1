import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { updateFormCollection } from "@/app/services/Collection";
import { Option } from "@/app/types";
import { Box, IconUserGroup, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import AddOptions from "../AddField/AddOptions";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import MultiChoiceVotingOnMultipleResponses from "./MultiChoiceVotingOnMultipleResponses";
import SingleChoiceVotingOnSingleResponse from "./SingleChoiceVotingOnSingleResponse";

export default function VotingModule() {
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();

  const [isOpen, setIsOpen] = useState(false);
  const [votingType, setVotingType] = useState({
    label: "Single Choice",
    value: "singleChoice",
  });
  const [votesArePublic, setVotesArePublic] = useState(false);
  const [votesAreWeightedByTokens, setVotesAreWeightedByTokens] =
    useState(false);
  const [tokenWeightedWith, setTokenWeightedWith] = useState(
    [] as {
      chain: Option;
      token: Option;
      weight: number;
    }[]
  );

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
  const [message, setMessage] = useState("Please vote");
  const [loading, setLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (
      collection?.voting &&
      collection.voting.enabled &&
      collection.voting.options
    ) {
      setVotingOptions(collection.voting.options);
      setMessage(collection.voting.message || "");
      setVotesArePublic(collection.voting.votesArePublic || false);
      setVotingType(
        collection.voting.votingType || {
          label: "Single Choice",
          value: "singleChoice",
        }
      );
      setVotesAreWeightedByTokens(
        collection.voting.votesAreWeightedByTokens || false
      );
      setTokenWeightedWith(collection.voting.tokensWeightedWith || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  return (
    <>
      {isConfirmModalOpen && (
        <ConfirmModal
          title={
            "Voting settings cannot be updated once voting is enabled. It has to be disabled and enabled again which would start the voting process anew for responses that have an active voting periods."
          }
          handleClose={() => setIsConfirmModalOpen(false)}
          onConfirm={async () => {
            setLoading(true);
            setIsConfirmModalOpen(false);
            const res = await updateFormCollection(collection.id, {
              voting: {
                enabled: true,
                options: votingOptions,
                message,
                votingType,
                votesArePublic,
                votesAreWeightedByTokens,
                tokensWeightedWith: tokenWeightedWith,
              },
            });
            setLoading(false);
            if (res.id) {
              setIsOpen(false);
              setLocalCollection(res);
            } else toast.error("Something went wrong");
          }}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
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
          {collection?.voting?.enabled ? "View" : "Enable"} Voting{" "}
          {collection?.voting?.enabled ? "Settings" : ""}
        </PrimaryButton>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Voting Module" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack space="4">
                {" "}
                <Stack space="2">
                  <Text variant="label">Voting Type</Text>
                  <Dropdown
                    options={[
                      {
                        label: "Single Choice Voting",
                        value: "singleChoice",
                      },
                      {
                        label: "Ranked Choice Voting",
                        value: "rankedChoice",
                      },
                      {
                        label: "Quadratic Voting",
                        value: "quadratic",
                      },
                    ]}
                    selected={votingType}
                    onChange={setVotingType}
                    multiple={false}
                    disabled={collection?.voting?.enabled}
                  />{" "}
                </Stack>
                <Stack space="0">
                  <Text variant="label">Message</Text>
                  <Input
                    label=""
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={collection?.voting?.enabled}
                  />
                </Stack>
                <Box
                  display="flex"
                  flexDirection="row"
                  gap="2"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <CheckBox
                    isChecked={votesArePublic}
                    onClick={() => {
                      setVotesArePublic(!votesArePublic);
                    }}
                    disabled={collection?.voting?.enabled}
                  />
                  <Text variant="small">
                    Votes are visible by other members
                  </Text>
                </Box>
                <Box display="flex" flexDirection="column" gap="2">
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="2"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <CheckBox
                      isChecked={votesAreWeightedByTokens}
                      onClick={() => {
                        setVotesAreWeightedByTokens(!votesAreWeightedByTokens);
                      }}
                      disabled={collection?.voting?.enabled}
                    />
                    <Text variant="small">
                      Votes are weighted by token holdings
                    </Text>
                  </Box>
                  {votesAreWeightedByTokens && (
                    <Text variant="label">Pick Token</Text>
                  )}
                </Box>
                {["rankedChoice", "quadratic"].includes(votingType.value) && (
                  <MultiChoiceVotingOnMultipleResponses />
                )}
                {votingType.value === "singleChoice" && (
                  <SingleChoiceVotingOnSingleResponse
                    options={votingOptions}
                    setOptions={setVotingOptions}
                    disabled={collection?.voting?.enabled}
                  />
                )}
                {!collection.voting?.enabled && (
                  <Box width="full" marginTop="8">
                    <PrimaryButton
                      loading={loading}
                      onClick={() => {
                        setIsConfirmModalOpen(true);
                      }}
                    >
                      Enable Voting
                    </PrimaryButton>
                  </Box>
                )}
                {collection.voting?.enabled && (
                  <Box width="full">
                    <PrimaryButton
                      variant="secondary"
                      tone="red"
                      loading={loading}
                      onClick={async () => {
                        setLoading(true);
                        const res = await updateFormCollection(collection.id, {
                          voting: {
                            enabled: false,
                          },
                        });
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
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
