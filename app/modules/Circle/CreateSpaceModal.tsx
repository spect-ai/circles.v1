import { Box, Button, IconPlus, Input, Stack, Text, Textarea } from "degen";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import Tabs from "@/app/common/components/Tabs";
import Card from "@/app/common/components/Card";

function CreateSpaceModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visibilityTab, setVisibilityTab] = useState(0);
  const onVisibilityTabClick = (id: number) => setVisibilityTab(id);
  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);

  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const onSubmit = () => {
    // setIsLoading(true);
    // runMoralisFunction('initBoard', {
    //   name,
    //   teamId: tribe.teamId,
    //   isPrivate: visibilityTab === 1,
    //   description,
    // })
    //   .then((res: any) => {
    //     if (res) {
    //       router.push(`/tribe/${tribe.teamId}/space/${res.id}`, undefined);
    //     }
    //     setIsLoading(false);
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //     setIsLoading(false);
    //   });
  };

  return (
    <>
      <Loader loading={isLoading} text="Creating your space" />
      <Card
        height="32"
        dashed
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <Box width="32">
          <Stack align="center">
            <Text align="center">Create Workspace</Text>
          </Stack>
        </Box>
      </Card>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalOpen && (
          <Modal handleClose={close} title="Create Workspace">
            <Box width="full" padding="8">
              <Stack>
                <Input
                  label=""
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                  label=""
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Tabs
                  selectedTab={visibilityTab}
                  onTabClick={onVisibilityTabClick}
                  tabs={["Public", "Private"]}
                  orientation="horizontal"
                  unselectedColor="transparent"
                />
                <Box display="flex" justifyContent="center">
                  <Button
                    width="1/2"
                    size="small"
                    variant="primary"
                    onClick={onSubmit}
                  >
                    <Text>Create Workspace</Text>
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default CreateSpaceModal;
