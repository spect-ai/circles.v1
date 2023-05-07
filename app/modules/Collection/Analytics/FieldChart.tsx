import { Chart, CollectionType, Option } from "@/app/types";
import { Box, Button, IconPencil, IconTrash, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { satisfiesConditions } from "../Common/SatisfiesFilter";
import { motion } from "framer-motion";
import { updateFormCollection } from "@/app/services/Collection";
import { BarOptions, LineOptions, PieOptions } from "./ChartOptions";
import { ImEmbed } from "react-icons/im";
import { logError } from "@/app/common/utils/utils";

type Props =
  | {
      chart: Chart;
      setIsAddChartOpen: (val: boolean) => void;
      setChartId: (id: string) => void;
      collection: CollectionType;
      updateCollection: (collection: CollectionType) => void;
      setIsEmbedOpen: (val: boolean) => void;
      disabled?: false;
    }
  | {
      chart: Chart;
      disabled: true;
      collection: CollectionType;
      updateCollection?: (collection: CollectionType) => void;
      setIsAddChartOpen?: (val: boolean) => void;
      setChartId?: (id: string) => void;
      setIsEmbedOpen?: (val: boolean) => void;
    };

const FieldChart = ({
  chart,
  setChartId,
  setIsAddChartOpen,
  disabled,
  collection,
  updateCollection,
  setIsEmbedOpen,
}: Props) => {
  const [dataRows, setDataRows] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [hover, setHover] = useState(false);
  const property = collection.properties[chart?.fields[0]];

  useEffect(() => {
    if (!property) return;
    const arr = Object.values(collection.data || {})
      .map((item) => {
        if (
          satisfiesConditions(item, collection.properties, chart?.filters || [])
        ) {
          if (property.type === "multiSelect") {
            return item[property.id]?.map((item: Option) => item.label);
          } else {
            return item[property.id]?.label;
          }
        }
      })
      .filter((item) => item !== undefined);

    const labelsArr = collection.properties[chart?.fields[0]]?.options?.map(
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
  }, []);
  return (
    <Box
      borderWidth={disabled ? "0" : "0.375"}
      padding="4"
      borderRadius="2xLarge"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      marginBottom="4"
    >
      <Stack space="0">
        {!disabled && (
          <Stack space="1">
            <Text weight="semiBold" ellipsis size="small">
              {chart?.name}
            </Text>
            <motion.div
              animate={{
                opacity: hover ? 1 : 0,
              }}
            >
              <Stack direction="horizontal" space="1" align="center">
                <Button
                  size="extraSmall"
                  shape="circle"
                  variant="transparent"
                  onClick={() => {
                    if (disabled) return;
                    setChartId(chart.id);
                    setIsEmbedOpen(true);
                  }}
                >
                  <Box marginTop="1">
                    <Text color="accent">
                      <ImEmbed size={16} />
                    </Text>
                  </Box>
                </Button>
                <Button
                  size="extraSmall"
                  shape="circle"
                  variant="transparent"
                  onClick={() => {
                    if (disabled) return;
                    setChartId(chart.id);
                    setIsAddChartOpen(true);
                  }}
                >
                  <Text color="accent">
                    <IconPencil size="4" />
                  </Text>
                </Button>
                <Button
                  size="extraSmall"
                  shape="circle"
                  variant="transparent"
                  onClick={async () => {
                    delete collection.formMetadata.charts?.[chart.id];
                    const res = await updateFormCollection(collection.id, {
                      formMetadata: {
                        ...collection.formMetadata,
                        chartOrder: collection.formMetadata.chartOrder?.filter(
                          (item) => item !== chart.id
                        ),
                      },
                    });
                    if (res.id) {
                      updateCollection(res);
                    } else {
                      logError("Error deleting chart");
                    }
                  }}
                >
                  <Text color="red">
                    <IconTrash size="4" />
                  </Text>
                </Button>
              </Stack>
            </motion.div>
          </Stack>
        )}

        {dataRows.some((a) => a > 0) ? (
          <Box>
            {chart.type === "bar" && (
              <Bar
                options={BarOptions}
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: chart?.name,
                      data: dataRows,
                      backgroundColor: "rgb(191,90,242,0.7)",
                      borderColor: "rgb(191,90,242)",
                      barPercentage: 0.8,
                      borderRadius: 10,
                      borderWidth: 2,
                    },
                  ],
                }}
              />
            )}
            {chart.type === "line" && (
              <Line
                options={LineOptions}
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: chart?.name,
                      data: dataRows,
                      backgroundColor: "rgb(191,90,242,0.7)",
                      borderColor: "rgb(191,90,242)",
                      borderWidth: 2,
                    },
                  ],
                }}
              />
            )}
            {chart.type === "pie" && (
              <Pie
                options={PieOptions}
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: chart?.name,
                      data: dataRows,
                      backgroundColor: [
                        "rgb(191,90,242,0.7)",
                        "rgb(191,90,212,0.5)",
                        "rgb(191,90,162,0.35)",
                        "rgb(191,90,132,0.2)",
                      ],
                      borderColor: "rgb(191,90,242)",
                      borderRadius: 10,
                      borderWidth: 2,
                    },
                  ],
                }}
              />
            )}
            {chart.type === "doughnut" && (
              <Doughnut
                options={PieOptions}
                data={{
                  labels: labels,
                  datasets: [
                    {
                      label: chart?.name,
                      data: dataRows,
                      backgroundColor: [
                        "rgb(191,90,242,0.7)",
                        "rgb(191,90,212,0.5)",
                        "rgb(191,90,162,0.35)",
                        "rgb(191,90,132,0.2)",
                      ],
                      borderColor: "rgb(191,90,242)",
                      borderRadius: 10,
                      borderWidth: 2,
                    },
                  ],
                }}
              />
            )}
          </Box>
        ) : (
          <Box>
            <Text variant="label">
              {property ? "No data added" : "Field deleted"}
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default FieldChart;
