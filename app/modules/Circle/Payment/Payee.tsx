import Avatar from "@/app/common/components/Avatar";
import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Option, PaymentDetails } from "@/app/types";
import { Box, IconTrash, Input, Stack, Text } from "degen";
import usePaymentViewCommon from "./Common/usePaymentCommon";
import { ethers } from "ethers";
import { useCircle } from "../CircleContext";
import { useEffect, useState } from "react";

type Props = {
  value: PaymentDetails;
  mode: "view" | "edit";
  setValue?: (values: PaymentDetails) => void;
  newCard?: boolean | string;
};

export default function Payee({ value, mode, setValue, newCard }: Props) {
  const { memberDetails } = usePaymentViewCommon();
  const memberOptions = Object.entries(memberDetails?.memberDetails || {}).map(
    ([id, member]) => {
      return {
        label: member.username,
        value: id,
      };
    }
  );
  const { circle, registry } = useCircle();
  const networkOptions = Object.entries(registry || {}).map(([id, network]) => {
    return {
      label: network.name,
      value: id,
    };
  });

  const tokenOptions =
    registry &&
    (Object.entries(registry[value.chain.value].tokenDetails).map(
      ([address, token]) => {
        return {
          label: token.symbol,
          value: address,
        };
      }
    ) as Option[]);
  const [addRewardFromCard, setAddRewardFromCard] = useState(false);

  useEffect(() => {
    console.log("newCard", newCard);
    console.log({ paidTo: value.paidTo });
    if (newCard && mode === "edit" && !value.paidTo?.length && setValue) {
      setValue({
        ...value,
        paidTo: [
          {
            propertyType: "user",
            value: {
              value: "",
              label: "",
            },
            reward: {
              value: 0,
              token: {
                value: "",
                label: "",
              },
              chain: value.chain,
            },
          },
        ],
      });
    }
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="full"
      gap="2"
      onClick={(e) => {}}
    >
      {mode === "edit" && (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
          gap="4"
        >
          <Text>Payment On</Text>
          <Dropdown
            options={networkOptions || []}
            selected={value.chain}
            onChange={(option) => {
              if (setValue && value.chain?.value !== option?.value) {
                setValue({
                  ...value,
                  chain: option,
                  paidTo: value.paidTo.map((p) => ({
                    ...p,
                    reward: {
                      chain: option,
                      token: {
                        value: "",
                        label: "",
                      },
                      value: 0,
                    },
                  })),
                });
              }
            }}
            multiple={false}
            isClearable={false}
          />
        </Box>
      )}
      {value.paidTo?.map &&
        value.paidTo?.map((p, index) => (
          <>
            <Box
              display="flex"
              flexDirection="row"
              width="full"
              gap="4"
              alignItems="center"
            >
              {mode === "edit" && (
                <Box
                  display="flex"
                  flexDirection="row"
                  cursor="pointer"
                  onClick={() => {
                    if (setValue)
                      setValue({
                        ...value,
                        paidTo: value.paidTo.filter((_, i) => i !== index),
                      });
                  }}
                >
                  <Text>
                    <IconTrash />
                  </Text>
                </Box>
              )}
              {p.propertyType === "user" && mode === "view" && (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  style={{
                    width: "80%",
                  }}
                >
                  <Stack direction="horizontal" align="center" space="2">
                    <Avatar
                      src={
                        memberDetails?.memberDetails[p.value?.value]?.avatar ||
                        ""
                      }
                      address={
                        memberDetails?.memberDetails[p.value?.value]?.ethAddress
                      }
                      label=""
                      size="8"
                      username={
                        memberDetails?.memberDetails[p.value?.value]
                          ?.username || ""
                      }
                      userId={p.value}
                    />
                    <Text color="white" weight="semiBold">
                      {memberDetails?.memberDetails[p.value?.value]?.username ||
                        ""}
                    </Text>
                  </Stack>
                </Box>
              )}
              {p.propertyType === "user" && mode === "edit" && (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  width="1/2"
                >
                  <Box width="full">
                    <Dropdown
                      multiple={false}
                      options={memberOptions}
                      selected={p.value}
                      onChange={(option) => {
                        if (setValue) {
                          const newPaidTo = value.paidTo[index];
                          newPaidTo.value = option;
                          newPaidTo.propertyType = "user";
                          newPaidTo.reward = newPaidTo.reward || {
                            value: 0,
                            token: value.token,
                            chain: value.chain,
                          };
                          setValue({
                            ...value,
                            paidTo: value.paidTo.map((p, i) =>
                              i === index ? newPaidTo : p
                            ),
                          });
                        }
                      }}
                      isClearable={false}
                      portal={true}
                    />
                  </Box>
                </Box>
              )}
              {p.propertyType === "ethAddress" && mode === "view" && (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  style={{
                    width: "80%",
                  }}
                >
                  {" "}
                  <Text variant="small">{p.value}</Text>
                </Box>
              )}
              {p.propertyType === "ethAddress" && mode === "edit" && (
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  width="1/2"
                >
                  <Input
                    label=""
                    placeholder={`Enter Eth Address`}
                    value={p?.value}
                    onChange={(e) => {
                      if (setValue) {
                        const newPaidTo = value.paidTo[index];
                        newPaidTo.value = e.target.value;
                        newPaidTo.propertyType = "ethAddress";
                        newPaidTo.reward = newPaidTo.reward || {
                          value: 0,
                          token: value.token,
                          chain: value.chain,
                        };
                        setValue({
                          ...value,
                          paidTo: value.paidTo.map((p, i) =>
                            i === index ? newPaidTo : p
                          ),
                        });
                      }
                    }}
                    error={
                      p?.value && !ethers.utils.isAddress(p?.value)
                        ? "Invalid address"
                        : undefined
                    }
                  />
                </Box>
              )}
              {mode === "view" && (
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                >
                  <Text variant="small">
                    {p.reward?.value
                      ? `${p.reward.value} ${p.reward.token?.label || ""}`
                      : "None"}
                  </Text>
                </Box>
              )}

              {mode === "edit" && (
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                  gap="2"
                >
                  {" "}
                  <Box width="1/2">
                    <Input
                      label=""
                      placeholder={`Enter Reward Amount`}
                      value={p.reward?.value}
                      onChange={(e) => {
                        if (setValue) {
                          const newPaidTo = value.paidTo[index];
                          newPaidTo.reward = {
                            ...newPaidTo.reward,
                            value: parseFloat(e.target.value),
                          };
                          setValue({
                            ...value,
                            paidTo: value.paidTo.map((p, i) =>
                              i === index ? newPaidTo : p
                            ),
                            value: value.paidTo.reduce(
                              (acc, p) => acc + p.reward.value,
                              0
                            ),
                          });
                        }
                      }}
                      type="number"
                    />
                  </Box>
                  <Box width="1/2">
                    <Dropdown
                      options={tokenOptions || []}
                      selected={value.paidTo[index].reward?.token}
                      onChange={(option) => {
                        if (setValue) {
                          const newPaidTo = value.paidTo[index];
                          newPaidTo.reward = {
                            ...newPaidTo.reward,
                            token: option,
                          };
                          setValue({
                            ...value,
                            paidTo: value.paidTo.map((p, i) =>
                              i === index ? newPaidTo : p
                            ),
                          });
                        }
                      }}
                      multiple={false}
                      isClearable={false}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </>
        ))}
      {mode === "edit" && (
        <Box display="flex" flexDirection="row" marginTop="8" gap="2">
          {" "}
          <PrimaryButton
            variant="tertiary"
            onClick={() => {
              if (setValue)
                setValue({
                  ...value,
                  paidTo: [
                    ...value.paidTo,
                    {
                      propertyType: "ethAddress",
                      value: "",
                      reward: {
                        chain: value.chain,
                        token: value.token,
                        value: 0,
                      },
                    },
                  ],
                });
            }}
          >
            Add Eth Address
          </PrimaryButton>
          <PrimaryButton
            variant="tertiary"
            onClick={() => {
              if (setValue)
                setValue({
                  ...value,
                  paidTo: [
                    ...(value.paidTo || []),
                    {
                      propertyType: "user",
                      value: "",
                      reward: {
                        chain: value.chain,
                        token: value.token,
                        value: 0,
                      },
                    },
                  ],
                });
            }}
          >
            Add User
          </PrimaryButton>
          <PrimaryButton
            variant="transparent"
            onClick={() => {
              setAddRewardFromCard(true);
            }}
          >
            Add Reward From Card
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );
}
