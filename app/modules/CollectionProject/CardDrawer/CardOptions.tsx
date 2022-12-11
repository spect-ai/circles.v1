import Popover from "@/app/common/components/Popover";
import { Box, Stack, Tag, Text } from "degen";
import React, { useState } from "react";
import { Archive, MoreHorizontal } from "react-feather";
import { MenuContainer, MenuItem } from "../EditValue";
import { motion } from "framer-motion";
import { updateFormCollection } from "@/app/services/Collection";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { toast } from "react-toastify";

type Props = {
  handleDrawerClose: () => void;
  cardSlug: string;
};

export default function CardOptions({ handleDrawerClose, cardSlug }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [isOpen, setIsOpen] = useState(false);
  return (
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
          <MenuItem
            padding="2"
            onClick={async () => {
              setIsOpen(false);
              handleDrawerClose();
              // delet cardslug from cardorders
              const newCardOrders = collection.projectMetadata.cardOrders;
              Object.keys(collection.projectMetadata.cardOrders).map((key) => {
                newCardOrders[key] = collection.projectMetadata.cardOrders[
                  key
                ].map((group) => {
                  return group.filter((slug) => slug !== cardSlug);
                });
              });
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
  );
}
