import Link from "next/link";
import React, { ReactElement, useEffect } from "react";
import { Box, Button } from "degen";
import { useRouter } from "next/router";
import CreateCircle from "./CreateCircleModal";
import Logo from "@/app/common/components/Logo";
import { HomeOutlined } from "@ant-design/icons";
import { useGlobalContext } from "@/app/context/globalContext";
import { useQuery } from "react-query";
import { CircleType, ProjectType, UserType } from "@/app/types";

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

  const { setIsSidebarExpanded } = useGlobalContext();

  const {
    data: myCircles,
    isLoading: myCirclesLoading,
    refetch,
  } = useQuery<CircleType[]>(
    "myOrganizations",
    () =>
      fetch(`${process.env.API_HOST}/circle/myOrganizations`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    void refetch();
  }, [refetch, currentUser]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRightWidth="0.375"
      paddingX="2"
      // onMouseEnter={() => {
      //   setIsSidebarExpanded(true);
      // }}
      transitionDuration="500"
    >
      {/* <Box borderBottomWidth="0.375" paddingTop="3">
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
      </Box> */}
      <Box marginTop="3">
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
            myCircles?.map &&
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
