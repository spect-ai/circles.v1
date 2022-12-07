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
  console.log(data);

  const payWallNetwork = (form.properties[propertyName]?.payWallOptions
    .network || {}) as Registry;

  const payWallOptions = form.properties[propertyName]
    ?.payWallOptions as PayWallOptions;

  const payWallData = data[propertyName];

  const { data: circleRegistry } = useQuery<Registry>(
    ["registry", form.parents?.[0].slug],
    () =>
      fetch(
        `${process.env.API_HOST}/circle/slug/${form.parents?.[0].slug}/getRegistry`
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

  const [tokenStatus, setTokenStatus] = useState(false);

  // Setting Token Options as per the network
  useEffect(() => {
    if (payWallOptions && selectedChain) {
      const tokens = Object.entries(
        payWallOptions.network?.[selectedChain.value].tokenDetails
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

  // 1. Checks if you are on the right network
  // 2. Checks if you have sufficient ERC20 Allowance
  const preCheck = () => {
    const approval = async () => {
      const approvalStatus = await isApproved(
        selectedToken.value,
        circleRegistry?.[selectedChain.value].distributorAddress as string,
        payWallOptions.value > 0 ? payWallOptions.value : payWallData?.value,
        userAddress || ""
      );
      setTokenStatus(approvalStatus);
      console.log({ approvalStatus });
    };
    if (chain?.id.toString() == selectedChain.value) {
      void approval();
    } else {
      try {
        switchNetworkAsync &&
          void switchNetworkAsync(parseInt(selectedChain.value)).catch(
            (err: any) => {
              toast.error(err.message);
            }
          );
        void approval();
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  // Record payment
  const recordPayment = (txnHash: string) => {
    setData({
      chain: selectedChain,
      token: selectedToken,
      value:
        payWallOptions.value > 0 ? payWallOptions?.value : payWallData?.value,
      paid: true,
      txnHash,
    });
  };

  return (
    <Box>
      <Stack
        direction={{
          xs: "vertical",
          md: "horizontal",
        }}
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
              setData({
                chain: option,
                token: selectedToken,
                value:
                  payWallOptions.value > 0
                    ? payWallOptions?.value
                    : payWallData?.value,
              });
            }}
            multiple={false}
            isClearable={false}
            disabled={payWallData && payWallData?.paid}
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
              setData({
                chain: selectedChain,
                token: option,
                value:
                  payWallOptions.value > 0
                    ? payWallOptions?.value
                    : payWallData?.value,
              });
            }}
            multiple={false}
            isClearable={false}
            disabled={payWallData && payWallData?.paid}
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
            value={
              payWallOptions.value > 0
                ? payWallOptions?.value
                : payWallData?.value
            }
            onChange={(e) => {
              setData({
                chain: selectedChain,
                token: selectedToken,
                value: parseFloat(e.target.value),
              });
            }}
            type="number"
            units={selectedToken.label}
            disabled={
              !!payWallOptions.value || (payWallData && payWallData?.paid)
            }
          />
        </Box>
      </Stack>
      <PrimaryButton
        onClick={async () => {
          // Pre Check
          preCheck();

          // Check if wallet has enough tokens
          if (
            !(await hasBalance(
              selectedToken.value,
              payWallOptions.value > 0
                ? payWallOptions.value
                : payWallData?.value,
              userAddress as string
            ))
          ) {
            toast.error(
              `You don't have sufficient ` + `${selectedToken.label}`
            );
            return;
          }

          // Paying via Native Currency
          if (
            circleRegistry &&
            selectedToken.label ==
              circleRegistry[selectedChain.value]?.nativeCurrency
          ) {
            const options = {
              chainId: selectedChain.value || "",
              paymentType: "currency",
              userAddresses: [
                form.properties[propertyName]?.payWallOptions.receiver,
              ],
              amounts: [
                payWallOptions.value > 0
                  ? payWallOptions.value
                  : payWallData?.value,
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
            return;
          }

          // Paying via ERC20 Token
          if (
            circleRegistry &&
            selectedToken.label !==
              circleRegistry[selectedChain.value]?.nativeCurrency
          ) {
            // Approval for ERC20 token
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
                  pending: `Approving ${
                    (circleRegistry &&
                      circleRegistry[selectedChain.value]?.tokenDetails[
                        selectedToken.value
                      ]?.name) ||
                    "Token"
                  }`,
                  error: {
                    render: ({ data }) => data,
                  },
                },
                {
                  position: "top-center",
                }
              );
            }

            // Paying on Mumbai or Polygon Mainnet --> Gasless transactions via BICO
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
                  payWallOptions.value > 0
                    ? payWallOptions.value
                    : payWallData?.value,
                ],
                tokenAddresses: [selectedToken.value],
                cardIds: [""],
                circleId: form.parents?.[0].id,
                circleRegistry: circleRegistry,
              });
              recordPayment("gasless");
              return;
            }

            // Paying on all other networks
            const tokenTxnHash = await toast
              .promise(
                batchPay({
                  chainId: selectedChain.value || "",
                  paymentType: "tokens",
                  batchPayType: "form",
                  userAddresses: [payWallOptions.receiver],
                  amounts: [
                    payWallOptions.value > 0
                      ? payWallOptions.value
                      : payWallData?.value,
                  ],
                  tokenAddresses: [selectedToken.value],
                  cardIds: [""],
                  circleId: form.parents?.[0].id,
                  circleRegistry: circleRegistry,
                }),
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
          }
        }}
        disabled={payWallData && payWallData?.paid}
      >
        Pay
      </PrimaryButton>
    </Box>
  );
};

export default PaywallField;
