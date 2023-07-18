import { logError } from "@/app/common/utils/utils";
import {
  getCurrencyPrice,
  getPlatformTokenPrice,
} from "@/app/services/CoinGecko";
import {
  approveOneTokenUsingEOA,
  convertToWei,
  distributeCurrencyUsingEOA,
  distributeTokensUsingEOA,
  hasAllowance,
} from "@/app/services/Paymentv2/utils";
import { PaymentConfig, Registry } from "@/app/types";
import { DollarCircleOutlined } from "@ant-design/icons";
import { Box, IconEth, IconEtherscan, Stack } from "degen";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Connect } from "../../Sidebar/ProfileButton/ConnectButton";
import { Button, InputField, SelectField, Text } from "@avp1598/vibes";

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
  const { address } = useAccount();

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

  useEffect(() => {
    const token =
      paymentConfig.networks[selectedNetwork.value].tokens[selectedToken.value];
    if (
      token?.dollarAmount &&
      paymentConfig.type === "paywall" &&
      circleRegistry
    ) {
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
  // const { batchPay } = usePaymentGateway();

  const checkNetwork = async () => {
    if (!(chain?.id.toString() == selectedNetwork.value)) {
      try {
        switchNetworkAsync &&
          (await switchNetworkAsync(parseInt(selectedNetwork.value)));
      } catch (err: any) {
        console.log(err.message);
        logError(err.message);
        throw err;
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
    console.log({ chain: selectedNetwork.value, token: selectedToken });
    const approvalStatus: any = await toast
      .promise(
        hasAllowance(
          circleRegistry as Registry,
          selectedNetwork.value,
          address as string,
          {
            [selectedToken.value]: parseFloat(amount || "0"),
          }
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
    return approvalStatus[selectedToken.value];
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
    const currencyTxnHash = await toast
      .promise(
        distributeCurrencyUsingEOA(
          options.chainId,
          [
            {
              ethAddress: options.userAddresses[0],
              valueInWei: ethers.utils.parseUnits(
                options.amounts[0].toString(),
                "ether"
              ),
              token: options.tokenAddresses[0],
            },
          ],
          circleRegistry as Registry,
          ""
        ),
        {
          pending: `Paying ${
            (circleRegistry &&
              circleRegistry[selectedNetwork.value]?.nativeCurrency) ||
            "Network Gas Token"
          }`,
          error: {
            render: ({ data }: { data?: any }) =>
              data.message || data.toString(),
          },
        },
        {
          position: "top-center",
        }
      )
      .catch((err) => console.log(err));

    recordPayment(currencyTxnHash?.transactionHash);
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
    const payload = await convertToWei([
      {
        ethAddress: options.userAddresses[0],
        token: options.tokenAddresses[0],
        amount: options.amounts[0],
      },
    ]);
    const tokenTxnHash = await toast
      .promise(
        distributeTokensUsingEOA(
          options.chainId,
          payload,
          circleRegistry as Registry,
          ""
        ),
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
    recordPayment(tokenTxnHash?.transactionHash);
    setLoading(false);
  };

  return (
    <Stack space="2">
      <Text type="label" color="tertiary">
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
          <Text color="secondary">View Transaction</Text>
        </a>
      )}
      {!data["__payment__"] && (
        <Stack space="0">
          <Stack
            direction={{
              xs: "vertical",
              md: "horizontal",
            }}
            align="flex-start"
          >
            <Box
              width={{
                xs: "full",
                md: "1/3",
              }}
            >
              <Stack space="0">
                <Text type="label">Chain</Text>
                <SelectField
                  name="payment-chain"
                  value={selectedNetwork}
                  options={networkOptions}
                  onChange={setSelectedNetwork}
                  isMulti={false}
                />
              </Stack>
            </Box>
            <Box
              width={{
                xs: "full",
                md: "1/3",
              }}
            >
              <Stack space="0">
                <Text type="label">Token</Text>
                <SelectField
                  name="payment-token"
                  value={selectedToken}
                  options={tokenOptions}
                  onChange={setSelectedToken}
                  isMulti={false}
                />
              </Stack>
            </Box>
            <Stack space="0">
              <Text type="label">
                {paymentConfig.networks[selectedNetwork.value].tokens[
                  selectedToken.value
                ]?.dollarAmount && paymentConfig.type === "paywall"
                  ? `
                  ${
                    paymentConfig.networks[selectedNetwork.value].tokens[
                      selectedToken.value
                    ].dollarAmount
                  } USD converted to ${selectedToken.label}`
                  : "Amount"}
              </Text>
              <InputField
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={paymentConfig.type === "paywall"}
                placeholder="Add any amount of"
              />
            </Stack>
          </Stack>
          <Box width="1/3">
            {address ? (
              <Button
                loading={loading}
                icon={<IconEth size="4" />}
                variant="secondary"
                onClick={async () => {
                  try {
                    // Checks if you are on the right network
                    await checkNetwork();
                  } catch (err) {
                    console.log(err);
                    return;
                  }
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
                        approveOneTokenUsingEOA(
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
                            render: ({ data }: { data?: any }) =>
                              JSON.stringify(data),
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
                {paymentConfig.type === "paywall" ? "Pay" : "Donate"}
              </Button>
            ) : (
              <Connect
                text={`
                Connect Wallet to ${
                  paymentConfig.type === "paywall" ? "Pay" : "Donate"
                }
              `}
              />
            )}
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
