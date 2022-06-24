import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import { useGlobalContext } from "@/app/context/globalContext";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { BatchPayInfo } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useLocalProject } from "../Context/LocalProjectContext";
import { ScrollContainer } from "./SelectCards";

type Props = {
  setStep: (step: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  batchPayInfo: BatchPayInfo;
};

export default function TokenPayment({
  setStep,
  batchPayInfo,
  setIsOpen,
}: Props) {
  const { getMemberDetails } = useModalOptions();
  const { batchPay } = usePaymentGateway();
  const [loading, setLoading] = useState(false);
  const { registry } = useGlobalContext();
  const { localProject: project } = useLocalProject();

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
            registry[project.parents[0].defaultPayment.chain.chainId]
              .tokenDetails[batchPayInfo.tokens.tokenAddresses[index]].symbol
          }
        </Text>,
      ]);
    });
    return rows;
  };

  const getEthAddress = () => {
    return batchPayInfo.tokens.userIds.map((userId) => {
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
                  project.parents[0].defaultPayment.chain.chainId,
                  "tokens",
                  getEthAddress() as string[],
                  batchPayInfo.tokens.values,
                  batchPayInfo.tokens.tokenAddresses
                );
                setLoading(false);
                if (res) {
                  setIsOpen(false);
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
