import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { VerifiableCredential, Credential } from "@/app/types";
import { SaveFilled } from "@ant-design/icons";
import { Box, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Tabs from "@/app/common/components/Tabs";
import { useGlobal } from "@/app/context/globalContext";
import { getCredentialsByAddressAndIssuer } from "@/app/services/Credentials/AggregatedCredentials";
import { PassportStampIcons, PassportStampIconsLightMode } from "@/app/assets";
import Image from "next/image";

type Props = {
  credentials: { [issuer: string]: { [id: string]: boolean } };
  setCredentials: (credentials: {
    [issuer: string]: { [id: string]: boolean };
  }) => void;
};

const tabKeys = [
  "kudos",
  "gitcoinPassport",
  "poap",
  "gitpoap",
  "sismo",
  "buildspace",
];

export default function LinkCredentialsModal({
  credentials,
  setCredentials,
}: Props) {
  const [tab, setTab] = useState(0);

  const [credentialsShown, setCredentialsShown] = useState<Credential[]>([]);
  const [linkCredentialsOpen, setLinkCredentialsOpen] = useState(false);

  const [selectedCredentials, setSelectedCredentials] =
    useState<{
      [tab: string]: { [id: string]: boolean };
    }>(credentials);
  const [loading, setLoading] = useState(false);
  const { userData } = useGlobal();
  const { mode } = useTheme();

  const fetchCredentials = (id: number) => {
    setLoading(true);
    setTab(id);
    getCredentialsByAddressAndIssuer(userData?.ethAddress, tabKeys[id])
      .then((res) => {
        console.log(res);
        if (res?.length) setCredentialsShown(res);
        else setCredentialsShown([]);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  const onTabClick = (id: number) => {
    void fetchCredentials(id);
  };
  useEffect(() => {
    if (linkCredentialsOpen) void fetchCredentials(0);
  }, [linkCredentialsOpen]);

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
          Link all your on-chain and verifiable credentials to this experience
          and showcase it with more confidence!
        </Text>
        <Box marginTop="2" width="48">
          <PrimaryButton
            variant="tertiary"
            onClick={() => {
              setLinkCredentialsOpen(true);
            }}
          >
            Link Credentials
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
                onTabClick={onTabClick}
                tabs={[
                  "Mintkudos",
                  "Gitcoin Passport",
                  "POAP",
                  "GitPOAP",
                  "Sismo",
                  "Buildspace",
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
              {!credentialsShown?.length && !loading && (
                <Box
                  marginTop="8"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text>No credentials found</Text>
                </Box>
              )}
              {!loading &&
                credentialsShown?.map((credential, index) => {
                  let selected = false;
                  if (
                    selectedCredentials[tabKeys[tab]] &&
                    selectedCredentials[tabKeys[tab]][credential.id]
                  )
                    selected = true;
                  if (tabKeys[tab] === "gitcoinPassport")
                    return (
                      <CredentialCard
                        key={index}
                        mode={mode}
                        selected={
                          selectedCredentials[tabKeys[tab]] &&
                          selectedCredentials[tabKeys[tab]][credential.id]
                        }
                        onClick={() => {
                          const newSelectedCredentials = {
                            ...selectedCredentials,
                          };
                          if (!newSelectedCredentials[tabKeys[tab]])
                            newSelectedCredentials[tabKeys[tab]] = {};
                          newSelectedCredentials[tabKeys[tab]][credential.id] =
                            !newSelectedCredentials[tabKeys[tab]][
                              credential.id
                            ];
                          setSelectedCredentials(newSelectedCredentials);
                        }}
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          gap="4"
                          alignItems="center"
                        >
                          <Box
                            width="8"
                            height="8"
                            flexDirection="row"
                            justifyContent="flex-start"
                            alignItems="center"
                          >
                            {mode === "dark"
                              ? PassportStampIcons[
                                  (credential?.metadata as VerifiableCredential)
                                    ?.providerName as keyof typeof PassportStampIconsLightMode
                                ]
                              : PassportStampIconsLightMode[
                                  (credential?.metadata as VerifiableCredential)
                                    ?.providerName as keyof typeof PassportStampIconsLightMode
                                ]}
                          </Box>
                          <Box display="flex" flexDirection="column">
                            <Text variant="large" weight="bold">
                              {credential.name}
                            </Text>
                            <Text variant="small">
                              {credential.description}
                            </Text>
                          </Box>
                        </Box>
                      </CredentialCard>
                    );
                  else
                    return (
                      <CredentialCard
                        key={index}
                        mode={mode}
                        selected={selected}
                        onClick={() => {
                          const newSelectedCredentials = {
                            ...selectedCredentials,
                          };
                          if (!newSelectedCredentials[tabKeys[tab]])
                            newSelectedCredentials[tabKeys[tab]] = {};
                          newSelectedCredentials[tabKeys[tab]][credential.id] =
                            !newSelectedCredentials[tabKeys[tab]][
                              credential.id
                            ];
                          setSelectedCredentials(newSelectedCredentials);
                        }}
                      >
                        <Box
                          display="flex"
                          flexDirection="row"
                          gap="4"
                          alignItems="flex-start"
                          justifyContent="center"
                        >
                          <Box width="1/4">
                            <Image
                              src={credential.imageUri}
                              width="100%"
                              height="100%"
                              objectFit="contain"
                              alt="img"
                            />
                          </Box>
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            width="3/4"
                          >
                            <Text variant="large" weight="bold" align="left">
                              {credential.name}
                            </Text>
                          </Box>
                        </Box>
                      </CredentialCard>
                    );
                })}
            </ScrollContainer>
          </Box>
          <Box padding="3">
            <PrimaryButton
              icon={<SaveFilled style={{ fontSize: "1.3rem" }} />}
              onClick={() => {
                setCredentials(selectedCredentials);
                setLinkCredentialsOpen(false);
              }}
            >
              Save
            </PrimaryButton>
          </Box>
        </Modal>
      )}
    </>
  );
}

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 10px;
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
