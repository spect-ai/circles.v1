import Modal from "@/app/common/components/Modal";
import Tabs from "@/app/common/components/Tabs";
import { updateFormCollection } from "@/app/services/Collection";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Button, IconCog, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import Archive from "./Archive";
import General from "./General";
import Payments from "./Payments";

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 5px;
  }
  height: 20rem;
  overflow-y: auto;
`;

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [name, setName] = useState(collection.name);
  const [rewardField, setRewardField] = useState({
    value: collection.projectMetadata.payments?.rewardField || "",
    label: collection.projectMetadata.payments?.rewardField || "",
  });
  const [payeeField, setPayeeField] = useState({
    value: collection.projectMetadata.payments?.payeeField || "",
    label: collection.projectMetadata.payments?.payeeField || "",
  });

  const { formActions } = useRoleGate();

  useEffect(() => {
    setName(collection.name);
    setRewardField({
      value: collection.projectMetadata.payments?.rewardField || "",
      label: collection.projectMetadata.payments?.rewardField || "",
    });
    setPayeeField({
      value: collection.projectMetadata.payments?.payeeField || "",
      label: collection.projectMetadata.payments?.payeeField || "",
    });
  }, [collection]);

  return (
    <Box>
      <Button
        shape="circle"
        onClick={() => {
          if (formActions("manageSettings")) {
            setIsOpen(true);
          } else {
            toast.error(
              "Your role(s) doesn't have the permission to access this collection's settings"
            );
          }
        }}
        size="small"
        variant="transparent"
      >
        <Text variant="label">
          <IconCog />
        </Text>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Collection Settings"
            handleClose={() => {
              updateFormCollection(collection.id, {
                name,
                projectMetadata: {
                  ...collection.projectMetadata,
                  payments: {
                    rewardField: rewardField.value,
                    payeeField: payeeField.value,
                  },
                },
              })
                .then((res) => {
                  if (res.id) updateCollection(res);
                  else toast.error("Error updating collection name");
                })
                .catch(() => {
                  toast.error("Error updating collection name");
                });
              setIsOpen(false);
            }}
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
                    tabs={["General", "Payments", "Archive"]}
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
                  {selectedTab === 0 && (
                    <General name={name} setName={setName} />
                  )}
                  {selectedTab === 1 && (
                    <Payments
                      rewardField={rewardField}
                      setRewardField={setRewardField}
                      payeeField={payeeField}
                      setPayeeField={setPayeeField}
                    />
                  )}
                  {selectedTab === 2 && <Archive />}
                </ScrollContainer>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Settings;
