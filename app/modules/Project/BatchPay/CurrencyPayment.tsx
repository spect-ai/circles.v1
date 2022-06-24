import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { BatchPayInfo } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import React, { useState } from "react";
import { ScrollContainer } from "./SelectCards";

type Props = {
  setStep: (step: number) => void;
  batchPayInfo: BatchPayInfo;
};

export default function CurrencyPayment({ setStep, batchPayInfo }: Props) {
  const { getMemberDetails } = useModalOptions();
  const { batchPay } = usePaymentGateway();
  const [loading, setLoading] = useState(false);

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
    return batchPayInfo.currency.userIds.map((userId) => {
      return getMemberDetails(userId)?.ethAddress;
    });
  };

  return (
    <Box>
      <ScrollContainer padding="8">
        <Text variant="extraLarge" weight="semiBold">
          Currency Payment
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
                const res = await batchPay(
                  "80001",
                  "currency",
                  getEthAddress() as string[],
                  batchPayInfo.currency.values,
                  []
                );
                setLoading(false);
                res && setStep(2);
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
