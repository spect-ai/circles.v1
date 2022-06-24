import React, { ReactElement } from "react";
import { Box, Button, Heading, IconChevronLeft } from "degen";
import { useRouter } from "next/router";
import styled from "styled-components";
import { motion } from "framer-motion";
import CircleSidebar from "./CircleSidebar";
import { useGlobalContext } from "@/app/context/globalContext";
import { useQuery } from "react-query";
import { CircleType, ProjectType } from "@/app/types";
import { DoubleRightOutlined } from "@ant-design/icons";
import { SlideButtonContainer } from "../Header";

export const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 5rem);
  overflow-y: auto;
`;

function ExtendedSidebar(): ReactElement {
  const { setIsSidebarExpanded, isSidebarExpanded } = useGlobalContext();
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });

  return (
    <motion.div
      key="content"
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { width: "300px", opacity: 1, minWidth: "300px" },
        collapsed: { width: 0, opacity: 0, minWidth: "0px" },
      }}
      transition={{ duration: 0.5 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        borderRightWidth="0.375"
        paddingX="3"
        height="full"
      >
        <Box>
          <Box
            borderBottomWidth="0.375"
            paddingY="3"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Heading>
              {cId && pId && (circle?.name || project?.parents[0].name)}
            </Heading>
            <SlideButtonContainer
              transitionDuration="300"
              style={{
                transform: isSidebarExpanded
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
              marginTop="2"
              marginBottom="2.5"
              cursor="pointer"
              color="textSecondary"
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            >
              <DoubleRightOutlined style={{ fontSize: "1.1rem" }} />
            </SlideButtonContainer>
            {/* <Button
              variant="transparent"
              size="small"
              shape="circle"
              onClick={() => {
                setIsSidebarExpanded(false);
              }}
            >
              <IconChevronLeft />
            </Button> */}
          </Box>
          <Container>{cId && <CircleSidebar />}</Container>
        </Box>
      </Box>
    </motion.div>
  );
}

export default ExtendedSidebar;
