import { AnimatePresence, motion } from "framer-motion";
import { useGlobal } from "@/app/context/globalContext";
import { Box, Avatar, Tag, Text, Button } from "degen";
import QuickProfileTabs from "./QuickProfileTab";
import { useTheme } from "degen";



const QuickProfilePanel = () => {

  const { isProfilePanelExpanded, setIsProfilePanelExpanded} = useGlobal();
  const { mode } = useTheme();

  return(
    <>
      <AnimatePresence>
        <motion.div
        onClick={()=> {setIsProfilePanelExpanded(!isProfilePanelExpanded)}}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          alignItems: "flex-end",
          zIndex: 1,
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{x: "700px"}}
          animate={{x: "0px"}}
          transition={{ duration: 0.5 }}
          exit="exit" 
        >
          <Box 
            backgroundColor={ mode === "dark" ? "background" : "white" }
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              padding: "2rem",
              width: "700px",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              zIndex: 2,
              boxShadow: "-4px 8px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <Box 
              paddingBottom="4"
              style={{ 
                display: "flex", 
                flexDirection: "row", 
                gap: "1rem", 
                position: "relative", 
                alignItems: "center",
                width: "650px", 
                borderBottom: "1px solid rgba(255, 255, 255, .1)" 
              }}>
              <Avatar
                label="profile-pic"
                src="/og.jpg"
                size="16"
              />
              <Box style={{ gap: "1.5rem"}}>
                <Text variant="extraLarge" weight="semiBold">Dude</Text>
                <Tag tone="purple" size="small">dude.eth</Tag>
              </Box>
              <Box style={{ position: "absolute", right: "1rem"}}>
                <Button size="small" variant="secondary">View Full Profile</Button>
              </Box>
            </Box>
            <QuickProfileTabs />
          </Box>
        </motion.div>
      </motion.div>
      </AnimatePresence>
    </>
  )
}

export default QuickProfilePanel;