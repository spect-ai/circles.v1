import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { AiOutlineAreaChart } from "react-icons/ai";
import AddConditions from "../Common/AddConditions";
import { Condition, Option } from "@/app/types";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import Dropdown from "@/app/common/components/Dropdown";
import { useRafState } from "react-use";
import { AnimatePresence } from "framer-motion";
import { updateFormCollection } from "@/app/services/Collection";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";

type Props = {
  handleClose: () => void;
  chartId?: string;
};

type ChartType = "pie" | "bar" | "line" | "doughnut";

const AddChart = ({ handleClose, chartId }: Props) => {
  const [viewCondtions, setViewCondtions] = useState<Condition[]>([]);
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const fieldOptions = Object.values(collection.properties || {})
    .filter((field) => field.type === "singleSelect")
    .map((field) => ({
      label: field.name,
      value: field.id,
    }));

  const chartOptions: {
    label: string;
    value: ChartType;
  }[] = [
    {
      label: "Pie",
      value: "pie",
    },
    {
      label: "Bar",
      value: "bar",
    },
    {
      label: "Line",
      value: "line",
    },
    {
      label: "Doughnut",
      value: "doughnut",
    },
  ];

  const [selectedField, setSelectedField] = useState({} as Option);
  const [title, setTitle] = useState("");
  const [chartType, setChartType] = useState(chartOptions[0]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chartId && collection.formMetadata?.charts) {
      const chart = collection.formMetadata?.charts[chartId];
      if (chart) {
        setTitle(chart.name);
        setSelectedField({
          label: collection.properties[chart.fields[0]].name,
          value: chart.fields[0],
        });
        setChartType(
          chartOptions.find((option) => option.value === chart.type) ||
            chartOptions[0]
        );
        setViewCondtions(chart.filters || []);
      }
    }
  }, []);

  return (
    <Modal
      title={chartId ? "Edit Chart" : "Add Chart"}
      handleClose={handleClose}
      size="small"
    >
      <Box padding="8">
        <Stack>
          <Input
            label="Chart title"
            placeholder="Vote distribution by country"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Dropdown
            options={fieldOptions}
            selected={selectedField}
            onChange={(option) => setSelectedField(option)}
            multiple={false}
            label="Select field to chart"
          />
          <Dropdown
            options={chartOptions}
            selected={chartType}
            onChange={(option) =>
              setChartType(
                option as {
                  label: string;
                  value: ChartType;
                }
              )
            }
            multiple={false}
            label="Select chart type"
          />
          <AddConditions
            viewConditions={viewCondtions}
            setViewConditions={setViewCondtions}
            firstRowMessage=""
            buttonText="Add Filter"
            collection={collection}
            dropDownPortal={true}
            buttonWidth="1/2"
          />
          <Box width="1/2">
            <PrimaryButton
              loading={loading}
              onClick={async () => {
                setLoading(true);
                let res;
                if (chartId && collection.formMetadata?.charts) {
                  res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      charts: {
                        ...collection.formMetadata?.charts,
                        [chartId]: {
                          ...collection.formMetadata?.charts[chartId],
                          name: title,
                          fields: [selectedField.value],
                          type: chartType.value,
                          filters: viewCondtions,
                        },
                      },
                    },
                  });
                } else {
                  const id = uuid();
                  res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      charts: {
                        ...collection.formMetadata?.charts,
                        [id]: {
                          id,
                          name: title,
                          fields: [selectedField.value],
                          type: chartType.value,
                          filters: viewCondtions,
                        },
                      },
                      chartOrder: [
                        ...(collection.formMetadata?.chartOrder || []),
                        id,
                      ],
                    },
                  });
                }
                if (res.id) {
                  updateCollection(res);
                  handleClose();
                } else {
                  toast.error("Something went wrong");
                }
                setLoading(false);
              }}
            >
              Save
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddChart;
