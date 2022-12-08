import { PayWallOptions } from "@/app/types";
import Accordian from "@/app/common/components/Accordian";
import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useERC20 from "@/app/services/Payment/useERC20";
import { Box, Button, IconClose, Input, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import Loader from "@/app/common/components/Loader";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";

interface Props {
  payWallOption: PayWallOptions;
  setPayWallOption: (opt: any) => void;
}

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 4px;
  }
`;

export default function PayWall({ payWallOption, setPayWallOption }: Props) {
  const { registry } = useCircle();
  const [networks, setNetworks] = useState(payWallOption.network);
  const [settingCustom, setSettingCustom] = useState(false);
  const [address, setAddress] = useState("");
  const [receiver, setReceiver] = useState(payWallOption?.receiver);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [value, setValue] = useState(payWallOption?.value);
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

  const [selectedOption, setSelectedOption] = useState({
    label: "polygon",
    value: "137",
  } as OptionType);

  useEffect(() => {
    setPayWallOption({
      network: networks,
      value: value,
      receiver: receiver,
    });
  }, [address, networks, receiver, setPayWallOption, value]);

  return (
    <>
      <ScrollContainer maxHeight="72" overflow="auto">
        {tokenLoading && <Loader loading text="Fetching" />}
        <Stack>
          <Text variant="label">Paywall Options</Text>
          {networks &&
            Object.entries(networks).map(([chainId, network]) => {
              return (
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
                      {Object.entries(network.tokenDetails).map(
                        ([address, token]) => {
                          return (
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
                                    delete newNetworks[chainId].tokenDetails[
                                      address
                                    ];
                                    if (
                                      Object.keys(
                                        newNetworks[chainId].tokenDetails
                                      ).length === 0
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
                          );
                        }
                      )}
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
                        if (Object.entries(networks).length > 1) {
                          const newNetworks = { ...networks };
                          delete newNetworks[chainId];
                          setNetworks(newNetworks);
                        }
                      }}
                    >
                      Remove Network
                    </Button>
                  </Box>
                </Accordian>
              );
            })}
          {!networks ||
            (!Object.keys(networks)?.length && (
              <Text variant="label">No reward options added yet</Text>
            ))}
          {!settingCustom && (
            <Button
              variant="tertiary"
              size="small"
              onClick={() => {
                setSettingCustom(true);
                setAddress("");
                setTokenName("");
                setTokenSymbol("");
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
                    } catch (e) {
                      console.log(e);
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
                  //@ts-ignore
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
          <Text variant="label">Receiver&apos;s Address</Text>
          <Input
            label=""
            placeholder="Receiver's Address"
            value={payWallOption?.receiver}
            error={!isAddress(receiver)}
            onChange={(e) => {
              setReceiver(e.target.value);
            }}
          />
          <Text variant="label">Token Value</Text>
          <Input
            min={0}
            label=""
            placeholder="Token Value eg. 10"
            value={payWallOption?.value}
            type="number"
            onChange={(e) => {
              setValue(parseFloat(e.target.value));
            }}
          />
        </Stack>
      </ScrollContainer>
    </>
  );
}
