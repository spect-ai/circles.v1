import { Chart, CollectionType } from "@/app/types";
import { Box, Button, IconPencil, IconTrash, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { Context } from "chartjs-plugin-datalabels";
import { satisfiesConditions } from "../Common/SatisfiesFilter";
import { motion } from "framer-motion";
import { updateFormCollection } from "@/app/services/Collection";
import { toast } from "react-toastify";
import { BarOptions, LineOptions, PieOptions } from "./ChartOptions";
import styled from "styled-components";

type Props =
  | {
      chart: Chart;
      setIsAddChartOpen: (val: boolean) => void;
      setChartId: (id: string) => void;
      collection: CollectionType;
      updateCollection: (collection: CollectionType) => void;
      disabled?: false;
    }
  | {
      chart: Chart;
      disabled: true;
      collection: CollectionType;
      updateCollection: (collection: CollectionType) => void;
      setIsAddChartOpen?: (val: boolean) => void;
      setChartId?: (id: string) => void;
    };

const FieldChart = ({
  chart,
  setChartId,
  setIsAddChartOpen,
  disabled,
  collection,
  updateCollection,
}: Props) => {
  const [dataRows, setDataRows] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const [hover, setHover] = useState(false);

  useEffect(() => {
    const arr: string[] = Object.values(collection.data || {})
      .map((item) => {
        if (
          satisfiesConditions(item, collection.properties, chart?.filters || [])
        ) {
          return item[chart?.fields[0]].label;
        }
      })
      .filter((item) => item !== undefined) as string[];

    const labelsArr = collection.properties[chart?.fields[0]].options?.map(
      (item) => item.label
    );
    setLabels(labelsArr || []);

    // create empty array of length of labels
    const rowData = new Array(labelsArr?.length).fill(0);

    // loop through arr and increment the index of rowData
    arr.forEach((item) => {
      const index = labelsArr?.indexOf(item);
      if (index !== undefined && index !== -1) {
        rowData[index] += 1;
      }
    });

    setDataRows(rowData);
  }, []);
  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Stack>
        <Stack direction="horizontal" justify="space-between" align="center">
          <Text weight="semiBold" ellipsis size="small">
            {chart?.name}
          </Text>
          {!disabled && (
            <motion.div
              animate={{
                opacity: hover ? 1 : 0,
              }}
            >
              <Stack direction="horizontal" space="1">
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
                      toast.error("Error deleting chart");
                    }
                  }}
                >
                  <Text color="red">
                    <IconTrash size="5" />
                  </Text>
                </Button>
              </Stack>
            </motion.div>
          )}
        </Stack>
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
      </Stack>
    </Box>
  );
};

export default FieldChart;
