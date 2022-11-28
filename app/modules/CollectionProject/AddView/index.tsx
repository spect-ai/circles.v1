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

type Props = {
  viewType: string;
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
    if (viewType === "kanban") {
      const options = Object.keys(collection.properties).map((key) => {
        if (
          collection.properties[key].type === "singleSelect" ||
          collection.properties[key].type === "user"
        ) {
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
          {viewType === "kanban" && (
            <Dropdown
              options={columnOptions}
              selected={groupByColumn}
              multiple={false}
              onChange={(option) => setGroupByColumn(option as Option)}
              placeholder="Group by column"
              label="Group by column"
            />
          )}
          <PrimaryButton
            loading={loading}
            icon={<IconPlusSmall />}
            onClick={async () => {
              setLoading(true);
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
                      sort: {},
                    },
                  },
                  viewOrder: [...collection.projectMetadata.viewOrder, viewId],
                },
              });
              console.log({ res });
              if (res.id) {
                updateCollection(res);
                handleClose();
              } else {
                console.error(res);
                toast.error("Error creating view");
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
