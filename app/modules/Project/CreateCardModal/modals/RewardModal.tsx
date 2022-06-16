import EditTag from "@/app/common/components/EditTag";
import {
  getFlattenedCurrencies,
  getFlattenedNetworks,
} from "@/app/common/utils/constants";
import { Box, Input, Stack, Tag, Text } from "degen";
import { motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";
import { useCreateCard } from "../hooks/createCardContext";

export default function CardReward() {
  const [modalOpen, setModalOpen] = useState(false);
  const { date, setDate } = useCreateCard();
  return (
    <div />
    // <EditTag
    //   name={date || "Add Deadline"}
    //   modalTitle="Select Deadline"
    //   tagLabel={date ? "Change" : ""}
    //   modalOpen={modalOpen}
    //   setModalOpen={setModalOpen}
    // >
    //   <Box height="96">
    //     <Box padding="8">
    //       <Stack>
    //         <Text size="extraLarge">Chain</Text>
    //         <Stack direction="horizontal">
    //           {getFlattenedNetworks(registry).map((aChain) => (
    //             <motion.button
    //               key={aChain.value}
    //               style={{
    //                 background: "transparent",
    //                 border: "none",
    //                 cursor: "pointer",
    //                 padding: "0rem",
    //               }}
    //               onClick={() => setChain(aChain)}
    //             >
    //               <Tag
    //                 hover
    //                 tone={
    //                   chain.chainId === aChain.chainId ? "accent" : "secondary"
    //                 }
    //               >
    //                 {aChain.name}
    //               </Tag>
    //             </motion.button>
    //           ))}
    //         </Stack>
    //         <Text size="extraLarge">Token</Text>
    //         <Stack direction="horizontal">
    //           {getFlattenedCurrencies(registry, chain.chainId).map((aToken) => (
    //             <motion.button
    //               key={chain.chainId}
    //               style={{
    //                 background: "transparent",
    //                 border: "none",
    //                 cursor: "pointer",
    //                 padding: "0rem",
    //               }}
    //               onClick={() => setToken(aToken)}
    //             >
    //               <Tag
    //                 hover
    //                 tone={
    //                   token.address === aToken.address ? "accent" : "secondary"
    //                 }
    //               >
    //                 {aToken.symbol}
    //               </Tag>
    //             </motion.button>
    //           ))}
    //         </Stack>
    //         <Text size="extraLarge">Value</Text>
    //         <Input
    //           label=""
    //           units={token.symbol}
    //           min={0}
    //           placeholder="10"
    //           type="number"
    //           value={value}
    //           onChange={(e) => setValue(e.target.value)}
    //         />
    //         {/* <Button width="full" size="small">
    //       Save
    //     </Button> */}
    //       </Stack>
    //     </Box>
    //   </Box>
    // </EditTag>
  );
}
