import { Box, Heading, Stack } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import FieldChart from "./FieldChart";
import { CollectionType } from "@/app/types";
import { useRouter } from "next/router";

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

type Props = {};

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

const EmbeddedAnalytics = (props: Props) => {
  const [collection, setCollection] = useState<CollectionType>();

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    (async () => {
      if (slug) {
        const res = await fetch(
          `${process.env.API_HOST}/collection/v1/${slug}/embedCharts`
        );
        const collection = await res.json();
        setCollection(collection);
      }
    })();
  }, [slug]);

  return (
    <ScrollContainer padding="8">
      <Stack direction="horizontal" wrap>
        {collection &&
          collection.formMetadata.chartOrder?.map((chartId) => {
            const chart = collection.formMetadata.charts?.[chartId];
            if (!chart) return null;
            return (
              <FieldChart
                key={chartId}
                chart={chart}
                disabled
                collection={collection}
                updateCollection={setCollection}
              />
            );
          })}
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

export default EmbeddedAnalytics;
