import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Stack, Text, Box } from "degen";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { MenuContainer, MenuItem } from "../EditValue";

const IncentiveFilter = () => {
  const { localCollection: collection } = useLocalCollection();
  const [isOpen, setIsOpen] = useState(false);
  const [erc20Claimee, setErc20Claimee] = useState(false);

  if (
    !collection.formMetadata.mintkudosTokenId &&
    !collection.formMetadata.poapEventId &&
    !collection.formMetadata.surveyTokenId &&
    collection.formMetadata.surveyTokenId !== 0
  ) {
    return null;
  }

  return (
    <Stack>
      <Popover
        width="fit"
        butttonComponent={
          <PrimaryButton variant="transparent" onClick={() => setIsOpen(true)}>
            Claimed Tokens
          </PrimaryButton>
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
          <Box backgroundColor="background">
            <MenuContainer borderRadius="2xLarge" cWidth="10rem">
              <Stack space="0">
                {collection.formMetadata.poapEventId && (
                  <MenuItem
                    padding="2"
                    onClick={() => {
                      window.open(
                        `https://poap.gallery/event/${collection.formMetadata.poapEventId}`,
                        "_blank"
                      );
                    }}
                  >
                    <Text>Claimed POAPs</Text>
                  </MenuItem>
                )}
                {collection.formMetadata.surveyTokenId && (
                  <MenuItem
                    padding="2"
                    onClick={() => {
                      setErc20Claimee(!erc20Claimee);
                    }}
                  >
                    <Text>Claimed ERC-20 Tokens</Text>
                  </MenuItem>
                )}
                {collection.formMetadata.mintkudosTokenId && (
                  <MenuItem
                    padding="2"
                    onClick={() => {
                      window.open(
                        `https://opensea.io/assets/matic/0x60576A64851C5B42e8c57E3E4A5cF3CF4eEb2ED6/${collection.formMetadata.mintkudosTokenId}`,
                        "_blank"
                      );
                    }}
                  >
                    <Text>Claimed Kudos</Text>
                  </MenuItem>
                )}
              </Stack>
            </MenuContainer>
          </Box>
        </motion.div>
      </Popover>
    </Stack>
  );
};

export default IncentiveFilter;
