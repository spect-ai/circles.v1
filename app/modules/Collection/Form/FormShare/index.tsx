import { Box, Heading, IconCopy, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { Embed } from "../../Embed";
import { ShareOnDiscord } from "../../ShareOnDiscord";
import { useLocalCollection } from "../../Context/LocalCollectionContext";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { FaDiscord } from "react-icons/fa";
import { ImEmbed2 } from "react-icons/im";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import styled from "@emotion/styled";
import PublicForm from "@/app/modules/PublicForm";

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 0px;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 1279px) {
    height: calc(100vh - 32rem);
  }
  height: calc(100vh - 24rem);
  border-radius: 1rem;
`;

const FormShare = () => {
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [shareOnDiscordOpen, setShareOnDiscordOpen] = useState(false);

  const { localCollection: collection } = useLocalCollection();
  const { formActions } = useRoleGate();

  return (
    <Box>
      <AnimatePresence>
        {/* {isAddFieldOpen && (
          <AddField handleClose={() => setIsAddFieldOpen(false)} />
        )} */}
        {isEmbedModalOpen && (
          <Embed
            setIsOpen={setIsEmbedModalOpen}
            embedRoute={`https://circles.spect.network/r/${collection.slug}/embed?`}
          />
        )}

        {shareOnDiscordOpen && (
          <ShareOnDiscord
            isOpen={shareOnDiscordOpen}
            setIsOpen={setShareOnDiscordOpen}
          />
        )}
      </AnimatePresence>
      <Stack align="center">
        <Heading>Multiple ways to share your form with the world</Heading>
        <div className="-translate-y-16 flex flex-col items-center w-full">
          <div className="w-full xl:w-2/3 scale-75 ">
            <ScrollContainer>
              <PublicForm form={collection} preview />
            </ScrollContainer>
          </div>
          <Stack direction="horizontal">
            <PrimaryButton
              icon={<IconCopy size="5" />}
              onClick={() => {
                void navigator.clipboard.writeText(
                  `https://circles.spect.network/r/${collection?.slug}`
                );
                toast.success("Copied to clipboard");
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Share Form", {
                    form: collection?.name,
                  });
              }}
            >
              Copy Link
            </PrimaryButton>
            <PrimaryButton
              icon={<FaDiscord size="24" />}
              onClick={() => {
                if (!formActions("manageSettings")) {
                  toast.error(
                    "You don't have permissions to share this form, your role needs to have manage settings permissions"
                  );
                  return;
                }
                setShareOnDiscordOpen(true);
              }}
            >
              Share on Discord
            </PrimaryButton>
            <PrimaryButton
              icon={<ImEmbed2 size="24" />}
              onClick={() => {
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Form Embed", {
                    collection: collection?.slug,
                    circle: collection?.parents[0].slug,
                  });
                setIsEmbedModalOpen(true);
              }}
            >
              Embed
            </PrimaryButton>
          </Stack>
        </div>
      </Stack>
    </Box>
  );
};

export default FormShare;
