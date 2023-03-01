import { Box, Text } from "degen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

import PrimaryButton from "@/app/common/components/PrimaryButton";
import { AnimatePresence } from "framer-motion";
import { Proposal } from "./VotingOnSnapshot";
import { useQuery as useApolloQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import { SnapshotModal } from "../../Common/SnapshotModal";

export default function VotingActions({
  dataId,
  data,
  col,
}: {
  dataId: string;
  data: any;
  col: boolean;
}) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { circle } = useCircle();
  const { address } = useAccount();
  const router = useRouter();

  const [snapshotModal, setSnapshotModal] = useState(false);

  const proposal = collection?.voting?.snapshot?.[dataId]?.proposalId;

  const { data: proposalData } = useApolloQuery(Proposal, {
    variables: { proposal: proposal },
  });

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        width="full"
        justifyContent="flex-end"
        paddingRight="8"
      >
        <Box display="flex" flexDirection="column" gap="2">
          {proposalData?.proposal?.state === "closed" && (
            <Text variant="base"> Voting has ended</Text>
          )}
          {proposalData?.proposal === null && (
            <Text variant="base"> Snapshot Proposal has been deleted.</Text>
          )}
          {/* {!proposal && !collection.voting?.snapshot?.[dataId]?.proposalId && (
            <PrimaryButton
              variant="secondary"
              onClick={() => {
                if (!address) {
                  toast.error("Please unlock your wallet first");
                  return;
                }
                if (!circle?.snapshot?.id) {
                  toast.error(
                    "Please integrate your Snapshot in the Governance Center first"
                  );
                  return;
                }

                setSnapshotModal(true);
              }}
            >
              Create Proposal on Snapshot
            </PrimaryButton>
          )} */}
        </Box>
      </Box>
      {circle?.snapshot?.id &&
        proposal &&
        proposalData?.proposal?.state === "active" && (
          <Text variant="base"> Voting is active</Text>
        )}
      <AnimatePresence>
        {snapshotModal && (
          <SnapshotModal
            data={data}
            dataId={dataId}
            setSnapshotModal={setSnapshotModal}
          />
        )}
      </AnimatePresence>
    </>
  );
}
