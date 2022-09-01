import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addColumn } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconPlusSmall, Stack } from "degen";
import React, { memo } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import { SkeletonLoader } from "../SkeletonLoader";
import ListSection from "./ListSection";
import { filterCards } from "../Filter/filterCards";
import { Filter } from "@/app/types";
import { useGlobal } from "@/app/context/globalContext";

interface Props {
  viewId: string;
}

const ScrollContainer = styled.div`
  height: calc(100vh - 4.5rem);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
  width: 100%;
`;

function ListView({ viewId }: Props) {
  const { localProject: project, setLocalProject, loading } = useLocalProject();
  const { currentFilter } = useGlobal();
  const { canDo } = useRoleGate();

  const view = project.viewDetails?.[viewId];
  const viewCards = filterCards(project, view?.filters as Filter);
  const viewFilter = view?.filters;

  const filteredCards = filterCards(project, currentFilter);

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <ScrollContainer>
      <Stack space="8">
        {!viewId &&
          project?.columnOrder?.map((columnId: string) => {
            const column = project.columnDetails[columnId];
            const cards = column.cards?.map(
              (cardId: string) => filteredCards[cardId]
            );
            return <ListSection key={columnId} column={column} cards={cards} />;
          })}
        {viewId &&
          project?.columnOrder?.map((columnId: string) => {
            if (
              (viewFilter as Filter)?.column?.length > 0 &&
              !(viewFilter as Filter).column?.includes(columnId)
            )
              return null;

            const column = project.columnDetails[columnId];
            let cards = column.cards?.map((cardId: string) =>
              viewId ? viewCards[cardId] : project.cards[cardId]
            );
            cards = cards.filter((i) => i !== undefined);

            return <ListSection key={columnId} column={column} cards={cards} />;
          })}
        {!viewId && project?.id && canDo(["steward"]) && (
          <Box style={{ width: "20rem" }} marginTop="2" marginLeft="2">
            <PrimaryButton
              variant="tertiary"
              icon={<IconPlusSmall />}
              onClick={async () => {
                const updatedProject = await addColumn(project.id);
                if (!updatedProject) {
                  toast.error("Error adding column", {
                    theme: "dark",
                  });
                }
                setLocalProject(updatedProject);
              }}
            >
              Add new section
            </PrimaryButton>
          </Box>
        )}
      </Stack>
    </ScrollContainer>
  );
}

export default memo(ListView);
