import { Box, Text } from "degen";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Insights } from "./Insights";
import { ResponseCharting } from "./ResponseCharting";

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
  const [analyticsViewId, setAnalyticsViewId] =
    useState<"Insights" | "ResponseCharting">("Insights");

  const router = useRouter();
  const { circle: cId, collection: colId } = router.query;

  useEffect(() => {}, []);

  return (
    <Box>
      <ViewTabsContainer
        backgroundColor="background"
        paddingX={{
          xs: "0",
          md: "4",
        }}
        borderTopRadius="large"
        display="flex"
        flexDirection={{
          xs: "column",
          md: "row",
        }}
        gap={{
          xs: "2",
          md: "0",
        }}
      >
        <Link href={`/${cId}/r/${colId}?tab=analytics&subTab=insights`}>
          <ViewTab
            paddingX="4"
            backgroundColor={
              analyticsViewId === "Insights"
                ? "backgroundSecondary"
                : "background"
            }
            borderTopWidth={analyticsViewId === "Insights" ? "0.375" : "0"}
            borderRightWidth={analyticsViewId === "Insights" ? "0.375" : "0"}
            borderLeftWidth={analyticsViewId === "Insights" ? "0.375" : "0"}
            key={"pending"}
            onClick={() => setAnalyticsViewId("Insights")}
          >
            <Text variant="small" weight="semiBold">
              Insights
            </Text>
          </ViewTab>
        </Link>
        <Link href={`/${cId}/r/${colId}?tab=analytics&subTab=responseCharting`}>
          <ViewTab
            paddingX="4"
            backgroundColor={
              analyticsViewId === "ResponseCharting"
                ? "backgroundSecondary"
                : "background"
            }
            borderTopWidth={
              analyticsViewId === "ResponseCharting" ? "0.375" : "0"
            }
            borderRightWidth={
              analyticsViewId === "ResponseCharting" ? "0.375" : "0"
            }
            borderLeftWidth={
              analyticsViewId === "ResponseCharting" ? "0.375" : "0"
            }
            key={"pending"}
            onClick={() => setAnalyticsViewId("ResponseCharting")}
          >
            <Text variant="small" weight="semiBold">
              ResponseCharting
            </Text>
          </ViewTab>
        </Link>
      </ViewTabsContainer>
      <Container marginX="8" paddingY="0" marginTop="2">
        {analyticsViewId === "Insights" && <Insights />}
        {analyticsViewId === "ResponseCharting" && <ResponseCharting />}
      </Container>
    </Box>
  );
};

const Container = styled(Box)`
&::-webkit-scrollbar {
  width: 0.5rem;
}
&::-webkit-scrollbar-track {
  background: transparent;
}
&::-webkit-scrollbar-thumb {
  background: linear-gradient(
      180deg,
      rgba(191, 90, 242, 0.4) 50%,
      rgba(191, 90, 242, 0.1) 100%
      )
      0% 0% / 100% 100% no-repeat padding-box;
  }
}
&::-webkit-scrollbar-thumb:hover {
  background: rgba(191, 90, 242, 0.8);
}


`;

export const ViewTabsContainer = styled(Box)``;

export const ViewTab = styled(Box)`
  @media (max-width: 768px) {
    max-width: 100%;
  }

  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export default Analytics;
