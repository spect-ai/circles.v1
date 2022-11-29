import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  updateCollectionDataGuarded,
  updateField,
} from "@/app/services/Collection";
import { MemberDetails, Option } from "@/app/types";
import { Box, IconPlusSmall, Stack } from "degen";
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
      setColumns(property.options as Option[]);
    } else if (property.type === "user" && memberDetails) {
      const memberOptions = memberDetails.members?.map((member: string) => ({
        label: memberDetails.memberDetails[member]?.username,
        value: member,
      }));
      setColumns(memberOptions as Option[]);
    }
  }, [memberDetails, property.options, property.type]);

  // console.log({ collection });
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const destColumn = columns.find(
      (c) => c.value === destination.droppableId
    ) as Option;

    updateCollection({
      ...collection,
      data: {
        ...collection.data,
        [draggableId]: {
          ...collection.data[draggableId],
          [view.groupByColumn]: destColumn,
        },
      },
    });

    const res = await updateCollectionDataGuarded(collection.id, draggableId, {
      [view.groupByColumn]: destColumn,
    });
    if (res.id) {
      updateCollection(res);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Box
      marginX="8"
      paddingY="0"
      style={{
        height: "calc(100vh - 7rem)",
        overflowX: "auto",
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
          {columns?.map((column) => (
            <Column
              key={column.value}
              column={column}
              groupByColumn={view.groupByColumn}
              setDefaultValue={setDefaultValue}
              setIsCardDrawerOpen={setIsCardDrawerOpen}
            />
          ))}
          <Box marginTop="4" width="64">
            {property.type === "singleSelect" && (
              <PrimaryButton
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  const res = await updateField(
                    collection.id,
                    view.groupByColumn,
                    {
                      options: [
                        ...columns,
                        {
                          label: "New Column",
                          value: uuid(),
                        },
                      ],
                    }
                  );
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
