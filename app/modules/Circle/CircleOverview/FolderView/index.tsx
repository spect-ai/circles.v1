import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { CircleType, ProjectType, RetroType } from "@/app/types";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { Box, Button, IconPlusSmall, Stack, Text } from "degen";
import React, { useCallback, useEffect, useState } from "react";
import { useCircle } from "../../CircleContext";
import { createFolder } from "@/app/services/Folders";
import Folder from "./folder";
import useDragFolder from "./useDragHook";
import styled from "styled-components";
import { FolderOpenOutlined } from "@ant-design/icons";
import Loader from "@/app/common/components/Loader";
import { AnimatePresence } from "framer-motion";
import TemplateModal from "./TemplateModal";
import { Pulse } from "@/app/modules/Project/ProjectHeading";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import ImportTasks from "../../ImportTasks";

interface Props {
  filteredProjects: {
    [key: string]: ProjectType;
  };
  filteredRetro: {
    [key: string]: RetroType;
  };
  filteredWorkstreams: {
    [key: string]: CircleType;
  };
  filteredCollections: {
    [key: string]: {
      id: string;
      name: string;
      slug: string;
      viewType?: string;
      collectionType: 0 | 1;
      archived: boolean;
    };
  };
  setIsRetroOpen: (isRetroOpen: boolean) => void;
}

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 768px) {
    height: calc(100vh - 12rem);
  }
  height: calc(100vh - 10rem);
`;

export const FolderView = ({
  filteredProjects,
  filteredWorkstreams,
  filteredRetro,
  filteredCollections,
}: Props) => {
  const { handleDrag } = useDragFolder();
  const {
    localCircle: circle,
    setCircleData,
    setLocalCircle,
    fetchCircle,
  } = useCircle();
  const [allContentIds, setAllContentIds] = useState([] as string[]);
  const [unclassified, setUnclassified] = useState([] as string[]);
  const [loading, setLoading] = useState(false);
  const [useTemplateModal, setTemplateModal] = useState(false);

  const { canDo } = useRoleGate();
  const createNewFolder = useCallback(async () => {
    const fol =
      circle?.folderOrder?.length === undefined ||
      NaN ||
      circle?.folderOrder?.length == 0;
    const payload = {
      name: fol ? "All" : `Section-${circle?.folderOrder?.length + 1}`,
      avatar: fol ? "All" : "New Avatar",
      contentIds: fol ? unclassified : ([] as string[]),
    };
    const res = await createFolder(payload, circle?.id);
    if (res) {
      setCircleData(res);
      setLocalCircle(res);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circle?.folderOrder?.length, circle?.id, unclassified]);

  const getFormattedData = useCallback(() => {
    let ids = [] as string[];
    circle?.folderDetails &&
      Object.values(circle?.folderDetails)?.map((folder) => {
        ids = ids.concat(folder?.contentIds);
      });
    setAllContentIds(ids);

    let unclassifiedIds = [] as string[];
    filteredProjects &&
      Object.values(filteredProjects)?.map((project) => {
        if (!ids.includes(project.id)) {
          unclassifiedIds = unclassifiedIds.concat(project.id);
        }
      });

    filteredWorkstreams &&
      Object.values(filteredWorkstreams)?.map((child) => {
        if (!allContentIds.includes(child.id)) {
          unclassifiedIds = unclassifiedIds.concat(child.id);
        }
      });

    filteredRetro &&
      Object.values(filteredRetro)?.map((re) => {
        if (!allContentIds.includes(re.id)) {
          unclassifiedIds = unclassifiedIds.concat(re.id);
        }
      });

    filteredCollections &&
      Object.values(filteredCollections)?.map((collection) => {
        if (!allContentIds.includes(collection.id)) {
          unclassifiedIds = unclassifiedIds.concat(collection.id);
        }
      });

    setUnclassified(unclassifiedIds);
  }, [
    allContentIds,
    circle?.folderDetails,
    filteredCollections,
    filteredProjects,
    filteredRetro,
    filteredWorkstreams,
  ]);

  useEffect(() => {
    setAllContentIds([]);
    setUnclassified([]);
    getFormattedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circle]);

  const DroppableContent = (provided: DroppableProvided) => (
    <ScrollContainer
      {...provided.droppableProps}
      ref={provided.innerRef}
      paddingTop="4"
    >
      <Stack direction="horizontal" align="baseline">
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Sections
        </Text>
        {canDo("manageCircleSettings") && (
          <Stack direction="horizontal" align="baseline">
            <Button
              data-tour="circle-create-folder-button"
              size="small"
              variant="transparent"
              shape="circle"
              onClick={createNewFolder}
            >
              <IconPlusSmall size="5" />
            </Button>
            <Pulse borderRadius="large">
              <PrimaryButton
                onClick={() => {
                  setTemplateModal(true);
                }}
              >
                Use Template
              </PrimaryButton>
            </Pulse>
            <ImportTasks />
          </Stack>
        )}
      </Stack>
      {/* {canDo("manageCircleSettings") && (
        <Box
          margin={"1"}
          padding={"3"}
          display="flex"
          flexDirection={{
            lg: "row",
            xs: "column",
            md: "column",
            sm: "column",
          }}
          gap="3"
          justifyContent="space-between"
          alignItems={"center"}
          boxShadow="0.5"
          borderRadius={"large"}
          marginBottom="3"
        >
          <Text variant="large" align={{ lg: "left", xs: "center" }}>
            Try out our Grants Workflow Template here !
          </Text>
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              setTemplateModal(true);
            }}
          >
            Use Template
          </Button>
        </Box>
      )} */}

      {(circle?.folderOrder?.length == 0 ||
        circle?.folderOrder?.length === undefined) && (
        <Box
          style={{
            margin: "12% 20%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <FolderOpenOutlined
            style={{ fontSize: "5rem", color: "rgb(191, 90, 242, 0.7)" }}
          />
          <Text variant="large" color={"textTertiary"} align="center">
            {canDo("manageCircleSettings")
              ? `Create Sections to classify and view Projects, Workstreams, Forms &
            Retro`
              : `Ouch ! This Circle doesnot have sections. And You do not have permission to create new sections.`}
          </Text>
        </Box>
      )}
      {circle?.folderOrder?.map((folder, i) => {
        const folderDetail = circle?.folderDetails?.[folder];
        return (
          <Folder
            key={folder}
            content={folderDetail?.contentIds}
            avatar={folderDetail?.avatar}
            id={folder}
            name={folderDetail?.name}
            index={i}
            projects={filteredProjects}
            workstreams={filteredWorkstreams}
            collections={filteredCollections}
            retros={filteredRetro}
          />
        );
      })}
      {provided.placeholder}
    </ScrollContainer>
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DroppableContentCallback = useCallback(DroppableContent, [
    canDo,
    circle?.folderDetails,
    circle?.folderOrder,
    circle,
    filteredProjects,
    filteredRetro,
    filteredWorkstreams,
  ]);

  if (loading) return <Loader loading={loading} text={"Creating.."} />;

  return (
    <>
      <DragDropContext onDragEnd={handleDrag}>
        <Droppable droppableId="all-folders" direction="vertical" type="folder">
          {DroppableContentCallback}
        </Droppable>
      </DragDropContext>
      <AnimatePresence>
        {useTemplateModal && (
          <TemplateModal
            handleClose={setTemplateModal}
            setLoading={setLoading}
          />
        )}
      </AnimatePresence>
    </>
  );
};
