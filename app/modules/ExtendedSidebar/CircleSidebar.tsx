import Accordian from "@/app/common/components/Accordian";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CircleType, UserType } from "@/app/types";
import { DollarOutlined, ProjectOutlined } from "@ant-design/icons";
import {
  Box,
  IconCollection,
  IconLightningBolt,
  IconSparkles,
  IconUserGroup,
  Skeleton,
  SkeletonGroup,
  Stack,
  Text,
  useTheme,
} from "degen";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../Circle/CircleContext";
import SettingsModal from "../Circle/CircleSettingsModal";
import ContributorsModal from "../Circle/ContributorsModal";
import CreateRetroModal from "../Retro/CreateRetro";
import CircleOptions from "./CircleOptions";
import { HeaderButton } from "./ExploreSidebar";
import mixpanel from "@/app/common/utils/mixpanel";
import { smartTrim } from "@/app/common/utils/utils";

export const Container = styled(Box)<{ subH?: string }>`
  ::-webkit-scrollbar {
    display: none;
  }
  height: ${({ subH }) =>
    subH ? `calc(100vh - ${subH})` : "calc(100vh - 9.1rem)"};
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
`;

function CircleSidebar() {
  const router = useRouter();
  const {
    circle: cId,
    project: pId,
    collection: cSlug,
    payment,
  } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { setCircleData, setMemberDetailsData } = useCircle();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);
  const [isRetroModalOpen, setIsRetroModalOpen] = useState(false);
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  if (isLoading) {
    return (
      <SkeletonGroup loading>
        <Box marginTop="8" paddingX="4">
          <Stack space="4">
            <Skeleton width="full" height="8" />
            <Skeleton width="full" height="8" />
          </Stack>
        </Box>
      </SkeletonGroup>
    );
  }

  if (circle?.unauthorized)
    return (
      <Box
        paddingY="2"
        paddingLeft="3"
        paddingRight="3"
        // onMouseEnter={() => setShowCollapseButton(true)}
        // onMouseLeave={() => setShowCollapseButton(false)}
      >
        <Stack space="3">
          <HeaderButton
            data-tour="circle-options-button"
            padding="1"
            marginTop="0.5"
            marginBottom="1"
            borderRadius="large"
            width="full"
            mode={mode}
          >
            <Text size="headingTwo" weight="semiBold" ellipsis>
              {circle?.name}
            </Text>
          </HeaderButton>
        </Stack>
      </Box>
    );

  return (
    <Box paddingY="2" paddingLeft="3" paddingRight="3">
      <AnimatePresence>
        {isSettingsModalOpen && (
          <SettingsModal handleClose={() => setIsSettingsModalOpen(false)} />
        )}
        {isContributorsModalOpen && (
          <ContributorsModal
            handleClose={() => setIsContributorsModalOpen(false)}
          />
        )}
        {isRetroModalOpen && (
          <CreateRetroModal handleClose={() => setIsRetroModalOpen(false)} />
        )}
      </AnimatePresence>
      <Stack space="3">
        <Stack direction="horizontal">
          <CircleOptions />
        </Stack>
        {!isLoading && circle?.toBeClaimed && (
          <PrimaryButton
            onClick={async () => {
              const circleRes = await fetch(
                `${process.env.API_HOST}/circle/v1/${circle?.id}/claimCircle`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({}),
                  credentials: "include",
                }
              );
              const circleData = await circleRes.json();

              if (!circleData) {
                toast.error("Cannot claim circle");
                return;
              }
              const memberDetailsRes = await fetch(
                `${process.env.API_HOST}/circle/${circle?.id}/memberDetails?circleIds=${circle?.id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                }
              );

              const memberDetailsData = await memberDetailsRes.json();

              setCircleData(circleData);
              setMemberDetailsData(memberDetailsData);
            }}
            variant="tertiary"
          >
            Claim
          </PrimaryButton>
        )}
        <Stack direction="vertical" space="2">
          <Link href={`/${cId}`}>
            <PrimaryButton
              variant={
                cId && router.query?.tab !== "payment" && !cSlug && !pId
                  ? "tertiary"
                  : "transparent"
              }
              icon={<IconSparkles size="5" />}
              onClick={() => {
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Circle Dashboard Button", {
                    user: currentUser?.username,
                    url: window.location.href,
                  });
              }}
            >
              Circle Dashboard
            </PrimaryButton>
          </Link>
          <Link href={`/${cId}?tab=payment`}>
            <PrimaryButton
              variant={
                cId && router.query?.tab === "payment" && !cSlug && !pId
                  ? "tertiary"
                  : "transparent"
              }
              icon={<DollarOutlined size={10} />}
              onClick={() => {
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Payment Center Button", {
                    user: currentUser?.username,
                    url: window.location.href,
                  });
              }}
            >
              Payment Center
            </PrimaryButton>
          </Link>
        </Stack>
        <Container subH="15.1rem">
          <Stack>
            {!isLoading &&
              circle?.folderOrder?.map((fol) => {
                const folder = circle?.folderDetails?.[fol];
                return (
                  <Accordian name={folder.name} key={fol} defaultOpen>
                    {folder.contentIds?.map((content) => {
                      return (
                        <Stack key={content} direction="horizontal" space="0">
                          <Box width="full" padding="1">
                            {circle?.children?.[content] && content && (
                              <Link
                                href={`/${circle?.children?.[content].slug}`}
                              >
                                <PrimaryButton
                                  center
                                  variant={
                                    pId === circle?.children?.[content].slug
                                      ? "tertiary"
                                      : "transparent"
                                  }
                                  icon={<IconUserGroup size={"5"} />}
                                >
                                  {smartTrim(
                                    circle?.children?.[content].name,
                                    22
                                  )}
                                </PrimaryButton>
                              </Link>
                            )}
                            {circle?.projects?.[content] && content && (
                              <Link
                                href={`/${cId}/${circle?.projects?.[content].slug}`}
                              >
                                <PrimaryButton
                                  center
                                  variant={
                                    pId === circle?.projects?.[content].slug
                                      ? "tertiary"
                                      : "transparent"
                                  }
                                  icon={
                                    <ProjectOutlined
                                      style={{ fontSize: "1.1rem" }}
                                    />
                                  }
                                >
                                  {smartTrim(
                                    circle?.projects?.[content].name,
                                    22
                                  )}
                                </PrimaryButton>
                              </Link>
                            )}
                            {circle?.retro?.[content] && content && (
                              <Link
                                href={`/${cId}?retroSlug=${circle?.retro?.[content].slug}`}
                              >
                                <PrimaryButton
                                  center
                                  variant={
                                    pId === circle?.retro?.[content].slug
                                      ? "tertiary"
                                      : "transparent"
                                  }
                                  icon={<IconLightningBolt size={"5"} />}
                                >
                                  {smartTrim(
                                    circle?.retro?.[content].title,
                                    22
                                  )}
                                </PrimaryButton>
                              </Link>
                            )}
                            {content &&
                              circle?.collections?.[content] &&
                              circle?.collections?.[content].archived !==
                                true && (
                                <Link
                                  href={`/${cId}/r/${circle?.collections?.[content].slug}`}
                                >
                                  <PrimaryButton
                                    center
                                    variant={
                                      cSlug ===
                                      circle?.collections?.[content].slug
                                        ? "tertiary"
                                        : "transparent"
                                    }
                                    icon={
                                      <Text
                                        color={
                                          cSlug ===
                                          circle?.collections?.[content].slug
                                            ? "accent"
                                            : "inherit"
                                        }
                                      >
                                        <IconCollection size={"5"} />
                                      </Text>
                                    }
                                  >
                                    {smartTrim(
                                      circle?.collections?.[content].name,
                                      22
                                    )}
                                  </PrimaryButton>
                                </Link>
                              )}
                          </Box>
                        </Stack>
                      );
                    })}
                  </Accordian>
                );
              })}
          </Stack>
        </Container>
      </Stack>
    </Box>
  );
}

export default memo(CircleSidebar);
