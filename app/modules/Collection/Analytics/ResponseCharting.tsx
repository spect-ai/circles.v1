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
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Embed } from "../Embed";
import { Col, Row } from "react-grid-system";
import { BsFillPieChartFill } from "react-icons/bs";

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

export const ResponseCharting = (props: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [isAddChartOpen, setIsAddChartOpen] = useState(false);
  const [chartId, setChartId] = useState("");
  const [isEmebedOpen, setIsEmebedOpen] = useState(false);

  return (
    <ScrollContainer padding="0">
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
            embedRoute={`https://circles.spect.network/embed/form/${collection?.slug}/charts?chartId=${chartId}`}
          />
        )}
      </AnimatePresence>
      <Box marginTop="4">
        <Stack direction="horizontal" justify="space-between">
          {collection.formMetadata.chartOrder &&
            collection.formMetadata.chartOrder?.length > 0 && (
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
            )}
        </Stack>
        {!collection.formMetadata.chartOrder ||
        collection.formMetadata.chartOrder?.length === 0 ? (
          <Box
            style={{
              margin: "12% 20%",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <BsFillPieChartFill
              style={{ fontSize: "5rem", color: "rgb(191, 90, 242, 0.7)" }}
            />
            <Text variant="large" color={"textTertiary"} align="center">
              No charts have been added
            </Text>
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
          </Box>
        ) : (
          <Box paddingY="4">
            <Row>
              {collection.formMetadata.chartOrder?.map((chartId) => {
                const chart = collection.formMetadata.charts?.[chartId];
                if (!chart) return null;
                return (
                  <Col xs={12} sm={6} md={4} lg={6} key={chartId}>
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
          </Box>
        )}
      </Box>
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
