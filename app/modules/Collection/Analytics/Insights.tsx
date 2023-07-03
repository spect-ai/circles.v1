import { useEffect, useState } from "react";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import { Box, Stack, Text } from "degen";
import styled from "styled-components";
import Table from "@/app/common/components/Table";
import { logError } from "@/app/common/utils/utils";
import { AiOutlineCrown } from "react-icons/ai";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { AnimatePresence } from "framer-motion";
import UpgradePlan from "../../Sidebar/UpgradePlanModal";
import mixpanel from "mixpanel-browser";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";

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
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { localCollection: collection } = useLocalCollection();

  const [responseMetrics, setResponseMetrics] = useState({} as ResponseMetrics);
  const [upgradePlanOpen, setUpgradePlanOpen] = useState(false);

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
        if (!res.ok) {
          logError(data.message);
        }
        setResponseMetrics(data);
        console.log({ data });
      } catch (err) {
        console.log({ err });
      }
    })();
  }, []);

  return (
    <Box paddingY="8">
      <AnimatePresence>
        {upgradePlanOpen && (
          <UpgradePlan
            handleClose={() => {
              setUpgradePlanOpen(false);
            }}
          />
        )}
      </AnimatePresence>
      <Stack>
        <Stack direction="horizontal" align="center">
          <Text variant="large" weight="semiBold" color="accent">
            Page metrics for forms shared via link
          </Text>
          {/* <Text color="accent">
            <AiOutlineCrown size="20" />
          </Text> */}
        </Stack>
        {collection.parents[0].pricingPlan === 0 && (
          <Box width="1/3">
            <PrimaryButton
              variant="transparent"
              icon={
                <Text color="accent">
                  <AiOutlineCrown size="20" />
                </Text>
              }
              onClick={() => {
                setUpgradePlanOpen(true);
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Upgrade Plan", {
                    user: currentUser?.username,
                    url: window.location.href,
                  });
              }}
            >
              <Text color="accent">View analytics</Text>
            </PrimaryButton>
          </Box>
        )}
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
            <Text variant="label">Unique Views</Text>
            {collection.parents[0].pricingPlan === 0 ? (
              <BlurBox>
                <Text variant="large">{responseMetrics.totalViews || 0}</Text>
              </BlurBox>
            ) : (
              <Text variant="large">{responseMetrics.totalViews || 0}</Text>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            gap="2"
          >
            <Text variant="label">Unique Starts</Text>
            {collection.parents[0].pricingPlan === 0 ? (
              <BlurBox>
                <Text variant="large">{responseMetrics.totalStarted || 0}</Text>
              </BlurBox>
            ) : (
              <Text variant="large">{responseMetrics.totalStarted || 0}</Text>
            )}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            gap="2"
          >
            <Text variant="label">Submitted</Text>
            {collection.parents[0].pricingPlan === 0 ? (
              <BlurBox>
                <Text variant="large">
                  {responseMetrics.totalSubmitted || 0}
                </Text>
              </BlurBox>
            ) : (
              <Text variant="large">{responseMetrics.totalSubmitted || 0}</Text>
            )}
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            gap="2"
          >
            <Text variant="label">Completion Rate</Text>
            {collection.parents[0].pricingPlan === 0 ? (
              <BlurBox>
                <Text variant="large">
                  {responseMetrics.completionRate?.toFixed(0) || 0}%{" "}
                </Text>
              </BlurBox>
            ) : (
              <Text variant="large">
                {responseMetrics.completionRate?.toFixed(0) || 0}%{" "}
              </Text>
            )}
            <Text variant="small" color="textSecondary">
              {responseMetrics.completionRate > 100
                ? `(Same person may have submitted multiple times)`
                : ``}
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
              columns={["Page", "Unique Views", "Drop off Rate"]}
              blurColumns={
                collection.parents[0].pricingPlan === 0
                  ? [false, true, true]
                  : [false, false, false]
              }
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
      </Stack>
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

const BlurBox = styled(Box)`
  filter: blur(7px);
`;
