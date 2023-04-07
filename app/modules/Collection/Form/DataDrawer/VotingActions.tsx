import { Box, IconLightningBolt, Stack, Tag, Text } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery as useApolloQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { useCircle } from "@/app/modules/Circle/CircleContext";
import {
  MenuContainer,
  MenuItem,
} from "@/app/modules/CollectionProject/EditValue";
import { MoreHorizontal } from "react-feather";
import Popover from "@/app/common/components/Popover";
import { SnapshotModal } from "../../Common/SnapshotModal";
import { Proposal } from "./VotingOnSnapshot";
import { useLocalCollection } from "../../Context/LocalCollectionContext";

const VotingActions = ({
  dataId,
  data,
}: {
  dataId: string;
  data: Record<string, unknown>;
}) => {
  const { localCollection: collection } = useLocalCollection();
  const { circle } = useCircle();
  const { address } = useAccount();
  const [snapshotModal, setSnapshotModal] = useState(false);

  const proposal = collection?.voting?.snapshot?.[dataId]?.proposalId;

  const { data: proposalData } = useApolloQuery(Proposal, {
    variables: { proposal },
  });
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Popover
        width="16"
        butttonComponent={
          <Box cursor="pointer" onClick={() => setIsOpen(true)}>
            <Tag hover>
              <MoreHorizontal
                style={{
                  marginTop: 2,
                }}
              />
            </Tag>
          </Box>
        }
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto", transition: { duration: 0.2 } }}
          exit={{ height: 0 }}
          style={{
            overflow: "hidden",
          }}
        >
          <MenuContainer cWidth="17rem">
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
                  <Text variant="base">
                    {" "}
                    Snapshot Proposal has been deleted.
                  </Text>
                )}
                {!proposal &&
                  !collection.voting?.snapshot?.[dataId]?.proposalId && (
                    <MenuItem
                      style={{
                        padding: "6px",
                      }}
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
                      <Stack direction="horizontal" align="center" space="2">
                        <IconLightningBolt color="accent" size="5" />
                        <Text align="left">Create Snapshot Proposal</Text>
                      </Stack>
                    </MenuItem>
                  )}
              </Box>
            </Box>
          </MenuContainer>
        </motion.div>
      </Popover>
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
};

export default VotingActions;
