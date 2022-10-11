import Accordian from "@/app/common/components/Accordian";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CircleType } from "@/app/types";
import { ProjectOutlined } from "@ant-design/icons";
import {
  Box,
  IconLightningBolt,
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
import CreateRetroModal from "../Retro/CreateRetro/CreateRetroModal";
import CircleOptions from "./CircleOptions";
import CollapseButton from "./CollapseButton";
import ExploreSidebar, { HeaderButton } from "./ExploreSidebar";

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
  const { circle: cId, project: pId } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { setCircleData, setMemberDetailsData } = useCircle();

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isContributorsModalOpen, setIsContributorsModalOpen] = useState(false);
  const [isRetroModalOpen, setIsRetroModalOpen] = useState(false);
  const { mode } = useTheme();

  const [showCollapseButton, setShowCollapseButton] = useState(false);
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
        onMouseEnter={() => setShowCollapseButton(true)}
        onMouseLeave={() => setShowCollapseButton(false)}
      >
        <Stack space="3">
          <HeaderButton
            data-tour="circle-options-button"
            padding="1"
            marginTop="0.5"
            marginBottom="1"
            borderRadius="large"
            width="full"
            onClick={() => {}}
            mode={mode}
          >
            <Stack direction="horizontal" align="center">
              <Text size="headingTwo" weight="semiBold" ellipsis>
                {circle?.name}
              </Text>
            </Stack>
          </HeaderButton>
        </Stack>
        <Container subH="8.1rem"></Container>
      </Box>
    );

  return (
    <Box
      paddingY="2"
      paddingLeft="3"
      paddingRight="3"
      onMouseEnter={() => setShowCollapseButton(true)}
      onMouseLeave={() => setShowCollapseButton(false)}
    >
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
          <CollapseButton
            show={showCollapseButton}
            setShowCollapseButton={setShowCollapseButton}
            top="2.7rem"
            left="21rem"
          />
        </Stack>
        {circle?.toBeClaimed && (
          <Stack>
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
                console.log({ circleRes });
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
                console.log({ memberDetailsRes });

                const memberDetailsData = await memberDetailsRes.json();
                console.log({ circleData });

                setCircleData(circleData);
                setMemberDetailsData(memberDetailsData);
              }}
              variant="tertiary"
            >
              Claim
            </PrimaryButton>
          </Stack>
        )}

        <Container subH={circle?.toBeClaimed ? "12.1rem" : "9.1rem"}>
          <Stack>
            {circle?.folderOrder?.map((fol) => {
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
                                variant={
                                  pId === circle?.children?.[content].slug
                                    ? "tertiary"
                                    : "transparent"
                                }
                                icon={<IconUserGroup size={"5"} />}
                              >
                                {circle?.children?.[content].name}
                              </PrimaryButton>
                            </Link>
                          )}
                          {circle?.projects?.[content] && content && (
                            <Link
                              href={`/${cId}/${circle?.projects?.[content].slug}`}
                            >
                              <PrimaryButton
                                variant={
                                  pId === circle?.projects?.[content].slug
                                    ? "tertiary"
                                    : "transparent"
                                }
                                icon={<ProjectOutlined style={{ fontSize: "1.1rem" }} />}
                              >
                                {circle?.projects?.[content].name}
                              </PrimaryButton>
                            </Link>
                          )}
                          {circle?.retro?.[content] && content && (
                            <Link
                              href={`/${cId}?retroSlug=${circle?.retro?.[content].slug}`}
                            >
                              <PrimaryButton
                                variant={
                                  pId === circle?.retro?.[content].slug
                                    ? "tertiary"
                                    : "transparent"
                                }
                                icon={<IconLightningBolt size={"5"} />}
                              >
                                {circle?.retro?.[content].title}
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

{/* <Accordian
              name="Projects"
              defaultOpen
              icon={<ProjectOutlined style={{ fontSize: "1.3rem" }} />}
            >
              <Stack space="0">
                {circle?.projects &&
                  Object.values(circle?.projects).map((proj) => (
                    <Stack key={proj.id} direction="horizontal" space="0">
                      {/* <Box borderRightWidth="0.5" /> */}
            //           <Box width="full" padding="1">
            //             <Link href={`/${cId}/${proj.slug}`}>
            //               <PrimaryButton
            //                 variant={
            //                   pId === proj.slug ? "tertiary" : "transparent"
            //                 }
            //               >
            //                 {proj.name}
            //               </PrimaryButton>
            //             </Link>
            //           </Box>
            //         </Stack>
            //       ))}
            //     {circle?.projects && !Object.values(circle?.projects).length && (
            //       <Box paddingLeft="7" paddingY="2">
            //         <Text variant="label">No projects created</Text>
            //       </Box>
            //     )}
            //   </Stack>
            // </Accordian>
            // <Accordian name="Workstreams" defaultOpen icon={<IconUserGroup />}>
            //   <Stack space="0">
            //     {circle?.children &&
            //       Object.values(circle?.children).map((space) => (
            //         <Stack key={space.id} direction="horizontal" space="0">
            //           {/* <Box borderRightWidth="0.5" /> */}
            //           <Box width="full" padding="1">
            //             <Link href={`/${space.slug}`} key={space.id}>
            //               <PrimaryButton variant="transparent">
            //                 {space.name}
            //               </PrimaryButton>
            //             </Link>
            //           </Box>
            //         </Stack>
            //       ))}
            //     {circle?.children && !Object.values(circle?.children).length && (
            //       <Box paddingLeft="7" paddingY="2">
            //         <Text variant="label">No workstreams created</Text>
            //       </Box>
            //     )}
            //   </Stack>
            // </Accordian> */}
