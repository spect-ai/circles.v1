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
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styled from "styled-components";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { AiOutlineAreaChart } from "react-icons/ai";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Embed } from "../Embed";

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
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [isAddChartOpen, setIsAddChartOpen] = useState(false);
  const [chartId, setChartId] = useState("");
  const [isEmebedOpen, setIsEmebedOpen] = useState(false);

  return (
    <ScrollContainer padding="2">
      <AnimatePresence>
        {isAddChartOpen && (
          <AddChart
            handleClose={() => setIsAddChartOpen(false)}
            chartId={chartId}
          />
        )}
        {isEmebedOpen && (
          <Embed
            setIsOpen={setIsEmebedOpen}
            embedRoute={`https://dev.spect.network/embed/form/${collection?.slug}/charts?`}
          />
        )}
      </AnimatePresence>
      <Stack>
        <Stack direction="horizontal" justify="space-between">
          <Box width="48">
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
          <Box width="48">
            <PrimaryButton
              onClick={() => setIsEmebedOpen(true)}
              variant="tertiary"
            >
              <Text color="accent">Embed</Text>
            </PrimaryButton>
          </Box>
        </Stack>
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
                collection={collection}
                updateCollection={updateCollection}
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
