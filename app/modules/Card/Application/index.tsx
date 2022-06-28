import { Box, Text } from "degen";
import { motion } from "framer-motion";
import { variants } from "..";
import { useLocalCard } from "../../Project/CreateCardModal/hooks/LocalCardContext";
import ApplicationItem from "./ApplicationItem";

export default function Application() {
  const { application, applicationOrder } = useLocalCard();
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
      <Box>
        {applicationOrder.map((applicationId) => (
          <ApplicationItem
            key={applicationId}
            application={application[applicationId]}
          />
        ))}
        {applicationOrder.length === 0 && (
          <Text variant="large" weight="semiBold">
            No Applications received yet
          </Text>
        )}
      </Box>
    </motion.main>
  );
}
