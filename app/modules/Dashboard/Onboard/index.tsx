import { Box } from "degen";
import { VioletBlur } from "../ConnectPage";
import Logout from "@/app/common/components/LogoutButton";
import { BasicProfile } from "./BasicProfile";
import { useQuery } from "react-query";
import { CircleType, UserType } from "@/app/types";
import { useState, useEffect } from "react";
import { CreateCircle } from "./CreateCircle";
import { CreateContent } from "./CreateContent";

const Onboard = () => {
  const [step, setStep] = useState(0);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { data: myCircles } = useQuery<CircleType[]>(
    "myOrganizations",
    () =>
      fetch(`${process.env.API_HOST}/circle/myOrganizations`, {
        credentials: "include",
      }).then((res) => res.json()),
    {
      enabled: false,
    }
  );
  useEffect(() => {
    if (currentUser && currentUser.username.startsWith("fren")) {
      setStep(0);
    } else if (currentUser && myCircles?.length == 0) {
      setStep(1);
    } else if (
      currentUser && myCircles &&
      myCircles?.length > 0 &&
      myCircles?.[0].id
    ) {
      setStep(2);
    }
  }, [currentUser, currentUser?.circles, myCircles]);
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
          margin: "25vh auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          zIndex: "1",
        }}
      >
        {step == 0 && <BasicProfile setStep={setStep} />}
        {step == 1 && <CreateCircle setStep={setStep}/>}
        {step == 2 && (
          <CreateContent />
        )}
      </Box>
    </Box>
  );
};

export default Onboard;
