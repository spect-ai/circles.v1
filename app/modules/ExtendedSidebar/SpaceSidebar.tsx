import React, { useEffect, useState } from "react";
import { Box, Button, IconCollection, IconEth, Stack, Text } from "degen";
import { useRouter } from "next/router";

// import Accordian from "../../../elements/accordian/Accordian";
// import useMoralisFunction from "../../../../hooks/useMoralisFunction";
// import { BoardData } from "../../../../types";

// import AddProject from "../../../elements/modals/addProject/AddProject";
// import CreateEpoch from "../../../modules/epoch/createEpochModal";
// import { useDataContext } from "../../../../context/dataContext";
// import CreatePeriod from "../../../modules/createPeriod";

export default function SpaceSidebar() {
  const [mySpaces, setMySpaces] = useState([] as any);
  const [isLoading, setIsLoading] = useState(true);
  // const { runMoralisFunction } = useMoralisFunction();
  const router = useRouter();
  const { id } = router.query;
  // const { setTab, tab } = useDataContext();

  // useEffect(() => {
  //   setIsLoading(true);
  //   runMoralisFunction("getMySpaces", {
  //     teamId: id,
  //   })
  //     .then((res) => {
  //       console.log({ res });
  //       setMySpaces(res);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setIsLoading(false);
  //     });
  // }, [id]);
  return (
    // <Box borderBottomWidth="0.375">
    //   <Accordian name="My Spaces" defaultOpen={false}>
    //     <Stack>
    //       {mySpaces.map((space: BoardData) => (
    //         <Button
    //           key={space._id}
    //           prefix={<WorkspacesOutlined />}
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
    //   <Accordian name="Project" defaultOpen buttonComponent={<AddProject />}>
    //     <Stack>
    //       <Button
    //         prefix={
    //           <IconCollection color={tab === 0 ? "accent" : "textTertiary"} />
    //         }
    //         center
    //         width="full"
    //         variant={tab === 0 ? "tertiary" : "transparent"}
    //         size="small"
    //         onClick={() => setTab(0)}
    //       >
    //         Dev Project
    //       </Button>
    //       <Button
    //         prefix={<IconCollection />}
    //         center
    //         width="full"
    //         variant="transparent"
    //         size="small"
    //       >
    //         Sprint Board
    //       </Button>
    //       <Button
    //         prefix={<IconCollection />}
    //         center
    //         width="full"
    //         variant="transparent"
    //         size="small"
    //       >
    //         Bugs
    //       </Button>
    //     </Stack>
    //   </Accordian>
    //   {/* <CreateEpoch /> */}
    //   <Accordian name="Retro" defaultOpen buttonComponent={<CreatePeriod />}>
    //     <Box paddingY="2">
    //       <Stack>
    //         {/* <Button
    //           prefix={<IconEth />}
    //           center
    //           width="full"
    //           variant="transparent"
    //           size="small"
    //         >
    //           Epoch1
    //         </Button> */}
    //         <Button
    //           prefix={
    //             <LaunchOutlined color={tab === 1 ? "secondary" : "inherit"} />
    //           }
    //           center
    //           width="full"
    //           variant={tab === 1 ? "tertiary" : "transparent"}
    //           size="small"
    //           onClick={() => setTab(1)}
    //         >
    //           View all
    //         </Button>
    //       </Stack>
    //     </Box>
    //   </Accordian>
    // </Box>
    <Box />
  );
}
