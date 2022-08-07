import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addColumn } from "@/app/services/Column";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { Box, IconPlusSmall, Stack } from "degen";
import React, { memo } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useLocalProject } from "../Context/LocalProjectContext";
import { SkeletonLoader } from "../SkeletonLoader";
import BatchPay from "../BatchPay";
import { AnimatePresence } from "framer-motion";
import ListSection from "./ListSection";
import { filterCards } from "../ProjectViews/filterCards";
import { Filter, Views } from "@/app/types";

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
`;

function ListView({ viewId }: Props) {
  const {
    localProject: project,
    setLocalProject,
    loading,
    batchPayModalOpen,
    selectedCard,
    setBatchPayModalOpen,
  } = useLocalProject();
  const { canDo } = useRoleGate();

  const view: Views = project.viewDetails?.[viewId as string]!;
  const viewCards = filterCards(project, view?.filters as Filter);
  const viewFilter = view?.filters;

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <AnimatePresence>
        {/* {batchPayModalOpen && selectedCard && (
          <BatchPay card={selectedCard} setIsOpen={setBatchPayModalOpen} />
        )} */}
        <ScrollContainer>
          <Stack space="8">
            {!viewId &&
              project?.columnOrder?.map((columnId, index): any => {
                const column = project.columnDetails[columnId];
                const cards = column.cards?.map(
                  (cardId: any) => project.cards[cardId]
                );
                return (
                  <ListSection key={columnId} column={column} cards={cards} />
                );
              })}
            {viewId &&
              project?.columnOrder?.map((columnId, index): any => {
                if (
                  viewFilter?.column?.length > 0 &&
                  !viewFilter.column?.includes(columnId)
                )
                  return null;

                const column = project.columnDetails[columnId];
                let cards = column.cards?.map((cardId: any) =>
                  viewId ? viewCards[cardId] : project.cards[cardId]
                );
                cards = cards.filter((i) => i !== undefined);

                return (
                  <ListSection key={columnId} column={column} cards={cards} />
                );
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
      </AnimatePresence>
    </>
  );
}

export default memo(ListView);
