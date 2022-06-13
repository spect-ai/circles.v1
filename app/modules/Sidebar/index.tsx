import Link from "next/link";
import React, { ReactElement, useEffect, useState } from "react";
import { Box, Button, IconPlus, IconUserSolid, Skeleton, Stack } from "degen";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import CreateCircle from "./CreateCircle";
import Logo from "@/app/common/components/Logo";
import { HomeOutlined } from "@ant-design/icons";

type props = {
  setIsExpanded: (isExpanded: boolean) => void;
};

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

function Sidebar({ setIsExpanded }: props): ReactElement {
  // const [myTribes, setMyTribes] = useState<Team[]>({} as Team[]);

  const [isLoading, setIsLoading] = useState(true);

  // const { setIsSidebarExpanded, tribe, space } = useDataContext();
  // const { runMoralisFunction } = useMoralisFunction();
  // const { isInitialized, isAuthenticated } = useMoralis();

  const router = useRouter();
  const { id, bid, tid } = router.query;

  // useEffect(() => {
  //   setIsLoading(true);
  //   if (isInitialized && isAuthenticated) {
  //     runMoralisFunction('getMyTeams', {})
  //       .then((res: Team[]) => {
  //         setMyTribes(res);
  //         console.log({ res });
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setIsLoading(false);
  //       });
  //   }
  // }, [isInitialized, isAuthenticated]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRightWidth="0.375"
      paddingX="3"
      onMouseEnter={() => {
        setIsExpanded(true);
        // setIsSidebarExpanded(true);
      }}
      transitionDuration="700"
    >
      <Box borderBottomWidth="0.375" paddingY="3">
        <Logo
          href="/"
          src="https://ipfs.moralis.io:2053/ipfs/QmVYsa4KQyRwBSJxQCmD1rDjyqYd1HJKrDfqLk3KMKLEhn"
        />
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
          <motion.div
            variants={containerAnimation}
            initial="hidden"
            animate="show"
          >
            {/* {myTribes?.map((aTribe) => (
              <motion.div key={aTribe.teamId} variants={itemAnimation}>
                <Box paddingY="2">
                  <Logo
                    key={aTribe._id}
                    href={`/tribe/${aTribe.teamId}`}
                    src={aTribe.logo}
                  />
                </Box>
              </motion.div>
            ))} */}
          </motion.div>
        </Box>
      )}
      <CreateCircle />
    </Box>
  );
}

export default Sidebar;
