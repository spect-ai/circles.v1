import {
  Box,
  Button,
  IconCollection,
  IconEth,
  Skeleton,
  SkeletonGroup,
  Stack,
  Text,
} from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import useMoralisFunction from "../../../../hooks/useMoralisFunction";
// import { BoardData } from "../../../../types";
// import Accordian from "../../../elements/accordian/Accordian";

export default function TribeSidebar() {
  const [mySpaces, setMySpaces] = useState([] as any);
  const [isLoading, setIsLoading] = useState(true);
  // const { runMoralisFunction } = useMoralisFunction();
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
    // <Box borderBottomWidth="0.375" paddingBottom="2">
    //   <Accordian name="My Spaces" defaultOpen>
    //     <Stack>
    //       {mySpaces.map((space: BoardData) => (
    //         <Button
    //           key={space._id}
    //           prefix={<IconCollection />}
    //           center
    //           width="full"
    //           variant="transparent"
    //           size="small"
    //           onClick={() => router.push(`/tribe/${id}/space/${space._id}`)}
    //         >
    //           {space.name}
    //         </Button>
    //       ))}
    //     </Stack>
    //   </Accordian>
    // </Box>
    <Box />
  );
}
