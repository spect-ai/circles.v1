/* eslint-disable @typescript-eslint/no-explicit-any */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateField, updateFormCollection } from "@/app/services/Collection";
import { Option } from "@/app/types";
import { Box, IconPlusSmall, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { DragDropContext } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import styled from "styled-components";
import InviteMemberModal from "../../Circle/ContributorsModal/InviteMembersModal";
import CardDrawer from "../CardDrawer";
import useViewCommon from "../Common/useViewCommon";
import Column from "./Column";

export default function ListView() {
  const {
    setIsCardDrawerOpen,
    isCardDrawerOpen,
    defaultValue,
    setDefaultValue,
    handleDragEnd,
    columns,
    view,
    collection,
    property,
    loading,
    setLoading,
    projectViewId,
    updateCollection,
  } = useViewCommon();

  return (
    <Container
      marginX="8"
      paddingY="0"
      style={{
        height: "calc(100vh - 7rem)",
        overflowY: "auto",
      }}
    >
      <AnimatePresence>
        {isCardDrawerOpen && (
          <CardDrawer
            handleClose={() => setIsCardDrawerOpen(false)}
            defaultValue={defaultValue}
          />
        )}
      </AnimatePresence>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Stack>
          {columns?.map((column, index) => (
            <Column
              key={column.value}
              column={column}
              groupByColumn={view.groupByColumn}
              setDefaultValue={setDefaultValue}
              setIsCardDrawerOpen={setIsCardDrawerOpen}
              cardIds={
                (
                  collection.projectMetadata.views[projectViewId]
                    .cardColumnOrder as any
                )[index]
              }
            />
          ))}
          <Box marginLeft="4" width="64" marginBottom="4">
            {property.type === "singleSelect" && (
              <PrimaryButton
                icon={<IconPlusSmall />}
                center
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  await updateField(collection.id, view.groupByColumn, {
                    options: [
                      ...(property.options as Option[]),
                      {
                        label: "New_Column",
                        value: `option-${uuid()}`,
                      },
                    ],
                  });
                  const res = await updateFormCollection(collection.id, {
                    projectMetadata: {
                      ...collection.projectMetadata,
                      views: {
                        ...collection.projectMetadata.views,
                        [projectViewId]: {
                          ...view,
                          cardColumnOrder: [
                            ...(view.cardColumnOrder as string[][]),
                            [],
                          ],
                        },
                      },
                    },
                  });
                  setLoading(false);
                  if (res.id) updateCollection(res);
                  else toast.error("Error adding column");
                }}
              >
                Add Column
              </PrimaryButton>
            )}
            {property.type === "user" && <InviteMemberModal />}
          </Box>
        </Stack>
      </DragDropContext>
    </Container>
  );
}

const Container = styled(Box)`
  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
        180deg,
        rgba(191, 90, 242, 0.4) 50%,
        rgba(191, 90, 242, 0.1) 100%
        )
        0% 0% / 100% 100% no-repeat padding-box;
    }
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(191, 90, 242, 0.8);
  }

  
`;
