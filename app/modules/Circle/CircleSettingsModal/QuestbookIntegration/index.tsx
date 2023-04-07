/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { fetchGuildChannels } from "@/app/services/Discord";
import { updateCircle } from "@/app/services/UpdateCircle";
import { DiscordChannel } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../CircleContext";

const ConnectQuestbook = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { circle, setCircleData } = useCircle();

  const [workspaceUrl, setWorkspaceUrl] = useState("");
  const [milestoneProject, setMilestoneProject] = useState({} as OptionType);
  const [applicantProject, setApplicantProject] = useState({} as OptionType);
  const [projectOptions, setProjectOptions] = useState([] as OptionType[]);
  const [channels, setChannels] = useState<OptionType[]>();
  const [discordGrantNotifChannel, setDiscordGrantNotifChannel] = useState(
    {} as DiscordChannel
  );

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    let workspaceId;
    try {
      const url = new URL(workspaceUrl);
      workspaceId = url.searchParams.get("daoId");
    } catch (err) {
      toast.error("Invalid Workspace Url");
      setIsLoading(false);
      return;
    }

    if (!workspaceId) {
      toast.error("DAO ID not found in Url");
      setIsLoading(false);
      return;
    }
    const res = await updateCircle(
      {
        questbookWorkspaceId: workspaceId,
        questbookWorkspaceUrl: workspaceUrl,
        grantMilestoneProject: milestoneProject?.value,
        grantApplicantProject: applicantProject?.value,
        grantNotificationChannel: discordGrantNotifChannel,
      },
      circle?.id || ""
    );
    setIsLoading(false);
    if (res) {
      setCircleData(res);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (circle?.projects) {
      const options = Object.values(circle?.projects).map((p) => {
        if (circle.grantApplicantProject === p.id) {
          setApplicantProject({
            label: p.name,
            value: p.id,
          });
        }
        if (circle.grantMilestoneProject === p.id) {
          setMilestoneProject({
            label: p.name,
            value: p.id,
          });
        }
        return {
          label: p.name,
          value: p.id,
        };
      });
      setProjectOptions(options);
      setWorkspaceUrl(circle.questbookWorkspaceUrl || "");
    }
  }, [circle]);

  useEffect(() => {
    const getGuildChannels = async () => {
      const res = await fetchGuildChannels(circle?.discordGuildId || "");
      setChannels(
        res.guildChannels.map((channel: any) => ({
          label: channel.name,
          value: channel.id,
        }))
      );
    };
    if (circle?.discordGuildId) {
      getGuildChannels();
    }
    setDiscordGrantNotifChannel(
      circle?.grantNotificationChannel || ({} as DiscordChannel)
    );
  }, [circle]);

  return (
    <>
      <PrimaryButton onClick={() => setIsOpen(true)}>
        {workspaceUrl
          ? workspaceUrl
            ? "Questbook Connected"
            : "Connect Questbook"
          : "Connect Questbook"}
      </PrimaryButton>
      <AnimatePresence>
        {isOpen && (
          <Modal
            handleClose={() => setIsOpen(false)}
            title="Connect Questbook Workspace"
          >
            <Box padding="8">
              <Stack>
                <Box marginBottom="4">
                  <Text>1. Add Questbook Workspace Url</Text>
                  <Input
                    label=""
                    placeholder="Questbook workspace Url"
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value)}
                    inputMode="url"
                  />
                </Box>

                <Box marginBottom="4">
                  <Text>
                    2. Pick a project where approved grant applicants are added
                  </Text>
                  <Dropdown
                    options={projectOptions}
                    selected={applicantProject}
                    onChange={(value) => {
                      setApplicantProject(value);
                    }}
                    multiple={false}
                    portal={false}
                  />
                </Box>

                <Box marginBottom="4">
                  <Text>
                    3. Pick a project where grant milestones are added
                  </Text>
                  <Dropdown
                    options={projectOptions}
                    selected={milestoneProject}
                    onChange={(value) => {
                      setMilestoneProject(value);
                    }}
                    multiple={false}
                    portal={false}
                  />{" "}
                </Box>

                <Box marginBottom="4">
                  <Text>
                    4. Add a Discord channel for notifications when a grant
                    application is approved. Please connect a Discord server in
                    the Integrations section in Circle settings first.
                  </Text>
                  <Dropdown
                    options={channels as OptionType[]}
                    selected={{
                      label: discordGrantNotifChannel?.name,
                      value: discordGrantNotifChannel?.id,
                    }}
                    onChange={(channel) =>
                      setDiscordGrantNotifChannel({
                        id: channel.value,
                        name: channel.label,
                      })
                    }
                    multiple={false}
                    portal={false}
                  />
                </Box>

                <PrimaryButton
                  shape="circle"
                  onClick={onSubmit}
                  loading={isLoading}
                >
                  Save
                </PrimaryButton>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConnectQuestbook;
