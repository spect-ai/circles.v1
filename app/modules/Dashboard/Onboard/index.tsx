import { Box, useTheme } from "degen";
import { VioletBlur } from "../ConnectPage";
import Logout from "@/app/common/components/LogoutButton";
import { BasicProfile } from "./BasicProfile";
import { useState } from "react";
import { CreateCircle } from "./CreateCircle";
import { SetUpProfile } from "./SetupProfile";
import useConnectDiscord from "@/app/services/Discord/useConnectDiscord";
import { ToastContainer } from "react-toastify";

const Onboard = () => {
  useConnectDiscord();
  const [onboardType, setOnboardType] =
    useState<"circle" | "profile">("circle");
  const [step, setStep] = useState(0);
  const { mode } = useTheme();
  // useEffect(() => {
  //   if (onboardType == "circle") {
  //     if (currentUser && currentUser.username?.startsWith("fren")) {
  //       setStep(0);
  //     } else if (currentUser && myCircles?.length == 0) {
  //       setStep(1);
  //     }
  //   }
  //   void refetch();
  // }, [currentUser, connectedUser, onboardType, refetch, myCircles?.length]);

  return (
    <Box position={"relative"} display="flex" width={"full"}>
      <ToastContainer
        toastStyle={{
          backgroundColor: `${
            mode === "dark" ? "rgb(20,20,20)" : "rgb(240,240,240)"
          }`,
          color: `${
            mode === "dark" ? "rgb(255,255,255,0.7)" : "rgb(20,20,20,0.7)"
          }`,
        }}
      />
      <VioletBlur style={{ top: "0px", left: "0rem" }} />

      <Box
        style={{ position: "absolute", right: "1rem", top: "1rem" }}
        display="flex"
        flexDirection="row"
        gap="1.5"
      >
        <Logout />
      </Box>
      <Box
        style={{
          margin: "5vh auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          zIndex: "1",
        }}
      >
        {onboardType == "circle" && step == 0 && (
          <BasicProfile setStep={setStep} />
        )}
        {onboardType == "circle" && step == 1 && (
          <CreateCircle setStep={setStep} setOnboardType={setOnboardType} />
        )}
        {/* {onboardType == "circle" && step == 2 && <CreateContent />} */}
        {onboardType == "profile" && <SetUpProfile />}
      </Box>
    </Box>
  );
};

export default Onboard;
