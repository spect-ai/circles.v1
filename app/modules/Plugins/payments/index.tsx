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
import Chain from "./Chain";
type Props = {
  handleClose: () => void;
};

export default function Payments({ handleClose }: Props) {
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
  const [addedNetworks, setAddedNetworks] = useState([networks[0]]);

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

  const [required, setRequired] = useState({
    label: "Yes",
    value: "yes",
  });

  const [receiverAddresses, setReceiverAddresses] = useState({
    [addedNetworks[0].value]: "",
  });

  const [tokenAmounts, setTokenAmounts] = useState<{
    [key: string]: { [key: string]: string };
  }>({});

  const [dollarAmounts, setDollarAmounts] = useState<{
    [key: string]: { [key: string]: string };
  }>({});

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
      const tokens: {
        [key: string]: { label: string; value: string }[];
      } = Object.keys(paymentConfig.networks).reduce((acc, key) => {
        const tokensList = Object.keys(
          paymentConfig.networks[key].tokens || {}
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
      console.log({ tokens });
      setAddedTokens(tokens);
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
    if (!collection.formMetadata.paymentConfig) {
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
    }
  }, [registry]);

  const validate = () => {
    const errMessages: string[] = [];
    if (paymentType.value === "paywall") {
      // check receiver address
      for (const network of addedNetworks) {
        if (!receiverAddresses[network.value] && network.value) {
          errMessages.push(`Receiver address is required for ${network.label}`);
        }
      }
      // check token amounts
      for (const network of addedNetworks) {
        if (!network.value) {
          continue;
        }
        for (const token of addedTokens[network.value]) {
          if (token.value === "") {
            continue;
          }
          if (
            !(
              tokenAmounts[network.value] &&
              tokenAmounts[network.value][token.value]
            ) &&
            !(
              dollarAmounts[network.value] &&
              dollarAmounts[network.value][token.value]
            )
          ) {
            console.log("here");
            errMessages.push(
              `Amount is required for ${token.label} on ${network.label}`
            );
          }
          // check if not both token amount and dollar amount are set
          if (
            tokenAmounts[network.value] &&
            tokenAmounts[network.value][token.value] &&
            dollarAmounts[network.value] &&
            dollarAmounts[network.value][token.value]
          ) {
            errMessages.push(
              `Token amount and dollar amount cannot be set for ${token.label} on ${network.label}. Please set only one of them.`
            );
          }
        }
      }

      if (addedNetworks.length === 0) {
        errMessages.push("At least one network is required");
      }
    } else if (paymentType.value === "donation") {
      // check receiver address
      for (const network of addedNetworks) {
        if (!receiverAddresses[network.value] && network.value) {
          errMessages.push(`Receiver address is required for ${network.label}`);
        }

        if (addedNetworks.length === 0) {
          errMessages.push("At least one network is required");
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
            chainId={"1"}
            chainName={"Ethereum"}
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
              <Text variant="label">
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
              <Text variant="label">
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
            <Text variant="label">
              Add the networks and tokens you want to accept payments in
            </Text>
            {registry &&
              addedNetworks.map((network, index) => (
                <Chain
                  paymentType={paymentType.value}
                  key={network.value}
                  registry={registry}
                  network={network}
                  networkOptions={networks}
                  addedTokens={addedTokens[network.value]}
                  tokenAmounts={tokenAmounts[network.value]}
                  dollarAmounts={dollarAmounts[network.value]}
                  receiverAddress={receiverAddresses[network.value]}
                  onNetworkDelete={() => {
                    if (addedNetworks.length === 1) {
                      toast.error("At least one network is required");
                      return;
                    }
                    // delete network at the index
                    const newNetworks = addedNetworks.filter(
                      (n, idx) => idx !== index
                    );
                    setAddedNetworks(newNetworks);
                  }}
                  onNetworkChange={(updatedNetwork) => {
                    // check if network already exists
                    const existingNetwork = addedNetworks.find(
                      (n, idx) =>
                        idx !== index && n.value === updatedNetwork.value
                    );
                    if (existingNetwork) {
                      toast.error(
                        `Network ${updatedNetwork.label} already exists`
                      );
                      return;
                    }

                    const newNetworks = addedNetworks.map((n, idx) => {
                      if (idx === index) {
                        return updatedNetwork;
                      }
                      return n;
                    });
                    setAddedNetworks(newNetworks);
                    if (!addedTokens[updatedNetwork.value]) {
                      setAddedTokens({
                        ...addedTokens,
                        [updatedNetwork.value]:
                          initTokens[updatedNetwork.value],
                      });
                    }
                    console.log({ newNetworks });
                  }}
                  onAddToken={() => {
                    if (!addedTokens[network.value]) {
                      toast.error("Please select a network first");
                      return;
                    }
                    setAddedTokens({
                      ...addedTokens,
                      [network.value]: [
                        ...addedTokens[network.value],
                        { label: "", value: "" },
                      ],
                    });
                  }}
                  onUpdateToken={(token, index) => {
                    console.log({ token, index });
                    if (token.value === "custom") {
                      setIsAddTokenOpen(true);
                      return;
                    }

                    // check if token already exists
                    const existingToken = addedTokens[network.value].find(
                      (t, idx) => idx !== index && t.value === token.value
                    );
                    if (existingToken) {
                      toast.error(
                        `Token ${token.label} already exists for ${network.label}`
                      );
                      return;
                    }
                    const newTokens = addedTokens[network.value].map(
                      (t, idx) => {
                        if (idx === index) {
                          return token;
                        }
                        return t;
                      }
                    );
                    console.log({ newTokens });
                    setAddedTokens({
                      ...addedTokens,
                      [network.value]: newTokens,
                    });
                  }}
                  onRemoveToken={(token, index) => {
                    if (addedTokens[network.value].length === 1) {
                      toast.error("At least one token is required");
                      return;
                    }
                    const newTokens = addedTokens[network.value].filter(
                      (t, idx) => idx !== index
                    );
                    setAddedTokens({
                      ...addedTokens,
                      [network.value]: newTokens,
                    });
                  }}
                  onTokenAmountChange={(token, amount) => {
                    setTokenAmounts({
                      ...tokenAmounts,
                      [network.value]: {
                        ...tokenAmounts[network.value],
                        [token.value]: amount,
                      },
                    });
                  }}
                  onDollarAmountChange={(token, amount) => {
                    setDollarAmounts({
                      ...dollarAmounts,
                      [network.value]: {
                        ...dollarAmounts[network.value],
                        [token.value]: amount,
                      },
                    });
                  }}
                  onUpdateReceiverAddress={(address) => {
                    setReceiverAddresses({
                      ...receiverAddresses,
                      [network.value]: address,
                    });
                  }}
                />
              ))}
            <Box width="1/3" paddingRight="6">
              <PrimaryButton
                onClick={() => {
                  setAddedNetworks([
                    ...addedNetworks,
                    { label: "", value: "" },
                  ]);
                }}
                variant="tertiary"
                icon={<IconPlusSmall size="4" />}
              >
                Add Chain
              </PrimaryButton>
            </Box>
          </Stack>
          <Stack direction="horizontal">
            <Box width={"1/2"}>
              <PrimaryButton
                loading={updateLoading}
                onClick={async () => {
                  if (!validate()) return;
                  const payload = {
                    required: required.value === "yes",
                    type: paymentType.value,
                    networks: addedNetworks.reduce((acc, network) => {
                      if (network.value) {
                        return {
                          ...acc,
                          [network.value]: {
                            chainId: network.value,
                            chainName: network.label,
                            receiverAddress: receiverAddresses[network.value],
                            tokens: addedTokens[network.value].reduce(
                              (acc, token) => {
                                if (token.value) {
                                  return {
                                    ...acc,
                                    [token.value]: {
                                      address: token.value,
                                      symbol: token.label,
                                      tokenAmount:
                                        tokenAmounts[network.value] &&
                                        tokenAmounts[network.value][token.value]
                                          ? tokenAmounts[network.value][
                                              token.value
                                            ]
                                          : "",
                                      dollarAmount:
                                        dollarAmounts[network.value] &&
                                        dollarAmounts[network.value][
                                          token.value
                                        ]
                                          ? dollarAmounts[network.value][
                                              token.value
                                            ]
                                          : "",
                                    },
                                  };
                                }
                                return acc;
                              },
                              {}
                            ),
                          },
                        };
                      }
                      return acc;
                    }, {}),
                  };
                  console.log({ payload });
                  setUpdateLoading(true);
                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      paymentConfig: payload,
                      walletConnectionRequired: true,
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
