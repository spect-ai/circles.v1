import PrimaryButton from "@/app/common/components/PrimaryButton";
import { isIntegerString, logError } from "@/app/common/utils/utils";
import { getPoap } from "@/app/services/Poap";
import { getTokenMetadata } from "@/app/services/nft";
import { LookupToken, PoapCredential } from "@/app/types";
import { Avatar, Box, Input, Spinner, Stack, Text, useTheme } from "degen";
import { matchSorter } from "match-sorter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";

type Props = {
  lookupTokens: LookupToken[];
  setLookupTokens: (lookupTokens: LookupToken[]) => void;
  initPoap: PoapCredential[];
};

const PoapClaimed = ({ lookupTokens, setLookupTokens, initPoap }: Props) => {
  const { mode } = useTheme();
  const [filteredPoaps, setFilteredPoaps] = useState<PoapCredential[]>([]);
  const [showFetchButton, setShowFetchButton] = useState<boolean>(false);
  const [poaps, setPoaps] = useState<PoapCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  useEffect(() => {
    setLoading(true);
    setPoaps(initPoap);
    setFilteredPoaps(initPoap);
    setShowFetchButton(false);
    setLoading(false);
  }, []);
  console.log({
    fPOAP: filteredPoaps,
    poap: poaps,
  });

  return (
    <Stack space="0">
      <Text variant="small" color="textSecondary" weight="semiBold">
        Pick the POAPs
      </Text>

      <Stack direction="vertical" space="3">
        <Stack direction="horizontal" space="2" align="center">
          <Input
            placeholder={"Search for a poap or enter an event id"}
            label=""
            width="2/3"
            onChange={(e) => {
              setLoading(true);
              try {
                if (!e.target.value) {
                  setFilteredPoaps(poaps);
                  setShowFetchButton(false);
                } else {
                  setSearchValue(e.target.value);
                  setFilteredPoaps(
                    matchSorter(poaps, e.target.value, {
                      keys: ["event.name"],
                    })
                  );

                  if (isIntegerString(e.target.value)) {
                    setShowFetchButton(true);
                  }
                }
              } catch (err) {
                console.log(err);
                logError("Error searching poap");
              }
              setLoading(false);
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
                    throw new Error("Invalid event id");
                  const poap = await getPoap(searchValue);
                  console.log({ poap });
                  if (!poap || !poap.name) {
                    setFilteredPoaps([]);
                    throw new Error("POAP with this event id not found");
                  }
                  const fullPoap: PoapCredential = {
                    event: poap,
                    chain: "xdai",
                  };
                  setFilteredPoaps([fullPoap]);
                } catch (err) {
                  console.log(err);
                  toast.error((err as any)?.message || err);
                  logError("Error fetching poap");
                }
                setLoading(false);
              }}
            >
              Fetch POAP by Event ID
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

          {!loading && filteredPoaps?.length === 0 && (
            <Box
              display="flex"
              justifyContent="flex-start"
              flexDirection="column"
            >
              <Text variant="small" color="textSecondary">
                No POAPs found
              </Text>
            </Box>
          )}
          {!loading && (
            <Stack direction="horizontal" wrap space="2">
              {filteredPoaps.map((poap) => {
                if (
                  lookupTokens.find(
                    (t) => t.contractAddress === poap.event.id.toString()
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
                    onClick={() => {
                      setLookupTokens([
                        ...lookupTokens,
                        {
                          contractAddress: poap.event.id.toString(),
                          tokenType: "poap",
                          metadata: {
                            name: poap.event.name,
                            image: poap.event.image_url,
                            symbol: "poap",
                          },
                          chainId: 100,
                          chainName: "gnosis",
                        },
                      ]);
                    }}
                  >
                    <Stack align="center">
                      <Avatar
                        src={poap.event.image_url}
                        label=""
                        shape="square"
                      />
                      <Text align="center">{poap.event.name}</Text>
                    </Stack>
                  </NFTCard>
                );
              })}
            </Stack>
          )}
        </ScrollContainer>
      </Stack>
    </Stack>
  );
};

export default PoapClaimed;

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
