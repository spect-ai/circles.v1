import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  getCurrencyPrice,
  getPlatformTokenPrice,
} from "@/app/services/CoinGecko";
import useERC20 from "@/app/services/Payment/useERC20";
import usePaymentGateway from "@/app/services/Payment/usePayment";
import { CollectionType, PaymentConfig, Registry } from "@/app/types";
import { DollarCircleOutlined } from "@ant-design/icons";
import { Box, Input, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNetwork, useSwitchNetwork } from "wagmi";

type Props = {
  paymentConfig: PaymentConfig;
  circleSlug: string;
  circleId: string;
  data: any;
  setData: (data: any) => void;
};

export default function CollectPayment({
  paymentConfig,
  circleSlug,
  circleId,
  data,
  setData,
}: Props) {
  const [circleRegistry, setCircleRegistry] = useState<Registry>();

  const networks = Object.keys(paymentConfig.networks).map((key) => ({
    label: paymentConfig.networks[key].chainName,
    value: key,
  }));

  const [networkOptions, setNetworkOptions] = useState(networks);
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

  const tokens = Object.keys(
    paymentConfig.networks[networks[0].value].tokens
  ).map((key) => ({
    label: paymentConfig.networks[networks[0].value].tokens[key].symbol,
    value: paymentConfig.networks[networks[0].value].tokens[key].address,
  }));

  const [tokenOptions, setTokenOptions] = useState(tokens);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  const [amount, setAmount] = useState<string>();

  useEffect(() => {
    (async () => {
      const registry = await fetch(
        `${process.env.API_HOST}/circle/slug/${circleSlug}/getRegistry`
      ).then((res) => res.json());
      console.log({ registry });
      setCircleRegistry(registry);
    })();
  }, []);

  useEffect(() => {
    const tokens = Object.keys(
      paymentConfig.networks[selectedNetwork.value].tokens
    ).map((key) => ({
      label: paymentConfig.networks[selectedNetwork.value].tokens[key].symbol,
      value: paymentConfig.networks[selectedNetwork.value].tokens[key].address,
    }));
    setTokenOptions(tokens);
    setSelectedToken(tokens[0]);
  }, [selectedNetwork]);

  // useEffect(() => {
  //   const token =
  //     paymentConfig.networks[selectedNetwork.value].tokens[tokens[0].value];
  //   console.log({ token });
  //   if (
  //     token.dollarAmount &&
  //     paymentConfig.type === "paywall" &&
  //     circleRegistry
  //   ) {
  //     if (token.address === "0x0") {
  //       const coinGeckoTokenId =
  //         circleRegistry[selectedNetwork.value].coinGeckoCurrencyId;
  //       getCurrencyPrice(coinGeckoTokenId).then((price) => {
  //         console.log({ price });
  //         setAmount((parseFloat(token.dollarAmount || "") / price).toString());
  //       });
  //     } else {
  //       getPlatformTokenPrice(
  //         token.address,
  //         circleRegistry[selectedNetwork.value].coinGeckoPlatformId
  //       ).then((price) => {
  //         console.log({ price });
  //         setAmount((parseFloat(token.dollarAmount || "") / price).toString());
  //       });
  //     }
  //   } else if (
  //     token.tokenAmount &&
  //     paymentConfig.type === "paywall" &&
  //     circleRegistry
  //   ) {
  //     setAmount(token.tokenAmount);
  //   }
  // }, [selectedNetwork]);

  useEffect(() => {
    const token =
      paymentConfig.networks[selectedNetwork.value].tokens[selectedToken.value];
    console.log({ token });
    if (
      token?.dollarAmount &&
      paymentConfig.type === "paywall" &&
      circleRegistry
    ) {
      console.log("here");
      if (token.address === "0x0") {
        const coinGeckoTokenId =
          circleRegistry[selectedNetwork.value].coinGeckoCurrencyId;
        getCurrencyPrice(coinGeckoTokenId).then((price) => {
          if (!price)
            return toast.error("Coingecko price not found for this token");
          setAmount(
            (parseFloat(token.dollarAmount || "") / price).toFixed(4).toString()
          );
        });
      } else {
        getPlatformTokenPrice(
          token.address,
          circleRegistry[selectedNetwork.value].coinGeckoPlatformId
        ).then((price) => {
          if (!price)
            return toast.error("Coingecko price not found for this token");
          setAmount(
            (parseFloat(token.dollarAmount || "") / price).toFixed(4).toString()
          );
        });
      }
    } else if (
      token?.tokenAmount &&
      paymentConfig.type === "paywall" &&
      circleRegistry
    ) {
      setAmount(token.tokenAmount);
    }
  }, [selectedToken, circleRegistry]);

  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const [loading, setLoading] = useState(false);
  const { batchPay } = usePaymentGateway();
  const { approve, isApproved, hasBalance } = useERC20();

  const checkNetwork = async () => {
    if (!(chain?.id.toString() == selectedNetwork.value)) {
      try {
        switchNetworkAsync &&
          (await switchNetworkAsync(parseInt(selectedNetwork.value)).catch(
            (err: any) => {
              console.log(err.message);
            }
          ));
      } catch (err: any) {
        console.log(err.message);
        toast.error(err.message);
      }
    }
  };

  const recordPayment = (txnHash: string) => {
    console.log({ txnHash });
    const paymentInfo = {
      chain: selectedNetwork,
      token: selectedToken,
      value: amount,
      paid: true,
      txnHash,
    };
    if (txnHash)
      setData({
        ...data,
        __payment__: paymentInfo,
      });
  };

  const approval = async () => {
    setLoading(true);
    console.log(selectedNetwork.value, circleRegistry);
    const approvalStatus = await toast
      .promise(
        isApproved(
          selectedToken.value,
          circleRegistry?.[selectedNetwork.value].distributorAddress as string,
          parseFloat(amount || "0"),
          paymentConfig.networks[selectedNetwork.value].receiverAddress,
          circleRegistry?.[selectedNetwork.value].provider || ""
        ),
        {
          pending: "Checking token approval",
          error: "Ouch ! Something went wrong",
        },
        {
          position: "top-center",
        }
      )
      .catch((err) => console.log(err));
    console.log({ approvalStatus });

    setLoading(false);
    return approvalStatus;
  };

  const currencyPayment = async () => {
    setLoading(true);
    const options = {
      chainId: selectedNetwork.value || "",
      paymentType: "currency",
      batchPayType: "form",
      userAddresses: [
        paymentConfig.networks[selectedNetwork.value].receiverAddress,
      ],
      amounts: [parseFloat(amount || "0")],
      tokenAddresses: [selectedToken.value],
      cardIds: [""],
      circleId: circleId,
      circleRegistry: circleRegistry,
    };
    console.log({ options });
    const currencyTxnHash = await toast
      .promise(
        batchPay(options),
        {
          pending: `Paying ${
            (circleRegistry &&
              circleRegistry[selectedNetwork.value]?.nativeCurrency) ||
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
  };

  const tokenPayment = async () => {
    setLoading(true);
    const options = {
      chainId: selectedNetwork.value || "",
      paymentType: "tokens",
      batchPayType: "form",
      userAddresses: [
        paymentConfig.networks[selectedNetwork.value].receiverAddress,
      ],
      amounts: [parseFloat(amount || "0")],
      tokenAddresses: [selectedToken.value],
      cardIds: [""],
      circleId: circleId,
      circleRegistry: circleRegistry,
    };
    setLoading(true);
    const tokenTxnHash = await toast
      .promise(
        batchPay(options),
        {
          pending: `Sending ${selectedToken.label}`,
          error: {
            render: ({ data }) => {
              return "Cannot proceed with the transaction, check if you have enough balance";
            },
          },
        },
        {
          position: "top-center",
        }
      )
      .catch((err) => console.log(err));
    recordPayment(tokenTxnHash);
    setLoading(false);
  };

  return (
    <Stack space="2">
      <Text variant="label">
        {paymentConfig.type === "paywall"
          ? "This form is paywalled. You need to pay the required amount before submitting the form"
          : "This form allows donation, you can donate any amount from any of the tokens"}
      </Text>
      {data["__payment__"] && (
        <a
          href={`${circleRegistry?.[selectedNetwork.value].blockExplorer}tx/${
            data["__payment__"].txnHash
          }`}
          target="_blank"
          rel="noreferrer"
        >
          <Text underline>View Transaction</Text>
        </a>
      )}
      {!data["__payment__"] && (
        <Stack>
          <Stack direction="horizontal" align="center">
            <Box width="1/3">
              <Dropdown
                options={networkOptions}
                selected={selectedNetwork}
                onChange={setSelectedNetwork}
                multiple={false}
                isClearable={false}
              />
            </Box>
            <Box width="1/3">
              <Dropdown
                options={tokenOptions}
                selected={selectedToken}
                onChange={setSelectedToken}
                multiple={false}
                isClearable={false}
              />
            </Box>
            <Stack>
              <Input
                width="full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={paymentConfig.type === "paywall"}
                units={selectedToken.label}
                placeholder="Add any amount of"
                label={
                  paymentConfig.networks[selectedNetwork.value].tokens[
                    selectedToken.value
                  ]?.dollarAmount && paymentConfig.type === "paywall"
                    ? `
                  ${
                    paymentConfig.networks[selectedNetwork.value].tokens[
                      selectedToken.value
                    ].dollarAmount
                  } USD converted to ${selectedToken.label}`
                    : "Token Amount"
                }
              />
              <Text variant="label"></Text>
            </Stack>
          </Stack>
          <Box width="1/3">
            <PrimaryButton
              loading={loading}
              icon={<DollarCircleOutlined />}
              variant="secondary"
              onClick={async () => {
                // Checks if you are on the right network
                await checkNetwork();
                // Paying via Native Currency
                if (
                  circleRegistry &&
                  selectedToken.label ==
                    circleRegistry[selectedNetwork.value]?.nativeCurrency
                ) {
                  await currencyPayment();
                }

                // Paying via ERC20 Token
                if (
                  circleRegistry &&
                  selectedToken.label !==
                    circleRegistry[selectedNetwork.value]?.nativeCurrency
                ) {
                  // Check if you have sufficient ERC20 Allowance
                  const approvalStatus = await approval();

                  // Approval for ERC20 token
                  setLoading(true);
                  if (!approvalStatus) {
                    await toast.promise(
                      approve(
                        selectedNetwork.value,
                        selectedToken.value,
                        circleRegistry
                      ).then((res: any) => {
                        if (res) {
                          const pay = async () => {
                            await tokenPayment();
                          };
                          pay();
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
                  } else {
                    await tokenPayment();
                  }

                  setLoading(false);
                }
              }}
            >
              Pay
            </PrimaryButton>
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
