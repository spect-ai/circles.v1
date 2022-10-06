import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateCircle } from "@/app/services/UpdateCircle";
import { Box, IconPlusSmall, Input, Stack, Tag, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";

export default function AddLabel() {
  const { labels, setLabels } = useLocalCard();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { circle, setCircleData } = useCircle();
  const [label, setLabel] = useState("");

  const onSubmit = async () => {
    setLoading(true);

    const res = await updateCircle(
      {
        labels: [...(circle?.labels || []), label],
      },
      circle?.id
    );
    setLoading(false);
    if (res) {
      setLabel("");
      setCircleData(res);
      setLabels([...labels, label]);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Box
        cursor="pointer"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Tag hover tone="accent">
          <Text>
            <Stack direction="horizontal" space="1" align="center">
              <IconPlusSmall size="4" />
              Add Label
            </Stack>
          </Text>
        </Tag>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Add Label"
            handleClose={() => setIsOpen(false)}
            size="small"
          >
            <Box padding="8">
              <Stack>
                <Input
                  label=""
                  placeholder="Custom Label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
                <PrimaryButton loading={loading} onClick={onSubmit}>
                  Create
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
