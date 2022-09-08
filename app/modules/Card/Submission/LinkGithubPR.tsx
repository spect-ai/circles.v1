import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { UserType } from "@/app/types";
import { CopyOutlined, GithubOutlined } from "@ant-design/icons";
import { Box, Button, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";

export default function LinkGithubPR() {
  const [isOpen, setIsOpen] = useState(false);
  const { card } = useLocalCard();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { circle } = useCircle();

  return (
    <>
      <Box width="1/3" marginBottom="2">
        <PrimaryButton
          onClick={() => setIsOpen(true)}
          icon={<GithubOutlined style={{ fontSize: "1.5rem" }} />}
          variant="tertiary"
        >
          Link PR
        </PrimaryButton>
        <AnimatePresence>
          {isOpen && (
            <Modal title="Link Github PR" handleClose={() => setIsOpen(false)}>
              <Box padding="8">
                <Stack>
                  {!currentUser?.githubId && (
                    <Text color="red" weight="semiBold">
                      You need to connect your Github account to link a PR.
                    </Text>
                  )}
                  {!circle?.githubRepos.length && (
                    <Text color="red" weight="semiBold">
                      The circle needs to connect a Github repo to link a PR.
                    </Text>
                  )}
                  <Text variant="label">
                    Add the following text to your PR title
                  </Text>
                  <Box
                    backgroundColor="accentSecondary"
                    padding="2"
                    borderRadius="2xLarge"
                  >
                    <Stack direction="horizontal" align="center">
                      <Text weight="semiBold">
                        Spect [&#34;{card?.slug}&#34;] title
                      </Text>
                      <Button
                        shape="circle"
                        size="small"
                        variant="tertiary"
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            `Spect [${card?.slug}] title`
                          );
                          toast("Copied to clipboard!", {
                            theme: "dark",
                          });
                        }}
                      >
                        <CopyOutlined />
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Modal>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
}
