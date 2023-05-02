import { Chart } from "@/app/types";
import { Box, Button, IconPencil, IconTrash, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import ChartDataLabels, { Context } from "chartjs-plugin-datalabels";
import { satisfiesConditions } from "../Common/SatisfiesFilter";
import { motion } from "framer-motion";
import { updateFormCollection } from "@/app/services/Collection";
import { toast } from "react-toastify";

type Props = {
  chart: Chart;
  setIsAddChartOpen: (val: boolean) => void;
  setChartId: (id: string) => void;
};

const FieldChart = ({ chart, setChartId, setIsAddChartOpen }: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

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
    setLabels(
      collection.properties[chart?.fields[0]].options?.map(
        (item) => item.label
      ) || []
    );
    const rowData = arr.reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr] += 1;
      } else {
        acc[curr] = 1;
      }
      return acc;
    }, {} as { [key: string]: number });
    setDataRows(Object.values(rowData).map((item) => item.toString()));
  }, []);
  return (
    <Box
      style={{
        width: "calc(20% - 1rem)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Stack>
        <Stack direction="horizontal" justify="space-between" align="center">
          <Text weight="semiBold">{chart?.name}</Text>
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

const BarOptions = {
  indexAxis: "y" as "y",
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      formatter: (value: number, ctx: Context) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;
        dataArr.map((data) => {
          if (typeof data === "string") {
            sum += parseFloat(data);
          }
        });
        let percentage = ((value * 100) / sum).toFixed(2) + "%";
        return percentage;
      },
      color: "#fff",
    },
  },
  responsive: true,
  // maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        color: "rgb(191,90,242,0.8)",
      },
    },
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: "rgb(191,90,242,0.8)",
      },
    },
  },
};

const LineOptions = {
  indexAxis: "y" as "y",
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      formatter: (value: number, ctx: Context) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;
        dataArr.map((data) => {
          if (typeof data === "string") {
            sum += parseFloat(data);
          }
        });
        let percentage = ((value * 100) / sum).toFixed(1) + "%";
        return percentage;
      },
      color: "#fff",
    },
  },
  responsive: true,
  // maintainAspectRatio: false,
  scales: {
    y: {
      ticks: {
        color: "rgb(191,90,242,0.8)",
      },
    },
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: "rgb(191,90,242,0.8)",
      },
    },
  },
};

const PieOptions = {
  indexAxis: "y" as "y",
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      formatter: (value: number, ctx: Context) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;
        const label = ctx.chart.data.labels?.[ctx.dataIndex];
        dataArr.map((data) => {
          if (typeof data === "string") {
            sum += parseFloat(data);
          }
        });
        let percentage = ((value * 100) / sum).toFixed(2) + "%";
        // return label + " " + percentage;
        return `${percentage}\n${label}`;
      },
      color: "#fff",
    },
  },
  responsive: true,
  // maintainAspectRatio: false,
  scales: {
    y: {
      display: false,
    },
    x: {
      display: false,
    },
  },
};

export default FieldChart;
