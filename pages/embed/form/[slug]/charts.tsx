import EmbedFormLayout from "@/app/common/layout/PublicLayout/EmbedFormLayout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import FieldChart from "@/app/modules/Collection/Analytics/FieldChart";
import { CollectionType } from "@/app/types";
import { Box, Text } from "degen";
import { GetServerSidePropsContext, NextPage } from "next";

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

interface Props {
  slug: string;
  chartId: string;
  collection: CollectionType;
}

const EmbedFormAnalytics: NextPage<Props> = ({
  slug,
  chartId,
  collection,
}: Props) => {
  if (!collection) {
    return (
      <>
        <MetaHead
          title={"Failed to fetch collection"}
          description={
            "Incentivized forms for communities to collect feedback, run surveys, onboarding, and more."
          }
          image={
            "https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
          }
        />
        <EmbedFormLayout>
          <Box padding="8">
            <Text>Failed to fetch</Text>
          </Box>
        </EmbedFormLayout>
      </>
    );
  }

  const chart = collection?.formMetadata.charts?.[chartId as string];
  return (
    <>
      <MetaHead
        title={"Spect Embedded Form Analytics"}
        description={`Embedded analytics ${chart?.name} for form ${collection?.properties?.name} on Spect.`}
        image={
          "https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
        }
      />
      <EmbedFormLayout>
        <Box padding="8">
          {chart ? (
            <FieldChart chart={chart} disabled collection={collection} />
          ) : (
            <Text>Chart not found</Text>
          )}
        </Box>
      </EmbedFormLayout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  const slug = params?.slug;

  const { query } = context;
  const { chartId } = query;

  const headers = {
    "x-secret-key": process.env.API_SECRET_KEY || "",
  };

  if (!slug || !chartId) return { props: { collection: null } };

  const res = await (
    await fetch(`${process.env.API_HOST}/collection/v1/${slug}/embedCharts`, {
      headers,
    })
  )?.json();

  if (!res?.properties) {
    console.log("Failed to fetch collection");
    return {
      props: {
        collection: null,
      },
    };
  }

  return {
    props: {
      slug,
      chartId,
      collection: res,
    },
  };
}

export default EmbedFormAnalytics;
