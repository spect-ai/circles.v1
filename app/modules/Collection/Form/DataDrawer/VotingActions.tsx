import { endVotingPeriod, startVotingPeriod } from "@/app/services/Collection";
import { Box, Input, Stack, Text, useTheme } from "degen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

import PrimaryButton from "@/app/common/components/PrimaryButton";
import { AnimatePresence } from "framer-motion";
import Modal from "@/app/common/components/Modal";
import { DateInput } from "@/app/modules/Profile/ProfilePage/AddExperienceModal";
import { dateIsInvalid } from "@/app/common/utils/utils";
import { useBlockNumber } from "wagmi";
import useSnapshot from "@/app/services/Snapshot/useSnapshot";

export default function VotingActions({ dataId }: { dataId: string }) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const block = useBlockNumber({
    chainId: 1,
  });
  const { mode } = useTheme();
  const { createProposal } = useSnapshot();

  const [snapshotModal, setSnapshotModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [title, setTitle] = useState("");
  const [blockNumber, setBlockNumber] = useState(block.data);
  return (
    <>
      {!collection.voting?.periods?.[dataId]?.active &&
        !collection.voting.snapshot?.id && (
          <Box
            display="flex"
            flexDirection="row"
            width="full"
            justifyContent="flex-end"
            paddingRight="8"
          >
            <Box display="flex" flexDirection="column" gap="2">
              {collection.voting?.periods?.[dataId]?.votes &&
                Object.keys(collection.voting?.periods[dataId]?.votes || {})
                  ?.length > 0 && <Text variant="base"> Voting has ended</Text>}
              {collection.voting?.enabled &&
                Object.keys(collection.voting?.periods?.[dataId]?.votes || {})
                  ?.length === 0 && (
                  <PrimaryButton
                    variant="secondary"
                    onClick={async () => {
                      const res = await startVotingPeriod(
                        collection.id,
                        dataId
                      );
                      if (!res.id) {
                        toast.error("Something went wrong");
                      } else updateCollection(res);
                    }}
                  >
                    Start Voting Period
                  </PrimaryButton>
                )}
            </Box>
          </Box>
        )}
      {collection.voting?.enabled &&
        !collection.voting.snapshot?.id &&
        collection.voting?.periods &&
        collection.voting?.periods[dataId]?.active && (
          <Box
            display="flex"
            flexDirection="row"
            width="full"
            justifyContent="flex-end"
            paddingRight="8"
          >
            <Box display="flex" flexDirection="column" gap="2">
              <Text variant="base"> Voting is active</Text>
              <PrimaryButton
                variant="tertiary"
                onClick={async () => {
                  const res = await endVotingPeriod(collection.id, dataId);
                  if (!res.id) {
                    toast.error("Something went wrong");
                  } else updateCollection(res);
                }}
              >
                End Voting Period
              </PrimaryButton>
            </Box>
          </Box>
        )}
      {!collection.voting?.periods?.[dataId]?.active &&
        collection.voting.snapshot?.id && (
          <Box
            display="flex"
            flexDirection="row"
            width="full"
            justifyContent="flex-end"
            paddingRight="8"
          >
            <Box display="flex" flexDirection="column" gap="2">
              {collection.voting?.periods?.[dataId]?.votes &&
                Object.keys(collection.voting?.periods[dataId]?.votes || {})
                  ?.length > 0 && <Text variant="base"> Voting has ended</Text>}
              {collection.voting?.enabled &&
                Object.keys(collection.voting?.periods?.[dataId]?.votes || {})
                  ?.length === 0 && (
                  <PrimaryButton
                    variant="secondary"
                    onClick={() => {
                      setSnapshotModal(true);
                    }}
                  >
                    Create Proposal on Snapshot
                  </PrimaryButton>
                )}
            </Box>
          </Box>
        )}
      <AnimatePresence>
        {snapshotModal && (
          <Modal
            handleClose={() => setSnapshotModal(false)}
            title="Create Snapshot Proposal"
          >
            <Box padding={"8"}>
              <Stack space={"3"}>
                <Text variant="label">Title of the proposal</Text>
                <Input
                  label
                  hideLabel
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Text variant="label">Snapshot ( Block Number )</Text>
                <Input
                  label
                  hideLabel
                  min={0}
                  type="number"
                  value={blockNumber}
                  onChange={(e) => setBlockNumber(Number(e.target.value))}
                />
                <Stack>
                  <Text variant="label">Voting Period</Text>
                  <Stack direction={"horizontal"}>
                    <DateInput
                      placeholder={`Enter Start Date`}
                      value={startDate}
                      type="datetime-local"
                      mode={mode}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                    />
                    <DateInput
                      placeholder={`Enter End Date`}
                      value={endDate}
                      type="datetime-local"
                      mode={mode}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                      }}
                    />
                  </Stack>
                  {dateIsInvalid(startDate, endDate) && (
                    <Text color={"red"}>Date is invalid</Text>
                  )}
                </Stack>
                <PrimaryButton
                  onClick={async () => {
                    const start = Math.floor(
                      new Date(startDate).getTime() / 1000
                    );
                    const end = Math.floor(new Date(endDate).getTime() / 1000);
                    const snapRes: any = await createProposal({
                      title,
                      body: "ffsrw",
                      start,
                      end,
                      block: blockNumber,
                    });
                    setSnapshotModal(false);
                    if (!snapRes?.id) {
                      toast.error("Something went wrong" + snapRes.error);
                    } else {
                      toast.success("Proposal created");
                      const res = await startVotingPeriod(
                        collection.id,
                        dataId,
                        {
                          endsOn: endDate,
                          postOnSnapshot: true,
                          space: collection?.voting?.snapshot?.id,
                          proposalId: snapRes.id,
                        }
                      );
                      if (!res.id) {
                        toast.error("Something went wrong");
                      } else updateCollection(res);
                    }
                  }}
                >
                  Create Proposal
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
