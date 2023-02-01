/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from "@/app/common/components/Drawer";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { smartTrim } from "@/app/common/utils/utils";
import {
  addManualPayment,
  cancelPayments,
  updatePayment,
} from "@/app/services/Paymentv2";
import { CollectionType, Option } from "@/app/types";
import { Box, Button, IconChevronRight, Stack, Text, useTheme } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Save } from "react-feather";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../CircleContext";
import usePaymentViewCommon from "./Common/usePaymentCommon";
import Payee from "./Payee";
import PaymentDropdown from "./PaymentDropdown";

type Props = {
  handleClose: () => void;
  paymentId?: string;
};

export default function PaymentCardDrawer({ handleClose }: Props) {
  const { mode } = useTheme();
  const { circle, fetchCircle, setCircleData, registry } = useCircle();
  const { push, pathname, query } = useRouter();

  const [isDirty, setIsDirty] = useState(false);
  const [cancelPaymentConfirmModal, setCancelPaymentConfirmModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [isGnosisPayLoading, setIsGnosisPayLoading] = useState(false);
  const [openPayeeModal, setOpenPayeeModal] = useState(false);
  const [confirmRewardUpdate, setConfirmRewardUpdate] = useState(false);
  const { newCard, value, setValue, pay } = usePaymentViewCommon();
  const [cardOptions, setCardOptions] = useState([] as Option[]);
  const projectOptions = Object.values(circle.collections)
    ?.filter(
      (collection) => collection.collectionType === 1 && !collection.archived
    )
    .map((collection) => ({
      label: collection.name,
      value: collection.slug,
    }));

  const { refetch: fetchCollection } = useQuery<CollectionType>(
    ["collection", value.collection?.value],
    () =>
      fetch(
        `${process.env.API_HOST}/collection/v1/slug/${
          value.collection?.value as string
        }`,
        {
          credentials: "include",
        }
      ).then((res) => {
        if (res.status === 403) return { unauthorized: true };
        return res.json();
      }),
    {
      enabled: false,
    }
  );

  const updateRewardFromCard = async (val?: Option) => {
    const payeeType = val?.data?.payeeType || value.data?.data?.payeeType;
    const payee = val?.data?.payee || value.data?.data?.payee;
    const reward = val?.data?.reward || value.data?.data?.reward;
    if (!payeeType || !payee || !reward) return;
    const paidTo = [];
    if (payeeType === "user[]") {
      for (const user of payee) {
        paidTo.push({
          propertyType: "user",
          value: user,
          reward:
            paidTo.length === 0
              ? {
                  chain: reward.chain,
                  token: reward.token,
                  value: reward.value,
                }
              : {
                  chain: null,
                  token: null,
                  value: 0,
                },
        });
      }
    } else {
      paidTo.push({
        propertyType: payeeType,
        value: reward.value,
        reward:
          paidTo.length === 0
            ? {
                chain: reward.chain,
                token: reward.token,
                value: reward.value,
              }
            : {
                chain: null,
                token: null,
                value: 0,
              },
      });
    }
    setValue({
      ...value,
      type: "Added From Card",
      paidTo,
      ...reward,
      data: val || value.data,
    });
    setCircleData({
      ...circle,
      paymentDetails: {
        ...circle.paymentDetails,
        [query.paymentId as string]: {
          ...value,
          type: "Added From Card",
          paidTo,
          ...reward,
          data: val || value.data,
        },
      },
    });
    if (query.paymentId) {
      const res = await updatePayment(circle.id, query.paymentId as string, {
        type: "Added From Card",
        paidTo,
        ...reward,
        data: val || value.data,
      });
    }
  };

  const onChange = async (update: any, labelOptions?: Option[]) => {
    if (query.paymentId) {
      let res;
      setCircleData({
        ...circle,
        paymentDetails: {
          ...circle.paymentDetails,
          [query.paymentId as string]: {
            ...circle.paymentDetails[query.paymentId as string],
            ...update,
          },
        },
        paymentLabelOptions: labelOptions || circle.paymentLabelOptions,
      });
      res = await updatePayment(circle.id, query.paymentId as string, update);
      if (!res) return;
    } else if (newCard) {
      setValue({
        ...value,
        ...update,
      });
    }
  };
  const closeCard = () => {
    void push({
      pathname,
      query: {
        circle: query.circle,
        tab: query.tab,
        status: query.status,
      },
    });
    handleClose();
  };

  useEffect(() => {
    if (value.collection?.value) {
      console.log({ v: value.collection?.value });

      fetchCollection()
        .then((res) => {
          if (res.data) {
            console.log({ d: res.data?.data });
            const options = Object.values(res.data?.data)?.map((card) => ({
              label: card.Title,
              value: card.slug,
              data: {
                payee: res.data.projectMetadata?.payments?.payeeField
                  ? card[res.data.projectMetadata?.payments?.payeeField]
                  : null,
                reward: res.data.projectMetadata?.payments?.rewardField
                  ? card[res.data.projectMetadata?.payments?.rewardField]
                  : null,
                payeeType: res.data.projectMetadata?.payments?.payeeField
                  ? res.data.properties[
                      res.data.projectMetadata?.payments?.payeeField
                    ]?.type
                  : null,
              },
            }));
            console.log({ options });
            setCardOptions(options);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong while fetching cards", {
            theme: "dark",
          });
        });
    }
  }, [value.collection]);

  return (
    <AnimatePresence>
      <Box>
        <Drawer
          width="50%"
          handleClose={() => {
            handleClose();
          }}
          header={
            <Box marginLeft="-4">
              <Stack
                direction="horizontal"
                align="center"
                justify="space-between"
              >
                <Button
                  shape="circle"
                  size="small"
                  variant="transparent"
                  onClick={() => {
                    closeCard();
                  }}
                >
                  <Stack direction="horizontal" align="center" space="0">
                    <IconChevronRight />
                    <Box marginLeft="-4">
                      <IconChevronRight />
                    </Box>
                  </Stack>
                </Button>
                <Box width="56">
                  {newCard && (
                    <PrimaryButton
                      loading={loading}
                      icon={<Save size="22" />}
                      onClick={async () => {
                        setLoading(true);
                        await addManualPayment(circle.id, value);
                        await fetchCircle();
                        setLoading(false);
                        push({
                          pathname,
                          query: {
                            circle: query.circle,
                            tab: query.tab,
                            status: query.status,
                          },
                        });
                      }}
                      disabled={!value.title || !value.paidTo?.length}
                    >
                      Create Payment
                    </PrimaryButton>
                  )}
                </Box>
              </Stack>
            </Box>
          }
        >
          {cancelPaymentConfirmModal && (
            <ConfirmModal
              title="This will cancel the payment as there is no valid payee or the reward is not set. Confirm?"
              handleClose={() => setCancelPaymentConfirmModal(false)}
              onCancel={() => setCancelPaymentConfirmModal(false)}
              onConfirm={async () => {
                setCancelPaymentConfirmModal(false);
                setOpenPayeeModal(false);
                handleClose();
                const res = await cancelPayments(circle.id as string, {
                  paymentIds: [query.paymentId as string],
                });
                if (res) {
                  fetchCircle();
                }
              }}
            />
          )}
          {confirmRewardUpdate && (
            <ConfirmModal
              title="Would you like to update the payee for this payment from the linked card?"
              handleClose={() => setConfirmRewardUpdate(false)}
              onCancel={() => setConfirmRewardUpdate(false)}
              onConfirm={async () => {
                setConfirmRewardUpdate(false);
                updateRewardFromCard();
              }}
            />
          )}
          {(value || newCard) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Container paddingX="8" paddingY="4" overflow="auto">
                {value.status === "Pending" && (
                  <Stack direction="horizontal" space="4" justify="flex-end">
                    <PrimaryButton
                      variant="secondary"
                      onClick={async () => {
                        setIsPayLoading(true);
                        await pay(value.chain.value, false, [
                          query.paymentId as string,
                        ]);
                        setIsPayLoading(false);
                        push({
                          pathname,
                          query: {
                            circle: query.circle,
                            tab: query.tab,
                            status: query.status,
                          },
                        });
                      }}
                      loading={isPayLoading}
                      disabled={isGnosisPayLoading}
                    >
                      Pay
                    </PrimaryButton>
                    {circle?.safeAddresses &&
                      value.chain?.value &&
                      circle?.safeAddresses[value.chain.value]?.length && (
                        <PrimaryButton
                          variant="secondary"
                          onClick={async () => {
                            setIsGnosisPayLoading(true);
                            await pay(value.chain.value, true, [
                              query.paymentId as string,
                            ]);
                            setIsGnosisPayLoading(false);
                            push({
                              pathname,
                              query: {
                                circle: query.circle,
                                tab: query.tab,
                                status: query.status,
                              },
                            });
                          }}
                          loading={isGnosisPayLoading}
                          disabled={isPayLoading}
                        >
                          Pay With Gnosis
                        </PrimaryButton>
                      )}
                    <PrimaryButton
                      variant="tertiary"
                      onClick={async () => {
                        handleClose();
                        const res = await cancelPayments(circle.id as string, {
                          paymentIds: [query.paymentId as string],
                        });
                        if (res) {
                          fetchCircle();
                        }
                      }}
                    >
                      Cancel Payment
                    </PrimaryButton>
                  </Stack>
                )}
                {openPayeeModal && (
                  <Modal
                    title="Payee"
                    handleClose={() => {
                      value.paidTo = value.paidTo?.filter(
                        (p) =>
                          p.value && p.reward?.value && p.reward?.token?.value
                      );
                      if (value.paidTo?.length > 0) {
                        setOpenPayeeModal(false);
                        onChange(value);
                      } else {
                        if (newCard) setOpenPayeeModal(false);
                        else setCancelPaymentConfirmModal(true);
                      }
                    }}
                  >
                    <Box padding="8" paddingTop="4">
                      <Payee
                        value={value}
                        mode="edit"
                        setValue={setValue}
                        newCard={newCard as string}
                      />
                    </Box>
                  </Modal>
                )}
                <Stack space="1">
                  <Stack
                    direction="horizontal"
                    justify="space-between"
                    align="center"
                  >
                    <NameInput
                      mode={mode}
                      placeholder="Untitled"
                      value={value?.title}
                      onChange={(e) => {
                        setIsDirty(true);
                        setValue({ ...value, title: e.target.value });
                      }}
                      onBlur={async () => {
                        if (isDirty) {
                          await onChange({ title: value.title });
                          setIsDirty(false);
                        }
                      }}
                      disabled={value.status !== "Pending" && !newCard}
                    />
                  </Stack>
                  <Box marginY="1" marginLeft="2">
                    <Stack direction="horizontal" align="center" space="0">
                      <Box width="1/4">
                        <Text>Type</Text>
                      </Box>
                      <Box width="3/4">
                        <FieldButton onClick={() => {}} mode={mode}>
                          <Box cursor="pointer" onClick={(e) => {}}>
                            {value.type ? <Text>{value.type}</Text> : "Empty"}
                          </Box>
                        </FieldButton>
                      </Box>
                    </Stack>
                    <Stack direction="horizontal" align="center" space="0">
                      <Box width="1/4">
                        <Text>
                          {circle?.parents?.length
                            ? "Workstream"
                            : "Organization"}
                        </Text>
                      </Box>
                      <Box width="3/4">
                        <FieldButton onClick={() => {}} mode={mode}>
                          <Box cursor="pointer" onClick={(e) => {}}>
                            <Text> {circle.name} </Text>
                          </Box>
                        </FieldButton>
                      </Box>
                    </Stack>
                    <Stack direction="horizontal" align="flex-start" space="0">
                      <Box width="1/4" paddingTop="2">
                        <Text>Project</Text>
                      </Box>
                      <Box width="3/4">
                        <PaymentDropdown
                          value={value.collection}
                          setValue={(v, opts) => {
                            const updates = { collection: v } as any;
                            if (!v) updates["data"] = null;
                            setValue({ ...value, ...updates });
                            onChange(updates, opts);
                          }}
                          options={projectOptions}
                          setOptions={(v) => {}}
                          paymentId={value.id}
                          multiple={false}
                          disabled={value.status !== "Pending" && !newCard}
                          clearable={true}
                          goToLink={
                            value?.collection?.value &&
                            `/${circle?.slug}/r/${value?.collection?.value}`
                          }
                        />
                      </Box>
                    </Stack>
                    {value.collection?.value && (
                      <Stack
                        direction="horizontal"
                        align="flex-start"
                        space="0"
                      >
                        <Box width="1/4" paddingTop="2">
                          <Text>Linked Card</Text>
                        </Box>
                        <Box width="3/4">
                          <PaymentDropdown
                            value={value.data}
                            setValue={(v, opts) => {
                              setValue({ ...value, data: v });
                              onChange({ data: v }, opts);
                              if (
                                value.paidTo?.length > 0 &&
                                v.data?.payee &&
                                v.data?.reward
                              ) {
                                setConfirmRewardUpdate(true);
                              } else updateRewardFromCard(v);
                            }}
                            options={cardOptions}
                            setOptions={(v) => {}}
                            paymentId={value.id}
                            multiple={false}
                            disabled={value.status !== "Pending" && !newCard}
                            clearable={true}
                            goToLink={
                              value?.data?.value &&
                              `/${circle?.slug}/r/${value?.collection?.value}?cardSlug=${value?.data?.value}`
                            }
                          />
                        </Box>
                      </Stack>
                    )}
                    <Stack direction="horizontal" align="flex-start" space="0">
                      <Box width="1/4" paddingTop="2">
                        <Text>Labels</Text>
                      </Box>
                      <Box width="3/4">
                        <PaymentDropdown
                          value={value.labels}
                          setValue={(v, opts) => {
                            setCircleData({
                              ...circle,
                              paymentLabelOptions: opts || [],
                            });
                            setValue({ ...value, labels: v });
                            onChange({ labels: v }, opts);
                          }}
                          options={circle.paymentLabelOptions}
                          setOptions={(v) => {}}
                          paymentId={value.id}
                          multiple={true}
                          clearable={true}
                        />
                      </Box>
                    </Stack>
                    <Stack direction="horizontal" align="flex-start" space="0">
                      <Box width="1/4" paddingTop="2">
                        <Text>Total Amount</Text>
                      </Box>
                      <Box width="3/4">
                        <FieldButton
                          onClick={() => {
                            setOpenPayeeModal(true);
                          }}
                          mode={mode}
                        >
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap="2"
                            cursor="pointer"
                            onClick={(e) => {}}
                          >
                            {value.chain?.value &&
                            value.token?.value &&
                            value.value ? (
                              <Text>
                                {value.value} {value.token?.label} on{" "}
                                {value.chain?.label}
                              </Text>
                            ) : (
                              "Empty"
                            )}
                          </Box>
                        </FieldButton>
                      </Box>
                    </Stack>
                    <Stack direction="horizontal" align="flex-start" space="0">
                      <Box width="1/4" paddingTop="2">
                        <Text>Payee</Text>
                      </Box>
                      <Box width="3/4">
                        <FieldButton
                          onClick={() => {
                            if (value.status === "Pending" || newCard)
                              setOpenPayeeModal(true);
                          }}
                          mode={mode}
                        >
                          {value?.paidTo?.length ? (
                            <Payee
                              value={value}
                              mode="view"
                              shortenEthAddress
                            />
                          ) : (
                            "Empty"
                          )}
                        </FieldButton>
                      </Box>
                    </Stack>

                    <Stack direction="horizontal" align="center" space="0">
                      <Box width="1/4">
                        <Text>Status</Text>
                      </Box>
                      <Box width="3/4">
                        <FieldButton onClick={() => {}} mode={mode}>
                          {value.status || newCard ? (
                            value.status === "Pending Signature" ? (
                              <a
                                href={`https://app.safe.global/${
                                  value.chain?.value === "137"
                                    ? "matic"
                                    : value.chain?.value === "1"
                                    ? "eth"
                                    : value.chain?.value === "10"
                                    ? "oeth"
                                    : "arb1"
                                }:${
                                  circle.safeAddresses[value.chain?.value][0]
                                }/transactions/queue`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Text>{value.status}</Text>
                              </a>
                            ) : (
                              <Text>{value.status || "Pending"}</Text>
                            )
                          ) : (
                            "Empty"
                          )}
                        </FieldButton>
                      </Box>
                    </Stack>
                    {value.status === "Completed" && (
                      <Stack direction="horizontal" align="center" space="0">
                        <Box width="1/4">
                          <Text>Transaction Hash</Text>
                        </Box>
                        <Box width="3/4">
                          <FieldButton onClick={() => {}} mode={mode}>
                            <a
                              href={`${
                                registry?.[value.chain.value].blockExplorer
                              }tx/${value.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Text>
                                {smartTrim(value.transactionHash as string, 16)}
                              </Text>
                            </a>
                          </FieldButton>
                        </Box>
                      </Stack>
                    )}
                  </Box>
                  <Box padding="2" borderBottomWidth="0.375" marginTop="4">
                    <Editor
                      placeholder="Describe your payment here...."
                      value={
                        circle.paymentDetails?.[
                          (query.paymentId as string) || ""
                        ]?.description
                      }
                      onSave={(val) => {
                        void onChange({ description: val });
                      }}
                      onChange={(val) => {
                        setIsDirty(true);
                        setValue({ ...value, description: val });
                      }}
                      isDirty={isDirty}
                      setIsDirty={setIsDirty}
                      disabled={value.status !== "Pending" && !newCard}
                    />
                  </Box>
                </Stack>
              </Container>
            </motion.div>
          )}
        </Drawer>
      </Box>
    </AnimatePresence>
  );
}

const NameInput = styled.input<{ mode: string }>`
  width: 100%;
  background: transparent;
  padding: 8px;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.9rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 700;
  ::placeholder {
    color: ${(props) =>
      props.mode === "dark"
        ? "rgb(255, 255, 255, 0.1)"
        : "rgb(20, 20, 20, 0.5)"};
  }
  letter-spacing: 0.05rem;
`;

const Container = styled(Box)`
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  height: calc(100vh - 4rem);
`;

const FieldButton = styled.div<{ mode: string }>`
  width: 25rem;
  color: ${({ mode }) =>
    mode === "dark" ? "rgb(255, 255, 255, 0.25)" : "rgb(0, 0, 0, 0.25)"};
  padding: 0.5rem 0.5rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  &:hover {
    cursor: pointer;
    background: rgb(191, 90, 242, 0.1);
  }

  transition: background 0.2s ease;
`;
