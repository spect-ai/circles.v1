/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from "@/app/common/components/Dropdown";
import { Option, Registry, Reward } from "@/app/types";
import { Box, Input, Stack } from "degen";
import { useEffect, useState } from "react";

type Props = {
  rewardOptions: Registry;
  value: Reward;
  updateData: (reward: Reward) => void;
  onValueKeyDown?: (e: any) => void;
  disabled?: boolean;
};

export default function RewardField({
  rewardOptions,
  value,
  updateData,
  onValueKeyDown,
  disabled,
}: Props) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const firstChainName =
    Object.values(rewardOptions).length > 0
      ? Object.values(rewardOptions)[0].name
      : "";
  const firstChainId =
    Object.keys(rewardOptions).length > 0 ? Object.keys(rewardOptions)[0] : "";
  const firstTokenSymbol = Object.values(
    rewardOptions[firstChainId]?.tokenDetails
  )[0].symbol;
  const firstTokenAddress = Object.keys(
    rewardOptions[firstChainId]?.tokenDetails
  )[0];

  const [tokenOptions, setTokenOptions] = useState<Option[]>([]);
  const [selectedChain, setSelectedChain] = useState<Option>({
    label: value?.chain?.label || firstChainName,
    value: value?.chain?.value || firstChainId,
  });
  const [selectedToken, setSelectedToken] = useState<Option>({
    label: value?.token?.label || firstTokenSymbol,
    value: value?.token?.value || firstTokenAddress,
  });

  console.log({ selectedChain, selectedToken, rewardOptions });

  useEffect(() => {
    if (rewardOptions && selectedChain) {
      const tokens = Object.entries(
        rewardOptions[selectedChain.value].tokenDetails
      ).map(([address, token]) => {
        return {
          label: token.symbol,
          value: address,
        };
      });
      setSelectedToken(tokens[0]);
      updateData({
        chain: selectedChain,
        token: tokens[0],
        value: value?.value,
      });
      setTokenOptions(tokens);
    }
  }, [selectedChain]);

  return (
    <Stack
      direction={{
        xs: "vertical",
        md: "horizontal",
      }}
      align="center"
    >
      <Box
        width={{
          xs: "full",
        }}
        marginTop="2"
      >
        <Dropdown
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
          selected={selectedChain}
          onChange={(option) => {
            setSelectedChain(option);
            updateData({
              chain: option,
              token: selectedToken,
              value: value?.value,
            });
          }}
          multiple={false}
          isClearable={false}
          disabled={disabled}
        />
      </Box>
      <Box
        width={{
          xs: "full",
        }}
        marginTop="2"
      >
        <Dropdown
          options={tokenOptions}
          selected={selectedToken}
          onChange={(option) => {
            setSelectedToken(option);
            updateData({
              chain: selectedChain,
              token: option,
              value: value?.value,
            });
          }}
          multiple={false}
          isClearable={false}
          disabled={disabled}
        />
      </Box>
      <Box
        width={{
          xs: "full",
        }}
        marginTop="2"
      >
        <Input
          label=""
          placeholder={`Enter Reward Amount`}
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
          units={selectedToken?.label}
          disabled={disabled}
        />
      </Box>
    </Stack>
  );
}
