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

const ScrollContainer = styled.div`
  height: calc(100vh - 4.5rem);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
`;

function ListView() {
  const {
    localProject: project,
    setLocalProject,
    loading,
    batchPayModalOpen,
    selectedCard,
    setBatchPayModalOpen,
  } = useLocalProject();
  const { canDo } = useRoleGate();

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <AnimatePresence>
        {batchPayModalOpen && selectedCard && (
          <BatchPay card={selectedCard} setIsOpen={setBatchPayModalOpen} />
        )}
        <ScrollContainer>
          <Stack space="8">
            {project?.columnOrder?.map((columnId, index): any => {
              const column = project.columnDetails[columnId];
              const cards = column.cards?.map(
                (cardId: any) => project.cards[cardId]
              );
              return (
                <ListSection key={columnId} column={column} cards={cards} />
              );
            })}
            {project?.id && canDo(["steward"]) && (
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
