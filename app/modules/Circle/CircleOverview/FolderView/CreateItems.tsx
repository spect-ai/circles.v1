import { createFolder } from "@/app/services/Folders";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, Stack, Text } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import { Trello } from "react-feather";
import { AiFillFolderAdd } from "react-icons/ai";
import { FaWpforms } from "react-icons/fa";
import { MdGroupWork } from "react-icons/md";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../../CircleContext";
import CreateCollectionModal from "../../CreateCollectionModal";
import CreateSpaceModal from "../../CreateSpaceModal";
import TemplateModal from "./TemplateModal";

type Props = {};

export default function CreateItems({}: Props) {
  const [createCollectionModalOpen, setCreateCollectionModalOpen] =
    useState(false);
  const [createWorkstreamModalOpen, setCreateWorkstreamModalOpen] =
    useState(false);
  const [collectionType, setCollectionType] = useState<0 | 1>(0);
  const { canDo } = useRoleGate();
  const { circle, setCircleData } = useCircle();

  const [loading, setLoading] = useState(false);

  const createNewFolder = useCallback(async () => {
    setLoading(true);
    if (circle) {
      const payload = {
        name: `Folder-${circle?.folderOrder?.length + 1}`,
        avatar: "New Avatar",
        contentIds: [],
      };
      const res = await toast.promise(createFolder(payload, circle?.id), {
        pending: "Creating a new folder...",
        success: {
          render: "Folder created successfully",
        },
        error: "Some error occured🤯",
      });
      console.log({ res });
      if (res?.id) {
        setCircleData(res);
      } else {
        toast.error("Something went wrong while creating a new folder");
      }
      setLoading(false);
    }
  }, [circle?.folderOrder?.length, circle?.id]);
  return (
    <Box paddingX="2">
      <AnimatePresence>
        {createCollectionModalOpen && (
          <CreateCollectionModal
            setCollectionModal={setCreateCollectionModalOpen}
            collectionType={collectionType}
            folderId={circle?.folderOrder[0]}
          />
        )}
        {createWorkstreamModalOpen && (
          <CreateSpaceModal
            setWorkstreamModal={setCreateWorkstreamModalOpen}
            folderId={circle?.folderOrder[0]}
          />
        )}
      </AnimatePresence>
      {canDo("createNewForm") && (
        <Grid>
          {Items.map((item, index) => (
            <Item
              key={index}
              name={item.name}
              Icon={item.icon}
              description={item.description}
              onClick={() => {
                if (item.component === "form") {
                  setCollectionType(0);
                  setCreateCollectionModalOpen(true);
                } else if (item.component === "project") {
                  setCollectionType(1);
                  setCreateCollectionModalOpen(true);
                } else if (item.component === "workstream") {
                  setCreateWorkstreamModalOpen(true);
                } else if (item.component === "folder") {
                  createNewFolder();
                }
              }}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
}

const Item = ({ name, Icon, description, onClick }: any) => {
  return (
    <Stack>
      <motion.div
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.1 },
        }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        style={{ height: "100%" }}
      >
        <Box
          padding="4"
          borderWidth="0.375"
          borderRadius="large"
          cursor="pointer"
          height="full"
          backgroundColor="foregroundTertiary"
        >
          <Stack align="center" space="2">
            <Text color="accent">
              <Icon size={32} />
            </Text>
            <Text>{name}</Text>
            <Text variant="label" align="center">
              {description}
            </Text>
          </Stack>
        </Box>
      </motion.div>
    </Stack>
  );
};

const Items = [
  {
    component: "form",
    name: "Create a Form",
    icon: FaWpforms,
    description: "Create a form to collect data, feedback, or ideas",
  },
  {
    component: "project",
    name: "Create a Project",
    icon: Trello,
    description:
      "Create a project to track tasks, contacts and share context with your team",
  },
  {
    component: "workstream",
    name: "Create a Workstream",
    icon: MdGroupWork,
    description: "Create a workstream to scale your organization",
  },
  {
    component: "folder",
    name: "Create a New Folder",
    icon: AiFillFolderAdd,
    description: "Create folders to organize your dashboard",
  },
];

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
  margin: 1rem 0;
  grid-auto-rows: 1fr;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
