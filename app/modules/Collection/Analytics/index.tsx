import { Box, Heading, Stack, Text } from "degen";
import AddChart from "./AddChart";
import { useLocalCollection } from "../Context/LocalCollectionContext";

import FieldChart from "./FieldChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  RadarController,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styled from "styled-components";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { AiOutlineAreaChart } from "react-icons/ai";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

type Props = {};

const Analytics = (props: Props) => {
  const { localCollection: collection } = useLocalCollection();
  const [isAddChartOpen, setIsAddChartOpen] = useState(false);
  const [chartId, setChartId] = useState("");
  return (
    <ScrollContainer>
      <AnimatePresence>
        {isAddChartOpen && (
          <AddChart
            handleClose={() => setIsAddChartOpen(false)}
            chartId={chartId}
          />
        )}
      </AnimatePresence>
      <Stack>
        <Box width="1/4">
          <PrimaryButton
            center
            icon={<AiOutlineAreaChart size={20} />}
            onClick={() => {
              setChartId("");
              setIsAddChartOpen(true);
            }}
          >
            Add Chart
          </PrimaryButton>
        </Box>
        <Stack direction="horizontal" wrap>
          {collection.formMetadata.chartOrder?.map((chartId) => {
            const chart = collection.formMetadata.charts?.[chartId];
            if (!chart) return null;
            return (
              <FieldChart
                key={chartId}
                chart={chart}
                setChartId={setChartId}
                setIsAddChartOpen={setIsAddChartOpen}
              />
            );
          })}
        </Stack>
      </Stack>
    </ScrollContainer>
  );
};

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 5px;
  }
  @media (max-width: 992px) {
    height: calc(100vh - 9rem);
  }
  height: calc(100vh - 9rem);
`;

export default Analytics;
