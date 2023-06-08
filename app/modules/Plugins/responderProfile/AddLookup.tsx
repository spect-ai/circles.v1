import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { WrappableTabs } from "@/app/common/components/Tabs";
import { logError } from "@/app/common/utils/utils";
import { LookupToken, NFTFromAlchemy, PoapCredential } from "@/app/types";
import { Box, IconEth, IconUserGroup, Spinner, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import ERC20Ownership, { TokenFromAnkr } from "./ERC20Ownership";
import KudosClaimed from "./KudosClaimed";
import NFTOwnership from "./NFTOwnership";
import PoapClaimed from "./POAPClaimed";
import {
  SelectedCredential,
  SelectedERC20,
  SelectedNFT,
} from "./SelectedToken";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { updateFormCollection } from "@/app/services/Collection";

export type Kudos = {
  description: string;
  id: string;
  imageUri: string;
  name: string;
  service: string;
  type: string;
};

type Props = {
  handleClose: () => void;
};

const AddLookup = ({ handleClose }: Props) => {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [selectedType, setSelectedType] = useState(
    collection.formMetadata.lookup?.verifiedAddress ||
      collection.formMetadata.lookup?.tokens?.length ||
      collection.formMetadata.lookup?.communities
      ? 0
      : -1
  );
  const [tokens, setTokens] = useState<TokenFromAnkr[]>([]);
  const [nfts, setNfts] = useState<NFTFromAlchemy[]>([]);
  const [kudos, setKudos] = useState<Kudos[]>([]);
  const [poaps, setPoaps] = useState<PoapCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lookupTokens, setLookupTokens] = useState<LookupToken[]>(
    collection.formMetadata.lookup?.tokens || []
  );
  const [collectEthAddress, setCollectEthAddress] = useState<boolean>(
    collection.formMetadata.lookup?.verifiedAddress || false
  );
  const [collectCommunityMemberships, setCollectCommunityMemberships] =
    useState<boolean>(collection.formMetadata.lookup?.communities || false);

  const { circle } = useCircle();

  const updateLocalTokens = async (selectedType: number) => {
    if (selectedType > 0 && selectedType < 5) {
      setLoading(true);

      const tokenType = [
        "ethAddress",
        "erc20",
        "nft",
        "kudos",
        "poaps",
        "memberships",
      ][selectedType];

      if (
        (tokenType === "erc20" && tokens.length > 0) ||
        (tokenType === "nft" && nfts.length > 0) ||
        (tokenType === "kudos" && kudos.length > 0) ||
        (tokenType === "poaps" && poaps.length > 0) ||
        ["ethAddress", "memberships"].includes(tokenType)
      ) {
        setLoading(false);
        return;
      }

      fetch(
        `${process.env.API_HOST}/user/v1/tokenBalances?tokenType=${tokenType}&circleId=${circle?.id}`,
        {
          credentials: "include",
        }
      )
        .then(async (res) => {
          let tokens = [];
          tokens = await res.json();
          if (tokenType === "erc20") {
            tokens.sort((a: TokenFromAnkr, b: TokenFromAnkr) => {
              // sort by token price in descending order
              if (parseFloat(a.tokenPrice) >= parseFloat(b.tokenPrice)) {
                return -1;
              }
              if (parseFloat(a.tokenPrice) < parseFloat(b.tokenPrice)) {
                return 1;
              }
              return 0;
            });
            setTokens(tokens);
          } else if (tokenType === "nft") {
            // only show 1 nft from each collection
            try {
              setNfts(tokens);
              console.log({ tokens });
            } catch (err) {
              setNfts([]);
              console.log(err);
            }
          } else if (tokenType === "kudos") {
            setKudos(tokens);
          } else if (tokenType === "poaps") {
            setPoaps(tokens);
          }
          setLoading(false);
          //
        })
        .catch((err) => {
          console.log(err);
          logError("Error fetching tokens");
          setLoading(false);
        });
    }
  };

  return (
    <Modal size="large" title="Learn about responder" handleClose={handleClose}>
      <Box
        padding="8"
        paddingTop="4"
        minHeight="72"
        display="flex"
        flexDirection={{
          xl: "row",
          xs: "column",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          style={{
            width: "60%",
          }}
          paddingRight="4"
        >
          <Stack>
            <Stack space="1">
              <Text variant="small" color="textSecondary" weight="semiBold">
                What would you like to learn about the responder?
              </Text>
              <WrappableTabs
                selectedTab={selectedType}
                onTabClick={(index) => {
                  setSelectedType(index);
                  updateLocalTokens(index);
                }}
                tabs={[
                  "General Information",
                  "ERC20 Ownership",
                  "NFT Ownership",
                  "Claimed Mintkudos",
                  "Claimed POAPs",
                ]}
                orientation="horizontal"
                unselectedColor="transparent"
                selectedColor="tertiary"
              />
            </Stack>
            {loading && (
              <Stack direction="horizontal" align="center">
                <Text>Fetching tokens</Text>
                <Spinner />
              </Stack>
            )}
            {!loading && (
              <Stack space="1">
                {selectedType === 0 && (
                  <Stack space="2">
                    <Box
                      display="flex"
                      flexDirection="row"
                      gap="2"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <CheckBox
                        isChecked={collectEthAddress}
                        onClick={async () => {
                          setCollectEthAddress(!collectEthAddress);
                        }}
                      />
                      <Text variant="base">
                        Collect Verified Ethereum Address
                      </Text>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      gap="2"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <CheckBox
                        isChecked={collectCommunityMemberships}
                        onClick={async () => {
                          setCollectCommunityMemberships(
                            !collectCommunityMemberships
                          );
                        }}
                      />
                      <Text variant="base">Collect Community Memberships</Text>
                    </Box>
                  </Stack>
                )}
                {selectedType === 1 && (
                  <ERC20Ownership
                    lookupTokens={lookupTokens}
                    setLookupTokens={setLookupTokens}
                    initTokens={tokens}
                  />
                )}
                {selectedType === 2 && (
                  <NFTOwnership
                    setLookupTokens={setLookupTokens}
                    lookupTokens={lookupTokens}
                    initNfts={nfts}
                  />
                )}
                {selectedType === 3 && (
                  <KudosClaimed
                    lookupTokens={lookupTokens}
                    setLookupTokens={setLookupTokens}
                    initKudos={kudos}
                  />
                )}
                {selectedType === 4 && (
                  <PoapClaimed
                    lookupTokens={lookupTokens}
                    setLookupTokens={setLookupTokens}
                    initPoap={poaps}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          borderLeftWidth="0.5"
          paddingX="4"
          style={{
            width: "40%",
          }}
        >
          <Text variant="small" color="textSecondary" weight="semiBold">
            Selected Items
          </Text>
          <SelectedTokenScrollContainer>
            {lookupTokens?.length === 0 &&
              !collectCommunityMemberships &&
              !collectEthAddress && (
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  flexDirection="column"
                  marginTop="4"
                >
                  <Text variant="small" color="textSecondary">
                    Nothing selected yet
                  </Text>
                </Box>
              )}
            <Box display="flex" flexDirection="column" gap="4" marginTop="4">
              {collectEthAddress && (
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  flexDirection="row"
                  alignItems="center"
                  gap="2"
                >
                  <Text color="textSecondary" weight="semiBold">
                    {" "}
                    <IconEth size="6" />
                  </Text>
                  <Text color="textSecondary" weight="semiBold">
                    Collecting Verified Ethereum Address
                  </Text>
                </Box>
              )}
              {collectCommunityMemberships && (
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  flexDirection="row"
                  alignItems="center"
                  gap="2"
                >
                  <Text color="textSecondary" weight="semiBold">
                    {" "}
                    <IconUserGroup size="6" />
                  </Text>
                  <Text color="textSecondary" weight="semiBold">
                    Collecting Community Memberships
                  </Text>
                </Box>
              )}
              {lookupTokens?.length > 0 && (
                <Stack space="4">
                  <SelectedERC20
                    lookupTokens={lookupTokens}
                    setLookupTokens={setLookupTokens}
                    tokenTypes={["erc20"]}
                    label="ERC20s and Currencies"
                  />
                  <SelectedNFT
                    lookupTokens={lookupTokens}
                    setLookupTokens={setLookupTokens}
                    tokenTypes={["erc721", "erc1155"]}
                    label="NFTs"
                  />
                  <SelectedCredential
                    lookupTokens={lookupTokens}
                    setLookupTokens={setLookupTokens}
                    tokenTypes={["kudos"]}
                    label="Mintkudos"
                  />
                  <SelectedCredential
                    lookupTokens={lookupTokens}
                    setLookupTokens={setLookupTokens}
                    tokenTypes={["poap"]}
                    label="POAPs"
                  />
                </Stack>
              )}
            </Box>
          </SelectedTokenScrollContainer>
        </Box>{" "}
      </Box>
      <Box
        display={"flex"}
        flexDirection="row"
        justifyContent="flex-end"
        width="full"
        padding="8"
        paddingTop="0"
      >
        <Box width="48">
          <PrimaryButton
            loading={saving}
            onClick={async () => {
              setSaving(true);
              const res = await updateFormCollection(collection.id, {
                formMetadata: {
                  ...collection.formMetadata,
                  allowAnonymousResponses: !collectEthAddress,
                  lookup: {
                    tokens: lookupTokens,
                    snapshot: 0,
                    verifiedAddress: collectEthAddress,
                    communities: collectCommunityMemberships,
                  },
                },
              });
              if (res.id) updateCollection(res);
              else logError("Error updating collection");
              setSaving(false);

              handleClose();
            }}
            disabled={
              loading ||
              (lookupTokens?.length === 0 &&
                !collectCommunityMemberships &&
                !collectEthAddress)
            }
          >
            Save
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddLookup;

const SelectedTokenScrollContainer = styled(Box)`
  overflow-y: auto;
  height: 40rem;
  ::-webkit-scrollbar {
    width: 0.5rem;
    border-radius: 0rem;
  }
  flex-wrap: wrap;
`;
