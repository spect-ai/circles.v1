import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, useTheme, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";

export default function CreateCredentials() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] =
    useState<"pickType" | "pickReceipient" | "create">("create");
  const [credentialType, setCredentialType] =
    useState<"soulbound" | "vc" | "poap" | "zkbadge">("soulbound");
  const { mode } = useTheme();
  return (
    <Box>
      <PrimaryButton
        onClick={() => {
          setModalMode("pickType");
          setIsOpen(true);
        }}
      >
        Create Credential
      </PrimaryButton>

      {isOpen && (
        <AnimatePresence>
          {modalMode === "pickType" && (
            <Modal
              size="medium"
              title="Pick Credential Type"
              handleClose={() => setIsOpen(false)}
              zIndex={2}
            >
              <Box
                display="flex"
                flexDirection={{
                  xs: "column",
                  md: "row",
                }}
                padding={{
                  xs: "4",
                  md: "8",
                }}
                justifyContent="center"
                alignItems="flex-start"
                width="full"
              >
                <Box display="flex" flexDirection="column" width="full">
                  <CredentialTypeCard
                    mode={mode}
                    selected={credentialType === "soulbound"}
                    onClick={() => {
                      setModalMode("pickReceipient");
                      setCredentialType("soulbound");
                    }}
                  >
                    <Text variant="large" weight="semiBold">
                      {" "}
                      Soulbound Token{" "}
                    </Text>
                    <Box
                      display="flex"
                      flexDirection="row"
                      gap="2"
                      justifyContent="flex-end"
                    >
                      <Text variant="small"> Powered by Mintkudos </Text>
                    </Box>
                  </CredentialTypeCard>
                  <CredentialTypeCard
                    mode={mode}
                    selected={credentialType === "vc"}
                    onClick={() => {
                      setModalMode("pickReceipient");
                      setCredentialType("vc");
                    }}
                  >
                    <Text variant="large" weight="semiBold">
                      {" "}
                      Verifiable Credential{" "}
                    </Text>
                    <Box
                      display="flex"
                      flexDirection="row"
                      gap="2"
                      justifyContent="flex-end"
                    >
                      <Text variant="small"> Powered by Gitcoin Passport </Text>
                    </Box>
                  </CredentialTypeCard>
                  <CredentialTypeCard
                    mode={mode}
                    selected={credentialType === "poap"}
                    onClick={() => {
                      setModalMode("pickReceipient");
                      setCredentialType("poap");
                    }}
                  >
                    <Text variant="large" weight="semiBold">
                      {" "}
                      POAP{" "}
                    </Text>
                  </CredentialTypeCard>
                  {/* <CredentialTypeCard mode={mode}>
                    <Text variant="large" weight="semiBold"> Zk-badges </Text>
                    </CredentialTypeCard> */}
                </Box>
              </Box>
            </Modal>
          )}
          {modalMode === "pickReceipient" && (
            <Modal
              size="medium"
              title="Pick Receipient"
              handleClose={() => setIsOpen(false)}
              zIndex={2}
            >
              <Box
                padding={{
                  xs: "4",
                  md: "8",
                }}
              >
                <Box
                  display="flex"
                  flexDirection={{
                    xs: "column",
                    md: "row",
                  }}
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  width="full"
                  gap="4"
                  marginBottom="16"
                >
                  <PrimaryButton variant="tertiary">
                    Pick Circle Contributors
                  </PrimaryButton>
                  <PrimaryButton variant="tertiary">
                    Pick From Collection
                  </PrimaryButton>
                  <PrimaryButton variant="tertiary">
                    Add Ethereum Addresses
                  </PrimaryButton>
                </Box>
                <Box width="64">
                  <PrimaryButton
                    variant="tertiary"
                    onClick={() => {
                      setModalMode("pickType");
                    }}
                  >
                    Back
                  </PrimaryButton>
                </Box>
              </Box>
            </Modal>
          )}
        </AnimatePresence>
      )}
    </Box>
  );
}

export const CredentialTypeCard = styled(Box)<{
  mode: string;
  selected: boolean;
}>`
  display: flex;
  flex-direction: column;
  min-height: 6vh;
  margin-top: 0.5rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.selected
        ? "rgb(191, 90, 242)"
        : props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 100%;
`;
