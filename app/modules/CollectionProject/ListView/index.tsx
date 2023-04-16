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
import { logError } from "@/app/common/utils/utils";

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
    setLoading,
    updateCollection,
    cardOrders,
    filteredOnGroupByColumn,
  } = useViewCommon();

  return (
    <Container
      marginX="8"
      paddingY="0"
      style={{
        height: "calc(100vh - 7.3rem)",
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
          {columns?.map((column, index) => {
            if (index === 0 && (!cardOrders[0] || cardOrders[0]?.length === 0))
              return null;
            if (filteredOnGroupByColumn && cardOrders[index]?.length === 0)
              return null;
            return (
              <Column
                key={column.value}
                column={column}
                groupByColumn={view.groupByColumn}
                setDefaultValue={setDefaultValue}
                setIsCardDrawerOpen={setIsCardDrawerOpen}
                cardIds={cardOrders[index]}
              />
            );
          })}
          <Box marginLeft="4" width="48" marginBottom="4">
            {property.type === "singleSelect" && (
              <PrimaryButton
                variant="transparent"
                center
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
                      cardOrders: {
                        ...collection.projectMetadata.cardOrders,
                        [view.groupByColumn]: [
                          ...collection.projectMetadata.cardOrders[
                            view.groupByColumn
                          ],
                          [],
                        ],
                      },
                    },
                  });
                  setLoading(false);
                  if (res.id) updateCollection(res);
                  else logError("Error adding column");
                }}
              >
                {`Add ${property.name}`}
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
`;
