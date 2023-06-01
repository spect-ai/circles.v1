import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Tabs from "@/app/common/components/Tabs";
import { logError, smartTrim } from "@/app/common/utils/utils";
import { LookupToken } from "@/app/types";
import { Avatar, Box, IconPlusSmall, Input, Spinner, Stack, Text } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";

export type Token = {
  logo: string | null;
  name: string;
  symbol: string;
  balance: number;
  contractAddress: string;
};

export type NFT = {
  balance: number;
  contract: {
    address: string;
    name: string;
    symbol: string;
    totalSupply: number;
  };
  description: string;
  media: {
    bytes: number;
    format: string;
    gateway: string;
    raw: string;
    thumbnail: string;
  }[];
  rawMetadata: {
    name: string;
    image: string;
    description: string;
  };
  timeLastUpdated: string;
  title: string;
  tokenId: string;
  tokenType: string;
  tokenUri: {
    gateway: string;
    raw: string;
  };
};

export type Kudos = {
  description: string;
  id: string;
  imageUri: string;
  name: string;
  service: string;
  type: string;
};

export type Poap = {
  chain: string;
  created: string;
  owner: string;
  tokenId: string;
  event: {
    city: string;
    country: string;
    description: string;
    end_date: string;
    event_url: string;
    expiry_date: string;
    fancy_id: string;
    id: number;
    image_url: string;
    name: string;
    start_date: string;
    supply: number;
    year: number;
  };
};

type Props = {
  lookupTokens: LookupToken[];
  setLookupTokens: (lookupTokens: LookupToken[]) => void;
};

