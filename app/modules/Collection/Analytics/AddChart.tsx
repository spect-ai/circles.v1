import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import AddConditions from "../Common/AddConditions";
import {
  Chart,
  Condition,
  ConditionGroup,
  Option,
  Property,
} from "@/app/types";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import Dropdown from "@/app/common/components/Dropdown";
import { v4 as uuid } from "uuid";
import { logError } from "@/app/common/utils/utils";
import { updateFormCollection } from "@/app/services/Collection";
import AddAdvancedConditions from "../Common/AddAdvancedConditions";
import Plot from "./Plot";
import { satisfiesAdvancedConditions } from "../Common/SatisfiesAdvancedFilter";

type Props = {
  handleClose: () => void;
  chartId?: string;
};

type ChartType = "pie" | "bar" | "line" | "doughnut";

const AddChart = ({ handleClose, chartId }: Props) => {
  const [advancedConditions, setAdvancedConditions] = useState<ConditionGroup>(
    {} as ConditionGroup
  );
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [dataRows, setDataRows] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const fieldOptions = Object.values(collection.properties || {})
    .filter(
      (field) =>
        field.type === "singleSelect" ||
        field.type === "multiSelect" ||
        field.type === "slider"
    )
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
        setAdvancedConditions(chart.advancedFilters || ({} as ConditionGroup));
      }
    }
  }, []);

  useEffect(() => {
    const property = collection.properties[selectedField.value];
    if (!property) return;
    const arr = Object.values(collection.data || {})
      .map((item) => {
        if (
          satisfiesAdvancedConditions(
            item,
            collection.properties,
            advancedConditions || ({} as ConditionGroup)
          )
        ) {
          if (property.type === "multiSelect") {
            return item[property.id]?.map((item: Option) => item.label);
          } else {
            return item[property.id]?.label;
          }
        }
      })
      .filter((item) => item !== undefined);

    const labelsArr = collection.properties[selectedField.value]?.options?.map(
      (item) => item.label
    );
    setLabels(labelsArr || []);

    // create empty array of length of labels
    const rowData = new Array(labelsArr?.length).fill(0);

    if (property.type === "multiSelect") {
      labelsArr?.forEach((label, index) => {
        arr.forEach((item) => {
          if (item?.includes(label)) {
            rowData[index] += 1;
          }
        });
      });
    } else {
      // loop through arr and increment the index of rowData
      arr.forEach((item) => {
        const index = labelsArr?.indexOf(item);
        if (index !== undefined && index !== -1) {
          rowData[index] += 1;
        }
      });
    }

    setDataRows(rowData);
  }, [selectedField, advancedConditions, chartType]);

  return (
    <Modal
      title={chartId ? "Edit Chart" : "Add Chart"}
      handleClose={handleClose}
      size="medium"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap="8"
        padding="8"
        paddingTop="4"
      >
        <Box display="flex" flexDirection="row" gap="8">
          <Box width="1/2" display="flex" flexDirection="column" gap="4">
            <Box display="flex" flexDirection="column">
              <Box marginLeft="2">
                {" "}
                <Text
                  variant="label"
                  color="textSecondary"
                  weight="semiBold"
                  size="small"
                >
                  Chart Title
                </Text>
              </Box>
              <Input
                label
                placeholder="Vote distribution by guild"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>
            <Dropdown
              options={fieldOptions}
              selected={selectedField}
              onChange={(option) => setSelectedField(option)}
              multiple={false}
              label="Field to chart"
              isClearable={false}
              variant="label"
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
              label="Chart type"
              isClearable={false}
              variant="label"
            />
          </Box>
          <Box width="1/2">
            {" "}
            <Plot
              chart={{
                id: "who cares",
                type: chartType.value,
                name: title,
                fields: [selectedField.value],
              }}
              dataRows={dataRows}
              labels={labels}
              property={collection.properties[selectedField.value]}
            />
          </Box>
        </Box>
        <Box marginLeft="2">
          <Text
            variant="label"
            size="small"
            weight="semiBold"
            color="textSecondary"
          >
            Segment Responses
          </Text>
          <AddAdvancedConditions
            rootConditionGroup={advancedConditions}
            setRootConditionGroup={(conditions) => {
              console.log(conditions);
              setAdvancedConditions(conditions);
            }}
            firstRowMessage="When"
            buttonText="Add Filter"
            groupButtonText="Group Filters"
            collection={collection}
            dropDownPortal={true}
          />{" "}
        </Box>
        <Box
          width="full"
          marginTop="16"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
        >
          <Box width="48">
            <PrimaryButton
              disabled={!title || !selectedField?.value || !chartType}
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
                          advancedFilters: advancedConditions,
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
                          advancedFilters: advancedConditions,
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
                  setLoading(false);
                } else {
                  logError("Error saving chart");
                }
              }}
            >
              Save
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddChart;
