import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { updateFormCollection } from "@/app/services/Collection";
import { Option } from "@/app/types";
import { Box, IconUserGroup, Input, Stack, Tag, Text, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import MultiChoiceVotingOnMultipleResponses from "./MultiChoiceVotingOnMultipleResponses";
import SingleChoiceVotingOnSingleResponse from "./SingleChoiceVotingOnSingleResponse";
import { useQuery, gql } from "@apollo/client";
import { useCircle } from "@/app/modules/Circle/CircleContext";

export const Space = gql`
  query Space($id: String!) {
    space(id: $id) {
      id
      name
      about
      network
      symbol
      members
    }
  }
`;

export default function VotingModule() {
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();

  const { circle } = useCircle();
  const [circleRoles, setCircleRoles] = useState(circle?.roles || {});

  const [permissions, setPermissions] = useState<string[]>(
    collection?.permissions?.viewResponses || []
  );

  const [isOpen, setIsOpen] = useState(false);
  const [votingType, setVotingType] = useState({
    label: "Single Choice",
    value: "singleChoice",
  });
  const [votesArePublic, setVotesArePublic] = useState(false);
  const [snapshotVoting, setSnapshotVoting] = useState(false);
  const [snapshotSpace, setSnapshotSpace] = useState("");

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
      setSnapshotVoting(collection.voting.votesAreWeightedByTokens || false);
      setSnapshotSpace(collection.voting?.snapshot?.id || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const {
    loading: isLoading,
    error,
    data,
  } = useQuery(Space, { variables: { id: snapshotSpace } });

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
          {collection?.voting?.enabled ? "View" : "Enable"} Voting{" "}
          {collection?.voting?.enabled ? "Settings" : ""}
        </PrimaryButton>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Voting Module"
            handleClose={() => setIsOpen(false)}
            size="large"
          >
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
                <Stack
                  direction={{
                    lg: "horizontal",
                    xs: "vertical",
                    md: "vertical",
                  }}
                  justify="space-between"
                >
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
                        isChecked={snapshotVoting}
                        onClick={() => {
                          if (snapshotVoting) {
                            setSnapshotSpace("");
                          }
                          setSnapshotVoting(!snapshotVoting);
                          setVotesArePublic(!snapshotVoting);
                        }}
                        disabled={collection?.voting?.enabled}
                      />
                      <Text variant="small">
                        Integrate with Snapshot (Token Weighted voting)
                      </Text>
                    </Box>
                  </Box>
                </Stack>
                {snapshotVoting && (
                  <>
                    <Text variant="label">Snapshot URL</Text>
                    <Input
                      label
                      hideLabel
                      prefix="https://snapshot.org/#/"
                      value={snapshotSpace}
                      placeholder="your-space.eth"
                      onChange={(e) => {
                        // const snapshotURL = e.target.value;
                        // const spaceSlug = snapshotURL.replace(
                        //   /^(https)\:\/\/snapshot.org\/#\//g,
                        //   ""
                        // );
                        setSnapshotSpace(e.target.value);
                      }}
                    />
                    {snapshotSpace &&
                      !isLoading &&
                      (data?.space?.id ? (
                        <Text size={"extraSmall"} color="accent">
                          Snapshot Space - {data?.space?.name}
                        </Text>
                      ) : (
                        <Text color={"red"}>Incorrect URL</Text>
                      ))}
                  </>
                )}
                <Text variant="label">Notifications</Text>
                <Box display={"flex"} flexDirection="row" gap={"2"}>
                  {Object.keys(circleRoles)?.map((role) => {
                    return (
                      <Box
                        key={role}
                        onClick={() => {
                          if (permissions.includes(role)) {
                            setPermissions(
                              permissions.filter((item) => item !== role)
                            );
                          } else {
                            setPermissions([...permissions, role]);
                          }
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <Tag
                          hover
                          size="medium"
                          as="span"
                          tone={
                            permissions.includes(role) ? "accent" : "secondary"
                          }
                        >
                          {role}
                        </Tag>
                      </Box>
                    );
                  })}
                </Box>
                <Text>
                  These roles will be notified when a voting period is starts
                  and will have the permissions to view the form's responses.
                </Text>
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
                      disabled={
                        loading ||
                        (snapshotVoting &&
                          (!snapshotSpace || !data?.space?.id)) ||
                        !votingType ||
                        !votingOptions.length
                      }
                      onClick={async () => {
                        setLoading(true);
                        setIsConfirmModalOpen(false);
                        const res = await updateFormCollection(collection.id, {
                          permissions: {
                            ...collection.permissions,
                            viewResponses: permissions,
                          },
                          voting: {
                            ...collection.voting,
                            enabled: true,
                            options: votingOptions,
                            message,
                            votingType,
                            votesArePublic,
                            votesAreWeightedByTokens: snapshotVoting,
                            snapshot: {
                              name: data?.space?.name || "",
                              id: snapshotSpace,
                              network: data?.space?.network || "",
                              symbol: data?.space?.symbol || "",
                            },
                          },
                        });
                        setLoading(false);
                        if (res.id) {
                          setIsOpen(false);
                          setLocalCollection(res);
                        } else toast.error("Something went wrong");
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
                            ...collection.voting,
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
