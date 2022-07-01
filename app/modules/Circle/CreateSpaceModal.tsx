import {
  Box,
  Button,
  IconPlus,
  IconPlusSmall,
  Input,
  Stack,
  Text,
  Textarea,
} from "degen";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import Tabs from "@/app/common/components/Tabs";
import Card from "@/app/common/components/Card";
import { useMutation, useQuery } from "react-query";
import { CircleType } from "@/app/types";
import PrimaryButton from "@/app/common/components/PrimaryButton";

type CreateWorkspaceDto = {
  name: string;
  description: string;
  private: boolean;
  parent: string;
};

interface Props {
  accordian: boolean;
}

function CreateSpaceModal({ accordian }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [visibilityTab, setVisibilityTab] = useState(0);
  const onVisibilityTabClick = (id: number) => setVisibilityTab(id);
  const close = () => setModalOpen(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle, refetch } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const { mutateAsync, isLoading } = useMutation(
    (circle: CreateWorkspaceDto) => {
      return fetch(`${process.env.API_HOST}/circle`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(circle),
        credentials: "include",
      });
    }
  );

  const onSubmit = () => {
    mutateAsync({
      name,
      description,
      private: visibilityTab === 1,
      parent: circle?.id as string,
    })
      .then(async (res) => {
        const resJson = await res.json();
        console.log({ resJson });
        void refetch();
        void router.push(`/${resJson.slug}`);
        void close();
      })
      .catch((err) => console.log({ err }));
  };

  return (
    <>
      <Loader loading={isLoading} text="Creating your workstream" />
      {accordian ? (
        <Button
          data-tour="circle-sidebar-create-space-button"
          size="small"
          variant="transparent"
          shape="circle"
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
        >
          <IconPlusSmall />
        </Button>
      ) : (
        <Card
          tourId="circle-create-space-card"
          height="32"
          dashed
          onClick={() => {
            setModalOpen(true);
          }}
        >
          <Box width="32">
            <Stack align="center">
              <Text align="center">Create Workstream</Text>
            </Stack>
          </Box>
        </Card>
      )}
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
                <Box width="full" marginTop="4">
                  <PrimaryButton onClick={onSubmit}>
                    Create Workspace
                  </PrimaryButton>
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