const AddLookup = ({ lookupTokens, setLookupTokens }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(0);
  const [selectedChain, setSelectedChain] = useState(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [kudos, setKudos] = useState<Kudos[]>([]);
  const [poaps, setPoaps] = useState<Poap[]>([]);

  const [loading, setLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenId, setTokenId] = useState("");

  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  const { circle } = useCircle();

  useEffect(() => {
    if (open) {
      (async () => {
        const chainId = [1, 137, 10, 42161, 80001][selectedChain];
        const tokenType = ["erc20", "nft", "kudos", "poaps"][selectedType];
        setLoading(true);
        fetch(
          `${process.env.API_HOST}/user/v1/getTokenBalances/${chainId}/${tokenType}/${circle?.id}`,
          {
            credentials: "include",
          }
        )
          .then(async (res) => {
            let tokens = [];
            try {
              tokens = await res.json();
            } catch (err) {
              console.log(err);
            }
            if (tokenType === "erc20") {
              // sort such that tokens with logos are first
              tokens.sort((a: Token, b: Token) => {
                if (a.logo && !b.logo) {
                  return -1;
                }
                if (!a.logo && b.logo) {
                  return 1;
                }
                return 0;
              });
              console.log({ tokens });
              setTokens(tokens);
            } else if (tokenType === "nft") {
              // only show 1 nft from each collection
              try {
                const nfts = tokens.reduce((acc: NFT[], nft: NFT) => {
                  if (
                    !acc.find(
                      (a) => a.contract.address === nft.contract.address
                    ) &&
                    nft.tokenType === "ERC721" &&
                    nft.contract.name
                  )
                    acc.push(nft);
                  else if (
                    nft.tokenType === "ERC1155" &&
                    nft.title &&
                    nft.contract.address !==
                      "0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6"
                  )
                    acc.push(nft);
                  return acc;
                }, []);
                setNfts(nfts);
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
      })();
    }
  }, [selectedChain, selectedType, open]);

  return (
    <Box>
      <Box width="44">
        <PrimaryButton variant="tertiary" onClick={() => setOpen(true)}>
          <Text color="accent">Add token lookup</Text>
        </PrimaryButton>
      </Box>
      <AnimatePresence>
        {open && (
          <Modal title="Add lookup" handleClose={() => setOpen(false)}>
            <Box padding="8">
              <Stack>
                <Tabs
                  selectedTab={selectedType}
                  onTabClick={(index) => setSelectedType(index)}
                  tabs={["ERC20", "NFTs", "Kudos", "POAPs"]}
                  orientation="horizontal"
                  unselectedColor="transparent"
                  selectedColor="tertiary"
                  width="96"
                />
                {selectedType < 2 && (
                  <Tabs
                    selectedTab={selectedChain}
                    onTabClick={(index) => setSelectedChain(index)}
                    tabs={[
                      "Ethereum",
                      "Polygon",
                      "Optimism",
                      "Arbritrum",
                      "Mumbai",
                    ]}
                    orientation="horizontal"
                    unselectedColor="transparent"
                    selectedColor="tertiary"
                  />
                )}
                {loading && (
                  <Stack direction="horizontal" align="center">
                    <Text>Fetching tokens</Text>
                    <Spinner />
                  </Stack>
                )}
                {!loading && selectedType === 0 && (
                  <Stack>
                    <Stack direction="horizontal" wrap space="2" align="center">
                      <Input
                        label=""
                        width="1/2"
                        placeholder="Contract Address"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                      />
                      <PrimaryButton
                        loading={fetchingMetadata}
                        variant="tertiary"
                        onClick={async () => {
                          const chainId = [1, 137, 10, 42161, 80001][
                            selectedChain
                          ];
                          const tokenType = ["erc20", "nft", "kudos", "poaps"][
                            selectedType
                          ];
                          setFetchingMetadata(true);
                          try {
                            const res = await (
                              await fetch(
                                `${process.env.API_HOST}/common/getTokenMetadata`,
                                {
                                  method: "POST",
                                  credentials: "include",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    chainId: chainId.toString(),
                                    tokenType,
                                    tokenAddress,
                                  }),
                                }
                              )
                            ).json();
                            setFetchingMetadata(false);
                            setTokens([
                              {
                                ...res,
                                contractAddress: tokenAddress,
                                balance: 0,
                              },
                              ...tokens,
                            ]);
                            setLookupTokens([
                              {
                                contractAddress: tokenAddress,
                                tokenType: "erc20",
                                metadata: {
                                  name: res.symbol,
                                  image: res.logo || "",
                                },
                                chainId,
                              },
                              ...lookupTokens,
                            ]);
                            setTokenAddress("");
                          } catch (err) {
                            toast.error(
                              "Error fetching token metadata, please ensure the contract address is correct and is on the right chain"
                            );
                            setFetchingMetadata(false);
                          }
                        }}
                      >
                        <Text color="accent">
                          <Stack
                            direction="horizontal"
                            align="center"
                            space="2"
                          >
                            <IconPlusSmall size="4" />
                            Add Token
                          </Stack>
                        </Text>
                      </PrimaryButton>
                    </Stack>
                    <Stack direction="horizontal" wrap space="2">
                      {tokens.map((token) => (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            width: "19%",
                          }}
                          onClick={() => {
                            const chainId = [1, 137, 10, 42161, 80001][
                              selectedChain
                            ];
                            if (
                              lookupTokens.find(
                                (t) =>
                                  t.contractAddress === token.contractAddress
                              )
                            ) {
                              setLookupTokens(
                                lookupTokens.filter(
                                  (t) =>
                                    t.contractAddress !== token.contractAddress
                                )
                              );
                            } else {
                              setLookupTokens([
                                ...lookupTokens,
                                {
                                  contractAddress: token.contractAddress,
                                  tokenType: "erc20",
                                  metadata: {
                                    name: token.symbol,
                                    image: token.logo || "",
                                  },
                                  chainId,
                                },
                              ]);
                            }
                          }}
                        >
                          <Box
                            key={token.contractAddress}
                            borderWidth="0.375"
                            borderRadius="2xLarge"
                            cursor="pointer"
                            padding="2"
                            borderColor={
                              lookupTokens.find(
                                (t) =>
                                  t.contractAddress === token.contractAddress
                              )
                                ? "accent"
                                : "foregroundSecondary"
                            }
                          >
                            <Stack align="center">
                              <Avatar
                                src={
                                  token.logo ||
                                  `https://api.dicebear.com/5.x/initials/svg?seed=${token.name}`
                                }
                                label=""
                                shape="square"
                              />
                              <Text align="center">
                                {smartTrim(token.symbol, 10)}
                              </Text>
                            </Stack>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>
                  </Stack>
                )}
                {!loading && selectedType === 1 && (
                  <Stack>
                    <Stack direction="horizontal" wrap space="2" align="center">
                      <Input
                        label=""
                        width="1/2"
                        placeholder="Contract Address"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                      />
                      <Input
                        label=""
                        width="1/4"
                        placeholder="TokenId"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                      />
                      <PrimaryButton
                        loading={fetchingMetadata}
                        variant="tertiary"
                        onClick={async () => {
                          const chainId = [1, 137, 10, 42161, 80001][
                            selectedChain
                          ];
                          const tokenType = ["erc20", "nft", "kudos", "poaps"][
                            selectedType
                          ];
                          setFetchingMetadata(true);
                          const res = await (
                            await fetch(
                              `${process.env.API_HOST}/common/getTokenMetadata`,
                              {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  chainId: chainId.toString(),
                                  tokenType,
                                  tokenAddress,
                                  tokenId,
                                }),
                              }
                            )
                          ).json();
                          setFetchingMetadata(false);
                          if (!res.tokenId) {
                            console.log("adding lookup token");
                            setNfts([
                              {
                                contract: res,
                                balance: 0,
                                tokenId: "",
                                tokenType: "ERC721",
                                description: "",
                                media: [],
                                rawMetadata: {
                                  name: res.openSea.name,
                                  image: res.openSea.imageUrl,
                                  description: res.openSea.description,
                                },
                                timeLastUpdated: "",
                                title: res.name,
                                tokenUri: {
                                  gateway: "",
                                  raw: "",
                                },
                              },
                              ...nfts,
                            ]);
                            setLookupTokens([
                              ...lookupTokens,
                              {
                                contractAddress: res.address,
                                tokenType:
                                  res.tokenType === "ERC721"
                                    ? "erc721"
                                    : "erc1155",
                                metadata: {
                                  name: res.name,
                                  image: res.openSea.imageUrl,
                                },
                                chainId,
                              },
                            ]);
                          } else {
                            setNfts([
                              {
                                ...res,
                                balance: 0,
                              },
                              ...nfts,
                            ]);
                            setLookupTokens([
                              ...lookupTokens,
                              {
                                contractAddress: res.contract.address,
                                tokenType:
                                  res.tokenType === "ERC721"
                                    ? "erc721"
                                    : "erc1155",
                                metadata: {
                                  name:
                                    res.tokenType === "ERC721"
                                      ? res.contract.name
                                      : res.title,
                                  image: res.media[0]?.gateway || "",
                                },
                                tokenId: res.tokenId,
                                chainId,
                              },
                            ]);
                          }
                          setTokenAddress("");
                          setTokenId("");
                        }}
                      >
                        <Text color="accent">
                          <Stack
                            direction="horizontal"
                            align="center"
                            space="2"
                          >
                            <IconPlusSmall size="4" />
                            Add NFT
                          </Stack>
                        </Text>
                      </PrimaryButton>
                    </Stack>
                    <Stack direction="horizontal" wrap space="2">
                      {nfts.map((nft) => (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            width: "19%",
                          }}
                          onClick={() => {
                            const chainId = [1, 137, 10, 42161, 80001][
                              selectedChain
                            ];
                            if (
                              nft.tokenType === "ERC721"
                                ? lookupTokens.find(
                                    (t) =>
                                      t.contractAddress ===
                                      nft.contract?.address
                                  )
                                : lookupTokens.find(
                                    (t) =>
                                      t.contractAddress ===
                                        nft.contract.address &&
                                      t.tokenId === nft.tokenId
                                  )
                            ) {
                              setLookupTokens(
                                lookupTokens.filter(
                                  (t) =>
                                    t.contractAddress !== nft.contract.address
                                )
                              );
                            } else {
                              setLookupTokens([
                                ...lookupTokens,
                                {
                                  contractAddress: nft.contract.address,
                                  tokenType:
                                    nft.tokenType === "ERC721"
                                      ? "erc721"
                                      : "erc1155",
                                  metadata: {
                                    name:
                                      nft.tokenType === "ERC721"
                                        ? nft.contract.name
                                        : nft.title,
                                    image: nft.media[0]?.gateway || "",
                                  },
                                  tokenId:
                                    nft.tokenType === "ERC721"
                                      ? ""
                                      : nft.tokenId,
                                  chainId,
                                },
                              ]);
                            }
                          }}
                        >
                          <Box
                            key={nft.contract.address}
                            borderWidth="0.375"
                            borderRadius="2xLarge"
                            cursor="pointer"
                            padding="2"
                            borderColor={
                              nft.tokenType === "ERC721"
                                ? lookupTokens.find(
                                    (t) =>
                                      t.contractAddress === nft.contract.address
                                  )
                                  ? "accent"
                                  : "foregroundSecondary"
                                : lookupTokens.find(
                                    (t) =>
                                      t.contractAddress ===
                                        nft.contract.address &&
                                      t.tokenId === nft.tokenId
                                  )
                                ? "accent"
                                : "foregroundSecondary"
                            }
                          >
                            <Stack align="center">
                              <Avatar
                                src={
                                  nft.media[0]?.gateway ||
                                  nft.rawMetadata.image ||
                                  `https://api.dicebear.com/5.x/initials/svg?seed=${nft.title}`
                                }
                                label=""
                                shape="square"
                              />
                              <Text align="center">
                                {nft.tokenType === "ERC721"
                                  ? smartTrim(nft.contract.name, 30)
                                  : smartTrim(nft.title, 30)}
                              </Text>
                            </Stack>
                          </Box>
                        </motion.div>
                      ))}
                    </Stack>
                  </Stack>
                )}
                {!loading && selectedType === 2 && (
                  <Stack direction="horizontal" wrap space="2">
                    {kudos?.map((kudo) => (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          width: "19%",
                        }}
                        onClick={() => {
                          if (
                            lookupTokens.find(
                              (t) => t.contractAddress === kudo.id
                            )
                          )
                            setLookupTokens(
                              lookupTokens.filter(
                                (t) => t.contractAddress !== kudo.id
                              )
                            );
                          else
                            setLookupTokens([
                              ...lookupTokens,
                              {
                                contractAddress: kudo.id,
                                tokenType: "kudos",
                                metadata: {
                                  name: kudo.name,
                                  image: kudo.imageUri,
                                },
                                chainId: 137,
                              },
                            ]);
                        }}
                      >
                        <Box
                          key={kudo.id}
                          borderWidth="0.375"
                          borderRadius="2xLarge"
                          cursor="pointer"
                          padding="2"
                          borderColor={
                            lookupTokens.find(
                              (t) => t.contractAddress === kudo.id
                            )
                              ? "accent"
                              : "foregroundSecondary"
                          }
                        >
                          <Stack align="center">
                            <Avatar
                              src={kudo.imageUri}
                              label=""
                              shape="square"
                            />
                            <Text align="center">{kudo.name}</Text>
                          </Stack>
                        </Box>
                      </motion.div>
                    ))}
                  </Stack>
                )}
                {!loading && selectedType === 3 && (
                  <Stack direction="horizontal" wrap space="2">
                    {poaps.map((poap) => (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          width: "19%",
                        }}
                        onClick={() => {
                          console.log({ poap });
                          if (
                            lookupTokens.find(
                              (t) =>
                                t.contractAddress === poap.event.id.toString()
                            )
                          )
                            setLookupTokens(
                              lookupTokens.filter(
                                (t) =>
                                  t.contractAddress !== poap.event.id.toString()
                              )
                            );
                          else
                            setLookupTokens([
                              ...lookupTokens,
                              {
                                contractAddress: poap.event.id.toString(),
                                tokenType: "poap",
                                metadata: {
                                  name: poap.event.name,
                                  image: poap.event.image_url,
                                },
                                chainId: 1,
                              },
                            ]);
                        }}
                      >
                        <Box
                          key={poap.tokenId}
                          borderWidth="0.375"
                          borderRadius="2xLarge"
                          cursor="pointer"
                          padding="2"
                          borderColor={
                            lookupTokens.find(
                              (t) =>
                                t.contractAddress === poap.event.id.toString()
                            )
                              ? "accent"
                              : "foregroundSecondary"
                          }
                        >
                          <Stack align="center">
                            <Avatar
                              src={poap.event.image_url}
                              label=""
                              shape="square"
                            />
                            <Text align="center">{poap.event.name}</Text>
                          </Stack>
                        </Box>
                      </motion.div>
                    ))}
                  </Stack>
                )}
                <Box width="32" marginTop="8">
                  <PrimaryButton
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Save
                  </PrimaryButton>
                </Box>
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default AddLookup;
