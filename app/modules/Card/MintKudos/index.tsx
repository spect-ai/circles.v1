import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useCredentials from "@/app/services/Credentials";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { KudosRequestType, KudosType, UserType } from "@/app/types";
import { Box, Stack, Textarea } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
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
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
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
  return (
    <>
      <PrimaryButton
        variant="tertiary"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Mint Kudos 🎉
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal
            size="large"
            title="Mint Kudos 🎉"
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

                      const res = await mintKudos({
                        headline: headlineContent,
                        description: title,
                        creator: currentUser?.ethAddress as string,
                        links: ["https://github.com/"],
                        contributors: getEthAddress(),
                      } as KudosRequestType);
                      if (res) {
                        recordTokenId(res.operationId);
                      }
                      setLoading(false);
                      if (res) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    Mint
                  </PrimaryButton>
                </Stack>
              </Box>
              <Box width="1/3" paddingRight="8" paddingBottom="4">
                <SoulboundToken
                  content={`${headlineContent}`}
                  issuedBy={`${circle?.name}`}
                  issuedOn={new Date().toISOString().slice(0, 10)}
                  issuerAvatar={`${circle?.avatar}`}
                />
              </Box>
            </Box>
          </Modal>
        )}
      </AnimatePresence>{" "}
    </>
  );
}
