import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack, Text } from "degen";
import { useState } from "react";
import { useCircle } from "../../CircleContext";
import { updateCircle } from "@/app/services/UpdateCircle";
import ConnectZealyModal from "./ConnectZealyModal";
import { AnimatePresence } from "framer-motion";

export default function ConnectZealy() {
  const { circle, privateCredentials } = useCircle();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <PrimaryButton
        variant={
          privateCredentials?.zealySubdomain && privateCredentials?.zealyApiKey
            ? "tertiary"
            : "secondary"
        }
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {privateCredentials?.zealySubdomain && privateCredentials?.zealyApiKey
          ? "Zealy Connected"
          : "Connect Zealy"}
      </PrimaryButton>

      <AnimatePresence>
        {" "}
        {isOpen && <ConnectZealyModal setIsOpen={setIsOpen} isOpen={isOpen} />}
      </AnimatePresence>
    </Box>
  );
}
