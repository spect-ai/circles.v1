import PrimaryButton from "@/app/common/components/PrimaryButton";
import { isIntegerString, logError } from "@/app/common/utils/utils";
import { getTokenMetadata } from "@/app/services/nft";
import { LookupToken } from "@/app/types";
import { Avatar, Box, Input, Spinner, Stack, Text, useTheme } from "degen";
import { matchSorter } from "match-sorter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

export type Kudos = {
  description: string;
  id: string;
  imageUri: string;
  name: string;
  service: string;
  type: string;
};

type Props = {
  lookupTokens: LookupToken[];
  setLookupTokens: (lookupTokens: LookupToken[]) => void;
  initKudos: Kudos[];
};

const KudosClaimed = ({ lookupTokens, setLookupTokens, initKudos }: Props) => {
  const { mode } = useTheme();
  const [filteredKudos, setFilteredKudos] = useState<Kudos[]>([]);
  const [kudos, setKudos] = useState<Kudos[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFetchButton, setShowFetchButton] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setKudos(initKudos);
    setFilteredKudos(initKudos);
    setLoading(false);
  }, []);

  return (
    <Stack space="0">
      <Text variant="small" color="textSecondary" weight="semiBold">
        Pick the Mintkudos
      </Text>

      <Stack direction="vertical" space="3">
        <Stack direction="horizontal" space="2" align="center">
          <Input
            placeholder={"Search for a kudos or enter a token id"}
            label=""
            width="2/3"
            onChange={(e) => {
              try {
                if (!e.target.value) {
                  setFilteredKudos(kudos);
                  setShowFetchButton(false);
                } else {
                  setSearchValue(e.target.value);

                  setFilteredKudos(
                    matchSorter(kudos, e.target.value, {
                      keys: ["name"],
                    })
                  );

                  if (isIntegerString(e.target.value)) {
                    setShowFetchButton(true);
                  }
                }
              } catch (err) {
                console.log(err);
                logError("Error searching kudos");
              }
            }}
          />
          {showFetchButton && (
            <PrimaryButton
              variant="tertiary"
              size="small"
              disabled={loading}
              onClick={async () => {
                setLoading(true);

                try {
                  if (!isIntegerString(searchValue))
                    throw new Error("Invalid token id");
                  const token = await getTokenMetadata(
                    "polygon",
                    "0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6",
                    searchValue
                  );
                  console.log({ token });
                  if (!token || !token.attributes) {
                    setFilteredKudos([]);
                    throw new Error(
                      "Mintkudos with the given token id not found"
                    );
                  }
                  setFilteredKudos([
                    {
                      description: token.attributes.description,
                      id: searchValue,
                      imageUri: token.attributes.imageUrl,
                      name: token.attributes.name,
                      service: "kudos",
                      type: "soulbound",
                    },
                  ]);
                } catch (err) {
                  console.log(err);
                  toast.error((err as any)?.message || err);
                  logError("Error fetching kudos");
                }
                setLoading(false);
              }}
            >
              Fetch Mintkudos by Token ID
            </PrimaryButton>
          )}
        </Stack>
        <ScrollContainer>
          {loading && (
            <Stack direction="horizontal" align="center">
              <Text>Fetching tokens</Text>
              <Spinner />
            </Stack>
          )}

          {!loading && filteredKudos?.length === 0 && (
            <Box
              display="flex"
              justifyContent="flex-start"
              flexDirection="column"
            >
              <Text variant="small" color="textSecondary">
                No mintkudos found
              </Text>
            </Box>
          )}
          <Stack direction="horizontal" wrap space="2">
            {!loading &&
              filteredKudos?.length > 0 &&
              filteredKudos?.map((kudo) => {
                if (lookupTokens.find((t) => t.tokenId === kudo.id)) {
                  return null;
                }

                return (
                  <NFTCard
                    mode={mode}
                    cursor="pointer"
                    style={{
                      width: "19%",
                    }}
                    key={kudo.id}
                    onClick={() => {
                      setLookupTokens([
                        ...lookupTokens,
                        {
                          contractAddress:
                            "0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6",
                          tokenType: "kudos",
                          metadata: {
                            name: kudo.name,
                            image: kudo.imageUri,
                            symbol: "kudos",
                          },
                          tokenId: kudo.id,
                          chainId: 137,
                          chainName: "polygon",
                        },
                      ]);
                    }}
                  >
                    <Stack align="center">
                      <Avatar src={kudo.imageUri} label="" shape="square" />
                      <Text align="center">{kudo.name}</Text>
                    </Stack>
                  </NFTCard>
                );
              })}
          </Stack>
        </ScrollContainer>
      </Stack>
    </Stack>
  );
};

export default KudosClaimed;

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
