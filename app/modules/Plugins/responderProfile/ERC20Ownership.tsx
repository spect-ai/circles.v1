import { LookupToken } from "@/app/types";
import { Box, Input, Spinner, Stack, Text, useTheme } from "degen";
import { ethers } from "ethers";
import { matchSorter } from "match-sorter";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { erc20ABI, readContracts } from "wagmi";

export type Token = {
  logo: string | null;
  name: string;
  symbol: string;
  balance: number;
  contractAddress: string;
};

export type TokenFromAnkr = {
  balance: string;
  contractAddress: string;
  balanceUsd: string;
  blockchain: string;
  holderAddress: string;
  thumbnail: string;
  tokenDecimals: number;
  tokenName: string;
  tokenSymbol: string;
  tokenType: string;
  tokenPrice: string;
};

type Props = {
  lookupTokens: LookupToken[];
  setLookupTokens: (lookupTokens: LookupToken[]) => void;
  initTokens: TokenFromAnkr[];
};

const ERC20Ownership = ({
  lookupTokens,
  setLookupTokens,
  initTokens,
}: Props) => {
  const { mode } = useTheme();
  const [tokens, setTokens] = useState<TokenFromAnkr[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredTokens, setFilteredTokens] = useState<TokenFromAnkr[]>([]);

  useEffect(() => {
    setLoading(true);
    setTokens(initTokens);
    setFilteredTokens(initTokens);
    setLoading(false);
  }, []);

  return (
    <Stack space="0">
      <Text variant="small" color="textSecondary" weight="semiBold">
        Pick the tokens and currencies
      </Text>

      <Stack direction="vertical" space="3">
        <Input
          placeholder={"Search for a token or enter a token address"}
          label=""
          width="2/3"
          onChange={async (e) => {
            if (!ethers.utils.isAddress(e.target.value))
              setFilteredTokens(
                matchSorter(tokens, e.target.value, {
                  keys: ["tokenName", "tokenSymbol"],
                })
              );
            else {
              setLoading(true);
              let tokenNames: any[], tokenSymbols: any[];
              try {
                tokenSymbols = await readContracts({
                  contracts: [1, 137, 100, 42161, 56, 43114].map((chainId) => ({
                    functionName: "symbol",
                    abi: erc20ABI,
                    address: e.target.value as `0x${string}`,
                    chainId,
                  })),
                  allowFailure: true,
                });
                tokenNames = await readContracts({
                  contracts: [1, 137, 10, 42161, 56, 43114].map((chainId) => ({
                    functionName: "name",
                    abi: erc20ABI,
                    address: e.target.value as `0x${string}`,
                    chainId,
                  })),
                });
              } catch (err) {
                console.log(err);
              }
              const tokens = [1, 137, 100, 42161, 56, 43114]
                ?.map((d) => {
                  if (tokenSymbols?.[d] && tokenNames?.[d])
                    return {
                      tokenName: tokenNames?.[d],
                      tokenSymbol: tokenSymbols?.[d],
                      contractAddress: e.target.value,
                      blockchain: [
                        "eth",
                        "polygon",
                        "optimism",
                        "arbitrum",
                        "bsc",
                        "avalanche",
                      ][d],
                    };
                  else return null;
                })
                .filter((d) => d) as TokenFromAnkr[];
              setFilteredTokens(tokens);
              setLoading(false);
            }
          }}
        />
        {loading && (
          <Stack direction="horizontal" align="center">
            <Text>Fetching tokens</Text>
            <Spinner />
          </Stack>
        )}

        {!loading && filteredTokens?.length === 0 && (
          <Box
            display="flex"
            justifyContent="flex-start"
            flexDirection="column"
          >
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
                View Supported Networks
              </Text>
            </Box>
          </Box>
        )}
        {!loading && filteredTokens?.length && (
          <ScrollContainer>
            <Box display="flex" flexDirection="row" gap="2" flexWrap="wrap">
              {filteredTokens.map((token, index) => {
                if (
                  lookupTokens.find(
                    (t) =>
                      t.contractAddress === token.contractAddress &&
                      t.chainName === token?.blockchain
                  )
                ) {
                  return null;
                }
                return (
                  <TokenTag
                    cursor="pointer"
                    key={index}
                    mode={mode}
                    onClick={() => {
                      setLookupTokens([
                        ...lookupTokens,
                        {
                          contractAddress: token.contractAddress,
                          tokenType: "erc20",
                          metadata: {
                            name: token.tokenName,
                            image: token.thumbnail || "",
                            symbol: token.tokenSymbol,
                          },
                          chainId: 0,
                          chainName: token.blockchain,
                        },
                      ]);
                    }}
                  >
                    <Text variant="small" color="textSecondary">
                      {token.tokenSymbol} on {token.blockchain}
                    </Text>
                  </TokenTag>
                );
              })}
            </Box>
          </ScrollContainer>
        )}
      </Stack>
    </Stack>
  );
};

export default ERC20Ownership;

export const TokenTag = styled(Box)<{ mode: string }>`
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
  height: 2.5rem;
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
