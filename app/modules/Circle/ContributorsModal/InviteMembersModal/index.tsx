import Accordian from "@/app/common/components/Accordian";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CircleType } from "@/app/types";
import { SendOutlined } from "@ant-design/icons";
import { Box, Stack, Tag, Text } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { expiryOptions, usesOptions } from "./constants";

function InviteMemberModal() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [role, setRole] = useState<any>({
    name: "member",
    role: "member",
  });
  const [uses, setUses] = useState<any>({
    name: "No Limit",
    uses: 1000,
  });
  const [expiry, setExpiry] = useState<any>({
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
      <Box width="full" marginBottom="2">
        <PrimaryButton
          tourId="invite-member-button"
          onClick={() => {
            setIsOpen(true);
          }}
          icon={<SendOutlined />}
        >
          Invite
        </PrimaryButton>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Create Invite" handleClose={handleClose}>
            <Box
              padding="8"
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="full"
            >
              <Stack>
                <Text align="center">Role</Text>
                <Stack direction="horizontal">
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
                    <Text align="center">Uses</Text>
                    <Stack direction="horizontal">
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
                    <Text align="center">Expiry</Text>
                    <Stack direction="horizontal">
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
                <PrimaryButton
                  loading={isLoading}
                  onClick={() => {
                    const expire = new Date().getTime() + expiry.expiry * 1000;
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
                          toast.error("Something went wrong", {
                            theme: "dark",
                          });
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
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default InviteMemberModal;
