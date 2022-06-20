import Link from "next/link";
import React, { ReactElement, useEffect, useState } from "react";
import { Box, Button, IconPlus, IconUserSolid, Skeleton, Stack } from "degen";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import CreateCircle from "./CreateCircleModal";
import Logo from "@/app/common/components/Logo";
import { HomeOutlined } from "@ant-design/icons";
import { useGlobalContext } from "@/app/context/globalContext";
import { useQuery } from "react-query";
import { CircleType, ProjectType, UserType } from "@/app/types";

const containerAnimation = {
  hidden: { rotate: 90 },
  show: {
    rotate: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

function Sidebar(): ReactElement {
  const router = useRouter();
  const { circle: cId, project: pId } = router.query;
  const { data: circle, isLoading } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  const { data: myCircles, isLoading: myCirclesLoading } = useQuery<
    CircleType[]
  >("myOrganizations", () =>
    fetch(`http://localhost:3000/circle/myOrganizations`, {
      credentials: "include",
    }).then((res) => res.json())
  );
  const { setIsSidebarExpanded } = useGlobalContext();

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRightWidth="0.375"
      paddingX="3"
      onMouseEnter={() => {
        cId && setIsSidebarExpanded(true);
      }}
      transitionDuration="700"
    >
      <Box borderBottomWidth="0.375" paddingY="3">
        {cId ? (
          <Logo
            href="/"
            src={circle?.avatar || (pId && project?.parents[0].avatar) || ""}
          />
        ) : (
          <Logo
            href="/"
            src="https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
          />
        )}
      </Box>
      <Box marginTop="2">
        <Link href="/" passHref>
          <Button shape="circle" variant="secondary" size="small">
            <HomeOutlined style={{ fontSize: "1.3rem" }} />
          </Button>
        </Link>
      </Box>
      {isLoading ? (
        <div />
      ) : (
        <Box paddingY="3" borderBottomWidth="0.375">
          {!myCirclesLoading &&
            currentUser?.id &&
            myCircles?.map((aCircle) => (
              <Box paddingY="2" key={aCircle.id}>
                <Logo
                  key={aCircle.id}
                  href={`/${aCircle.slug}`}
                  src={aCircle.avatar}
                />
              </Box>
            ))}
        </Box>
      )}
      <CreateCircle />
    </Box>
  );
}

export default Sidebar;
