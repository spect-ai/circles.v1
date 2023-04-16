import Accordian from "@/app/common/components/Accordian";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CircleType, UserType } from "@/app/types";
import { SendOutlined, UserAddOutlined } from "@ant-design/icons";
import { Box, Stack, Tag, Text, useTheme } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { expiryOptions, usesOptions } from "./constants";
import mixpanel from "@/app/common/utils/mixpanel";
import styled from "styled-components";
import { logError } from "@/app/common/utils/utils";

function InviteMemberModal({
  buttonIsSmallTransparent,
}: {
  buttonIsSmallTransparent?: boolean;
}) {
  const router = useRouter();
  const { mode } = useTheme();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [role, setRole] = useState({
    name: "member",
    role: "member",
  });
  const [uses, setUses] = useState({
    name: "No Limit",
    uses: 1000,
  });
  const [expiry, setExpiry] = useState({
    name: "7 Days",
    expiry: 604800,
  });
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions =
    circle &&
    Object.keys(circle.roles).map((role) => ({
      name: role,
      role: role,
    }));
  return (
    <>
      {buttonIsSmallTransparent && (
        <Box width="1/2">
          <CustomButton
            cursor="pointer"
            mode={mode}
            onClick={() => {
              setIsOpen(true);
              console.log(process.env.NODE_ENV);
              process.env.NODE_ENV === "production" &&
                mixpanel.track("Invite Open", {
                  circle: cId,
                  user: currentUser?.username,
                });
            }}
          >
            <Box display="flex" flexDirection="row" alignItems="center" gap="2">
              <Text>
                <UserAddOutlined />
              </Text>

              <Text> Invite</Text>
            </Box>
          </CustomButton>
        </Box>
      )}
      {!buttonIsSmallTransparent && (
        <Box width="full">
          <PrimaryButton
            tourId="invite-member-button"
            onClick={() => {
              setIsOpen(true);
              console.log(process.env.NODE_ENV);
              process.env.NODE_ENV === "production" &&
                mixpanel.track("Invite Open", {
                  circle: cId,
                  user: currentUser?.username,
                });
            }}
            icon={<UserAddOutlined />}
          >
            Invite
          </PrimaryButton>
        </Box>
      )}
      <AnimatePresence>
        {isOpen && (
          <Modal
            size="small"
            title="Create Invite"
            handleClose={handleClose}
            zIndex={2}
          >
            <Box padding="8">
              <Stack>
                <Text variant="label" align="left">
                  Role
                </Text>
                <Stack
                  direction="horizontal"
                  align="flex-start"
                  justify="flex-start"
                  wrap
                >
                  {roleOptions?.map((option) => (
                    <Box
                      key={option.role}
                      cursor="pointer"
                      onClick={() => setRole(option)}
                    >
                      <Tag
                        tone={
                          role?.name === option.name ? "accent" : "secondary"
                        }
                        hover
                      >
                        <Box paddingX="2">{option.name}</Box>
                      </Tag>
                    </Box>
                  ))}
                </Stack>
                <Accordian name="Advance options" defaultOpen={false}>
                  <Stack>
                    <Text align="left" variant="label">
                      Uses
                    </Text>
                    <Stack
                      direction="horizontal"
                      align="flex-start"
                      justify="flex-start"
                      wrap
                    >
                      {usesOptions.map((option) => (
                        <motion.button
                          key={option.name}
                          onClick={() => setUses(option)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0rem",
                          }}
                        >
                          <Tag
                            tone={
                              uses?.name === option.name
                                ? "accent"
                                : "secondary"
                            }
                          >
                            <Box paddingX="2">{option.name}</Box>
                          </Tag>
                        </motion.button>
                      ))}
                    </Stack>
                    <Text align="left" variant="label">
                      Expiry
                    </Text>
                    <Stack
                      direction="horizontal"
                      align="flex-start"
                      wrap
                      justify="flex-start"
                    >
                      {expiryOptions.map((option) => (
                        <motion.button
                          key={option.name}
                          whileHover={{
                            scale: 1.03,
                          }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setExpiry(option)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0rem",
                          }}
                        >
                          <Tag
                            tone={
                              expiry?.name === option.name
                                ? "accent"
                                : "secondary"
                            }
                          >
                            <Box paddingX="2">{option.name}</Box>
                          </Tag>
                        </motion.button>
                      ))}
                    </Stack>
                  </Stack>
                </Accordian>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                  gap="2"
                  marginTop="4"
                >
                  <PrimaryButton
                    loading={isLoading}
                    onClick={() => {
                      const expire =
                        new Date().getTime() + expiry.expiry * 1000;
                      setIsLoading(true);
                      fetch(
                        `${process.env.API_HOST}/circle/v1/${circle?.id}/invite`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            roles: [role.role],
                            uses: uses.uses,
                            expires: new Date(expire).toISOString(),
                          }),
                          credentials: "include",
                        }
                      )
                        .then(async (res) => {
                          console.log({ res });
                          const invite = await res.text();
                          console.log({ invite });
                          if (res.ok) {
                            const link = `${window.location.origin}?inviteCode=${invite}&circleId=${circle?.id}`;
                            void navigator.clipboard.writeText(link);
                            toast("Invite link copied", {
                              theme: "dark",
                            });
                            setIsLoading(false);
                            setIsOpen(false);
                          } else {
                            logError("Something went wrong generating invite");
                            setIsLoading(false);
                          }
                        })
                        .catch((err) => {
                          console.log({ err });
                          setIsLoading(false);
                        });
                    }}
                  >
                    Generate Link
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

export default InviteMemberModal;

export const CustomButton = styled(Box)<{ mode: string }>`
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  transition: all 0.3s ease-in-out;
  padding: 0.5rem 0.5rem;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
`;
