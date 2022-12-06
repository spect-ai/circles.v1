/* eslint-disable @typescript-eslint/no-explicit-any */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { reorder } from "@/app/common/utils/utils";
import {
  updateCollectionDataGuarded,
  updateField,
  updateFormCollection,
} from "@/app/services/Collection";
import { MemberDetails, Option } from "@/app/types";
import { Box, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import InviteMemberModal from "../../Circle/ContributorsModal/InviteMembersModal";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import CardDrawer from "../CardDrawer";
import Column from "./Column";

export default function KanbanView() {
  const {
    localCollection: collection,
    projectViewId,
    updateCollection,
  } = useLocalCollection();

  const view = collection.projectMetadata.views[projectViewId];
  const property = collection.properties[view.groupByColumn];
  // const columns =  collection.properties[view.groupByColumn].options as Option[];

  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState({} as Option);

  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<Option[]>([]);

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: memberDetails } = useQuery<MemberDetails>(
    ["memberDetails", cId],
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (property.type === "singleSelect") {
      const options = Array.from(property.options as Option[]);
      options.unshift({
        label: "Unassigned",
        value: "__unassigned__",
      });
      setColumns(options);
    } else if (property.type === "user" && memberDetails) {
      const memberOptions = memberDetails.members?.map((member: string) => ({
        label: memberDetails.memberDetails[member]?.username,
        value: member,
      }));
      memberOptions?.unshift({
        label: "Unassigned",
        value: "__unassigned__",
      });
      setColumns(memberOptions as Option[]);
    }
  }, [memberDetails, property.options, property.type]);

  // console.log({ collection });
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || !view.cardColumnOrder) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (source.droppableId === destination.droppableId) {
      const columnIndex = columns.findIndex(
        (column) => column.value === source.droppableId
      );
      const oldColumnOrder = view.cardColumnOrder[columnIndex];
      const newColumnOrder = reorder(
        oldColumnOrder,
        source.index,
        destination.index
      );
      updateCollection({
        ...collection,
        projectMetadata: {
          ...collection.projectMetadata,
          views: {
            ...collection.projectMetadata.views,
            [projectViewId]: {
              ...view,
              cardColumnOrder: view.cardColumnOrder.map((column, index) =>
                index === columnIndex ? newColumnOrder : column
              ),
            },
          },
        },
      });
      void updateFormCollection(collection.id, {
        projectMetadata: {
          ...collection.projectMetadata,
          views: {
            ...collection.projectMetadata.views,
            [projectViewId]: {
              ...view,
              cardColumnOrder: view.cardColumnOrder.map((column, index) =>
                index === columnIndex ? newColumnOrder : column
              ),
            },
          },
        },
      });
      return;
    }

    const destColumn = columns.find(
      (c) => c.value === destination.droppableId
    ) as Option;

    const sourceColumnIndex = columns.findIndex(
      (column) => column.value === source.droppableId
    );
    const destColumnIndex = columns.findIndex(
      (column) => column.value === destination.droppableId
    );

    const newSourceColumnOrder = Array.from(
      view.cardColumnOrder[sourceColumnIndex]
    );

    newSourceColumnOrder.splice(source.index, 1);
    const newDestColumnOrder = Array.from(
      view.cardColumnOrder[destColumnIndex]
    );
    newDestColumnOrder.splice(destination.index, 0, draggableId);

    const newCardColumnOrder = Array.from(view.cardColumnOrder);
    newCardColumnOrder[sourceColumnIndex] = newSourceColumnOrder;
    newCardColumnOrder[destColumnIndex] = newDestColumnOrder;

    updateCollection({
      ...collection,
      data: {
        ...collection.data,
        [draggableId]: {
          ...collection.data[draggableId],
          [view.groupByColumn]:
            destColumn.value === "__unassigned__" ? undefined : destColumn,
        },
      },
      projectMetadata: {
        ...collection.projectMetadata,
        views: {
          ...collection.projectMetadata.views,
          [projectViewId]: {
            ...view,
            cardColumnOrder: newCardColumnOrder,
          },
        },
      },
    });

    void updateCollectionDataGuarded(collection.id, draggableId, {
      [view.groupByColumn]: destColumn,
    });

    void updateFormCollection(collection.id, {
      projectMetadata: {
        ...collection.projectMetadata,
        views: {
          ...collection.projectMetadata.views,
          [projectViewId]: {
            ...view,
            cardColumnOrder: newCardColumnOrder,
          },
        },
      },
    });
  };

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
              setIsCardDrawerOpen={setIsCardDrawerOpen}
              cardIds={
                (
                  collection.projectMetadata.views[projectViewId]
                    .cardColumnOrder as any
                )[index]
              }
            />
          ))}
          <Box marginTop="4" width="64">
            {property.type === "singleSelect" && (
              <PrimaryButton
                loading={loading}
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
    </Box>
  );
}
