import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { VerifiableCredential, Credential } from "@/app/types";
import { SaveFilled } from "@ant-design/icons";
import { Box, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Tabs from "@/app/common/components/Tabs";
import { getCredentialsByAddressAndIssuer } from "@/app/services/Credentials/AggregatedCredentials";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import Image from "next/image";
import { useAtom } from "jotai";
import { userDataAtom } from "@/app/state/global";
import { Mintkudos } from "./Credentials/Mintkudos";
import { Poap } from "./Credentials/Poap";
import { GitcoinPassport } from "./Credentials/GitcoinPassport";

type Props = {
  credentials: Credential[];
  setCredentials: (credentials: Credential[]) => void;
  allCredentials: { [id: string]: any[] };
};

const tabKeys = [
  "poaps",
  "kudos",
  "gitcoinPassports",
  "gitpoap",
  "sismo",
  "buildspace",
];

export default function LinkCredentialsModal({
  credentials,
  setCredentials,
  allCredentials,
}: Props) {
  const [tab, setTab] = useState(0);

  const [linkCredentialsOpen, setLinkCredentialsOpen] = useState(false);

  const [selectedCredentials, setSelectedCredentials] = useState<{
    [tab: string]: { [id: string]: boolean };
  }>({});
  const [normalizedSelectedCredentials, setNormalizedSelectedCredentials] =
    useState<Credential[]>(credentials ? credentials : []);

  const onCredentialClick = (credential: Credential) => {
    const newSelectedCredentials = {
      ...selectedCredentials,
    };
    if (!newSelectedCredentials[tabKeys[tab]])
      newSelectedCredentials[tabKeys[tab]] = {};
    newSelectedCredentials[tabKeys[tab]][credential.id] =
      !newSelectedCredentials[tabKeys[tab]][credential.id];
    if (newSelectedCredentials[tabKeys[tab]][credential.id]) {
      setNormalizedSelectedCredentials([
        ...(normalizedSelectedCredentials || []),
        credential,
      ]);
    } else {
      setNormalizedSelectedCredentials(
        normalizedSelectedCredentials.filter(
          (cred) =>
            cred.id !== credential.id || cred.service !== credential.service
        ) || []
      );
    }

    setSelectedCredentials(newSelectedCredentials);
  };

  return (
    <>
      <Box
        width={{
          xs: "full",
          md: "full",
        }}
        marginTop="2"
      >
        <Text variant="small">
          {normalizedSelectedCredentials?.length
            ? `${normalizedSelectedCredentials.length} credentials linked`
            : `Link all your on-chain and verifiable credentials to this experience
          and showcase it with more confidence!`}
        </Text>
        <Box marginTop="2" width="64">
          <PrimaryButton
            variant="tertiary"
            onClick={() => {
              setLinkCredentialsOpen(true);
            }}
          >
            {normalizedSelectedCredentials?.length
              ? `Update Linked Credentials`
              : `Link Credentials`}
          </PrimaryButton>
        </Box>
      </Box>
      {linkCredentialsOpen && (
        <Modal
          handleClose={() => {
            setLinkCredentialsOpen(false);
          }}
          title={`Link Credentials`}
        >
          <Box display="flex">
            <Box width="1/4" paddingY="8" paddingRight="1">
              <Tabs
                selectedTab={tab}
                onTabClick={(idx) => setTab(idx)}
                tabs={[
                  "POAP",
                  "Mintkudos",
                  "Gitcoin Passport",

                  // "GitPOAP",
                  // "Sismo",
                  // "Buildspace",
                ]}
                orientation="vertical"
                unselectedColor="transparent"
              />
            </Box>
            <ScrollContainer
              width="3/4"
              paddingX={{
                xs: "2",
                md: "4",
                lg: "8",
              }}
              paddingY="4"
            >
              {tabKeys[tab] === "kudos" && (
                <Mintkudos
                  credentials={allCredentials["kudos"]}
                  selectedCredentials={selectedCredentials["kudos"]}
                  onCredentialClick={(credential: Credential) =>
                    onCredentialClick(credential)
                  }
                />
              )}
              {tabKeys[tab] === "poaps" && (
                <Poap
                  credentials={allCredentials["poaps"]}
                  selectedCredentials={selectedCredentials["poaps"]}
                  onCredentialClick={(credential: Credential) =>
                    onCredentialClick(credential)
                  }
                />
              )}
              {tabKeys[tab] === "gitcoinPassports" && (
                <GitcoinPassport
                  credentials={allCredentials["gitcoinPassports"]}
                  selectedCredentials={selectedCredentials["gitcoinPassports"]}
                  onCredentialClick={(credential: Credential) =>
                    onCredentialClick(credential)
                  }
                />
              )}
            </ScrollContainer>
          </Box>
          <Box padding="3">
            <PrimaryButton
              icon={<SaveFilled style={{ fontSize: "1.3rem" }} />}
              onClick={() => {
                setCredentials(normalizedSelectedCredentials);
                setLinkCredentialsOpen(false);
              }}
            >
              Link Credentials
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </>
  );
}

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 5px;
  }
  height: 35rem;
  overflow-y: auto;
`;

export const CredentialCard = styled(Box)<{ mode: string; selected: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 12vh;
  margin-top: 1rem;
  padding: 0.4rem 1rem 0;
  border-radius: 0.5rem;
  border: solid 2px
    ${(props) =>
      props.selected
        ? "rgb(191, 90, 242, 1)"
        : props.mode === "dark"
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
`;

export const PluginAdded = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(20, 20, 20, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 0 1rem 0 1rem;
`;
