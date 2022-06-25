import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import { storeImage } from "@/app/common/utils/ipfs";
import { updateCircle } from "@/app/services/UpdateCircle";
import { CircleType } from "@/app/types";
import { Box, Input, MediaPicker, Stack, Textarea } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Contributors from "../ContributorsModal/Contributors";
import DefaultPayment from "../DefaultPayment";

interface Props {
  handleClose: () => void;
}

export default function SettingsModal({ handleClose }: Props) {
  const queryClient = useQueryClient();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const [tab, setTab] = useState(0);
  const [visibilityTab, setVisibilityTab] = useState(0);
  const onTabClick = (id: number) => setTab(id);
  const onVisibilityTabClick = (id: number) => setVisibilityTab(id);

  const [name, setName] = useState(circle?.name || "");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState(circle?.description || "");
  const [logo, setLogo] = useState(circle?.avatar || "");

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await updateCircle(
      {
        name,
        description,
        avatar: logo,
        private: visibilityTab === 1,
      },
      circle?.id as string
    );
    setIsLoading(false);
    if (res) {
      handleClose();
      queryClient.setQueryData(["circle", cId], res);
    }
  };

  const uploadFile = async (file: File) => {
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file, "circleLogo");
      console.log({ imageGatewayURL });
      setLogo(imageGatewayURL);
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Circle Settings"
      handleClose={handleClose}
      height="40rem"
      size="large"
    >
      <Box display="flex" height="full">
        <Box
          width="1/4"
          borderRightWidth="0.375"
          paddingY="8"
          height="full"
          paddingRight="1"
        >
          <Tabs
            selectedTab={tab}
            onTabClick={onTabClick}
            tabs={["Info", "Integrations", "Payments", "Members"]}
            orientation="vertical"
            unselectedColor="transparent"
          />
        </Box>
        <Box width="3/4" padding="8">
          {tab === 0 && (
            <Stack>
              <Input
                label=""
                placeholder="Circle Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Textarea
                label=""
                placeholder="Circle Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <MediaPicker
                compact
                defaultValue={{
                  type: "image/png",
                  url: logo,
                }}
                label="Choose or drag and drop media"
                uploaded={!!logo}
                onChange={uploadFile}
                uploading={uploading}
                maxSize={10}
              />
              <Tabs
                selectedTab={visibilityTab}
                onTabClick={onVisibilityTabClick}
                tabs={["Public", "Private"]}
                orientation="horizontal"
                unselectedColor="transparent"
              />
              <Box marginTop="4" width="full">
                <PrimaryButton
                  onClick={onSubmit}
                  loading={isLoading}
                  disabled={uploading}
                >
                  Update Circle
                </PrimaryButton>
              </Box>
            </Stack>
          )}
          {/* {tab === 1 && <Integrations />} */}
          {tab === 2 && <DefaultPayment />}
          {tab === 3 && (
            <Stack>
              {/* <Box display="flex" flexDirection="row" marginLeft="8">
                {space.roles[user?.id as string] === 3 && <SpaceRoleMapping />}
                {space.roles[user?.id as string] === 3 && <InviteMemberModal />}
              </Box> */}
              <Contributors
                members={circle?.members.map((member) => member.id) || []}
                memberDetails={circle?.memberDetails || {}}
                roles={circle?.memberRoles || {}}
              />
            </Stack>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
