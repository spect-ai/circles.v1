import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobalContext } from "@/app/context/globalContext";
import useERC20 from "@/app/services/Payment/useERC20";
import { BatchPayInfo } from "@/app/types";
import { Box, IconCheck, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { ScrollContainer } from "./SelectCards";

type Props = {
  batchPayInfo: BatchPayInfo;
  setStep: (step: number) => void;
};

export default function ApproveToken({ batchPayInfo, setStep }: Props) {
  const { approve } = useERC20();
  const { registry } = useGlobalContext();

  const [tokenStatus, settokenStatus] = useState<{
    [tokenAddress: string]: {
      loading: boolean;
      approved: boolean;
      error: string;
    };
  }>({} as any);

  useEffect(() => {
    // initialize tokenStatus
    const tokenStatus: any = {};
    batchPayInfo.approval.tokenAddresses.forEach((address: string) => {
      tokenStatus[address] = {
        loading: false,
        approved: false,
        error: "",
      };
    });
    settokenStatus(tokenStatus);
  }, [batchPayInfo]);

  return (
    <Box>
      <ScrollContainer padding="8">
        <Text variant="extraLarge" weight="semiBold">
          Approve Tokens
        </Text>
        <Stack>
          <Box marginTop="4" />
          {batchPayInfo.approval.tokenAddresses.map((tokenAddress, index) => (
            <Box key={index}>
              <Stack>
                <Text variant="base" weight="semiBold">
                  {registry["80001"].tokenDetails[tokenAddress].symbol}
                </Text>
                <Box width="1/3">
                  <PrimaryButton
                    tone={
                      tokenStatus[tokenAddress]?.approved ? "green" : "accent"
                    }
                    icon={
                      tokenStatus && tokenStatus[tokenAddress]?.approved ? (
                        <IconCheck />
                      ) : null
                    }
                    loading={tokenStatus && tokenStatus[tokenAddress]?.loading}
                    onClick={async () => {
                      // set loading for this token status
                      settokenStatus({
                        ...tokenStatus,
                        [tokenAddress]: {
                          ...tokenStatus[tokenAddress],
                          loading: true,
                        },
                      });
                      const res = await approve("80001", tokenAddress);
                      // set approved for this token status
                      if (res) {
                        // set loading for this token status
                        settokenStatus({
                          ...tokenStatus,
                          [tokenAddress]: {
                            ...tokenStatus[tokenAddress],
                            approved: true,
                            loading: false,
                          },
                        });
                      } else {
                        settokenStatus({
                          ...tokenStatus,
                          [tokenAddress]: {
                            ...tokenStatus[tokenAddress],
                            loading: false,
                          },
                        });
                      }
                    }}
                  >
                    {tokenStatus && tokenStatus[tokenAddress]?.approved
                      ? "Approved"
                      : "Approve"}
                  </PrimaryButton>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </ScrollContainer>

      <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
        <Stack direction="horizontal">
          <Box width="1/2">
            <PrimaryButton
              tone="red"
              onClick={() => {
                setStep(1);
              }}
            >
              Cancel
            </PrimaryButton>
          </Box>
          <Box width="1/2">
            <PrimaryButton
              onClick={() => {
                setStep(3);
              }}
              disabled={
                // check if all tokens are approved
                !batchPayInfo.approval.tokenAddresses.every(
                  (tokenAddress) => tokenStatus[tokenAddress]?.approved === true
                )
              }
            >
              Continue
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
