import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import { Box, IconCog, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import Access from "./Access";
import Curation from "./Curation";
import General from "./General";

function FormSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <>
      <PrimaryButton icon={<IconCog />} onClick={() => setIsOpen(true)}>
        Form Settings
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal
            handleClose={() => setIsOpen(false)}
            title="Form Settings"
            size="large"
          >
            <Box padding="8">
              <Stack direction="horizontal">
                <Box width="1/4" paddingY="8" paddingRight="1">
                  <Tabs
                    selectedTab={selectedTab}
                    onTabClick={(tab) => setSelectedTab(tab)}
                    tabs={["General", "Access", "Curation"]}
                    orientation="vertical"
                    unselectedColor="transparent"
                  />
                </Box>
                <ScrollContainer
                  width="3/4"
                  paddingX={{
                    xs: "2",
                    md: "4",
                    lg: "8",
                  }}
                  paddingY="4"
                >
                  {selectedTab === 0 && <General />}
                  {selectedTab === 1 && <Access />}
                  {selectedTab === 2 && <Curation />}
                </ScrollContainer>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 5px;
  }
  height: 32rem;
  overflow-y: auto;
`;

export default FormSettings;
