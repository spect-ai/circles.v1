import { Box } from "degen";
import { VioletBlur } from "../ConnectPage";
import Logout from "@/app/common/components/LogoutButton";
import { BasicProfile } from "./BasicProfile";
import { useQuery } from "react-query";
import { CircleType, UserType } from "@/app/types";
import { useState, useEffect } from "react";
import { CreateCircle } from "./CreateCircle";
import { CreateContent } from "./CreateContent";
import { SetUpProfile } from "./SetupProfile";
import { useGlobal } from "@/app/context/globalContext";
import useConnectDiscord from "@/app/services/Discord/useConnectDiscord";

const Onboard = () => {
  useConnectDiscord();
  const [onboardType, setOnboardType] =
    useState<"circle" | "profile">("circle");
  const [step, setStep] = useState(1);
  const { connectedUser } = useGlobal();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { data: myCircles, refetch } = useQuery<CircleType[]>(
    "dashboardCircles",
    () =>
      fetch(`${process.env.API_HOST}/user/v1/circles`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );
  useEffect(() => {
    if (onboardType == "circle") {
      if (currentUser && currentUser.username.startsWith("fren")) {
        setStep(0);
      } else if (currentUser && myCircles?.length == 0) {
        setStep(1);
      }
    }
    void refetch();
  }, [currentUser, step, connectedUser, onboardType, refetch, myCircles?.length]);

  return (
    <Box position={"relative"} display="flex" width={"full"} gap="11">
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
