import Modal from "@/app/common/components/Modal";
import Tabs from "@/app/common/components/Tabs";
import { storeImage } from "@/app/common/utils/ipfs";
import { CircleType, MemberDetails } from "@/app/types";
import { Box, Button, Input, MediaPicker, Stack, Text, Textarea } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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
  const { circle: cId, project: pId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { mutateAsync, isLoading } = useMutation(
    (circleUpdate: Partial<CircleType>) => {
      return fetch(`http://localhost:3000/circle/${circle?.id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(circleUpdate),
        credentials: "include",
      });
    }
  );

  const [tab, setTab] = useState(0);
  const [visibilityTab, setVisibilityTab] = useState(0);
  const onTabClick = (id: number) => setTab(id);
  const onVisibilityTabClick = (id: number) => setVisibilityTab(id);

  const [name, setName] = useState(circle?.name || "");
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState(circle?.description || "");
  const [logo, setLogo] = useState(circle?.avatar || "");

  const onSubmit = () => {
    mutateAsync({
      name,
      description,
      avatar: logo,
      private: visibilityTab === 1,
    })
      .then(async (res) => {
        const updatedCircle = await res.json();
        console.log({ updatedCircle });
        queryClient.setQueryData(["circle", cId], updatedCircle);
        handleClose();
        toast("Circle updated successfully", { theme: "dark" });
      })
      .catch((err) => {
        console.log({ err });
      });
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
          paddingX="1"
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
              <Box display="flex" justifyContent="center" marginTop="4">
                <Button
                  width="1/2"
                  size="small"
                  variant="secondary"
                  onClick={onSubmit}
                  loading={isLoading}
                  disabled={uploading}
                >
                  <Text>Update Circle</Text>
                </Button>
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
