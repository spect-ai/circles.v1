import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import { fetchGuildChannels } from "@/app/services/Discord";
import { archiveProject, patchProject } from "@/app/services/Project";
import {
  AlignLeftOutlined,
  AppstoreOutlined,
  BarsOutlined,
  SaveOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Box, Button, IconTrash, Input, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useLocalProject } from "../Context/LocalProjectContext";
import { ViewType } from "@/app/types";

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};

interface IconProps {
  icon: ViewType;
  layout: ViewType;
  setLayout: (layout: ViewType) => void;
}

const LayoutIcons = ({ icon, layout, setLayout }: IconProps) => {
  return (
    <Box
      cursor="pointer"
      color="textSecondary"
      paddingX="1.5"
      paddingY="1"
      borderRadius="large"
      backgroundColor={layout == icon ? "accentSecondary" : "background"}
      onClick={() => setLayout(icon)}
    >
      {icon == "Board" && <AppstoreOutlined style={{ fontSize: "1.1rem" }} />}
      {icon == "List" && <BarsOutlined style={{ fontSize: "1.1rem" }} />}
      {icon == "Gantt" && <AlignLeftOutlined style={{ fontSize: "1.1rem" }} />}
      {icon == "Table" && <TableOutlined style={{ fontSize: "1.1rem" }} />}
    </Box>
  );
};

export default function ProjectSettings({ setIsOpen }: Props) {
  const handleClose = () => setIsOpen(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { localProject: project, updateProject } = useLocalProject();
  const router = useRouter();
  const { circle: cId } = router.query;
  const [defaultView, setDefaultView] = useState<ViewType>(project.defaultView);

  const [channels, setChannels] = useState<OptionType[]>();
  const [discordDiscussionChannel, setDiscordDiscussionChannel] = useState(
    project.discordDiscussionChannel
  );

  useEffect(() => {
    if (project?.id) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [project]);

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
    if (project.parents[0].discordGuildId) {
      void getGuildChannels();
    }
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);
    const data = await patchProject(project.id, {
      name,
      description,
      discordDiscussionChannel,
      defaultView,
    });
    setIsLoading(false);
    if (data) {
      updateProject(data);
      handleClose();
    }
  };

  const onArchive = async () => {
    setIsLoading(true);
    const data = await archiveProject(project.id);
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
            title="Are you sure you want to archive the project?"
            handleClose={() => setShowConfirm(false)}
            onConfirm={() => {
              setShowConfirm(false);
              void onArchive();
            }}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>

      <Modal title="Project Settings" handleClose={handleClose} zIndex={2}>
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
            <Box
              display="flex"
              flexDirection="row"
              padding="1"
              paddingBottom="2"
              justifyContent="space-between"
            >
              <Text variant="label">Default Layout</Text>
              <Box display="flex" flexDirection="row" gap={"2"}>
                <LayoutIcons
                  icon="Board"
                  layout={defaultView}
                  setLayout={setDefaultView}
                />
                <LayoutIcons
                  icon="List"
                  layout={defaultView}
                  setLayout={setDefaultView}
                />
                <LayoutIcons
                  icon="Gantt"
                  layout={defaultView}
                  setLayout={setDefaultView}
                />
                <LayoutIcons
                  icon="Table"
                  layout={defaultView}
                  setLayout={setDefaultView}
                />
              </Box>
            </Box>
            {project.parents[0].discordGuildId && (
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
                  multiple={false}
                />
              </Box>
            )}
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
                Archive
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
