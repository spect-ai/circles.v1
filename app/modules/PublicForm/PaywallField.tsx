import PrimaryButton from "@/app/common/components/PrimaryButton";
import { PayWallOptions, Registry } from "@/app/types";
import { Box, Input, Stack } from "degen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { useQuery } from "react-query";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import useERC20 from "@/app/services/Payment/useERC20";
import Dropdown, { OptionType } from "@/app/common/components/Dropdown";
import { useRouter } from "next/router";

type Props = {
  form: any;
  propertyName: string;
  data: any;
  disabled?: boolean;
  setData: (data: any) => void;
};

const PaywallField = ({
  form,
  propertyName,
  data,
  disabled,
  setData,
}: Props) => {
  const router = useRouter();
  const { circle: cId } = router.query;

  const payWallNetwork = (form.properties[propertyName]?.payWallOptions
    .network || {}) as Registry;

  const payWallOptions = form.properties[propertyName]
    ?.payWallOptions as PayWallOptions;

  const payWallData = data[propertyName];

  const { data: circleRegistry, refetch } = useQuery<Registry>(
    ["registry", form.parents?.[0].slug],
    () =>
      fetch(
        `${process.env.API_HOST}/circle/slug/${
          cId ? cId : form.parents?.[0].slug
        }/getRegistry`
      ).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  const { batchPay, payGasless } = usePaymentGateway();
  const { approve, isApproved, hasBalance } = useERC20();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { address: userAddress } = useAccount();

  const [tokenOptions, setTokenOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);

  const firstChainName =
    Object.values(payWallNetwork).length > 0
      ? Object.values(payWallNetwork)[0].name
      : "";
  const firstChainId =
    Object.keys(payWallNetwork).length > 0
      ? Object.keys(payWallNetwork)[0]
      : "";
  const firstTokenSymbol = Object.values(
    payWallNetwork[firstChainId]?.tokenDetails
  )[0].symbol;
  const firstTokenAddress = Object.keys(
    payWallNetwork[firstChainId]?.tokenDetails
  )[0];
  const [selectedChain, setSelectedChain] = useState<OptionType>({
    label: (data && data[propertyName]?.chain?.label) || firstChainName,
    value: (data && data[propertyName]?.chain?.value) || firstChainId,
  });
  const [selectedToken, setSelectedToken] = useState<OptionType>({
    label: firstTokenSymbol,
    value: firstTokenAddress,
  });
  const [payValue, setPayValue] = useState(0);

  const [tokenStatus, setTokenStatus] = useState(false);

  console.log(data);

  // Setting Token Options as per the network
  useEffect(() => {
    if (payWallOptions && selectedChain) {
      const tokens = Object.entries(
        payWallOptions?.network?.[cId ? firstChainId : selectedChain.value]
          ?.tokenDetails
      ).map(([address, token]) => {
        return {
          label: token.symbol,
          value: address,
        };
      });
      setSelectedToken(tokens[0]);
      setTokenOptions(tokens);
    }
  }, [form.properties, propertyName, payWallOptions, selectedChain]);

  const approval = async () => {
    const approvalStatus = await isApproved(
      selectedToken.value,
      circleRegistry?.[selectedChain.value].distributorAddress as string,
      payWallOptions.value > 0 ? payWallOptions.value : payValue,
      userAddress || ""
    );
    setTokenStatus(approvalStatus);
    console.log({ approvalStatus });
  };

  // Record payment
  const recordPayment = (txnHash: string) => {
    console.log(txnHash);
    if (txnHash)
      setData({
        chain: selectedChain,
        token: selectedToken,
        value: payWallOptions.value > 0 ? payWallOptions?.value : payValue,
        paid: true,
        txnHash,
      });
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  const checkReceiver = async () => {
    if (userAddress === payWallOptions.receiver) {
      toast.error(`You cannot fund yourself`);
      return;
    }
  };

  const checkNetwork = async () => {
    if (!(chain?.id.toString() == selectedChain.value)) {
      try {
        switchNetworkAsync &&
          (await switchNetworkAsync(parseInt(selectedChain.value)).catch(
            (err: any) => {
              console.log(err.message);
            }
          ));
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  const checkBalance = async () => {
    if (
      !(await hasBalance(
        selectedToken.value,
        payWallOptions.value > 0 ? payWallOptions.value : payValue,
        userAddress as string
      ))
    ) {
      toast.error(`You don't have sufficient ` + `${selectedToken.label}`);
      return;
    }
  };

  useEffect(() => {
    void refetch();
    void approval();
  }, [selectedToken]);

  return (
    <Box display={"flex"} flexDirection="column" gap={"2"}>
      <Stack
        direction={{
          xs: "vertical",
          md: "horizontal",
        }}
        align="center"
        justify="center"
      >
        <Box
          width={{
            xs: "full",
            md: "72",
          }}
          marginTop="2"
        >
          <Dropdown
            options={
              payWallOptions.network
                ? Object.entries(payWallOptions.network).map(
                    ([chainId, network]) => {
                      return {
                        label: network.name,
                        value: chainId,
                      };
                    }
                  )
                : []
            }
            selected={selectedChain}
            onChange={(option) => {
              setSelectedChain(option);
            }}
            multiple={false}
            isClearable={false}
            disabled={!cId && payWallData && payWallData?.paid}
          />
        </Box>
        <Box
          width={{
            xs: "full",
            md: "72",
          }}
          marginTop="2"
        >
          <Dropdown
            options={tokenOptions}
            selected={selectedToken}
            onChange={(option) => {
              setSelectedToken(option);
            }}
            multiple={false}
            isClearable={false}
            disabled={!cId && payWallData && payWallData?.paid}
          />
        </Box>
        <Box
          width={{
            xs: "full",
            md: "72",
          }}
        >
          <Input
            label=""
            placeholder={`Enter Reward Amount`}
            value={payWallOptions.value > 0 ? payWallOptions?.value : payValue}
            onChange={(e) => {
              setPayValue(parseFloat(e.target.value));
            }}
            type="number"
            units={selectedToken.label}
            min={0}
            disabled={
              payWallOptions.value ||
              (!cId && payWallData && payWallData?.paid)
            }
          />
        </Box>
      </Stack>
      {!cId && (
        <PrimaryButton
          loading={loading}
          onClick={async () => {
            // 1. Check if the receiver & sender are the same
            await checkReceiver();

            // 2. Checks if you are on the right network
            await checkNetwork();

            // 3. Check if wallet has enough tokens
            await checkBalance();

            // 4. Check if you have sufficient ERC20 Allowance
            await approval();

            // Paying via Native Currency
            if (
              circleRegistry &&
              selectedToken.label ==
                circleRegistry[selectedChain.value]?.nativeCurrency &&
              (await hasBalance(
                selectedToken.value,
                payWallOptions.value > 0 ? payWallOptions.value : payValue,
                userAddress as string
              ))
            ) {
              setLoading(true);
              const options = {
                chainId: selectedChain.value || "",
                paymentType: "currency",
                userAddresses: [
                  form.properties[propertyName]?.payWallOptions.receiver,
                ],
                amounts: [
                  payWallOptions.value > 0 ? payWallOptions.value : payValue,
                ],
                tokenAddresses: [""],
                batchPayType: "form",
                cardIds: [""],
                circleId: form.parents?.[0].id,
                circleRegistry: circleRegistry,
              };
              console.log({ options });
              const currencyTxnHash = await toast
                .promise(
                  batchPay(options),
                  {
                    pending: `Distributing ${
                      (circleRegistry &&
                        circleRegistry[selectedChain.value]?.nativeCurrency) ||
                      "Network Gas Token"
                    }`,
                    error: {
                      render: ({ data }) => data,
                    },
                  },
                  {
                    position: "top-center",
                  }
                )
                .catch((err) => console.log(err));

              recordPayment(currencyTxnHash);
              setLoading(false);
              return;
            }

            if (
              circleRegistry &&
              selectedToken.label !==
                circleRegistry[selectedChain.value]?.nativeCurrency &&
              !tokenStatus
            ) {
              await approval();
              // Approval for ERC20 token
              setLoading(true);
              if (!tokenStatus) {
                await toast.promise(
                  approve(
                    selectedChain.value,
                    selectedToken.value,
                    circleRegistry
                  ).then((res: any) => {
                    if (res) {
                      setTokenStatus(true);
                    }
                  }),
                  {
                    pending: `Approving ${selectedToken.label} Token`,
                    error: {
                      render: ({ data }) => data,
                    },
                  },
                  {
                    position: "top-center",
                  }
                );
              }
              setLoading(false);
            }

            // Paying via ERC20 Token
            if (
              circleRegistry &&
              selectedToken.label !==
                circleRegistry[selectedChain.value]?.nativeCurrency &&
              tokenStatus
            ) {
              // Paying on Mumbai or Polygon Mainnet --> Gasless transactions via BICO
              setLoading(true);
              if (
                (selectedChain.value === "137" ||
                  selectedChain.value === "80001") &&
                selectedToken.label !==
                  circleRegistry[selectedChain.value]?.nativeCurrency
              ) {
                await payGasless({
                  chainId: selectedChain.value || "",
                  paymentType: "tokens",
                  batchPayType: "form",
                  userAddresses: [payWallOptions.receiver],
                  amounts: [
                    payWallOptions.value > 0 ? payWallOptions.value : payValue,
                  ],
                  tokenAddresses: [selectedToken.value],
                  cardIds: [""],
                  circleId: form.parents?.[0].id,
                  circleRegistry: circleRegistry,
                });
                recordPayment("gasless");
                setLoading(false);
                return;
              }

              // Paying on all other networks
              const options = {
                chainId: selectedChain.value || "",
                paymentType: "tokens",
                batchPayType: "form",
                userAddresses: [payWallOptions.receiver],
                amounts: [
                  payWallOptions.value > 0 ? payWallOptions.value : payValue,
                ],
                tokenAddresses: [selectedToken.value],
                cardIds: [""],
                circleId: form.parents?.[0].id,
                circleRegistry: circleRegistry,
              };
              console.log(options);
              const tokenTxnHash = await toast
                .promise(
                  batchPay(options),
                  {
                    pending: `Distributing Approved Tokens`,
                    error: {
                      render: ({ data }) => data,
                    },
                  },
                  {
                    position: "top-center",
                  }
                )
                .catch((err) => console.log(err));
              recordPayment(tokenTxnHash);
              setLoading(false);
            }
          }}
          disabled={
            (payWallData && payWallData?.paid) ||
            (payWallOptions.value <= 0 && payValue <= 0)
          }
        >
          Pay {payWallOptions.value > 0 ? payWallOptions.value : payValue}
          {" " + selectedToken.label}
        </PrimaryButton>
      )}
      {cId && (
        <Input
          label=""
          placeholder={`Enter Transaction Hash`}
          onChange={(e) => {
            setData({
              chain: selectedChain,
              token: selectedToken,
              value: payWallOptions.value > 0 ? payWallOptions?.value : payValue,
              paid: true,
              txnHash: e.target.value,
            });
          }}
          type="text"
        />
      )}
    </Box>
  );
};

export default PaywallField;
