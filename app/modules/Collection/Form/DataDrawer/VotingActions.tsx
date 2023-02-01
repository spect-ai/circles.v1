import { endVotingPeriod, startVotingPeriod } from "@/app/services/Collection";
import { Box, IconLightningBolt, Input, Stack, Text, useTheme } from "degen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

import PrimaryButton from "@/app/common/components/PrimaryButton";
import { AnimatePresence } from "framer-motion";
import Modal from "@/app/common/components/Modal";
import { DateInput } from "@/app/modules/Profile/ProfilePage/AddExperienceModal";
import { dateIsInvalid, smartTrim } from "@/app/common/utils/utils";
import useSnapshot from "@/app/services/Snapshot/useSnapshot";
import { Proposal } from "./VotingOnSnapshot";
import { useQuery as useApolloQuery } from "@apollo/client";
import { CollectionType, Option } from "@/app/types";
import { useLocation } from "react-use";
import { useAccount } from "wagmi";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
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
  const { localCircle: circle } = useCircle();
  const { formActions } = useRoleGate();
  const { hostname } = useLocation();
  const { address } = useAccount();
  const { mode } = useTheme();
  const { createProposal } = useSnapshot();
  const router = useRouter();
  const { circle: cId } = router.query;

  const [snapshotModal, setSnapshotModal] = useState(false);

  const proposal = collection?.voting?.periods?.[dataId]?.snapshot?.proposalId;

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
          {!collection.voting?.periods?.[dataId]?.active && (
            <PrimaryButton
              variant="secondary"
              onClick={() => {
                if (!address) {
                  toast.error("Please unlock your wallet first");
                  return;
                }
                setSnapshotModal(true);
              }}
            >
              Create Proposal on Snapshot
            </PrimaryButton>
          )}
        </Box>
      </Box>
      {collection.voting?.periods?.[dataId]?.active &&
        circle?.snapshot?.id &&
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
