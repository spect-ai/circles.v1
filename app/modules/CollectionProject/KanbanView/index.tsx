import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateField } from "@/app/services/Collection";
import { Option } from "@/app/types";
import { Box, IconPlusSmall, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import uuid from "react-uuid";
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
  const columns = collection.properties[view.groupByColumn].options as Option[];

  const [isCardDrawerOpen, setIsCardDrawerOpen] = useState(false);
  const [defaultValue, setDefaultValue] = useState({
    [view.groupByColumn]: columns && columns[0],
  });

  const [loading, setLoading] = useState(false);

  // console.log({ collection });

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
          <PrimaryButton
            loading={loading}
            onClick={async () => {
              setLoading(true);
              const res = await updateField(collection.id, view.groupByColumn, {
                options: [
                  ...columns,
                  {
                    label: "New Column",
                    value: uuid(),
                  },
                ],
              });
              setLoading(false);
              if (res.id) updateCollection(res);
              else toast.error("Error adding column");
            }}
          >
            Add Column
          </PrimaryButton>
        </Box>
      </Stack>
    </Box>
  );
}
