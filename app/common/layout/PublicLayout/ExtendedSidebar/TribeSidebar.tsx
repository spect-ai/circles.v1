import Accordian from "@/app/common/components/Accordian";
import { AppstoreOutlined } from "@ant-design/icons";
import {
  Box,
  Button,
  IconCollection,
  Skeleton,
  SkeletonGroup,
  Stack,
} from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function TribeSidebar() {
  const [mySpaces, setMySpaces] = useState([] as any);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  // useEffect(() => {
  //   console.log("initiated");
  //   setIsLoading(true);
  //   if (id) {
  //     runMoralisFunction("getMySpaces", {
  //       teamId: id,
  //     })
  //       .then((res) => {
  //         console.log({ res });
  //         setMySpaces(res);
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setIsLoading(false);
  //       });
  //   }
  // }, []);

  if (isLoading) {
    return (
      <SkeletonGroup loading>
        <Box marginTop="8" paddingX="4">
          <Stack space="4">
            <Skeleton width="full" height="8">
              Hello World
            </Skeleton>
            <Skeleton width="full" height="8">
              Hello World
            </Skeleton>
          </Stack>
        </Box>
      </SkeletonGroup>
    );
  }

  return (
    <Box marginTop="4">
      <Button
        prefix={<AppstoreOutlined style={{ fontSize: "1.3rem" }} />}
        center
        width="full"
        variant="transparent"
        size="small"
      >
        Overview
      </Button>
      <Accordian name="Workspaces" defaultOpen>
        <Stack>
          {/* {mySpaces.map((space: BoardData) => ( */}
          <Button
            prefix={<IconCollection />}
            center
            width="full"
            variant="transparent"
            size="small"
          >
            {"Workspace 1"}
          </Button>
          {/* ))} */}
        </Stack>
      </Accordian>
    </Box>
  );
}
