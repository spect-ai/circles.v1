import React from "react";
import { variants } from "..";
import { motion } from "framer-motion";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import WorkThread from "./WorkThread";

export default function Submission() {
  const { workThreadOrder, workThreads } = useLocalCard();
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ type: "linear" }}
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
