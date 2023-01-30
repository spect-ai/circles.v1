/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Drawer from "@/app/common/components/Drawer";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import ConfirmModal from "@/app/common/components/Modal/ConfirmModal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  addManualPayment,
  cancelPayments,
  updatePayment,
} from "@/app/services/Paymentv2";
import { CollectionType, Option } from "@/app/types";
import { Box, Button, IconChevronRight, Stack, Text, useTheme } from "degen";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Save } from "react-feather";
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
  const { circle, fetchCircle, setCircleData } = useCircle();
  const { push, pathname, query } = useRouter();

  const [isDirty, setIsDirty] = useState(false);
  const [cancelPaymentConfirmModal, setCancelPaymentConfirmModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [isPayLoading, setIsPayLoading] = useState(false);
  const [isGnosisPayLoading, setIsGnosisPayLoading] = useState(false);
  const [openPayeeModal, setOpenPayeeModal] = useState(false);

  const { newCard, value, setValue, pay } = usePaymentViewCommon();
  const projectOptions = Object.values(circle.collections)?.map(
    (collection) => ({
      label: collection.name,
      value: collection.slug,
    })
  );

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
  console.log({ value });

  useEffect(() => {
    console.log("fetch data");
  }, [value.collection]);

  return (
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
                      await addManualPayment(circle.id, value);
                      await fetchCircle();
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
                    }}
                    loading={isPayLoading}
                    disabled={isGnosisPayLoading}
                  >
                    Pay
                  </PrimaryButton>
                  {circle?.safeAddresses &&
                    Object.entries(circle?.safeAddresses).some(
                      ([aChain, aSafes]) => aSafes?.length > 0
                    ) && (
                      <PrimaryButton
                        variant="secondary"
                        onClick={async () => {
                          setIsGnosisPayLoading(true);
                          await pay(value.chain.value, true, [
                            query.paymentId as string,
                          ]);
                          setIsGnosisPayLoading(false);
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
                  <Stack direction="horizontal" align="center" space="0">
                    <Box width="1/4">
                      <Text>Project</Text>
                    </Box>
                    <Box width="3/4">
                      <PaymentDropdown
                        value={value.collection}
                        setValue={(v, opts) => {
                          console.log({ v });
                          setValue({ ...value, collection: v });
                          onChange({ collection: v }, opts);
                        }}
                        options={projectOptions}
                        setOptions={(v) => {}}
                        paymentId={value.id}
                        multiple={false}
                        disabled={value.status !== "Pending" && !newCard}
                      />
                    </Box>
                  </Stack>
                  {/* <Stack direction="horizontal" align="center" space="0">
                    <Box width="1/4">
                      <Text>Card</Text>
                    </Box>
                    <Box width="3/4">
                      <FieldButton onClick={() => {}} mode={mode}>
                        <Box cursor="pointer" onClick={(e) => {}}>
                          <Text> val </Text>
                        </Box>
                      </FieldButton>
                    </Box>
                  </Stack> */}
                  <Stack direction="horizontal" align="center" space="0">
                    <Box width="1/4">
                      <Text>Labels</Text>
                    </Box>
                    <Box width="3/4">
                      <PaymentDropdown
                        value={value.labels}
                        setValue={(v, opts) => {
                          setValue({ ...value, labels: v });
                          onChange({ labels: v }, opts);
                        }}
                        options={circle.paymentLabelOptions}
                        setOptions={(v) => {}}
                        paymentId={value.id}
                        multiple={true}
                      />
                    </Box>
                  </Stack>
                  <Stack direction="horizontal" align="flex-start" space="0">
                    <Box width="1/4" paddingTop="2">
                      <Text>Total Amount</Text>
                    </Box>
                    <Box width="3/4">
                      <FieldButton onClick={() => {}} mode={mode}>
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
                          <Payee value={value} mode="view" />
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
                          <Text>{value.status || "Pending"}</Text>
                        ) : (
                          "Empty"
                        )}
                      </FieldButton>
                    </Box>
                  </Stack>
                </Box>
                <Box padding="2" borderBottomWidth="0.375" marginTop="4">
                  <Editor
                    placeholder="Describe your payment here...."
                    value={
                      circle.paymentDetails[(query.paymentId as string) || ""]
                        ?.description
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

export {};

const FieldButton = styled.div<{ mode: string }>`
  width: 30rem;
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
