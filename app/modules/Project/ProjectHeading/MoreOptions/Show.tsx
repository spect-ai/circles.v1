import { Box, Button, useTheme, Text, Stack, Tag } from "degen";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Popover from "@/app/common/components/Popover";
import { grow } from "@/app/common/components/Modal";
import { EyeOutlined } from "@ant-design/icons";
import { useLocalProject } from "../../Context/LocalProjectContext";

export function Show() {
  const { advFilters, setAdvFilters } = useLocalProject();
  const [showToggleOpen, setShowToggle] = useState(false);

  const { mode } = useTheme();
  return (
    <Box
      data-tour="show-options-button"
      cursor="pointer"
      color="foreground"
      display="flex"
      flexDirection="row"
      gap="3"
      alignItems={"center"}
    >
      <Text whiteSpace="nowrap">Show Subtasks</Text>
      <Button
        shape="circle"
        size="small"
        variant="transparent"
        onClick={() => {
          setAdvFilters({
            ...advFilters,
            show: {
              subTasks: !advFilters.show.subTasks,
            },
          });
        }}
      >
        <EyeOutlined
          style={{
            color: `${advFilters.show.subTasks ? "rgb(191, 90, 242, 0.7)" : "gray"}`,
            fontSize: "1.1rem",
          }}
        />
      </Button>
    </Box>
    // <Popover
    //   butttonComponent={
    //     <Box
    //       data-tour="show-options-button"
    //       cursor="pointer"
    //       color="foreground"
    //       display="flex"
    //       flexDirection="row"
    //       gap="3"
    //       alignItems={"center"}
    //     >
    //       <Text whiteSpace="nowrap">Show</Text>
    //       <Button
    //         shape="circle"
    //         size="small"
    //         variant="transparent"
    //         onClick={() => setShowToggle(!showToggleOpen)}
    //       >
    //         <EyeOutlined
    //           style={{
    //             color: `${showToggleOpen ? "rgb(191, 90, 242, 0.7)" : "gray"}`,
    //             fontSize: "1.1rem",
    //           }}
    //         />
    //       </Button>
    //     </Box>
    //   }
    //   isOpen={showToggleOpen}
    //   setIsOpen={setShowToggle}
    // >
    //   <AnimatePresence>
    //     <motion.div
    //       initial="hidden"
    //       animate="visible"
    //       exit="exit"
    //       variants={grow}
    //     >
    //       <Box
    //         padding={"3"}
    //         backgroundColor="background"
    //         width="44"
    //         style={{
    //           border: `2px solid ${
    //             mode == "dark"
    //               ? "rgb(255, 255, 255, 0.05)"
    //               : "rgb(20, 20, 20, 0.05)"
    //           }`,
    //           borderRadius: "0.7rem",
    //         }}
    //       >
    //         <Stack direction={"horizontal"}>
    //           <Text>Sub Tasks</Text>
    //           <Box
    //             data-tour="order-options-button"
    //             cursor="pointer"
    //             onClick={() => {
    //               setAdvFilters({
    //                 ...advFilters,
    //                 show: {
    //                   subTasks: !advFilters.show.subTasks,
    //                 },
    //               });
    //             }}
    //             color="foreground"
    //             display="flex"
    //             flexDirection="row"
    //             gap="3"
    //           >
    //             <Tag size="medium" hover tone="accent">
    //               {advFilters.show.subTasks ? "Hide" : "Show"}
    //             </Tag>
    //           </Box>
    //         </Stack>
    //       </Box>
    //     </motion.div>
    //   </AnimatePresence>
    // </Popover>
  );
}
