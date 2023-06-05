import Modal from "@/app/common/components/Modal";
import { getTokenMetadata } from "@/app/services/nft";
import { Avatar, Box, Stack, useTheme, Text, Tag, Input } from "degen";
import { useEffect, useState } from "react";
import { NFTCard, NFTFromAnkr } from "./NFTOwnership";
import { smartTrim } from "@/app/common/utils/utils";
import PrimaryButton from "@/app/common/components/PrimaryButton";

export type NFTDetails = {
  tokenId: string;
  tokenAttributes: {
    key: string;
    value: string;
  }[];
};

type Props = {
  handleClose: () => void;
  nft: NFTFromAnkr;
  onSave: (nftDetails: NFTDetails) => void;
};

export default function NFTDetailsModal({ handleClose, nft, onSave }: Props) {
  const { mode } = useTheme();
  const [adding, setAdding] =
    useState<"tokenId" | "tokenAttributes" | null>(null);

  const [nftDetails, setNftDetails] = useState<Partial<NFTDetails>>({
    tokenId: "",
    tokenAttributes: [],
  });
  return (
    <Modal size="small" title="More about NFT" handleClose={handleClose}>
      <Box
        padding="8"
        paddingTop="4"
        minHeight="72"
        display="flex"
        flexDirection="column"
        width="full"
        alignItems="flex-start"
        gap="4"
      >
        {nft.contractType === "ERC721" && (
          <Text variant="small" color="textSecondary" weight="semiBold">
            You may optionally add a token ID or token attributes to this NFT
            for a more specific search.
          </Text>
        )}
        {nft.contractType === "ERC1155" && (
          <Text variant="small" color="textSecondary" weight="semiBold">
            As this is an ERC1155 token, you must add a token ID or token
            attributes to this NFT for a more specific search.
          </Text>
        )}
        <NFTCard
          mode={mode}
          cursor="pointer"
          style={{
            width: "35%",
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
        <Stack space="1">
          <Text variant="small" color="textSecondary" weight="semiBold">
            Would you like to add token ID or token attributes?
          </Text>
          <Box display="flex" flexDirection="row" gap="2">
            <Tag hover tone={adding === "tokenId" ? "accent" : "secondary"}>
              <Box
                display="flex"
                alignItems="center"
                gap="1"
                cursor="pointer"
                onClick={() => {
                  setNftDetails({
                    ...nftDetails,
                    tokenAttributes: [],
                  });
                  setAdding("tokenId");
                }}
              >
                Token ID
              </Box>
            </Tag>
            <Tag
              hover
              tone={adding === "tokenAttributes" ? "accent" : "secondary"}
            >
              <Box
                display="flex"
                alignItems="center"
                gap="1"
                cursor="pointer"
                onClick={() => {
                  setNftDetails({
                    ...nftDetails,
                    tokenAttributes: [
                      {
                        key: "",
                        value: "",
                      },
                    ],
                    tokenId: "",
                  });

                  setAdding("tokenAttributes");
                }}
              >
                Token Attributes
              </Box>
            </Tag>
          </Box>
        </Stack>
        {adding === "tokenId" && (
          <Input
            label="Enter token ID"
            placeholder="69420"
            value={nftDetails.tokenId}
            width="2/3"
            onChange={(e) => {
              setNftDetails({
                ...nftDetails,
                tokenId: e.target.value,
              });
            }}
          />
        )}
        {adding === "tokenAttributes" && (
          <Stack space="1">
            <Text variant="small" color="textSecondary" weight="semiBold">
              Enter token attributes
            </Text>
            {nftDetails.tokenAttributes?.map((tokenAttribute, index) => {
              return (
                <Stack direction="horizontal" space="2" align="center">
                  <Input
                    label=""
                    placeholder="Key"
                    value={tokenAttribute.key}
                    width="2/3"
                    onChange={(e) => {
                      setNftDetails({
                        ...nftDetails,
                        tokenAttributes: nftDetails.tokenAttributes?.map(
                          (tokenAttribute, i) => {
                            if (i === index) {
                              return {
                                ...tokenAttribute,
                                key: e.target.value,
                              };
                            }
                            return tokenAttribute;
                          }
                        ),
                      });
                    }}
                  />
                  <Input
                    label=""
                    placeholder="Value"
                    value={tokenAttribute.value}
                    width="2/3"
                    onChange={(e) => {
                      setNftDetails({
                        ...nftDetails,
                        tokenAttributes: nftDetails.tokenAttributes?.map(
                          (tokenAttribute, i) => {
                            if (i === index) {
                              return {
                                ...tokenAttribute,
                                value: e.target.value,
                              };
                            }
                            return tokenAttribute;
                          }
                        ),
                      });
                    }}
                  />
                </Stack>
              );
            })}
            <Box width="1/2" marginTop="4">
              <PrimaryButton
                variant="tertiary"
                size="extraSmall"
                disabled={
                  !nftDetails.tokenAttributes?.length ||
                  !nftDetails.tokenAttributes?.every(
                    (tokenAttribute) =>
                      tokenAttribute.key && tokenAttribute.value
                  )
                }
                onClick={() => {
                  setNftDetails({
                    ...nftDetails,
                    tokenAttributes: [
                      ...(nftDetails.tokenAttributes || []),
                      {
                        key: "",
                        value: "",
                      },
                    ],
                  });
                }}
              >
                Add another attribute
              </PrimaryButton>
            </Box>
          </Stack>
        )}
      </Box>
      <Box
        display={"flex"}
        flexDirection="row"
        justifyContent="flex-end"
        width="full"
        padding="8"
        paddingTop="0"
      >
        <Box width="32">
          <PrimaryButton
            disabled={
              !nftDetails.tokenId &&
              (!nftDetails.tokenAttributes?.length ||
                !nftDetails.tokenAttributes?.every(
                  (tokenAttribute) => tokenAttribute.key && tokenAttribute.value
                )) &&
              nft.contractType === "ERC1155"
            }
            onClick={() => onSave(nftDetails as NFTDetails)}
          >
            Save
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
