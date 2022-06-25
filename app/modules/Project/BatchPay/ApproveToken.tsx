import Loader from "@/app/common/components/Loader";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobalContext } from "@/app/context/globalContext";
import useERC20 from "@/app/services/Payment/useERC20";
import { QuestionCircleFilled } from "@ant-design/icons";
import { Box, Button, IconCheck, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tippy";
import { useAccount } from "wagmi";

import { useLocalProject } from "../Context/LocalProjectContext";
import { useBatchPayContext } from "./context/batchPayContext";
import { ScrollContainer } from "./SelectCards";

export default function ApproveToken() {
  const { approve, isApproved } = useERC20();
  const { registry } = useGlobalContext();
  const { localProject: project } = useLocalProject();
  const { data } = useAccount();
  const [loading, setLoading] = useState(true);
  const { batchPayInfo, setStep, setIsOpen } = useBatchPayContext();

  const [tokenStatus, setTokenStatus] = useState<{
    [tokenAddress: string]: {
      loading: boolean;
      approved: boolean;
      error: string;
    };
  }>({} as any);

  useEffect(() => {
    console.log("useeffect");
    // initialize tokenStatus
    setLoading(true);
    const tokenStatus: any = {};
    let index = 0;
    batchPayInfo?.approval.tokenAddresses.forEach(async (address: string) => {
      const approvalStatus = await isApproved(
        address,
        registry[project.parents[0].defaultPayment.chain.chainId]
          .distributorAddress as string,
        batchPayInfo.approval.values[index],
        data?.address as string
      );
      tokenStatus[address] = {
        loading: false,
        approved: approvalStatus,
        error: "",
      };
      if (index === batchPayInfo.approval.tokenAddresses.length - 1) {
        setTokenStatus(tokenStatus);
        setLoading(false);
        console.log({ tokenStatus });
        if (
          batchPayInfo.approval.tokenAddresses.every(
            (address: string) => tokenStatus[address]?.approved
          )
        ) {
          setStep(3);
        }
      }
      index++;
    });
    // set to final step if all tokens approved
  }, [batchPayInfo]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between">
      <ScrollContainer padding="8">
        <Loader loading={loading} text="" />
        {!loading && (
          <Box>
            <Stack direction="horizontal" space="1" align="center">
              <Text variant="extraLarge" weight="semiBold">
                Approve Tokens
              </Text>

              <Button shape="circle" size="small" variant="transparent">
                <Tooltip
                  html={
                    <Text>
                      You need to approve the following tokens so we can
                      transfer them to relevant addresses
                    </Text>
                  }
                >
                  <QuestionCircleFilled style={{ fontSize: "1rem" }} />
                </Tooltip>
              </Button>
            </Stack>
            <Stack>
              <Box marginTop="4" />
              {batchPayInfo?.approval.tokenAddresses.map(
                (tokenAddress, index) => (
                  <Box key={index}>
                    <Stack>
                      <Text variant="base" weight="semiBold">
                        {
                          registry[
                            project.parents[0].defaultPayment.chain.chainId
                          ].tokenDetails[tokenAddress].symbol
                        }
                      </Text>
                      <Box width="1/3">
                        <PrimaryButton
                          tone={
                            tokenStatus[tokenAddress]?.approved
                              ? "green"
                              : "accent"
                          }
                          icon={
                            tokenStatus &&
                            tokenStatus[tokenAddress]?.approved ? (
                              <IconCheck />
                            ) : null
                          }
                          loading={
                            tokenStatus && tokenStatus[tokenAddress]?.loading
                          }
                          onClick={async () => {
                            // set loading for this token status
                            setTokenStatus({
                              ...tokenStatus,
                              [tokenAddress]: {
                                ...tokenStatus[tokenAddress],
                                loading: true,
                              },
                            });
                            const res = await approve(
                              project.parents[0].defaultPayment.chain.chainId,
                              tokenAddress
                            );
                            // set approved for this token status
                            if (res) {
                              // set loading for this token status
                              setTokenStatus({
                                ...tokenStatus,
                                [tokenAddress]: {
                                  ...tokenStatus[tokenAddress],
                                  approved: true,
                                  loading: false,
                                },
                              });
                            } else {
                              setTokenStatus({
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
                )
              )}
            </Stack>
          </Box>
        )}
      </ScrollContainer>

      <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
        <Stack direction="horizontal">
          <Box width="1/2">
            <PrimaryButton
              tone="red"
              onClick={() => {
                setStep(0);
                setIsOpen(false);
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
                !batchPayInfo?.approval.tokenAddresses.every(
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
