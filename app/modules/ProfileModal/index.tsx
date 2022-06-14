import Modal from "@/app/common/components/Modal";
import { Box, Button, Input, MediaPicker, Stack, Text } from "degen";
import React from "react";
import { useQuery } from "react-query";
import { useDisconnect } from "wagmi";

type Props = {
  handleClose: () => void;
};

export default function ProfileModal({ handleClose }: Props) {
  const { disconnect } = useDisconnect();
  const { data: currentUser } = useQuery<User>("getMyUser", {
    enabled: false,
  });
  return (
    <Modal title="Profile" handleClose={handleClose}>
      <Box padding="8">
        <Stack>
          <Text variant="label">Profile Picture</Text>
          <MediaPicker
            compact
            // defaultValue={{
            //   type: "image/png",
            //   url: avatar,
            // }}
            label="Choose or drag and drop media"
            // uploaded={!!avatar}
            // onChange={uploadFile}
            // uploading={uploading}
          />
          <Text variant="label">Username</Text>
          <Input
            label=""
            placeholder="Username"
            value={currentUser?.username}
            // onChange={(e) => setUsername(e.target.value)}
            // onBlur={() => {
            //   user?.set("username", username);
            //   user?.save();
            //   toast("Profile updated", {
            //     theme: "dark",
            //   });
            // }}
          />
          {/* <Button
            size="small"
            variant="secondary"
            width="full"
            onClick={() => {
              router.push(
                `https://discord.com/api/oauth2/authorize?client_id=942494607239958609&redirect_uri=${
                  process.env.DEV_ENV === "local"
                    ? "http%3A%2F%2Flocalhost%3A3000%2F"
                    : "https%3A%2F%2Ftribes.spect.network%2F"
                }&response_type=code&scope=identify`
              );
            }}
          >
            <Text>
              {user?.attributes.discordId
                ? "Discord Connected"
                : "Link Discord"}
            </Text>
          </Button> */}
          <Box marginTop="6" />
          <Button
            size="small"
            width="full"
            variant="tertiary"
            onClick={() => {
              disconnect();
              handleClose();
              localStorage.removeItem("web3token");
            }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
