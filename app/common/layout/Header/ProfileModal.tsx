import Modal from "@/app/common/components/Modal";
import { Avatar, Box, Button, Input, MediaPicker, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDisconnect } from "wagmi";

export default function ProfileModal() {
  const { disconnect } = useDisconnect();
  const { data: currentUser } = useQuery<User>("getMyUser", {
    enabled: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const queryClient = useQueryClient();
  return (
    <>
      <Button shape="circle" size="small" onClick={() => setIsOpen(true)}>
        <Avatar
          src={currentUser?.avatar}
          placeholder={!currentUser?.avatar}
          label={currentUser?.username || ""}
          size="9"
        />
      </Button>
      <AnimatePresence>
        {isOpen && (
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
                  onClick={async () => {
                    await fetch("http://localhost:3000/auth/disconnect", {
                      method: "POST",
                      credentials: "include",
                    });
                    disconnect();
                    queryClient.setQueryData("getMyUser", null);
                    await queryClient.invalidateQueries("getMyUser");
                    handleClose();
                  }}
                >
                  Logout
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
