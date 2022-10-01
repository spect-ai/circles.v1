import Card from "@/app/common/components/Card";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import {
  CircleType,
  ProjectType,
  RetroType,
  CollectionType,
} from "@/app/types";
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { ExpandAltOutlined } from "@ant-design/icons";
import { Box, Button, IconPlusSmall, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Col, Container, Row } from "react-grid-system";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import CreateRetro from "../../../Retro/CreateRetro";
import { useCircle } from "../../CircleContext";
import CreateCollectionModal from "../../CreateCollectionModal";
import CreateProjectModal from "../../CreateProjectModal";
import CreateSpaceModal from "../../CreateSpaceModal";
import { createFolder } from "@/app/services/Folders";

export const FolderView = () => {
  const router = useRouter();
  const { localCircle: circle, setCircleData } = useCircle();
  console.log(circle);

  const { canDo } = useRoleGate();
  const createNewFolder = async () => {
    const payload = {
      name: "New Folder",
      avatar: "newFolder",
    };
    const res = await createFolder(payload, circle?.id);
    if (res) {
      setCircleData(res);
    }
  };

  // const DroppableContent = (provided: DroppableProvided) => (
  //   <Container {...provided.droppableProps} ref={provided.innerRef}>
  //     {provided.placeholder}
  //   </Container>
  // );

  // const DroppableContentCallback = useCallback(DroppableContent, [circle]);

  // return (
  //   <DragDropContext onDragEnd={handleDragEnd}>
  //     <Droppable droppableId="all-columns" direction="horizontal" type="column">
  //       {DroppableContentCallback}
  //     </Droppable>
  //   </DragDropContext>
  // );

  return (
    <Box>
      <Stack>
        <Text size="headingTwo" weight="semiBold" ellipsis>
          Folders
        </Text>
        {canDo("createNewRetro") && (
          <Box onClick={createNewFolder} cursor="pointer">
            <IconPlusSmall />
          </Box>
        )}
      </Stack>
      {circle?.folderOrder?.map((folder) => {
        return (
          <Box key={folder} minHeight="96" minWidth="52">
            <Text>{circle?.folderDetails?.[folder]?.name}</Text>
            {circle?.folderDetails?.[folder]?.contentIds?.map((content) => {
              return (
                <Card
                  onClick={() =>
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    router.push(`/`)
                  }
                  height="32"
                  key={content}
                >
                  <Text align="center">{content}</Text>
                  <Text variant="label" align="center">
                    {content}
                  </Text>
                </Card>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};
