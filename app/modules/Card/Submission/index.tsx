import React from "react";
import { variants } from "..";
import { motion } from "framer-motion";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import WorkThread from "./WorkThread";

export default function Submission() {
  const { workThreadOrder, workThreads } = useLocalCard();
  return (
    <motion.main
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      className=""
      key="editor"
    >
      {workThreadOrder.map((workThreadId) => (
        <WorkThread
          key={workThreadId}
          workThread={workThreads[workThreadId]}
          threadId={workThreadId}
        />
      ))}
    </motion.main>
  );
}
