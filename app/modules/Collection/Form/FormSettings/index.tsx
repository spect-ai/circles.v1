import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import { Box, Button, IconCog, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import Access from "./Access";
import General from "./General";
import mixpanel from "@/app/common/utils/mixpanel";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { toast } from "react-toastify";
import Archive from "@/app/modules/CollectionProject/Settings/Archive";

function FormSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { formActions } = useRoleGate();
  const { localCollection: collection } = useLocalCollection();
  return (
    <Box>
      <Button
        shape="circle"
        size="small"
        variant="secondary"
        center
        onClick={() => {
          process.env.NODE_ENV === "production" &&
            mixpanel.track("Form Settings", {
              user: currentUser?.username,
              form: collection.name,
            });
          if (formActions("manageSettings")) {
            setIsOpen(true);
          } else {
            toast.error(
              "Your role(s) doesn't have the permission to access this form's settings"
            );
          }
        }}
      >
        <IconCog />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal
            handleClose={() => setIsOpen(false)}
            title="Form Settings"
            size="large"
          >
            <Box
              padding={{
                xs: "2",
                md: "8",
              }}
            >
              <Stack direction="horizontal">
                <Box width="1/4" paddingY="8" paddingRight="1">
                  <Tabs
                    selectedTab={selectedTab}
                    onTabClick={(tab) => setSelectedTab(tab)}
                    tabs={["General", "Access", "Archive"]}
                    orientation="vertical"
                    unselectedColor="transparent"
                  />
                </Box>
                <ScrollContainer
                  width="3/4"
                  paddingX={{
                    xs: "0",
                    md: "4",
                    lg: "8",
                  }}
                  paddingY="4"
                >
                  {selectedTab === 0 && <General />}
                  {selectedTab === 1 && <Access />}
                  {selectedTab === 2 && <Archive />}
                </ScrollContainer>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
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
