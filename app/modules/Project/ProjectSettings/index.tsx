import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { fetchGuildChannels } from "@/app/services/Discord";
import { deleteProject, patchProject } from "@/app/services/Project";
import { SaveOutlined } from "@ant-design/icons";
import { Box, Button, IconCog, IconTrash, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PopoverOption } from "../../Card/OptionPopover";
import { useLocalProject } from "../Context/LocalProjectContext";

export default function ProjectSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { localProject: project, updateProject } = useLocalProject();
  const router = useRouter();
  const { circle: cId } = router.query;

  const [channels, setChannels] = useState<OptionType[]>();
  const [discordDiscussionChannel, setDiscordDiscussionChannel] = useState(
    project.discordDiscussionChannel
  );

  useEffect(() => {
    if (project?.id && isOpen) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [project, isOpen]);

  useEffect(() => {
    const getGuildChannels = async () => {
      const res = await fetchGuildChannels(project.parents[0].discordGuildId);
      setChannels(
        res.guildChannels.map((channel: any) => ({
          label: channel.name,
          value: channel.id,
        }))
      );
    };
    if (isOpen) {
      void getGuildChannels();
    }
  }, [isOpen]);

  const onSubmit = async () => {
    setIsLoading(true);
    const data = await patchProject(project.id, {
      name,
      description,
      discordDiscussionChannel,
    });
    setIsLoading(false);
    if (data) {
      updateProject(data);
      handleClose();
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    const data = await deleteProject(project.id);
    updateProject(null as any);
    console.log({ data });
    setIsLoading(false);
    handleClose();
    void router.push(`/${cId}`);
  };

  return (
    <>
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            title="Are you sure you want to delete the project, this cannot be undone?"
            handleClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              void onDelete();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
      <PopoverOption
        tourId="project-settings-button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Stack direction="horizontal" space="2">
          <IconCog />
          Settings
        </Stack>
      </PopoverOption>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Project Settings" handleClose={handleClose}>
            <Box width="full" padding="8">
              <Stack>
                <Box>
                  <Text variant="label">Name</Text>
                  <Input
                    label=""
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Box>
                <Box>
                  <Text variant="label">Description</Text>
                  <Input
                    label=""
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Box>
                <Box>
                  <Text variant="label">Discussion Channel</Text>
                  <Dropdown
                    options={channels as OptionType[]}
                    selected={{
                      label: discordDiscussionChannel?.name,
                      value: discordDiscussionChannel?.id,
                    }}
                    onChange={(channel) =>
                      setDiscordDiscussionChannel({
                        id: channel.value,
                        name: channel.label,
                      })
                    }
                  />
                </Box>
                <Stack direction="horizontal">
                  <Button
                    width="1/2"
                    size="small"
                    variant="secondary"
                    onClick={onSubmit}
                    loading={isLoading}
                    center
                    prefix={<SaveOutlined style={{ fontSize: "1.3rem" }} />}
                    disabled={!name}
                  >
                    Save
                  </Button>
                  <Button
                    width="1/2"
                    size="small"
                    variant="secondary"
                    onClick={() => setShowConfirm(true)}
                    center
                    tone="red"
                    prefix={<IconTrash />}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
