import { PayWallOptions, Registry } from "@/app/types";
import { Box, Input, Stack, Tag, Text, useTheme } from "degen";
import React, { useEffect, useState } from "react";
import { isAddress } from "ethers/lib/utils";
import { Tooltip } from "react-tippy";
import RewardTokenOptions from "./RewardTokenOptions";

interface Props {
  payWallOption: PayWallOptions;
  setPayWallOption: (opt: any) => void;
}

export default function PayWall({ payWallOption, setPayWallOption }: Props) {
  const [networks, setNetworks] = useState<Registry | undefined>(
    payWallOption.network || {}
  );
  const [receiver, setReceiver] = useState(payWallOption?.receiver);
  const [value, setValue] = useState(payWallOption?.value);
  const { mode } = useTheme();

  useEffect(() => {
    setPayWallOption({
      network: networks,
      value: value,
      receiver: receiver,
    });
  }, [networks, receiver, setPayWallOption, value]);

  return (
    <>
      <Box>
        <Stack space="4">
          <Stack direction="vertical" space="0">
            <Stack direction="horizontal" space="2" align="center">
              <Text variant="label">{`Receiver's Address`}</Text>
              <Tag size="small" tone="accent">
                Required
              </Tag>
            </Stack>
            <Input
              label=""
              placeholder="Receiver's Address"
              value={payWallOption?.receiver}
              error={receiver && !isAddress(receiver)}
              onChange={(e) => {
                setReceiver(e.target.value);
              }}
            />
          </Stack>
          <Tooltip
            html={
              <Text>
                This is optional. It is recommended to leave it empty where you
                would like the payer to decide the amount, eg, donations.
                Alternatively, you can fix the amount to use this as a paywall,
                collect payments for services etc.
              </Text>
            }
            theme={mode}
          >
            {" "}
            <Stack direction="vertical" space="0">
              <Text variant="label">Receiving Amount</Text>
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
          </Tooltip>
          <RewardTokenOptions
            networks={networks}
            setNetworks={setNetworks}
            customText={
              "Pick the network and token that the payer can pay with"
            }
            customTooltip="You can only pick one token"
            singleSelect={true}
          />
          {/* {!networks ||
            (!Object.keys(networks)?.length && (
              <Text variant="label">No Payment options added yet</Text>
            ))} */}
        </Stack>
      </Box>
    </>
  );
}
