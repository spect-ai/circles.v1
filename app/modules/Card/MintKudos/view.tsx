import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useCredentials from "@/app/services/Credentials";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { KudosRequestType, KudosType, UserType } from "@/app/types";
import { Box, Stack, Textarea } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import SoulboundToken from "./SoulboundToken";

export default function MintKudos() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { title, project, assignees } = useLocalCard();
  const { circle } = useCircle();
  const { mintKudos, recordTokenId } = useCredentials();
  const { getMemberDetails } = useModalOptions();
  const { data: kudos } = useQuery<KudosType>("viewKudos", {
    enabled: false,
  });
  const [headlineContent, setHeadlineContent] = useState(
    `Thank you for your contribution to ${circle?.name}!`
  );

  const getEthAddress = () => {
    return assignees.map((userId) => {
      return getMemberDetails(userId)?.ethAddress;
    });
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen]);

  return (
    <>
      <PrimaryButton
        variant="tertiary"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        View Kudos 🎉
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal
            size="large"
            title="View Kudos 🎉"
            handleClose={() => setIsOpen(false)}
          >
            <Box
              display="flex"
              flexDirection="row"
              paddingTop="2"
              paddingRight="8"
              paddingLeft="8"
              paddingBottom="4"
            >
              <Box padding="1" paddingTop="4" width="2/3">
                <Stack>
                  <Textarea
                    label="Headline"
                    value={headlineContent}
                    onChange={(e) => setHeadlineContent(e.target.value)}
                    maxLength={50}
                  />
                  <PrimaryButton
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);

                      setLoading(false);
                    }}
                  >
                    Claim
                  </PrimaryButton>
                </Stack>
              </Box>
            </Box>
          </Modal>
        )}
      </AnimatePresence>{" "}
    </>
  );
}
