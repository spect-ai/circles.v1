import Accordian from "@/app/common/components/Accordian";
import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addToken } from "@/app/services/Payment";
import useERC20 from "@/app/services/Payment/useERC20";
import { Registry } from "@/app/types";
import {
  InfoOutlined,
  QuestionCircleFilled,
  QuestionCircleOutlined,
  QuestionCircleTwoTone,
} from "@ant-design/icons";
import { Box, Button, IconClose, Input, Stack, Text, useTheme } from "degen";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tippy";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";

type Props = {
  networks?: Registry;
  setNetworks: React.Dispatch<React.SetStateAction<Registry>>;
  customText?: string;
  customTooltip?: string;
  newTokenOpen?: boolean;
  singleSelect?: boolean;
  setIsDirty?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RewardTokenOptions({
  networks,
  setNetworks,
  customText,
  customTooltip,
  newTokenOpen,
  singleSelect,
  setIsDirty,
}: Props) {
  const { registry, circle, setRegistryData } = useCircle();
  const [newToken, setNewToken] = useState(newTokenOpen || false);
  const { mode } = useTheme();

  const [address, setAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [addFrom, setAddFrom] = useState("whitelist");
  const [tokenLoading, setTokenLoading] = useState(false);
  const { symbol, name } = useERC20();
  const [options, setOptions] = useState(
    registry
      ? Object.entries(registry).map(([chainId, network]) => {
          return {
            label: network.name,
            value: chainId,
          };
        })
      : ([] as OptionType[])
  );
  const [tokenOptions, setTokenOptions] = useState([] as OptionType[]);
  const [selectedChain, setSelectedChain] = useState({
    label: "Mainnet",
    value: "1",
  } as OptionType);
  const [selectedToken, setSelectedToken] = useState({} as OptionType);
  const isDisabled = () => {
    if (addFrom === "whitelist") {
      return !selectedToken;
    } else {
      return !tokenSymbol;
    }
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (addFrom === "whitelist" && selectedChain && registry) {
      const tokens = Object.entries(
        registry[selectedChain.value]?.tokenDetails || {}
      ).map(([address, token]) => {
        return {
          label: token.symbol,
          value: address,
        };
      });

      setTokenOptions(tokens);
      setSelectedToken(tokens[0]);
    }
  }, [selectedChain]);

  return (
    <ScrollContainer maxHeight="72" overflow="auto">
      <Stack>
        <Stack direction="horizontal" space="2" align="center">
          <Text variant="label">
            {customText ? customText : "Token Options for reward"}
          </Text>
          <Text variant="label">
            <Tooltip
              title={
                customTooltip
                  ? customTooltip
                  : "The reward field can be set to any of the tokens that are added as an option."
              }
              theme={mode}
              position="top"
            >
              <QuestionCircleOutlined style={{ fontSize: "1rem" }} />
            </Tooltip>
          </Text>
        </Stack>
        {networks &&
          Object.entries(networks).map(([chainId, network]) => {
            return (
              <>
                <Text variant="label">On {network.name}</Text>
                <OptionContainer>
                  {Object.entries(network.tokenDetails).map(
                    ([tokenAddress, token]) => {
                      return (
                        <TokenTag
                          key={tokenAddress}
                          mode={mode}
                          onClick={() => {}}
                        >
                          <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            gap="4"
                          >
                            <Text variant="base" weight="semiBold">
                              {`${token.symbol}`}
                            </Text>
                            <Box
                              shape="circle"
                              cursor="pointer"
                              onClick={() => {
                                setIsDirty && setIsDirty(true);
                                const newNetworks = networks;
                                delete newNetworks[chainId].tokenDetails[
                                  tokenAddress
                                ];
                                if (
                                  Object.keys(newNetworks[chainId].tokenDetails)
                                    .length === 0
                                )
                                  delete newNetworks[chainId];
                                setNetworks({ ...newNetworks });
                              }}
                            >
                              <IconClose color="accent" size="4" />
                            </Box>
                          </Box>
                        </TokenTag>
                      );
                    }
                  )}
                </OptionContainer>
              </>
            );
          })}

        {newToken && (
          <Box display="flex" flexDirection="column" marginTop="4">
            <Text variant="label">Add new token</Text>
            <Stack
              direction={{
                xs: "vertical",
                md: "horizontal",
              }}
              space="1"
              align="center"
            >
              <Dropdown
                options={options}
                selected={selectedChain}
                onChange={(option) => {
                  setAddress("");
                  setSelectedChain(option);
                }}
                multiple={false}
                isClearable={false}
              />

              {addFrom === "address" && (
                <Input
                  label=""
                  placeholder="Token Address"
                  width="1/2"
                  value={address}
                  onChange={async (e) => {
                    setAddress(e.target.value);
                    setTokenLoading(true);
                    try {
                      setTokenSymbol(
                        await symbol(e.target.value, selectedChain.value)
                      );
                      setTokenName(
                        await name(e.target.value, selectedChain.value)
                      );
                    } catch (e) {
                      console.log(e);
                      setTokenLoading(false);
                    }
                    setTokenLoading(false);
                  }}
                />
              )}
              {addFrom === "whitelist" && (
                <Box width="1/2">
                  <Dropdown
                    options={tokenOptions}
                    selected={selectedToken}
                    onChange={(option) => {
                      setSelectedToken(option);
                    }}
                    multiple={false}
                    isClearable={false}
                  />
                </Box>
              )}
            </Stack>
            {tokenSymbol && (
              <Box
                marginTop="2"
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
              >
                <Text variant="small">{`Adding ${tokenSymbol} (${tokenName})`}</Text>
              </Box>
            )}
            {addFrom === "address" && address && !tokenSymbol && !tokenLoading && (
              <Box
                marginTop="2"
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
              >
                <Text variant="small">Token not found</Text>
              </Box>
            )}
            <Box
              marginTop="4"
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              gap="2"
              padding="1"
            >
              <PrimaryButton
                variant="secondary"
                loading={loading || tokenLoading}
                onClick={async () => {
                  setLoading(true);
                  const newNetworks = networks || {};
                  if (!newNetworks[selectedChain.value] && registry) {
                    newNetworks[selectedChain.value] = {
                      ...registry[selectedChain.value],
                      tokenDetails: {},
                    };
                  }
                  if (addFrom === "address") {
                    newNetworks[selectedChain.value].tokenDetails = {
                      ...newNetworks[selectedChain.value].tokenDetails,
                      [address]: {
                        symbol: tokenSymbol,
                        name: tokenName,
                        address,
                      },
                    };
                    const res = await addToken(circle?.id || "", {
                      chainId: selectedChain.value as string,
                      address,
                      symbol: tokenSymbol,
                      name: tokenName,
                    });
                    console.log({ res });
                    setRegistryData(res);
                  } else {
                    [selectedToken].forEach((token) => {
                      newNetworks[selectedChain.value].tokenDetails = {
                        ...newNetworks[selectedChain.value].tokenDetails,
                        [token.value]: {
                          symbol: token.label,
                          name: token.label,
                          address: token.value,
                        },
                      };
                    });
                  }
                  setLoading(false);
                  setNetworks(newNetworks);
                  setNewToken(false);
                }}
                disabled={isDisabled()}
              >
                Add
              </PrimaryButton>
              <PrimaryButton
                tone="red"
                onClick={() => {
                  setNewToken(false);
                }}
              >
                Cancel
              </PrimaryButton>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                alignItems="flex-end"
                marginLeft={"2"}
              >
                <PrimaryButton
                  variant="transparent"
                  onClick={() => {
                    setAddFrom(addFrom === "address" ? "whitelist" : "address");
                  }}
                >
                  {addFrom === "address"
                    ? "Or pick whitelisted token"
                    : "Or add token by address"}
                </PrimaryButton>
              </Box>
            </Box>
          </Box>
        )}
        {!newToken &&
          (singleSelect ? Object.keys(networks || {}).length === 0 : true) && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              padding="2"
            >
              <Button
                variant="tertiary"
                size="small"
                onClick={() => {
                  setIsDirty && setIsDirty(true);
                  setNewToken(true);
                }}
                disabled={tokenLoading}
              >
                Add Token
              </Button>
            </Box>
          )}
      </Stack>
    </ScrollContainer>
  );
}

const OptionInput = styled.input<{ mode: string }>`
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(255, 255, 255, 0.85);
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.8)" : "rgb(20, 20, 20, 0.8)"};
  font-weight: 500;
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 4px;
  }
`;

export const TokenTag = styled(Box)<{ mode: string }>`
  border-radius: 1.5rem;
  border: solid 2px
    ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.05)"
        : "rgb(20, 20, 20, 0.05)"};
  transition: all 0.3s ease-in-out;
  padding: 0.1rem 1.5rem;
  justify-content: center;
  align-items: center;
  display: flex;
  width: fit-content;
`;

const OptionContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
`;
