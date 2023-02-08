import Modal from "@/app/common/components/Modal";
import Popover from "@/app/common/components/Popover";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Select from "@/app/common/components/Select";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, IconPlusSmall, Input, Stack, Tag, Text } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";
import AddToken from "../../Circle/CircleSettingsModal/CirclePayment/AddToken";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
type Props = {
  handleClose: () => void;
};

export default function Payments({ handleClose }: Props) {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAddChainOpen, setIsAddChainOpen] = useState(false);

  const [isAddTokenOpen, setIsAddTokenOpen] = useState(false);

  const [paymentType, setPaymentType] = useState<{
    label: string;
    value: "donation" | "paywall";
  }>({
    label: "Paywall",
    value: "paywall",
  });

  const { registry } = useCircle();

  const networks = Object.keys(registry || {}).map((key) => {
    return {
      label: (registry && registry[key].name) || "",
      value: key,
    };
  });
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [addedNetworks, setAddedNetworks] = useState(networks);

  const { localCollection: collection, updateCollection } =
    useLocalCollection();

  const initTokens: {
    [key: string]: { label: string; value: string }[];
  } = Object.keys(registry || {}).reduce((acc, key) => {
    const tokensList = Object.keys(
      (registry && registry[key].tokenDetails) || {}
    ).map((tokenKey) => {
      return {
        label: (registry && registry[key].tokenDetails[tokenKey].symbol) || "",
        value: tokenKey,
      };
    });
    return {
      ...acc,
      [key]: tokensList,
    };
  }, {});

  const [addedTokens, setAddedTokens] = useState(initTokens);
  const [selectedToken, setSelectedToken] = useState(
    initTokens[selectedNetwork.value][0]
  );

  const [required, setRequired] = useState({
    label: "Yes",
    value: "yes",
  });

  const [receiverAddresses, setReceiverAddresses] = useState({
    [selectedNetwork.value]: "",
  });

  const [tokenAmounts, setTokenAmounts] = useState({
    [selectedNetwork.value]: {
      [selectedToken.value]: "",
    },
  });

  const [dollarAmounts, setDollarAmounts] = useState({
    [selectedNetwork.value]: {
      [selectedToken.value]: "",
    },
  });

  useEffect(() => {
    if (collection.formMetadata.paymentConfig) {
      const paymentConfig = collection.formMetadata.paymentConfig;
      setPaymentType({
        label: paymentConfig.type === "donation" ? "Donation" : "Paywall",
        value: paymentConfig.type,
      });
      setRequired({
        label: paymentConfig.required ? "Yes" : "No",
        value: paymentConfig.required ? "yes" : "no",
      });
      const networks = Object.keys(paymentConfig.networks).map((key) => {
        return {
          label: (registry && registry[key].name) || "",
          value: key,
        };
      });
      setAddedNetworks(networks);
      setSelectedNetwork(networks[0]);
      const tokens: {
        [key: string]: { label: string; value: string }[];
      } = Object.keys(paymentConfig.networks).reduce((acc, key) => {
        const tokensList = Object.keys(
          (registry && registry[key].tokenDetails) || {}
        ).map((tokenKey) => {
          return {
            label:
              (registry && registry[key].tokenDetails[tokenKey].symbol) || "",
            value: tokenKey,
          };
        });
        return {
          ...acc,
          [key]: tokensList,
        };
      }, {});
      setAddedTokens(tokens);
      setSelectedToken(tokens[networks[0].value][0]);
      const receiverAddresses = Object.keys(paymentConfig.networks).reduce(
        (acc, key) => {
          return {
            ...acc,
            [key]: paymentConfig.networks[key].receiverAddress,
          };
        },
        {}
      );
      setReceiverAddresses(receiverAddresses);

      const tokenAmounts = Object.keys(paymentConfig.networks).reduce(
        (acc, key) => {
          const amounts = Object.keys(paymentConfig.networks[key].tokens).map(
            (tokenKey) => {
              return {
                [tokenKey]:
                  paymentConfig.networks[key].tokens[tokenKey].tokenAmount,
              };
            }
          );
          return {
            ...acc,
            [key]: Object.assign({}, ...amounts),
          };
        },
        {}
      );
      console.log({ tokenAmounts });
      setTokenAmounts(tokenAmounts);
      const dollarAmounts = Object.keys(paymentConfig.networks).reduce(
        (acc, key) => {
          const amounts = Object.keys(paymentConfig.networks[key].tokens).map(
            (tokenKey) => {
              return {
                [tokenKey]:
                  paymentConfig.networks[key].tokens[tokenKey].dollarAmount,
              };
            }
          );
          return {
            ...acc,
            [key]: Object.assign({}, ...amounts),
          };
        },
        {}
      );
      setDollarAmounts(dollarAmounts);
    }
  }, []);

  useEffect(() => {
    setSelectedToken(addedTokens[selectedNetwork.value][0]);
  }, [selectedNetwork.value]);

  useEffect(() => {
    // update token options when registry changes
    const newTokens: {
      [key: string]: { label: string; value: string }[];
    } = Object.keys(registry || {}).reduce((acc, key) => {
      const tokensList = Object.keys(
        (registry && registry[key].tokenDetails) || {}
      ).map((tokenKey) => {
        return {
          label:
            (registry && registry[key].tokenDetails[tokenKey].symbol) || "",
          value: tokenKey,
        };
      });
      return {
        ...acc,
        [key]: tokensList,
      };
    }, {});
    setAddedTokens(newTokens);
  }, [registry]);

  const validate = () => {
    const errMessages: string[] = [];
    if (paymentType.value === "paywall") {
      // check receiver address
      for (const network of addedNetworks) {
        if (!receiverAddresses[network.value]) {
          errMessages.push(`Receiver address is required for ${network.label}`);
        }
      }
      // check token amounts
      for (const network of addedNetworks) {
        for (const token of addedTokens[network.value]) {
          try {
            if (
              !tokenAmounts[network.value][token.value] &&
              !dollarAmounts[network.value][token.value]
            ) {
              errMessages.push(
                `Token amount or dollar amount is required for ${token.label} on ${network.label}`
              );
            }
          } catch (e) {
            console.log(e);
            errMessages.push(
              `Token amount or dollar amount is required for ${token.label} on ${network.label}`
            );
          }
          // check if not both token amount and dollar amount are set
          try {
            if (
              tokenAmounts[network.value][token.value] &&
              dollarAmounts[network.value][token.value]
            ) {
              errMessages.push(
                `Token amount and dollar amount cannot be set for ${token.label} on ${network.label}. Please set only one of them.`
              );
            }
          } catch (e) {
            errMessages.push(
              `Token amount and dollar amount cannot be set for ${token.label} on ${network.label}. Please set only one of them.`
            );
          }
        }
      }

      if (addedNetworks.length === 0) {
        errMessages.push("At least one network is required");
      }

      if (addedTokens[selectedNetwork.value].length === 0) {
        errMessages.push("At least one token is required");
      }
    } else if (paymentType.value === "donation") {
      // check receiver address
      for (const network of addedNetworks) {
        if (!receiverAddresses[network.value]) {
          errMessages.push(`Receiver address is required for ${network.label}`);
        }

        if (addedNetworks.length === 0) {
          errMessages.push("At least one network is required");
        }

        if (addedTokens[selectedNetwork.value].length === 0) {
          errMessages.push("At least one token is required");
        }

        if (required.value === "yes") {
          errMessages.push(
            "Donation cannot be required, please change to paywall"
          );
        }
      }
    }

    if (errMessages.length > 0) {
      errMessages.forEach((err) => {
        toast.error(err);
      });
      return false;
    }
    return true;
  };

  return (
    <Modal handleClose={handleClose} title="Payments">
      <AnimatePresence>
        {isAddTokenOpen && (
          <AddToken
            chainId={selectedNetwork.value}
            chainName={selectedNetwork.label}
            handleClose={() => {
              setIsAddTokenOpen(false);
            }}
          />
        )}
      </AnimatePresence>
      <Box padding="8">
        <Stack>
          <Stack>
            <Stack space="1">
              <Text variant="label">Payment Type</Text>
              <Text size="extraSmall">
                Paywall: User must pay the amount specified. Donation: User can
                pay any amount
              </Text>
            </Stack>
            <Select
              options={[
                { label: "Paywall", value: "paywall" },
                { label: "Donation", value: "donation" },
              ]}
              value={paymentType}
              onChange={setPaymentType as any}
              variant="secondary"
            />
          </Stack>
          <Stack>
            <Stack space="1">
              <Text variant="label">Required</Text>
              <Text size="extraSmall">
                Is this payment required to submit the form?
              </Text>
            </Stack>
            <Select
              options={[
                { label: "Yes", value: "yes" },
                { label: "No", value: "no" },
              ]}
              value={required}
              onChange={setRequired}
              variant="secondary"
            />
          </Stack>
          <Stack>
            <Stack space="1">
              <Text variant="label">Chain</Text>
              <Text size="extraSmall">
                Configure the chains you want to receive payments on
              </Text>
            </Stack>
            <Stack direction="horizontal" space="4">
              <Select
                options={addedNetworks}
                value={selectedNetwork}
                onChange={setSelectedNetwork}
                variant="secondary"
                canDelete
                onDelete={(value) => {
                  console.log({ value });
                  const newNetworks = addedNetworks.filter(
                    (network) => network.value !== value.value
                  );
                  if (newNetworks.length === 0) {
                    toast.error("You must have at least one network");
                    return;
                  }
                  setAddedNetworks(newNetworks);
                  setSelectedNetwork(newNetworks[0]);
                  setSelectedToken(addedTokens[newNetworks[0].value][0]);
                }}
              />
              <Popover
                isOpen={isAddChainOpen}
                setIsOpen={setIsAddChainOpen}
                butttonComponent={
                  <Box
                    cursor="pointer"
                    onClick={() => {
                      setIsAddChainOpen(true);
                    }}
                  >
                    <Tag>
                      <IconPlusSmall size="5" color="accent" />
                    </Tag>
                  </Box>
                }
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto", transition: { duration: 0.2 } }}
                  exit={{ height: 0 }}
                  style={{
                    overflow: "hidden",
                    borderRadius: "0.25rem",
                  }}
                >
                  <Box
                    backgroundColor="background"
                    borderWidth="0.375"
                    borderRadius="2xLarge"
                    height="64"
                    overflow="auto"
                  >
                    {networks.map((network) => (
                      <Box
                        key={network.value}
                        padding="4"
                        borderBottomWidth="0.375"
                        cursor="pointer"
                        onClick={() => {
                          if (
                            addedNetworks.find(
                              (addedNetwork) =>
                                addedNetwork.value === network.value
                            )
                          ) {
                            toast.error("Network already added");
                            return;
                          }
                          setAddedNetworks([...addedNetworks, network]);
                          setSelectedNetwork(network);
                          setSelectedToken(addedTokens[network.value][0]);
                          setIsAddChainOpen(false);
                        }}
                      >
                        <Text>{network.label}</Text>
                      </Box>
                    ))}
                  </Box>
                </motion.div>
              </Popover>
            </Stack>
          </Stack>
          <Stack>
            <Stack space="1">
              <Text variant="label">Receiver Address</Text>
              <Text size="extraSmall">
                {selectedNetwork.label} address which will receive the payments
              </Text>
            </Stack>
            <Input
              width="1/2"
              label=""
              placeholder="0x"
              value={receiverAddresses[selectedNetwork.value] || ""}
              onChange={(e) => {
                setReceiverAddresses({
                  ...receiverAddresses,
                  [selectedNetwork.value]: e.target.value,
                });
              }}
            />
          </Stack>
          <Stack>
            <Stack space="1">
              <Text variant="label">Tokens</Text>
              <Text size="extraSmall">
                Configure the tokens you want to receive payments in
              </Text>
            </Stack>
            <Stack direction="horizontal">
              <Select
                options={addedTokens[selectedNetwork.value]}
                value={selectedToken}
                onChange={setSelectedToken}
                variant="secondary"
                canDelete
                onDelete={(value) => {
                  console.log({ value });
                  const ch = {
                    ...addedTokens,
                    [selectedNetwork.value]: addedTokens[
                      selectedNetwork.value
                    ].filter((token) => token.value !== value.value),
                  };
                  console.log({ ch });
                  setAddedTokens({
                    ...addedTokens,
                    [selectedNetwork.value]: addedTokens[
                      selectedNetwork.value
                    ].filter((token) => token.value !== value.value),
                  });
                }}
              />
              <Box
                cursor="pointer"
                onClick={() => {
                  setIsAddTokenOpen(true);
                }}
              >
                <Tag>
                  <IconPlusSmall size="5" color="accent" />
                </Tag>
              </Box>
            </Stack>
          </Stack>
          <AnimatePresence>
            {paymentType.value === "paywall" && (
              <motion.div
                initial={{
                  height: 0,
                }}
                animate={{
                  height: "auto",
                }}
                exit={{
                  height: 0,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeInOut",
                }}
                style={{
                  overflow: "hidden",
                }}
              >
                <Stack>
                  <Stack space="1">
                    <Text variant="label">Amount</Text>
                    <Text size="extraSmall">
                      Amount of {selectedToken.label} to receive. You can set
                      token amount or dollar amount pegged to the current price
                      of the token
                    </Text>
                  </Stack>
                  <Stack direction="horizontal" align="center">
                    <Input
                      type="number"
                      label=""
                      placeholder="0"
                      value={
                        tokenAmounts[selectedNetwork.value] &&
                        tokenAmounts[selectedNetwork.value][selectedToken.value]
                          ? tokenAmounts[selectedNetwork.value][
                              selectedToken.value
                            ]
                          : ""
                      }
                      onChange={(e) => {
                        setTokenAmounts({
                          ...tokenAmounts,
                          [selectedNetwork.value]: {
                            ...tokenAmounts[selectedNetwork.value],
                            [selectedToken.value]: e.target.value,
                          },
                        });
                      }}
                      units={selectedToken.label}
                    />
                    <Text variant="label">OR</Text>
                    <Input
                      type="number"
                      label=""
                      placeholder="0"
                      value={
                        dollarAmounts[selectedNetwork.value] &&
                        dollarAmounts[selectedNetwork.value][
                          selectedToken.value
                        ]
                          ? dollarAmounts[selectedNetwork.value][
                              selectedToken.value
                            ]
                          : ""
                      }
                      onChange={(e) => {
                        setDollarAmounts({
                          ...dollarAmounts,
                          [selectedNetwork.value]: {
                            ...dollarAmounts[selectedNetwork.value],
                            [selectedToken.value]: e.target.value,
                          },
                        });
                      }}
                      units="$"
                    />
                  </Stack>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
          <Stack direction="horizontal">
            <Box width={"1/2"}>
              <PrimaryButton
                loading={updateLoading}
                onClick={async () => {
                  if (!validate()) return;
                  console.log({ addedTokens });
                  const payload = {
                    required: required.value === "yes",
                    type: paymentType.value,
                    networks: addedNetworks.reduce(
                      (acc, network) => ({
                        ...acc,
                        [network.value]: {
                          chainId: network.value,
                          chainName: network.label,
                          receiverAddress: receiverAddresses[network.value],
                          tokens: addedTokens[network.value].reduce(
                            (acc, token) => ({
                              ...acc,
                              [token.value]: {
                                address: token.value,
                                symbol: token.label,
                                tokenAmount:
                                  tokenAmounts[network.value] &&
                                  tokenAmounts[network.value][token.value]
                                    ? tokenAmounts[network.value][token.value]
                                    : "",
                                dollarAmount:
                                  dollarAmounts[network.value] &&
                                  dollarAmounts[network.value][token.value]
                                    ? dollarAmounts[network.value][token.value]
                                    : "",
                              },
                            }),
                            {}
                          ),
                        },
                      }),
                      {}
                    ),
                  };
                  console.log({ payload });
                  setUpdateLoading(true);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      paymentConfig: payload,
                    },
                  });
                  console.log({ res });
                  setUpdateLoading(false);
                  updateCollection(res);
                  handleClose();
                }}
              >
                {collection.formMetadata.paymentConfig ? "Update" : "Add"}{" "}
                Payment
              </PrimaryButton>
            </Box>
            <Box width={"1/2"}>
              <PrimaryButton
                tone="red"
                loading={deleteLoading}
                onClick={async () => {
                  console.log({ addedTokens });
                  setDeleteLoading(true);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      paymentConfig: undefined,
                    },
                  });
                  console.log({ res });
                  setDeleteLoading(false);
                  updateCollection(res);
                  handleClose();
                }}
              >
                Disable Payment
              </PrimaryButton>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
