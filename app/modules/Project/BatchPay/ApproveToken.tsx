import Loader from "@/app/common/components/Loader";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import useERC20 from "@/app/services/Payment/useERC20";
import { CircleType, Registry } from "@/app/types";
import { QuestionCircleFilled } from "@ant-design/icons";
import { Box, Button, Heading, IconCheck, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Tooltip } from "react-tippy";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";

import { useBatchPayContext } from "./context/batchPayContext";
import { ScrollContainer } from "./SelectCards";

export default function ApproveToken() {
  const { approveAll, isApproved } = useERC20();
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { data: registry } = useQuery<Registry>(["registry", cId], {
    enabled: false,
  });

  const { data } = useAccount();
  const [loading, setLoading] = useState(true);
  const { batchPayInfo, setStep, setIsOpen } = useBatchPayContext();
  const { activeChain, switchNetworkAsync } = useNetwork();

  const { mode } = useTheme();

  const [tokenStatus, setTokenStatus] = useState<{
    [tokenAddress: string]: {
      loading: boolean;
      approved: boolean;
      error: string;
    };
  }>({} as any);
  const circleSafe =
    (circle?.safeAddresses &&
      batchPayInfo &&
      circle?.safeAddresses[batchPayInfo?.chainId] &&
      circle?.safeAddresses[batchPayInfo?.chainId][0]) ||
    "";

  useEffect(() => {
    // initialize tokenStatus
    setLoading(true);
    if (
      circle &&
      activeChain?.id.toString() === circle.defaultPayment.chain.chainId &&
      registry
    ) {
      const tokenStatus: any = {};
      let index = 0;
      console.log(circle.defaultPayment.chain.chainId);

      batchPayInfo?.approval.tokenAddresses.forEach(async (address: string) => {
        console.log({ batchPayInfo });
        const approvalStatus = await isApproved(
          address,
          registry[circle.defaultPayment.chain.chainId]
            .distributorAddress as string,
          batchPayInfo.approval.values[index],
          circleSafe || data?.address || ""
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
        setLoading(false);
        index++;
      });
    } else {
      switchNetworkAsync &&
        void switchNetworkAsync(parseInt(batchPayInfo?.chainId as string));
      setLoading(false);
    }
    // set to final step if all tokens approved
  }, [batchPayInfo, activeChain]);

  if (!registry) {
    return <Heading>Registry not found</Heading>;
  }

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
                  theme={mode}
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
                        {batchPayInfo &&
                          registry[batchPayInfo.chainId]?.tokenDetails[
                            tokenAddress
                          ]?.symbol}
                      </Text>
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
                approveAll(
                  batchPayInfo?.chainId as string,
                  batchPayInfo?.approval.tokenAddresses as string[],
                  false
                )
                  .then((res: any) => {
                    setStep(3);
                  })
                  .catch((err: any) => {
                    console.log(err);
                    toast.error(err.message);
                  });
              }}
            >
              Approve All
            </PrimaryButton>
          </Box>
          <Box width="1/2">
            <PrimaryButton
              onClick={() => {
                approveAll(
                  batchPayInfo?.chainId as string,
                  batchPayInfo?.approval.tokenAddresses as string[],
                  true,
                  circleSafe
                )
                  .then((res: any) => {
                    setStep(3);
                  })
                  .catch((err: any) => {
                    console.log(err);
                    toast.error(err.message);
                  });
              }}
            >
              Approve All On Gnosis
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
