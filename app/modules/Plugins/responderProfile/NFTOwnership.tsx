import PrimaryButton from "@/app/common/components/PrimaryButton";
import { logError, smartTrim } from "@/app/common/utils/utils";
import { ERC1155InterfaceId, ERC165Abi } from "@/app/services/nft";
import { LookupToken } from "@/app/types";
import { erc721ABI } from "@wagmi/core";
import { Avatar, Box, Input, Spinner, Stack, Text, useTheme } from "degen";
import { ethers } from "ethers";
import { AnimatePresence } from "framer-motion";
import { matchSorter } from "match-sorter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { readContracts } from "wagmi";
import NFTDetailsModal, { NFTDetails } from "./NFTDetailsModal";

type Props = {
  lookupTokens: LookupToken[];
  setLookupTokens: (lookupTokens: LookupToken[]) => void;
  initNfts: NFTFromAnkr[];
};

const networks = [1, 137, 100, 42161, 56, 43114];
const networkNames = [
  "eth",
  "polygon",
  "optimism",
  "arbitrum",
  "bsc",
  "avalanche",
];
const networkToIds = {
  eth: 1,
  polygon: 137,
  optimism: 100,
  arbitrum: 42161,
  bsc: 56,
  avalanche: 43114,
};

export type NFTFromAnkr = {
  contractAddress: string;
  blockchain: string;
  collectionName: string;
  symbol: string;
  tokenId: string;
  contractType: string;
  tokenUrl: string;
  name: string;
  imageUrl: string;
  quantity: string;
};

const NFTOwnership = ({ lookupTokens, setLookupTokens, initNfts }: Props) => {
  const { mode } = useTheme();
  const [filteredNFTs, setFilteredNFTs] = useState<NFTFromAnkr[]>([]);
  const [nfts, setNfts] = useState<NFTFromAnkr[]>([]);
  const [loading, setLoading] = useState(false);
  const [openNFTDetails, setOpenNFTDetails] = useState(false);
  const [showFetchAddressButton, setShowFetchAddressButton] =
    useState<boolean>(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<NFTFromAnkr>(
    {} as NFTFromAnkr
  );
  const [searchValue, setSearchValue] = useState<string>("");

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
                  contractAddress: currentlyEditing.contractAddress,
                  tokenType:
                    currentlyEditing.contractType === "ERC721"
                      ? "erc721"
                      : "erc1155",
                  metadata: {
                    name: currentlyEditing.name,
                    image: currentlyEditing.imageUrl,
                    symbol: currentlyEditing.symbol,
                  },
                  tokenId: nftDetails.tokenId,
                  tokenAttributes: nftDetails.tokenAttributes,
                  chainId:
                    networkToIds[
                      currentlyEditing.blockchain as keyof typeof networkToIds
                    ],
                  chainName: currentlyEditing.blockchain,
                },
              ]);
              setCurrentlyEditing({} as NFTFromAnkr);
              setOpenNFTDetails(false);
              setSearchValue("");
              setFilteredNFTs(nfts);
            }}
          />
        )}
      </AnimatePresence>
      <Text variant="small" color="textSecondary" weight="semiBold">
        Pick the NFTs
      </Text>
      <Stack direction="vertical" space="3">
        <Stack direction="horizontal" space="2" align="center">
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
          {showFetchAddressButton && (
            <PrimaryButton
              variant="tertiary"
              size="small"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const nftTypes = [] as Partial<NFTFromAnkr>[];

                try {
                  if (!ethers.utils.isAddress(searchValue))
                    throw new Error("Invalid nft contract address");
                  const isERC1155 = (await readContracts({
                    contracts: networks.map((chainId) => ({
                      functionName: "supportsInterface",
                      abi: ERC165Abi,
                      address: searchValue as `0x${string}`,
                      chainId,
                      args: [ERC1155InterfaceId],
                    })),
                    allowFailure: true,
                  })) as unknown as null[] | boolean[];
                  const isERC721 = (await readContracts({
                    contracts: networks.map((chainId) => ({
                      functionName: "supportsInterface",
                      abi: ERC165Abi,
                      address: searchValue as `0x${string}`,
                      chainId,
                      args: [ERC1155InterfaceId],
                    })),
                    allowFailure: true,
                  })) as unknown as null[] | boolean[];
                  networkNames.forEach((network, index) => {
                    if (isERC1155?.[index]) {
                      nftTypes.push({
                        contractAddress: searchValue,
                        blockchain: network,
                        collectionName: "",
                        symbol: "",
                        tokenId: "",
                        contractType: "ERC1155",
                        tokenUrl: "",
                        name: "An ERC1155 NFT on " + network,
                      });
                    } else if (isERC721?.[index]) {
                      nftTypes.push({
                        contractAddress: searchValue,
                        blockchain: network,
                        collectionName: "",
                        symbol: "",
                        tokenId: "",
                        contractType: "ERC721",
                        tokenUrl: "",
                        name: "An ERC721 NFT on " + network,
                      });
                    }
                  });
                  if (!nftTypes?.length) {
                    setFilteredNFTs([]);
                    throw new Error(
                      "No NFT with the given contract address found"
                    );
                  }
                  const networksWithTokens = nftTypes.map(
                    (chain: Partial<NFTFromAnkr>) => {
                      return networkToIds[
                        chain.blockchain as keyof typeof networkToIds
                      ];
                    }
                  );

                  const names = await readContracts({
                    contracts: networksWithTokens.map((chainId) => ({
                      functionName: "name",
                      abi: erc721ABI,
                      address: searchValue as `0x${string}`,
                      chainId,
                    })),
                  });
                  console.log({ names });
                  names.forEach((name, index) => {
                    if (name) nftTypes[index].name = name;
                  });
                  console.log({ nftTypes });
                  setFilteredNFTs(nftTypes as NFTFromAnkr[]);
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
                      t.contractAddress === nft.contractAddress &&
                      t.chainName === nft?.blockchain
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
                      if (!nft.tokenId) {
                        setCurrentlyEditing(nft);
                        setOpenNFTDetails(true);
                        return;
                      }
                      setLookupTokens([
                        ...lookupTokens,
                        {
                          contractAddress: nft.contractAddress,
                          tokenType:
                            nft.contractType === "ERC721"
                              ? "erc721"
                              : "erc1155",
                          metadata: {
                            name: nft.name,
                            image: nft.imageUrl,
                            symbol: nft.symbol,
                          },
                          tokenId:
                            nft.contractType === "ERC721" ? "" : nft.tokenId,
                          chainId:
                            networkToIds[
                              nft.blockchain as keyof typeof networkToIds
                            ],
                          chainName: nft.blockchain,
                        },
                      ]);
                    }}
                  >
                    <Stack align="center">
                      <Avatar
                        src={
                          nft.imageUrl ||
                          `https://api.dicebear.com/5.x/initials/svg?seed=${nft.name}`
                        }
                        label=""
                        shape="square"
                      />
                      <Text align="center">{smartTrim(nft.name, 30)}</Text>
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
