import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { logError, smartTrim } from "@/app/common/utils/utils";
import { getContractMetdata, getTokenMetadata } from "@/app/services/nft";
import { LookupToken, NFT, NFTFromAlchemy } from "@/app/types";
import { Avatar, Box, Input, Spinner, Stack, Text, useTheme } from "degen";
import { ethers } from "ethers";
import { AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import NFTDetailsModal, { NFTDetails } from "./NFTDetailsModal";

type Props = {
  lookupTokens: LookupToken[];
  setLookupTokens: (lookupTokens: LookupToken[]) => void;
  initNfts: NFTFromAlchemy[];
};

const networks = [1, 137, 10, 42161];
const networkNames = ["Ethereum", "Polygon", "Optimism", "Arbitrum"];
const networkToIds = {
  eth: 1,
  polygon: 137,
  optimism: 10,
  arbitrum: 42161,
};
const networkIdToNames = {
  1: "Ethereum",
  137: "Polygon",
  10: "Optimism",
  42161: "Arbitrum",
};

const NFTOwnership = ({ lookupTokens, setLookupTokens, initNfts }: Props) => {
  const { mode } = useTheme();
  const [filteredNFTs, setFilteredNFTs] = useState<NFTFromAlchemy[]>([]);
  const [nfts, setNfts] = useState<NFTFromAlchemy[]>([]);
  const [loading, setLoading] = useState(false);
  const [openNFTDetails, setOpenNFTDetails] = useState(false);
  const [showFetchAddressButton, setShowFetchAddressButton] =
    useState<boolean>(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<NFTFromAlchemy>(
    {} as NFTFromAlchemy
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [network, setNetwork] = useState<OptionType>({
    label: "Ethereum",
    value: "1",
  });

  useEffect(() => {
    setLoading(true);
    setNfts(initNfts);
    setFilteredNFTs(initNfts);
    setLoading(false);
  }, []);

  return (
    <Stack space="0">
      <AnimatePresence>
        {openNFTDetails && (
          <NFTDetailsModal
            handleClose={() => setOpenNFTDetails(false)}
            nft={currentlyEditing}
            onSave={(nftDetails: NFTDetails) => {
              setLookupTokens([
                ...lookupTokens,
                {
                  contractAddress: currentlyEditing.contract.address,
                  tokenType:
                    currentlyEditing.tokenType === "ERC721"
                      ? "erc721"
                      : "erc1155",
                  metadata: {
                    name:
                      currentlyEditing.tokenType === "ERC721"
                        ? currentlyEditing.contract.name ||
                          currentlyEditing.title ||
                          "An NFT"
                        : currentlyEditing.title ||
                          currentlyEditing.contract.name ||
                          "An NFT",
                    image:
                      currentlyEditing?.media?.[0]?.gateway ||
                      currentlyEditing.rawMetadata.image,
                    symbol: currentlyEditing.contract.symbol,
                  },
                  tokenId: nftDetails.tokenId,
                  tokenAttributes: nftDetails.tokenAttributes,
                  chainId: parseInt(network.value),
                },
              ]);
              setCurrentlyEditing({} as NFTFromAlchemy);
              setOpenNFTDetails(false);
              setSearchValue("");
              setShowFetchAddressButton(false);
              setFilteredNFTs(nfts);
            }}
          />
        )}
      </AnimatePresence>
      <Stack direction="vertical" space="3">
        <Stack space="0">
          <Text variant="small" color="textSecondary" weight="semiBold">
            Pick the NFTs
          </Text>
          <Input
            placeholder={"Search for a token or enter a token address"}
            label=""
            value={searchValue}
            width="2/3"
            onChange={(e) => {
              try {
                if (!e.target.value) {
                  setFilteredNFTs(nfts);
                  setShowFetchAddressButton(false);
                  setShowFetchAddressButton(false);
                } else {
                  setSearchValue(e.target.value);
                  setFilteredNFTs(
                    matchSorter(nfts, e.target.value, {
                      keys: ["name", "collectionName", "symbol"],
                    })
                  );
                  if (ethers.utils.isAddress(e.target.value)) {
                    setShowFetchAddressButton(true);
                  }
                }
              } catch (err) {
                console.log(err);
              }
            }}
          />
        </Stack>
        <Stack direction="horizontal" space="2" align="flex-end">
          {showFetchAddressButton && (
            <Box width="1/3">
              <Stack space="0">
                <Text variant="small" color="textSecondary" weight="semiBold">
                  Pick a Network
                </Text>
                <Dropdown
                  label=""
                  options={[
                    {
                      label: "Ethereum",
                      value: "1",
                    },
                    {
                      label: "Polygon",
                      value: "137",
                    },
                    {
                      label: "Optimism",
                      value: "10",
                    },
                    {
                      label: "Arbitrum",
                      value: "42161",
                    },
                  ]}
                  selected={network}
                  onChange={(value: any) => {
                    setNetwork(value);
                    setShowFetchAddressButton(true);
                  }}
                  multiple={false}
                />{" "}
              </Stack>
            </Box>
          )}
          {showFetchAddressButton && (
            <PrimaryButton
              variant="tertiary"
              size="small"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  if (!ethers.utils.isAddress(searchValue))
                    throw new Error("Invalid nft contract address");
                  const nftContract = await getContractMetdata(
                    network.value,
                    searchValue
                  );
                  if (!nftContract) throw new Error("NFT Contract not found");
                  setFilteredNFTs([
                    {
                      chainId: parseInt(network.value),
                      contract: {
                        address: searchValue,
                        name:
                          nftContract.name ||
                          `An ${nftContract.tokenType} NFT on ${
                            networkIdToNames[
                              network.value as unknown as keyof typeof networkIdToNames
                            ]
                          }`,
                        symbol: nftContract.symbol || "NFT",
                      },
                      tokenType: nftContract.tokenType,
                      rawMetadata: {
                        image: nftContract.openSea?.imageUrl,
                        name:
                          nftContract.openSea?.collectionName ||
                          `An ${nftContract.tokenType} NFT on ${
                            networkIdToNames[
                              network.value as unknown as keyof typeof networkIdToNames
                            ]
                          }`,
                      },
                    },
                  ]);
                } catch (err) {
                  console.log(err);
                  toast.error((err as any)?.message || err);
                  logError("Error fetching nft with address");
                }
                setLoading(false);
                // Optimistically find the nfts then add nft details if found
                try {
                } catch (err) {
                  logError("Error adding details about nft");
                }
              }}
            >
              Fetch NFT with address
            </PrimaryButton>
          )}
        </Stack>
        {loading && (
          <Stack direction="horizontal" align="center">
            <Text>Fetching tokens</Text>
            <Spinner />
          </Stack>
        )}

        {!loading && filteredNFTs?.length === 0 && (
          <Box
            display="flex"
            justifyContent="flex-start"
            flexDirection="column"
          >
            {" "}
            <Text variant="small" color="textSecondary">
              No tokens found
            </Text>
            <Box
              cursor="pointer"
              onClick={() => {
                window.open("https://docs.spect.network/");
              }}
            >
              <Text variant="small" color="accent">
                View Support Networks
              </Text>
            </Box>
          </Box>
        )}

        <ScrollContainer>
          <Box display="flex" flexDirection="row" gap="2" flexWrap="wrap">
            {!loading &&
              filteredNFTs.map((nft, index) => {
                if (
                  lookupTokens.find(
                    (t) =>
                      t.contractAddress === nft.contract.address &&
                      t.chainId === nft?.chainId
                  )
                ) {
                  return null;
                }
                return (
                  <NFTCard
                    mode={mode}
                    cursor="pointer"
                    style={{
                      width: "19%",
                    }}
                    key={index}
                    onClick={() => {
                      console.log({ nft });
                      if (!nft.tokenId) {
                        setCurrentlyEditing(nft);
                        setOpenNFTDetails(true);
                        return;
                      }
                      setLookupTokens([
                        ...lookupTokens,
                        {
                          contractAddress: nft.contract.address,
                          tokenType:
                            nft.tokenType === "ERC721" ? "erc721" : "erc1155",
                          metadata: {
                            name:
                              nft.tokenType === "ERC721"
                                ? nft.title || nft.contract.name
                                : nft.contract.name,
                            image:
                              nft.media?.[0]?.gateway || nft.rawMetadata.image,
                            symbol: nft.contract.symbol,
                          },
                          tokenId:
                            nft.tokenType === "ERC721" ? "" : nft.tokenId,
                          chainId: nft.chainId,
                        },
                      ]);
                    }}
                  >
                    <Stack align="center">
                      <Avatar
                        src={
                          nft.media?.[0]?.gateway ||
                          nft.rawMetadata.image ||
                          `https://api.dicebear.com/5.x/initials/svg?seed=${
                            nft.title || nft.contract.name
                          }`
                        }
                        label=""
                        shape="square"
                      />
                      <Text align="center">
                        {" "}
                        {nft.tokenType === "ERC721"
                          ? smartTrim(nft.title || nft.contract.name, 30)
                          : smartTrim(nft.contract.name, 30)}
                      </Text>
                    </Stack>
                  </NFTCard>
                );
              })}
          </Box>
        </ScrollContainer>
      </Stack>
    </Stack>
  );
};

export default NFTOwnership;

export const NFTCard = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  &:hover {
    border: solid 2px rgb(191, 90, 242);
    transition-duration: 0.7s;
  }
  transition: all 0.3s ease-in-out;
  padding: 0.3rem 0.8rem;
  justify-content: center;
  align-items: center;
  overflow: auto;
`;

const ScrollContainer = styled(Box)`
  overflow-y: auto;
  height: 20rem;
  ::-webkit-scrollbar {
    width: 0.5rem;
    border-radius: 0rem;
  }
  flex-wrap: wrap;
`;
