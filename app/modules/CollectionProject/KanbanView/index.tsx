/* eslint-disable @typescript-eslint/no-explicit-any */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateField, updateFormCollection } from "@/app/services/Collection";
import { Option } from "@/app/types";
import { Box, IconPlusSmall, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { DragDropContext } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import InviteMemberModal from "../../Circle/ContributorsModal/InviteMembersModal";
import CardDrawer from "../CardDrawer";
import useViewCommon from "../Common/useViewCommon";
import Column from "./Column";

export default function KanbanView() {
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
    updateCollection,
    cardOrders,
  } = useViewCommon();

  return (
    <Box
      marginX="8"
      paddingY="0"
      style={{
        height: "calc(100vh - 7rem)",
        overflowX: "auto",
        overflowY: "hidden",
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
        <Stack direction="horizontal" align="flex-start">
          {columns?.map((column, index) => (
            <Column
              key={column.value}
              column={column}
              groupByColumn={view.groupByColumn}
              setDefaultValue={setDefaultValue}
              cardIds={cardOrders[index]}
            />
          ))}
          <Box marginTop="4" width="48">
            {property.type === "singleSelect" && !loading && (
              <PrimaryButton
                icon={<IconPlusSmall />}
                onClick={async () => {
                  setLoading(true);
                  await updateField(collection.id, view.groupByColumn, {
                    options: [
                      ...(property.options as Option[]),
                      {
                        label: "New Column",
                        value: uuid(),
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
    </Box>
  );
}
