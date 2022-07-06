import PrimaryButton from "@/app/common/components/PrimaryButton";
import Table from "@/app/common/components/Table";
import { useGlobal } from "@/app/context/globalContext";
import useModalOptions from "@/app/services/ModalOptions/useModalOptions";
import { updatePaymentInfo } from "@/app/services/Payment";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { BatchPayInfo, CircleType } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useBatchPayContext } from "./context/batchPayContext";
import { ScrollContainer } from "./SelectCards";

export default function TokenPayment() {
  const { getMemberDetails } = useModalOptions();
  const { batchPay } = usePaymentGateway();
  const { registry } = useGlobal();
  const { batchPayInfo, setStep, setIsOpen, tokenCards, setBatchPayInfo } =
    useBatchPayContext();

  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });

  const formatRows = () => {
    const rows: any[] = [];
    batchPayInfo?.tokens?.userIds.forEach((userId, index) => {
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
            registry[circle?.defaultPayment.chain.chainId as string]
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
                setStep(-1);
              }}
            >
              Cancel
            </PrimaryButton>
          </Box>
          <Box width="1/2">
            <PrimaryButton
              onClick={async () => {
                const txnHash = await toast.promise(
                  batchPay(
                    circle?.defaultPayment.chain.chainId as string,
                    "tokens",
                    getEthAddress() as string[],
                    batchPayInfo?.tokens.values as number[],
                    batchPayInfo?.tokens.tokenAddresses as string[]
                  ),
                  {
                    pending: "Transaction is pending",
                    success: {
                      render: "Success",
                    },
                    error: {
                      render: ({ data }) => data,
                    },
                  }
                );
                console.log({ txnHash });
                if (txnHash) {
                  const res = await updatePaymentInfo(
                    tokenCards as string[],
                    txnHash
                  );
                  console.log({ res });
                  if (res) {
                    // updateProject(res);
                    setIsOpen(false);
                    setStep(0);
                    setBatchPayInfo({} as BatchPayInfo);
                  }
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
