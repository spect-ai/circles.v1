import { isSidebarExpandedAtom } from "@/app/state/global";
import { DoubleRightOutlined } from "@ant-design/icons";
import { Box, Button } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";

type Props = {
  show: boolean;
  setShowCollapseButton: (show: boolean) => void;
  top: string;
  left: string;
};

const CollapseButton = ({ show, setShowCollapseButton, top, left }: Props) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useAtom(
    isSidebarExpandedAtom
  );
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            transitionDuration="300"
            style={{
              transform: isSidebarExpanded ? "rotate(180deg)" : "rotate(0deg)",
              top,
              left,
            }}
            position="absolute"
          >
            <Button
              shape="circle"
              size="small"
              variant="tertiary"
              onClick={() => {
                setShowCollapseButton(false);
                setIsSidebarExpanded(!isSidebarExpanded);
              }}
            >
              <DoubleRightOutlined style={{ fontSize: "1.1rem" }} />
            </Button>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollapseButton;
