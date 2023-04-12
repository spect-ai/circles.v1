import PrimaryButton from "@/app/common/components/PrimaryButton";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { Box, Stack, Text } from "degen";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocalCollection } from "../Context/LocalCollectionContext";

type Props = {
  onYes: () => void;
  onNo: () => void;
};

const WarnConnectWallet = ({ onYes, onNo }: Props) => {
  const [checkboxState, setCheckboxState] = useState(false);
  const { localCollection: collection } = useLocalCollection();
  useEffect(() => {
    if (!collection.formMetadata.walletConnectionRequired) {
      onYes();
      return;
    }
    const slug = collection.slug;
    const dontShow = localStorage.getItem(
      `dontShowConnectWalletWarning-${slug}`
    );
    if (dontShow) {
      onYes();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container
        backgroundColor="background"
        padding="4"
        borderRadius="2xLarge"
        width="72"
      >
        <Stack space="2">
          <Text size="small">
            This form requires responders to connect their wallet to submit a
            response. Are you sure you want to continue?
          </Text>
          <Text size="small">You can change this in the form settings</Text>
          <Stack direction="horizontal">
            <PrimaryButton onClick={onYes}>Continue</PrimaryButton>
            <PrimaryButton variant="tertiary" onClick={onNo}>
              Cancel
            </PrimaryButton>
          </Stack>
          <Stack direction="horizontal">
            <CheckBox
              isChecked={checkboxState}
              onClick={() => {
                setCheckboxState(!checkboxState);
                const slug = collection.slug;
                localStorage.setItem(
                  `dontShowConnectWalletWarning-${slug}`,
                  "true"
                );
              }}
            />
            <Text>Don't show this again</Text>
          </Stack>
        </Stack>
      </Container>
    </motion.div>
  );
};

// position it top right like a sticky toast
const Container = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000;
  margin: 2rem;
`;

export default WarnConnectWallet;
