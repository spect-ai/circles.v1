import Accordian from "@/app/common/components/Accordian";
import Modal from "@/app/common/components/Modal";
import { CircleType } from "@/app/types";
import { SendOutlined } from "@ant-design/icons";
import { Box, Button, Stack, Tag, Text } from "degen";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { expiryOptions, roleOptions, usesOptions } from "./constants";

function InviteMemberModal() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [role, setRole] = useState<any>({
    name: "Member",
    role: 0,
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
  return (
    <>
      <Box width="1/2">
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
          width="full"
          size="small"
          variant="secondary"
          prefix={<SendOutlined />}
          center
        >
          Invite Member
        </Button>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Create Invite" handleClose={handleClose}>
            <Box
              padding="8"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Stack>
                <Text align="center">Role</Text>
                <Stack direction="horizontal">
                  {roleOptions.map((option) => (
                    <motion.button
                      key={option.name}
                      whileHover={{
                        scale: 1.03,
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setRole(option)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0rem",
                      }}
                    >
                      <Tag
                        tone={
                          role?.name === option.name ? "accent" : "secondary"
                        }
                      >
                        <Box paddingX="2">{option.name}</Box>
                      </Tag>
                    </motion.button>
                  ))}
                </Stack>
                <Accordian name="Advance options" defaultOpen={false}>
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
                            uses?.name === option.name ? "accent" : "secondary"
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
                </Accordian>
                <Button
                  loading={isLoading}
                  size="small"
                  width="full"
                  variant="secondary"
                >
                  Generate Link
                </Button>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default InviteMemberModal;
