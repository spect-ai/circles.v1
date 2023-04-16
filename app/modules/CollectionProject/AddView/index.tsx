/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Option } from "@/app/types";
import { Box, IconPlusSmall, Input, Stack } from "degen";
import React, { useEffect, useState } from "react";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import uuid from "react-uuid";
import { toast } from "react-toastify";
import { logError } from "@/app/common/utils/utils";

type Props = {
  viewType: "kanban" | "list" | "grid";
  handleClose: () => void;
};

export default function AddView({ viewType, handleClose }: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [columnOptions, setColumnOptions] = useState<Option[]>([]);
  const [groupByColumn, setGroupByColumn] = useState<Option>({} as Option);
  const [viewName, setViewName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (["kanban", "list"].includes(viewType)) {
      const options = Object.keys(collection.properties).map((key) => {
        if (collection.properties[key].type === "singleSelect") {
          return {
            label: collection.properties[key].name,
            value: key,
          };
        }
      });
      setColumnOptions(
        options.filter((option) => option !== undefined) as Option[]
      );
    }
  }, [collection.properties, viewType]);

  return (
    <Modal handleClose={handleClose} title="Add View">
      <Box padding="8">
        <Stack>
          <Input
            label="View Name"
            placeholder="New View 1"
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
          />
          {["kanban", "list"].includes(viewType) && (
            <Dropdown
              options={columnOptions}
              selected={groupByColumn}
              multiple={false}
              onChange={(option) => setGroupByColumn(option as Option)}
              placeholder="Group by field"
              label="Group by field"
            />
          )}
          <PrimaryButton
            disabled={
              ["kanban", "list"].includes(viewType) ? !groupByColumn : !viewName
            }
            loading={loading}
            icon={<IconPlusSmall size="5" />}
            onClick={async () => {
              setLoading(true);
              if (viewType === "grid") {
                const viewId = uuid();
                const newCollection: any = {
                  projectMetadata: {
                    ...collection.projectMetadata,
                    views: {
                      ...collection.projectMetadata.views,
                      [viewId]: {
                        name: viewName,
                        type: "grid",
                        filters: [],
                        sort: {
                          property: "",
                          direction: "asc",
                        },
                      },
                    },
                    viewOrder: [
                      ...collection.projectMetadata.viewOrder,
                      viewId,
                    ],
                  },
                };
                const res = await updateFormCollection(
                  collection.id,
                  newCollection
                );
                updateCollection(res);
                setLoading(false);
                handleClose();
                return;
              }
              const cardColumnOrder: Array<Array<string>> = Array.from(
                {
                  length:
                    (collection.properties[groupByColumn.value].options
                      ?.length || 0) + 1,
                },
                () => []
              );
              const cardOrders = collection.projectMetadata.cardOrders || {};
              if (
                ["kanban", "list"].includes(viewType) &&
                groupByColumn.value &&
                !(
                  collection.projectMetadata.cardOrders &&
                  collection.projectMetadata.cardOrders[groupByColumn.value]
                )
              ) {
                // filter collection data based on group by column options and add it to a 2 dimensional array
                collection.data &&
                  Object.keys(collection.data).forEach((key) => {
                    const data = collection.data[key];
                    const columnValue = data[groupByColumn.value];
                    const columnIndex = collection.properties[
                      groupByColumn.value
                    ].options?.findIndex(
                      (option) => option.value === columnValue?.value
                    ) as number;
                    cardColumnOrder[columnIndex + 1].push(data.slug);
                  });
                cardOrders[groupByColumn.value] = cardColumnOrder;
              }
              const viewId = uuid();
              const res = await updateFormCollection(collection.id, {
                projectMetadata: {
                  views: {
                    ...collection.projectMetadata.views,
                    [viewId]: {
                      name: viewName,
                      type: viewType as any,
                      groupByColumn: groupByColumn.value,
                      filters: [],
                      sort: {
                        property: "",
                        direction: "asc",
                      },
                    },
                  },
                  viewOrder: [...collection.projectMetadata.viewOrder, viewId],
                  cardOrders,
                },
              });
              console.log({ res });
              if (res.id) {
                updateCollection(res);
                handleClose();
              } else {
                logError("Error creating view");
              }
              setLoading(false);
            }}
          >
            Create View
          </PrimaryButton>
        </Stack>
      </Box>
    </Modal>
  );
}
