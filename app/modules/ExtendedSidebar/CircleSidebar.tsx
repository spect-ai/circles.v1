import Accordian from "@/app/common/components/Accordian";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CircleType, UserType } from "@/app/types";
import {
  BankOutlined,
  DollarOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import {
  Box,
  IconLightningBolt,
  IconSparkles,
  IconUserGroup,
  IconUserGroupSolid,
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
import styled from "styled-components";
import SettingsModal from "../Circle/CircleSettingsModal";
import CircleOptions from "./CircleOptions";
import { HeaderButton } from "./ExploreSidebar";
import mixpanel from "@/app/common/utils/mixpanel";
import { smartTrim } from "@/app/common/utils/utils";
import { getViewIcon } from "../CollectionProject/Heading";
import { Table } from "react-feather";
import InviteMemberModal, {
  CustomButton,
} from "../Circle/ContributorsModal/InviteMembersModal";
import { BiBot } from "react-icons/bi";
import UpgradePlan from "../Sidebar/UpgradePlanModal";
import { RiFlowChart } from "react-icons/ri";
import { AiOutlineCrown } from "react-icons/ai";

export const Container = styled(Box)<{ subH?: string }>`
  @media (max-width: 768px) {
    height: calc(100vh - 16.1rem);
  }

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
  const { circle: cId, project: pId, collection: cSlug } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalInitialTab, setSettingsModalInitialTab] = useState(0);
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [upgradePlanOpen, setUpgradePlanOpen] = useState(false);

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
          <SettingsModal
            handleClose={() => {
              setIsSettingsModalOpen(false);
              setSettingsModalInitialTab(0);
            }}
            initialTab={settingsModalInitialTab}
          />
        )}
        {upgradePlanOpen && (
          <UpgradePlan
            handleClose={() => {
              setUpgradePlanOpen(false);
            }}
          />
        )}
      </AnimatePresence>
      <Stack space="3">
        <Stack direction="horizontal">
          <CircleOptions />
        </Stack>

        <Container subH="8.1rem">
          <Stack direction="vertical" space="2">
            <Box padding="1">
              {circle?.pricingPlan === 0 && (
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
                  <Text color="accent">Upgrade Plan</Text>
                </PrimaryButton>
              )}
            </Box>
            <Stack direction="horizontal" space="2">
              <Box width="1/2">
                <CustomButton
                  mode={mode}
                  onClick={() => {
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Sidebar roles", {
                        circle: circle?.slug,
                        user: currentUser?.username,
                      });
                    setSettingsModalInitialTab(3);
                    setIsSettingsModalOpen(true);
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    gap="2"
                  >
                    <Text>
                      <IconUserGroup size="4" />{" "}
                    </Text>
                    <Text>Roles</Text>
                  </Box>
                </CustomButton>
              </Box>
              <InviteMemberModal buttonIsSmallTransparent={true} />
            </Stack>
            <Link href={`/${cId}`}>
              <PrimaryButton
                center
                variant={
                  cId &&
                  ![
                    "payment",
                    "credential",
                    "automation",
                    "governance",
                    "membership",
                    "workflows",
                  ].includes(router.query?.tab as string) &&
                  !cSlug &&
                  !pId
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
                Dashboard
              </PrimaryButton>
            </Link>
            <Link href={`/${cId}?tab=workflows`}>
              <PrimaryButton
                center
                variant={
                  cId && router.query?.tab === "workflows" && !cSlug && !pId
                    ? "tertiary"
                    : "transparent"
                }
                icon={<RiFlowChart size="16" />}
                suffix={<Text color="accent">Beta</Text>}
                onClick={() => {
                  process.env.NODE_ENV === "production" &&
                    mixpanel.track("Workflows", {
                      user: currentUser?.username,
                      url: window.location.href,
                    });
                }}
              >
                Community AI
              </PrimaryButton>
            </Link>
            {circle?.sidebarConfig?.showPayment && (
              <Link href={`/${cId}?tab=payment&status=pending`}>
                <PrimaryButton
                  center
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
                  Payments
                </PrimaryButton>
              </Link>
            )}
            {circle?.sidebarConfig?.showAutomation && (
              <Link href={`/${cId}?tab=automation`}>
                <PrimaryButton
                  center
                  variant={
                    cId && router.query?.tab === "automation" && !cSlug && !pId
                      ? "tertiary"
                      : "transparent"
                  }
                  icon={<BiBot size={16} />}
                  onClick={() => {
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Automation Center Button", {
                        user: currentUser?.username,
                        url: window.location.href,
                      });
                  }}
                >
                  Automations
                </PrimaryButton>
              </Link>
            )}
            {circle?.sidebarConfig?.showGovernance && (
              <Box position="relative">
                <Link href={`/${cId}?tab=governance&proposalStatus=Active`}>
                  <PrimaryButton
                    center
                    variant={
                      cId &&
                      router.query?.tab === "governance" &&
                      !cSlug &&
                      !pId
                        ? "tertiary"
                        : "transparent"
                    }
                    icon={<BankOutlined />}
                    onClick={() => {
                      process.env.NODE_ENV === "production" &&
                        mixpanel.track("Governance Center Button", {
                          user: currentUser?.username,
                          url: window.location.href,
                        });
                    }}
                  >
                    Governance
                  </PrimaryButton>
                </Link>
              </Box>
            )}
            {circle?.sidebarConfig?.showMembership && (
              <Box position="relative">
                <Link href={`/${cId}?tab=membership`}>
                  <PrimaryButton
                    center
                    variant={
                      cId &&
                      router.query?.tab === "membership" &&
                      !cSlug &&
                      !pId
                        ? "tertiary"
                        : "transparent"
                    }
                    icon={<IconUserGroupSolid size="4" />}
                    onClick={() => {
                      process.env.NODE_ENV === "production" &&
                        mixpanel.track("Membership Center Button", {
                          user: currentUser?.username,
                          url: window.location.href,
                        });
                    }}
                  >
                    Memberships
                  </PrimaryButton>
                </Link>
              </Box>
            )}

            {/* <Link href={`/${cId}?tab=credential`}>
            <PrimaryButton
              variant={
                cId && router.query?.tab === "credential" && !cSlug && !pId
                  ? "tertiary"
                  : "transparent"
              }
              icon={<StarOutlined size={10} />}
              onClick={() => {
                process.env.NODE_ENV === "production" &&
                  mixpanel.track("Credential Center Button", {
                    user: currentUser?.username,
                    url: window.location.href,
                  });
              }}
            >
              Credential Center
            </PrimaryButton>
          </Link> */}
          </Stack>
          <Stack>
            {!isLoading &&
              circle?.folderOrder?.map((fol) => {
                const folder = circle?.folderDetails?.[fol];
                if (!folder) return null;
                return (
                  <Accordian name={folder.name} key={fol} defaultOpen>
                    {folder.contentIds?.map((content) => {
                      if (circle?.collections?.[content]?.archived) return null;
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
                            {content && circle?.collections?.[content] && (
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
                                      {circle?.collections?.[content]
                                        .viewType ? (
                                        getViewIcon(
                                          circle?.collections?.[content]
                                            .viewType || ""
                                        )
                                      ) : (
                                        <Table
                                          size={18}
                                          style={{ marginTop: 4 }}
                                        />
                                      )}
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
      {/* <PrimaryButton
        variant="tertiary"
        onClick={() => {
          process.env.NODE_ENV === "production" &&
            mixpanel.track("Use template", {
              circle: circle?.slug,
              user: currentUser?.username,
            });
          setTemplateModalOpen(true);
        }}
      >
        Use a Template
      </PrimaryButton> */}
    </Box>
  );
}

export default memo(CircleSidebar);

const Badge = styled(Box)`
  position: absolute;
  top: 12px;
  right: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
