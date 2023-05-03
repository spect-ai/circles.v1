import { Box, Text } from "degen";
import { useEffect, useState } from "react";
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

const EmbeddedAnalytics = () => {
  const [collection, setCollection] = useState<CollectionType>();

  const router = useRouter();
  const { slug, chartId } = router.query;

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

  const chart = collection?.formMetadata.charts?.[chartId as string];

  return (
    <Box padding="8">
      {chart ? (
        <FieldChart
          chart={chart}
          disabled
          collection={collection}
          updateCollection={setCollection}
        />
      ) : (
        <Text>Chart not found</Text>
      )}
    </Box>
  );
};

export default EmbeddedAnalytics;
