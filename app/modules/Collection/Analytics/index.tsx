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
import { Col, Row } from "react-grid-system";

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
    <ScrollContainer padding="4">
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
            embedRoute={`https://circles-v1-production.vercel.app/embed/form/${collection?.slug}/charts?chartId=${chartId}`}
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
          {/* <Box width="48">
            <PrimaryButton
              onClick={() => setIsEmebedOpen(true)}
              variant="tertiary"
            >
              <Text color="accent">Embed</Text>
            </PrimaryButton>
          </Box> */}
        </Stack>
        {!collection.formMetadata.chartOrder ||
        collection.formMetadata.chartOrder?.length === 0 ? (
          <Stack align="center">
            <Heading>No charts have been added</Heading>
          </Stack>
        ) : (
          <Row>
            {collection.formMetadata.chartOrder?.map((chartId) => {
              const chart = collection.formMetadata.charts?.[chartId];
              if (!chart) return null;
              return (
                <Col xs={12} sm={6} md={4} lg={3} key={chartId}>
                  <FieldChart
                    chart={chart}
                    setChartId={setChartId}
                    setIsAddChartOpen={setIsAddChartOpen}
                    collection={collection}
                    updateCollection={updateCollection}
                    setIsEmbedOpen={setIsEmebedOpen}
                  />
                </Col>
              );
            })}
          </Row>
        )}
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
