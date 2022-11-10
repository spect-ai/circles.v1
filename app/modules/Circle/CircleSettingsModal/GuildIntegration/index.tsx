import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateCircle } from "@/app/services/UpdateCircle";
import { guild } from "@guildxyz/sdk";
import { Box, Input, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useCircle } from "../../CircleContext";

export default function GuildIntegration() {
  const [isOpen, setIsOpen] = useState(false);
  const [guildName, setGuildName] = useState("");
  const { circle, setCircleData } = useCircle();
  const [loading, setLoading] = useState(false);
  return (
    <>
      {circle?.guildxyzId ? (
        <PrimaryButton disabled>
          Guild Connected: {circle?.guildxyzId}
        </PrimaryButton>
      ) : (
        <PrimaryButton onClick={() => setIsOpen(true)}>
          Connect Guild
        </PrimaryButton>
      )}
      <AnimatePresence>
        {isOpen && (
          <Modal title="Guild Integration" handleClose={() => setIsOpen(false)}>
            <Box padding="8">
              <Stack>
                <Input
                  label="Guild url"
                  placeholder="https://guild.xyz/test-server"
                  name={guildName}
                  onChange={(e) => setGuildName(e.target.value)}
                />
                <Box width="1/3">
                  <PrimaryButton
                    loading={loading}
                    onClick={async () => {
                      setLoading(true);
                      const guildSlug = guildName.replace(
                        /^http(s)?(:)?(\/\/)?|(\/\/)?(www\.)?guild.xyz(\/)/g,
                        ""
                      );
                      const guildServer = await guild.get(guildSlug);
                      const res = await updateCircle(
                        {
                          guildxyzId: guildServer.id,
                        },
                        circle?.id
                      );
                      console.log({ res });
                      setLoading(false);
                      setCircleData(res);
                      setIsOpen(false);
                    }}
                  >
                    Save
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
