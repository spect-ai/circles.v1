import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import { useGlobalContext } from "@/app/context/globalContext";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { updatePaymentInfo } from "@/app/services/Payment";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { BatchPayInfo, ProjectType } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useBatchPayContext } from "./context/batchPayContext";
import { ScrollContainer } from "./SelectCards";

export default function TokenPayment() {
  const { getMemberDetails } = useModalOptions();
  const { batchPay } = usePaymentGateway();
  const [loading, setLoading] = useState(false);
  const { registry } = useGlobalContext();
  const router = useRouter();

  const { project: pId } = router.query;
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });

  const { batchPayInfo, setStep, setIsOpen, tokenCards, setBatchPayInfo } =
    useBatchPayContext();

  const queryClient = useQueryClient();

  const formatRows = () => {
    const rows: any[] = [];
    batchPayInfo?.tokens.userIds.forEach((userId, index) => {
      return rows.push([
        <Stack key={index} direction="horizontal" align="center">
          <Avatar
            src={getMemberDetails(userId)?.avatar}
            placeholder={!getMemberDetails(userId)?.avatar}
            label=""
            size="8"
          />
          <Text variant="base" weight="semiBold">
            {getMemberDetails(userId)?.username}
          </Text>
        </Stack>,
        <Text variant="base" weight="semiBold" key={userId}>
          {batchPayInfo.tokens.values[index]}{" "}
          {
            registry[project?.parents[0].defaultPayment.chain.chainId as string]
              .tokenDetails[batchPayInfo.tokens.tokenAddresses[index]].symbol
          }
        </Text>,
      ]);
    });
    return rows;
  };

  const getEthAddress = () => {
    return batchPayInfo?.tokens.userIds.map((userId) => {
      return getMemberDetails(userId)?.ethAddress;
    });
  };

  return (
    <Box>
      <ScrollContainer padding="8">
        <Text variant="extraLarge" weight="semiBold">
          Token Payment
        </Text>
        <Box paddingY="4" />
        <Table columns={["Member", "Amount"]} rows={formatRows()} />
      </ScrollContainer>
      <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
        <Stack direction="horizontal">
          <Box width="1/2">
            <PrimaryButton
              tone="red"
              onClick={() => {
                setIsOpen(false);
                setStep(0);
              }}
            >
              Cancel
            </PrimaryButton>
          </Box>
          <Box width="1/2">
            <PrimaryButton
              loading={loading}
              onClick={async () => {
                setLoading(true);
                const txnHash = await batchPay(
                  project?.parents[0].defaultPayment.chain.chainId as string,
                  "tokens",
                  getEthAddress() as string[],
                  batchPayInfo?.tokens.values as number[],
                  batchPayInfo?.tokens.tokenAddresses as string[]
                );
                if (txnHash) {
                  const res = await updatePaymentInfo(
                    tokenCards as string[],
                    txnHash
                  );
                  console.log({ res });
                  if (res) {
                    await queryClient.setQueryData(["project", pId], res);
                    setLoading(false);
                    setIsOpen(false);
                    setStep(0);
                    setBatchPayInfo({} as BatchPayInfo);
                  } else {
                    setLoading(false);
                  }
                }
                setLoading(false);
              }}
            >
              Pay
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
