import Dropdown from "@/app/common/components/Dropdown";
import { Chain, Option, Registry, Reward, Token } from "@/app/types";
import { Box, Input, Stack } from "degen";
import { useEffect, useState } from "react";

type Props = {
  form: any;
  propertyName: string;
  data: any;
  updateData: (reward: Reward) => void;
  onValueKeyDown?: (e: any) => void;
};

export default function RewardField({
  form,
  propertyName,
  data,
  updateData,
  onValueKeyDown,
}: Props) {
  const rewardOptions = (form.properties[propertyName]?.rewardOptions ||
    {}) as Registry;
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
    label: (data && data[propertyName]?.chain?.label) || firstChainName,
    value: (data && data[propertyName]?.chain?.value) || firstChainId,
  });
  const [selectedToken, setSelectedToken] = useState<Option>({
    label: firstTokenSymbol,
    value: firstTokenAddress,
  });

  useEffect(() => {
    if (form.properties[propertyName]?.rewardOptions && selectedChain) {
      const tokens = Object.entries(
        rewardOptions[selectedChain.value].tokenDetails
      ).map(([address, token]) => {
        return {
          label: token.symbol,
          value: address,
        };
      });
      setSelectedToken(tokens[0]);
      setTokenOptions(tokens);
    }
  }, [selectedChain]);

  return (
    <Stack direction="horizontal">
      <Box width="72" marginTop="2">
        <Dropdown
          options={
            form.properties[propertyName]?.rewardOptions
              ? Object.entries(
                  form.properties[propertyName].rewardOptions as Registry
                ).map(([chainId, network]) => {
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
              value: data[propertyName]?.value,
            });
          }}
          multiple={false}
          isClearable={false}
        />
      </Box>
      <Box width="72" marginTop="2">
        <Dropdown
          options={tokenOptions}
          selected={selectedToken}
          onChange={(option) => {
            setSelectedToken(option);
            updateData({
              chain: selectedChain,
              token: option,
              value: data[propertyName]?.value,
            });
          }}
          multiple={false}
          isClearable={false}
        />
      </Box>
      <Input
        label=""
        placeholder={`Enter Reward Amount`}
        value={data && data[propertyName]?.value}
        onChange={(e) => {
          updateData({
            chain: selectedChain,
            token: selectedToken,
            value: parseFloat(e.target.value),
          });
        }}
        type="number"
        onKeyDown={onValueKeyDown}
      />
    </Stack>
  );
}
