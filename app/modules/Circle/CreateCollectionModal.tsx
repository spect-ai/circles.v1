import { Box, Button, IconPlusSmall, Input, MediaPicker, Stack } from "degen";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Loader from "@/app/common/components/Loader";
import Modal from "@/app/common/components/Modal";
import Tabs from "@/app/common/components/Tabs";
import { useMutation } from "react-query";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import { useCircle } from "./CircleContext";

type CreateCollectionDto = {
  name: string;
  private: boolean;
  circleId: string;
  defaultView?: "form" | "table" | "kanban" | "list" | "gantt";
};

function CreateCollectionModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [visibilityTab, setVisibilityTab] = useState(0);
  const onVisibilityTabClick = (id: number) => setVisibilityTab(id);
  const close = () => setModalOpen(false);

  const [name, setName] = useState("");

  const router = useRouter();
  const { circle, fetchCircle } = useCircle();

  const { mutateAsync, isLoading } = useMutation(
    (circle: CreateCollectionDto) => {
      return fetch(`${process.env.API_HOST}/collection/v1`, {
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
      private: visibilityTab === 1,
      circleId: circle?.id,
      defaultView: "form", // TODO: Change this when collections are used as general purpose primitive
    })
      .then(async (res) => {
        const resJson = await res.json();
        console.log({ resJson });
        void router.push(`/${circle?.slug}/r/${resJson.slug}`);
        void close();
      })
      .catch((err) => console.log({ err }));
  };

  return (
    <>
      <Loader loading={isLoading} text="Creating your collection" />

      <Button
        data-tour="circle-create-workstream-button"
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
      <AnimatePresence>
        {modalOpen && (
          <Modal handleClose={close} title="Create Form">
            <Box width="full" padding="8">
              <Stack>
                <Input
                  label=""
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Tabs
                  selectedTab={visibilityTab}
                  onTabClick={onVisibilityTabClick}
                  tabs={["Public", "Private"]}
                  orientation="horizontal"
                  unselectedColor="transparent"
                />
                <Box width="full" marginTop="4">
                  <PrimaryButton
                    onClick={onSubmit}
                    disabled={name.length === 0}
                  >
                    Create Form
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

export default CreateCollectionModal;
