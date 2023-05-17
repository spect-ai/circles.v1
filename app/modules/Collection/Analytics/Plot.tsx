import { Box, Text } from "degen";
import { BarOptions, LineOptions, PieOptions } from "./ChartOptions";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { Chart, Property } from "@/app/types";

type Props = {
  dataRows: number[];
  chart: Chart;
  labels: string[];
  property: Property;
};

export default function Plot({ dataRows, chart, labels, property }: Props) {
  return (
    <Box>
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
            {property ? "No data found" : "Field deleted"}
          </Text>
        </Box>
      )}
    </Box>
  );
}
