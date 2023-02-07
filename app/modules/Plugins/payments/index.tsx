import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Select from "@/app/common/components/Select";
import { updateFormCollection } from "@/app/services/Collection";
import { PaymentConfig } from "@/app/types";
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
  const [loading, setLoading] = useState(false);

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
          <Box width={"1/2"}>
            <PrimaryButton
              loading={loading}
              onClick={async () => {
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
                setLoading(true);
                const res = await updateFormCollection(collection.id, {
                  formMetadata: {
                    ...collection.formMetadata,
                    paymentConfig: payload,
                  },
                });
                console.log({ res });
                setLoading(false);
                updateCollection(res);
                handleClose();
              }}
            >
              Enable Payment
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
