import { LookupToken } from "@/app/types";
import { Avatar, Box, Button, IconClose, Stack, Text, useTheme } from "degen";
import { smartTrim } from "@/app/common/utils/utils";
import { motion } from "framer-motion";
import styled from "styled-components";

type Props = {
  tokenTypes: string[];
  lookupTokens: LookupToken[];
  setLookupTokens: (lookupTokens: LookupToken[]) => void;
  label: string;
};

export function SelectedCredential({
  lookupTokens,
  setLookupTokens,
  tokenTypes,
  label,
}: Props) {
  const { mode } = useTheme();
  return (
    <Box>
      {lookupTokens?.some((token) => tokenTypes.includes(token.tokenType)) && (
        <Stack space="1">
          <Text variant="small" color="textTertiary" weight="semiBold">
            {label}
          </Text>
          <Box display="flex" flexDirection="row" gap="2" flexWrap="wrap">
            {lookupTokens?.map((token, index) => {
              if (tokenTypes.includes(token.tokenType)) {
                return (
                  <NFTCardWithoutHover mode={mode} width="40" key={index}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="flex-end"
                    >
                      <Button
                        shape="circle"
                        size="extraSmall"
                        variant="transparent"
                        onClick={() => {
                          setLookupTokens(
                            lookupTokens.filter(
                              (t) =>
                                t.contractAddress !== token.contractAddress ||
                                t.chainName !== token.chainName
                            )
                          );
                        }}
                      >
                        <IconClose size="4" />
                      </Button>
                    </Box>
                    <Stack align="center">
                      <Avatar
                        src={
                          token.metadata.image ||
                          `https://api.dicebear.com/5.x/initials/svg?seed=${token.metadata.name}`
                        }
                        label=""
                        shape="square"
                      />
                      <Text align="center">
                        {smartTrim(token.metadata.name, 30)}
                      </Text>
                    </Stack>
                  </NFTCardWithoutHover>
                );
              } else return null;
            })}
          </Box>
        </Stack>
      )}
    </Box>
  );
}

export function SelectedNFT({
  lookupTokens,
  setLookupTokens,
  tokenTypes,
  label,
}: Props) {
  const { mode } = useTheme();
  console.log({ lookupTokens });
  return (
    <Box>
      {lookupTokens?.some((token) => tokenTypes.includes(token.tokenType)) && (
        <Stack space="1">
          <Text variant="small" color="textTertiary" weight="semiBold">
            {label}
          </Text>
          <Box display="flex" flexDirection="row" gap="2" flexWrap="wrap">
            {lookupTokens?.map((token, index) => {
              if (tokenTypes.includes(token.tokenType)) {
                return (
                  <NFTCardWithoutHover mode={mode} width="40" key={index}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="flex-end"
                    >
                      <Button
                        shape="circle"
                        size="extraSmall"
                        variant="transparent"
                        onClick={() => {
                          setLookupTokens(
                            lookupTokens.filter(
                              (t) =>
                                t.contractAddress !== token.contractAddress ||
                                t.chainName !== token.chainName
                            )
                          );
                        }}
                      >
                        <IconClose size="4" />
                      </Button>
                    </Box>
                    <Box padding="2">
                      <Stack align="center">
                        <Avatar
                          src={
                            token.metadata.image ||
                            `https://api.dicebear.com/5.x/initials/svg?seed=${token.metadata.name}`
                          }
                          label=""
                          shape="square"
                        />
                        <Text align="center">
                          {smartTrim(token.metadata.name, 30)}
                        </Text>
                        {token.tokenId && (
                          <Text
                            align="center"
                            variant="small"
                            color="textSecondary"
                          >
                            Token ID: {token.tokenId}
                          </Text>
                        )}
                        {token.tokenAttributes?.length && (
                          <Stack space="0">
                            {token.tokenAttributes?.map((attribute, index) => {
                              console.log({ attribute });
                              return (
                                <Text
                                  align="center"
                                  variant="small"
                                  color="textSecondary"
                                  key={index}
                                >
                                  {attribute.key}- {attribute.value}
                                </Text>
                              );
                            })}
                          </Stack>
                        )}
                      </Stack>
                    </Box>
                  </NFTCardWithoutHover>
                );
              } else return null;
            })}
          </Box>
        </Stack>
      )}
    </Box>
  );
}

export function SelectedERC20({
  tokenTypes,
  lookupTokens,
  setLookupTokens,
}: Props) {
  const { mode } = useTheme();
  return (
    <Box>
      {lookupTokens?.some((token) => tokenTypes.includes(token.tokenType)) && (
        <Stack space="1">
          <Text variant="small" color="textTertiary" weight="semiBold">
            ERC20 Tokens and Currencies
          </Text>{" "}
          <Box display="flex" flexDirection="row" gap="2" flexWrap="wrap">
            {lookupTokens?.map((token, index) => {
              if (tokenTypes.includes(token.tokenType)) {
                return (
                  <TokenTagWithoutHover mode={mode} key={index}>
                    <Stack direction="horizontal" align="center" space="2">
                      <Text variant="small" color="textSecondary">
                        {token.metadata.symbol} on {token.chainName}
                      </Text>
                      <Button
                        shape="circle"
                        size="extraSmall"
                        variant="transparent"
                        onClick={() => {
                          setLookupTokens(
                            lookupTokens.filter(
                              (t) =>
                                t.contractAddress !== token.contractAddress ||
                                t.chainName !== token.chainName
                            )
                          );
                        }}
                      >
                        <IconClose size="4" />
                      </Button>
                    </Stack>
                  </TokenTagWithoutHover>
                );
              } else return null;
            })}
          </Box>
        </Stack>
      )}
    </Box>
  );
}

export const NFTCardWithoutHover = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  padding: 0.2rem 0.2rem;
  justify-content: center;
  align-items: center;
  overflow: auto;
`;

export const TokenTagWithoutHover = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  padding: 0.3rem 0.8rem;
  justify-content: center;
  align-items: center;
  overflow: auto;
`;
