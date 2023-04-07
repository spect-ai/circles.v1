import Accordian from "@/app/common/components/Accordian";
import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useERC20 from "@/app/services/Payment/useERC20";
import { Registry } from "@/app/types";
import { Box, Button, IconClose, Input, Stack, Text } from "degen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";

type Props = {
  networks?: Registry;
  setNetworks: React.Dispatch<React.SetStateAction<Registry | undefined>>;
};

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 4px;
  }
`;

const RewardOptions = ({ networks, setNetworks }: Props) => {
  const { registry } = useCircle();
  const [settingCustom, setSettingCustom] = useState(false);
  const [address, setAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");

  const [, setTokenLoading] = useState(false);
  const { symbol, name } = useERC20();
  const [options] = useState(
    registry
      ? Object.entries(registry).map(([chainId, network]) => ({
          label: network.name,
          value: chainId,
        }))
      : ([] as OptionType[])
  );
  const [selectedOption, setSelectedOption] = useState({
    label: "Mainnet",
    value: "1",
  } as OptionType);

  return (
    <ScrollContainer maxHeight="72" overflow="auto">
      <Stack>
        <Text variant="label">Reward Options</Text>
        {!settingCustom && (
          <Button
            variant="tertiary"
            size="small"
            onClick={() => {
              setSettingCustom(true);
            }}
          >
            Add Custom Token
          </Button>
        )}
        {settingCustom && (
          <Box display="flex" flexDirection="column">
            <Stack direction="horizontal" space="1" align="center">
              <Dropdown
                options={options}
                selected={selectedOption}
                onChange={(option) => {
                  setAddress("");
                  setSelectedOption(option);
                }}
                multiple={false}
                isClearable={false}
              />

              <Input
                label=""
                placeholder="Token Address"
                width="72"
                value={address}
                onChange={async (e) => {
                  setAddress(e.target.value);
                  setTokenLoading(true);
                  try {
                    setTokenSymbol(
                      await symbol(e.target.value, selectedOption.value)
                    );
                    setTokenName(
                      await name(e.target.value, selectedOption.value)
                    );
                  } catch (err) {
                    console.error(err);
                    setTokenLoading(false);
                  }
                  setTokenLoading(false);
                }}
              />
            </Stack>
            {tokenSymbol && (
              <Box
                marginTop="2"
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
              >
                <Text variant="small">{`Adding ${tokenSymbol} (${tokenName})`}</Text>
              </Box>
            )}
            <Box
              marginTop="4"
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
            >
              <Button
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                marginRight="2"
                variant="secondary"
                size="small"
                onClick={() => {
                  setSettingCustom(true);
                  setAddress("");
                  const newNetworks = { ...networks };
                  newNetworks[selectedOption.value] = {
                    ...(newNetworks[selectedOption.value] || {
                      name: selectedOption.label,
                      chainId: selectedOption.value,
                    }),
                    tokenDetails: {
                      ...newNetworks[selectedOption.value]?.tokenDetails,
                      [address]: {
                        name: tokenName,
                        symbol: tokenSymbol,
                        address,
                      },
                    },
                  };
                  setNetworks(newNetworks);
                  setSettingCustom(false);
                  setTokenSymbol("");
                  toast.success(
                    "Token added, please save to add it permanently"
                  );
                }}
                disabled={!tokenSymbol}
              >
                Add
              </Button>
              <PrimaryButton
                tone="red"
                onClick={() => {
                  setSettingCustom(false);
                }}
              >
                Cancel
              </PrimaryButton>
            </Box>
          </Box>
        )}

        {networks &&
          Object.entries(networks).map(([chainId, network]) => (
            <Accordian
              key={chainId}
              name={`${network.name}`}
              defaultOpen={false}
            >
              <Box width="full">
                <Stack
                  direction="horizontal"
                  space="1"
                  justify="flex-start"
                  wrap
                >
                  {Object.entries(network.tokenDetails).map(([addr, token]) => (
                    <Box
                      key={token.address}
                      display="flex"
                      flexDirection="column"
                    >
                      <Stack direction="horizontal" align="center">
                        <Text>{token.symbol}</Text>
                        <Button
                          shape="circle"
                          size="small"
                          width="2"
                          variant="transparent"
                          onClick={() => {
                            const newNetworks = { ...networks };
                            delete newNetworks[chainId].tokenDetails[addr];
                            if (
                              Object.keys(newNetworks[chainId].tokenDetails)
                                .length === 0
                            ) {
                              delete newNetworks[chainId];
                            }
                            setNetworks(newNetworks);
                          }}
                        >
                          <IconClose size="4" />
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="flex-end"
                width="full"
                marginTop="2"
              >
                <Button
                  size="small"
                  variant="tertiary"
                  onClick={() => {
                    const newNetworks = { ...networks };
                    delete newNetworks[chainId];
                    setNetworks(newNetworks);
                  }}
                >
                  Remove Network
                </Button>
              </Box>
            </Accordian>
          ))}
        {!networks ||
          (!Object.keys(networks)?.length && (
            <Text variant="label">No reward options added yet</Text>
          ))}
      </Stack>
    </ScrollContainer>
  );
};

export default RewardOptions;
