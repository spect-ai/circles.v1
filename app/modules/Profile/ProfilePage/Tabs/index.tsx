import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box } from "degen";
import { useState } from "react";
import styled from "styled-components";

import { profileLoadingAtom, userDataAtom } from "@/app/state/global";
import { useAtom } from "jotai";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";

export const Card = styled(Box)<{ mode: string }>`
  display: flex;
  flex-direction: column;
  min-height: 12vh;
  margin-top: 1rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
    cursor: pointer;
  }
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 80%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Tags = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 40vw;
  padding: 1rem 0rem;
  gap: 0.7rem;
`;

export const GigInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  right: 0.7rem;
  gap: 1rem;
`;

export const TextBox = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-right: 7rem;
`;

export const ScrollContainer = styled(Box)`
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    margin: 0;
    padding-right: 1.2rem;
  }
  @media (max-width: 1028px) and (min-width: 768px) {
    width: 100%;
  }
  overflow: auto;
  width: 50vw;
  height: 80vh;
  padding-right: 2rem;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ProfileTabs = () => {
  const [tab, setProfileTab] = useState("Experience");
  const [userData, setUserData] = useAtom(userDataAtom);
  const [profileLoading, setProfileLoading] = useAtom(profileLoadingAtom);

  return (
    <Box
      width={{
        xs: "full",
        md: "max",
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        width="32"
        paddingTop={{
          xs: "4",
          md: "10",
        }}
        paddingLeft={{
          xs: "4",
          md: "0",
        }}
        justifyContent="space-between"
      >
        <PrimaryButton
          variant={tab === "Experience" ? "tertiary" : "transparent"}
          onClick={() => setProfileTab("Experience")}
        >
          Experience
        </PrimaryButton>
        <PrimaryButton
          variant={tab === "Education" ? "tertiary" : "transparent"}
          onClick={() => setProfileTab("Education")}
        >
          Education
        </PrimaryButton>
        <PrimaryButton
          variant={tab === "Skills" ? "tertiary" : "transparent"}
          onClick={() => setProfileTab("Skills")}
        >
          Skills
        </PrimaryButton>
      </Box>
      {!profileLoading && (
        <Box
          width={{
            xs: "full",
            md: "168",
          }}
          paddingLeft={{
            xs: "4",
            md: "0",
          }}
        >
          {tab === "Experience" && <Experience userData={userData} />}
          {tab === "Education" && <Education userData={userData} />}
          {tab === "Skills" && <Skills userData={userData} />}
        </Box>
      )}
    </Box>
  );
};

export default ProfileTabs;
