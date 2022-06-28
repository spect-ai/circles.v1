import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { updatePaymentInfo } from "@/app/services/Payment";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { ProjectType } from "@/app/types";
import { QuestionCircleFilled } from "@ant-design/icons";
import { Avatar, Box, Button, Stack, Text } from "degen";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Tooltip } from "react-tippy";
import { useBatchPayContext } from "./context/batchPayContext";
import { ScrollContainer } from "./SelectCards";

export default function CurrencyPayment() {
  const { getMemberDetails } = useModalOptions();
  const { batchPay } = usePaymentGateway();
  const [loading, setLoading] = useState(false);
  const { batchPayInfo, setStep, currencyCards, tokenCards, setIsOpen } =
    useBatchPayContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { project: pId } = router.query;
  const { data: project } = useQuery<ProjectType>(["project", pId], {
    enabled: false,
  });

  const formatRows = () => {
    const rows: any[] = [];
    batchPayInfo?.currency.userIds.forEach((userId, index) => {
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
          {batchPayInfo.currency.values[index]} MATIC
        </Text>,
      ]);
    });
    return rows;
  };

  const getEthAddress = () => {
    return batchPayInfo?.currency.userIds.map((userId) => {
      return getMemberDetails(userId)?.ethAddress;
    });
  };

  return (
    <Box>
      <ScrollContainer paddingX="8" paddingY="4">
        <Stack direction="horizontal" space="1" align="center">
          <Text variant="extraLarge" weight="semiBold">
            Currency Payment
          </Text>
          <Button shape="circle" size="small" variant="transparent">
            <Tooltip
              html={
                <Stack>
                  <Text>
                    Currency payment (network gas token) and token payment need
                    to happen separately
                  </Text>
                  <Text>
                    First we will payout the currency as it doesn&apos;t require
                    approvals
                  </Text>
                </Stack>
              }
            >
              <QuestionCircleFilled style={{ fontSize: "1rem" }} />
            </Tooltip>
          </Button>
        </Stack>
        <Box paddingY="2" />
        <Table columns={["Member", "Amount"]} rows={formatRows()} />
      </ScrollContainer>
      <Box borderTopWidth="0.375" paddingX="8" paddingY="4">
        <Stack direction="horizontal">
          <Box width="1/2">
            <PrimaryButton
              tone="red"
              onClick={() => {
                setStep(0);
              }}
            >
              Back
            </PrimaryButton>
          </Box>
          <Box width="1/2">
            <PrimaryButton
              loading={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const txnHash = await batchPay(
                    project?.parents[0].defaultPayment.chain.chainId as string,
                    "currency",
                    getEthAddress() as string[],
                    batchPayInfo?.currency.values as number[],
                    []
                  );
                  console.log({ txnHash });
                  if (txnHash) {
                    const res = await updatePaymentInfo(
                      currencyCards as string[],
                      txnHash
                    );
                    console.log({ res });
                    if (res) {
                      await queryClient.setQueryData(["project", pId], res);
                      setLoading(false);
                      if (tokenCards && tokenCards?.length > 0) {
                        setStep(2);
                      } else {
                        setStep(0);
                        setIsOpen(false);
                      }
                    } else {
                      setLoading(false);
                    }
                  }
                  setLoading(false);
                } catch (error) {
                  setLoading(false);
                  console.log(error);
                }
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
