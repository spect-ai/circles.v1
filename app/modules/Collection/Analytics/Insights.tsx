import { useEffect, useState } from "react";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import { Box, Text } from "degen";
import styled from "styled-components";
import Table from "@/app/common/components/Table";
import { Col, Row } from "react-grid-system";

type Props = {};

type ResponseMetrics = {
  averageTimeSpent: number;
  totalViews: number;
  totalStarted: number;
  totalSubmitted: number;
  completionRate: number;
  totalTimeSpentMetricsOnPage: {
    [pageId: string]: number;
  };
  pageVisitMetricsForAllUser: {
    [pageId: string]: number;
  };
  averageTimeSpentOnPage: {
    [pageId: string]: number;
  };
  dropOffRate: {
    [pageId: string]: number;
  };
};

export const Insights = (props: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const [responseMetrics, setResponseMetrics] = useState({} as ResponseMetrics);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(
          `${process.env.API_HOST}/collection/v1/${collection?.id}/responseMetrics`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setResponseMetrics(data);
        console.log({ data });
      } catch (err) {
        console.log({ err });
      }
    })();
  }, []);

  return (
    <Box paddingY="8">
      <Text variant="large" weight="semiBold" color="accent">
        Page metrics for forms shared via link
      </Text>
      <Box
        display="flex"
        flexDirection="row"
        width="full"
        gap={{
          md: "6",
          xs: "2",
        }}
        marginTop="4"
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="2"
        >
          <Text variant="label">Views</Text>

          <Text variant="large">{responseMetrics.totalViews || 0}</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="2"
        >
          <Text variant="label">Started</Text>

          <Text variant="large">{responseMetrics.totalStarted || 0}</Text>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="2"
        >
          <Text variant="label">Submitted</Text>

          <Text variant="large">{responseMetrics.totalSubmitted || 0}</Text>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="2"
        >
          <Text variant="label">Completion Rate</Text>

          <Text variant="large">
            {responseMetrics.completionRate?.toFixed(0) || 0}%
          </Text>
        </Box>
      </Box>
      <ScrollContainer
        marginTop="4"
        width={{
          md: "3/4",
          xs: "full",
        }}
      >
        <Box display="flex" flexDirection="column" gap="4">
          <Text variant="label" weight="bold">
            Metrics for each page
          </Text>
          <Table
            columns={["Page", "Views", "Drop off Rate"]}
            columnWidths={{
              xl: [6, 3, 3],
              lg: [6, 3, 3],
              md: [6, 3, 3],
              sm: [6, 3, 3],
              xs: [4, 3, 3],
            }}
            rows={collection.formMetadata.pageOrder.map((pageId) => {
              if (["connect", "connectDiscord", "collect"].includes(pageId))
                return [];
              if (pageId === "submitted")
                return [
                  collection.formMetadata.pages[pageId].name,
                  Object.keys(collection.data || {})?.length || 0,
                  "0%",
                ];
              return [
                collection.formMetadata.pages[pageId].name,
                responseMetrics.pageVisitMetricsForAllUser?.[pageId] || 0,
                `${(responseMetrics.dropOffRate?.[pageId] || 0).toFixed(0)}%`,
              ];
            })}
          />
        </Box>
      </ScrollContainer>
    </Box>
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
