/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from "@/app/common/components/Dropdown";
import { Option, Registry, Reward } from "@/app/types";
import { InputField, SelectField, Text } from "@avp1598/vibes";
import { Box, Stack } from "degen";
import { useState } from "react";

type Props = {
  rewardOptions: Registry;
  value: Reward;
  updateData: (reward: Reward) => void;
  onValueKeyDown?: (e: any) => void;
  propertyId: string;
  disabled?: boolean;
  error?: string;
};

export default function RewardField({
  rewardOptions,
  value,
  updateData,
  onValueKeyDown,
  propertyId,
  disabled,
  error,
}: Props) {
  if (!rewardOptions || !Object.values(rewardOptions)) return null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const firstChainName =
    Object.values(rewardOptions).length > 0
      ? Object.values(rewardOptions)[0].name
      : "";
  const firstChainId =
    Object.keys(rewardOptions).length > 0 ? Object.keys(rewardOptions)[0] : "";
  const firstTokenSymbol = Object.values(
    rewardOptions[firstChainId]?.tokenDetails || {}
  )[0]?.symbol;
  const firstTokenAddress = Object.keys(
    rewardOptions[firstChainId]?.tokenDetails || {}
  )[0];

  if (!firstTokenSymbol || !firstTokenAddress) return null;

  const [tokenOptions, setTokenOptions] = useState<Option[]>(
    Object.entries(
      rewardOptions?.[value?.chain?.value || firstChainId]?.tokenDetails || {}
    ).map(([address, token]) => {
      return {
        label: token.symbol,
        value: address,
      };
    })
  );
  const [selectedChain, setSelectedChain] = useState<Option>({
    label: value?.chain?.label || firstChainName,
    value: value?.chain?.value || firstChainId,
  });
  const [selectedToken, setSelectedToken] = useState<Option>({
    label: value?.token?.label || firstTokenSymbol,
    value: value?.token?.value || firstTokenAddress,
  });

  return (
    <Stack
      space="0"
      direction={{
        xs: "vertical",
        md: "horizontal",
      }}
    >
      <Box
        width={{
          xs: "full",
          md: "1/3",
        }}
      >
        <Stack space="1">
          <Text type="label" color="tertiary">
            Chain
          </Text>
          <SelectField
            name={`chain-${propertyId}`}
            value={selectedChain}
            options={
              rewardOptions
                ? Object.entries(rewardOptions).map(([chainId, network]) => {
                    return {
                      label: network.name,
                      value: chainId,
                    };
                  })
                : []
            }
            onChange={(option) => {
              setSelectedChain(option);
              const tokens = Object.entries(
                rewardOptions[option.value].tokenDetails
              ).map(([address, token]) => {
                return {
                  label: token.symbol,
                  value: address,
                };
              });
              setSelectedToken(tokens[0]);
              updateData({
                chain: option,
                token: tokens[0],
                value: value?.value,
              });
              setTokenOptions(tokens);
            }}
            isMulti={false}
            disabled={disabled}
          />
        </Stack>
      </Box>
      <Box
        width={{
          xs: "full",
          md: "1/3",
        }}
      >
        <Stack space="1">
          <Text type="label" color="tertiary">
            Token
          </Text>
          <SelectField
            name={`token-${propertyId}`}
            value={selectedToken}
            options={tokenOptions}
            onChange={(option) => {
              setSelectedToken(option);
              updateData({
                chain: selectedChain,
                token: option,
                value: value?.value,
              });
            }}
            isMulti={false}
            disabled={disabled}
          />
        </Stack>
      </Box>
      <Box
        width={{
          xs: "full",
          md: "1/3",
        }}
      >
        <Stack space="1">
          <Text type="label" color="tertiary">
            Value
          </Text>
          <InputField
            placeholder="Enter Reward Amount"
            value={value?.value}
            onChange={(e) => {
              updateData({
                chain: selectedChain,
                token: selectedToken,
                value: parseFloat(e.target.value),
              });
            }}
            type="number"
            onKeyDown={onValueKeyDown}
            prefix={selectedToken?.label}
            disabled={disabled}
            error={error}
          />
        </Stack>
      </Box>
    </Stack>
  );
}
