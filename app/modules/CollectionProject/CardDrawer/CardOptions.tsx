import Popover from "@/app/common/components/Popover";
import {
  Box,
  IconCheck,
  IconClose,
  IconLightningBolt,
  IconLockClosed,
  IconRefresh,
  Stack,
  Tag,
  Text,
} from "degen";
import React, { useMemo, useState } from "react";
import { Archive, MoreHorizontal } from "react-feather";
import { MenuContainer, MenuItem } from "../EditValue";
import { motion } from "framer-motion";
import { updateFormCollection } from "@/app/services/Collection";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { toast } from "react-toastify";
import {
  ClockCircleOutlined,
  DollarOutlined,
  IssuesCloseOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { addPendingPayment } from "@/app/services/Paymentv2";
import { useCircle } from "../../Circle/CircleContext";
import { useAccount } from "wagmi";
import DiscordIcon from "@/app/assets/icons/discordIcon.svg";
import IntegrateSnapshotModal from "../../Circle/Governance/IntegrateSnapshotModal";

type Props = {
  handleDrawerClose: () => void;
  cardSlug: string;
  setSnapshotModal: (value: boolean) => void;
  setDiscordThreadModal: (value: boolean) => void;
  onChange: (data: any, slug: string) => Promise<void>;
};

export default function CardOptions({
  handleDrawerClose,
  cardSlug,
  setSnapshotModal,
  setDiscordThreadModal,
  onChange,
}: Props) {
  const { address } = useAccount();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const { circle } = useCircle();
  const [isOpen, setIsOpen] = useState(false);
  const [integrateSnapshotModalOpen, setIntegrateSnapshotModalOpen] =
    useState(false);

  const rewardProperties = useMemo(
    () =>
      Object.values(collection?.properties).filter(
        (property) => property.type === "reward"
      ).length,
    [collection?.properties]
  );
  const userProperties = useMemo(
    () =>
      Object.values(collection?.properties).filter(
        (property) => property.type === "user"
      ).length,
    [collection?.properties]
  );
  const multiUserProperties = useMemo(
    () =>
      Object.values(collection?.properties).filter(
        (property) => property.type === "user[]"
      ).length,
    [collection?.properties]
  );
  const ethAddressProperties = useMemo(
    () =>
      Object.values(collection?.properties).filter(
        (property) => property.type === "ethAddress"
      ).length,
    [collection?.properties]
  );

  const showPendingPayment =
    !["pending", "pendingSignature", "completed"].includes(
      collection.projectMetadata.paymentStatus?.[cardSlug] || ""
    ) &&
    rewardProperties > 0 &&
    (userProperties > 0 || multiUserProperties > 0 || ethAddressProperties > 0);

  return (
    <Box>
      {integrateSnapshotModalOpen && (
        <IntegrateSnapshotModal
          handleClose={() => setIntegrateSnapshotModalOpen(false)}
        />
      )}
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
          <MenuContainer cWidth="15rem">
            {(!collection.discordThreadRef ||
              !collection.discordThreadRef[cardSlug]) && (
              <MenuItem
                style={{
                  padding: "6px",
                }}
                onClick={() => {
                  setIsOpen(false);

                  if (!circle?.snapshot?.id) {
                    toast.error(
                      "Please integrate your Snapshot in the Governance Center first"
                    );
                    return;
                  }
                  setDiscordThreadModal(true);
                }}
              >
                <Stack direction="horizontal" align="center" space="2">
                  <Text color="accent">
                    {" "}
                    <DiscordIcon />
                  </Text>
                  <Text align={"left"}>Link Discord Thread</Text>
                </Stack>
              </MenuItem>
            )}
            {!collection.voting.snapshot?.[cardSlug]?.proposalId && (
              <MenuItem
                style={{
                  padding: "6px",
                }}
                onClick={() => {
                  setIsOpen(false);
                  if (!address) {
                    toast.error("Please unlock your wallet first");
                    return;
                  }
                  if (!circle?.snapshot?.id) {
                    setIntegrateSnapshotModalOpen(true);
                    return;
                  }
                  setSnapshotModal(true);
                }}
              >
                <Stack direction="horizontal" align="center" space="2">
                  <IconLightningBolt color={"accent"} size="5" />
                  <Text align={"left"}>Create Snapshot Proposal</Text>
                </Stack>
              </MenuItem>
            )}
            {showPendingPayment && (
              <MenuItem
                padding="2"
                onClick={async () => {
                  if (
                    !collection.projectMetadata.payments?.payeeField ||
                    !collection.projectMetadata.payments?.rewardField
                  ) {
                    toast.error(
                      "Please set up payments first in collection settings"
                    );
                    setIsOpen(false);
                    return;
                  }
                  if (
                    !collection.data[cardSlug][
                      collection.projectMetadata.payments?.payeeField
                    ]
                  ) {
                    toast.error(
                      `"${collection.projectMetadata.payments.payeeField}" is not added, please add a payee first`
                    );
                    setIsOpen(false);
                    return;
                  }
                  if (
                    !collection.data[cardSlug][
                      collection.projectMetadata.payments?.rewardField
                    ]
                  ) {
                    toast.error(
                      `"${collection.projectMetadata.payments.rewardField}" is not added, please add a reward first`
                    );
                    setIsOpen(false);
                    return;
                  }
                  setIsOpen(false);
                  handleDrawerClose();
                  const res = await addPendingPayment(circle?.id || "", {
                    collectionId: collection.id,
                    dataSlugs: [cardSlug],
                  });
                  updateCollection(res);
                  if (res.id)
                    toast.success(
                      "Added to pending payments, you can view it in the payments center"
                    );
                  else toast.error("Error adding to pending payments");
                }}
              >
                <Stack direction="horizontal" align="center" space="2">
                  <Text color="accent">
                    <DollarOutlined />
                  </Text>
                  <Text>Add to pending payment</Text>
                </Stack>
              </MenuItem>
            )}
            <MenuItem
              style={{
                padding: "6px",
              }}
              onClick={async () => {
                setIsOpen(false);
                handleDrawerClose();
                await onChange(
                  {
                    ["__cardStatus__"]:
                      collection.data?.[cardSlug]?.__cardStatus__ ===
                        undefined ||
                      collection.data?.[cardSlug]?.__cardStatus__ === "active"
                        ? "closed"
                        : "active",
                  },
                  cardSlug
                );
              }}
            >
              <Stack direction="horizontal" align="center" space="2">
                {!(collection.data?.[cardSlug]?.__cardStatus__ === "closed") ? (
                  <>
                    <IconLockClosed color={"accent"} size="5" />
                    <Text align={"left"}>Close Card</Text>
                  </>
                ) : (
                  <Box
                    marginLeft="0.5"
                    display="flex"
                    flexDirection="row"
                    gap="2"
                  >
                    <Text color="accent">
                      <UnlockOutlined />
                    </Text>
                    <Text>Re-open Card</Text>
                  </Box>
                )}
              </Stack>
            </MenuItem>
            <MenuItem
              padding="2"
              onClick={async () => {
                setIsOpen(false);
                handleDrawerClose();
                // delet cardslug from cardorders
                const newCardOrders = collection.projectMetadata.cardOrders;
                Object.keys(collection.projectMetadata.cardOrders).map(
                  (key) => {
                    newCardOrders[key] = collection.projectMetadata.cardOrders[
                      key
                    ].map((group) => {
                      return group.filter((slug) => slug !== cardSlug);
                    });
                  }
                );
                const res = await updateFormCollection(collection.id, {
                  data: {
                    ...collection.data,
                    [cardSlug]: undefined,
                  },
                  archivedData: {
                    ...collection.archivedData,
                    [cardSlug]: collection.data[cardSlug],
                  },
                  projectMetadata: {
                    ...collection.projectMetadata,
                    cardOrders: newCardOrders,
                  },
                });
                if (res.id) {
                  updateCollection(res);
                } else {
                  toast.error("Error updating collection");
                }
              }}
            >
              <Stack direction="horizontal" align="center" space="2">
                <Text color="red">
                  <Archive
                    size={18}
                    style={{
                      marginTop: 2,
                    }}
                  />
                </Text>
                <Text>Archive</Text>
              </Stack>
            </MenuItem>
          </MenuContainer>
        </motion.div>
      </Popover>
    </Box>
  );
}
