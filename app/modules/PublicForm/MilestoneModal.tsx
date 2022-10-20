import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, IconPlusSmall, useTheme } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocalCollection } from "../Collection/Context/LocalCollectionContext";

export default function AddMilestone() {
  const [isOpen, setIsOpen] = useState(false);
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();

  const [propertyName, setPropertyName] = useState("");

  const [data, setData] = useState({} as any);
  const { mode } = useTheme();

  return (
    <>
      <Box marginTop="4" width="72">
        <PrimaryButton
          variant="tertiary"
          icon={<IconPlusSmall />}
          onClick={() => setIsOpen(true)}
        >
          Add new milestone
        </PrimaryButton>
      </Box>
      {isOpen && (
        <AnimatePresence>
          <Modal
            handleClose={() => {
              setIsOpen(false);
            }}
            title={`Add Milestone`}
          >
            <Box padding="8">Hello</Box>
          </Modal>
        </AnimatePresence>
      )}
    </>
  );
}
