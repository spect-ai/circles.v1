import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { profileLoadingAtom, userDataAtom } from "@/app/state/global";
import { useAtom } from "jotai";
import { getCredentialsByAddressAndIssuer } from "@/app/services/Credentials/AggregatedCredentials";
import Education from "./Education";
import Experience from "./Experience";
import Skills from "./Skills";

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

const ProfileTabs = () => {
  const [tab, setProfileTab] = useState("Experience");
  const [userData] = useAtom(userDataAtom);
  const [profileLoading] = useAtom(profileLoadingAtom);
  const [, setCredentialLoading] = useState(false);
  const [poaps, setPoaps] = useState([]);
  const [gitcoinPassports, setGitcoinPassports] = useState([]);
  const [kudos, setKudos] = useState([]);

  const fetchAllCredentials = () => {
    getCredentialsByAddressAndIssuer(userData?.ethAddress, "poap")
      .then((res) => {
        if (res?.length) setPoaps(res);
        else setPoaps([]);
      })
      .catch((err) => console.error(err));
    getCredentialsByAddressAndIssuer(userData?.ethAddress, "gitcoinPassport")
      .then((res) => {
        if (res?.length) setGitcoinPassports(res);
        else setGitcoinPassports([]);
      })
      .catch((err) => console.error(err));
    getCredentialsByAddressAndIssuer(userData?.ethAddress, "kudos")
      .then((res) => {
        if (res?.length) setKudos(res);
        else setKudos([]);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (userData) {
      setCredentialLoading(true);
      fetchAllCredentials();
      setCredentialLoading(false);
    }
  }, [userData]);

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
          {tab === "Experience" && (
            <Experience
              userData={userData}
              allCredentials={{
                poaps,
                gitcoinPassports,
                kudos,
              }}
            />
          )}
          {tab === "Education" && (
            <Education
              userData={userData}
              allCredentials={{
                poaps,
                gitcoinPassports,
                kudos,
              }}
            />
          )}
          {tab === "Skills" && (
            <Skills
              userData={userData}
              allCredentials={{
                poaps,
                gitcoinPassports,
                kudos,
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProfileTabs;
