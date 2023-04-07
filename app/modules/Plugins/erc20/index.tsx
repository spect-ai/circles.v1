import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import Select from "@/app/common/components/Select";
import { updateFormCollection } from "@/app/services/Collection";
import { createSurvey, getLastSurveyId } from "@/app/services/SurveyProtocol";
import { ConditionInfo, DistributionInfo, Option, UserType } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { ethers } from "ethers";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { useCircle } from "../../Circle/CircleContext";
import AddToken from "../../Circle/CircleSettingsModal/CirclePayment/AddToken";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

type Props = {
  handleClose: () => void;
  distributionInfo?: DistributionInfo;
  conditionInfo?: ConditionInfo;
};

const DistributeERC20 = ({
  handleClose,
  distributionInfo,
  conditionInfo,
}: Props) => {
  const { registry } = useCircle();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [paymentType, setPaymentType] = useState(
    distributionInfo?.distributionType === 0
      ? {
          label: "Lottery",
          value: "lottery",
        }
      : {
          label: "Pay per response",
          value: "payPerResponse",
        }
  );
  const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false);

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const networks = Object.keys(registry || {})
    .filter((key) => ["137", "43113", "80001", "5"].includes(key))
    .map((key) => ({
      label: (registry && registry[key].name) || "",
      value: key,
    }));
  const [selectedNetwork, setSelectedNetwork] = useState(
    collection?.formMetadata?.surveyChain || networks[0]
  );
  const [tokenOptions, setTokenOptions] = useState([] as Option[]);
  const [selectedToken, setSelectedToken] = useState(
    collection?.formMetadata?.surveyToken as Option
  );
  const [value, setValue] = useState(
    collection?.formMetadata?.surveyTotalValue || 0
  );
  const [valuePerResponse, setValuePerResponse] = useState(0);
  const [minResponses, setMinResponses] = useState(
    conditionInfo?.minTotalSupply || 0
  );
  const [minTimestamp, setMinTimestamp] = useState(
    conditionInfo?.timestamp || 0
  );
  const [lotteryClaimOptions] = useState<"minDays" | "minResponses">(
    conditionInfo?.timestamp && conditionInfo?.timestamp > 0
      ? "minDays"
      : "minResponses"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({
    amountPerResponse: false,
    totalAmount: false,
  });

  useEffect(() => {
    if (registry && selectedNetwork) {
      const tokens = Object.entries(
        registry[selectedNetwork.value].tokenDetails
      ).map(([address, token]) => ({
        label: token.symbol,
        value: address,
      }));
      tokens.unshift({
        label: "Add Token from address",
        value: "__custom__",
      });
      setSelectedToken(tokens[1]);
      setTokenOptions(tokens);
    }
  }, [selectedNetwork, registry]);

  useEffect(() => {
    if (distributionInfo?.amountPerResponse) {
      setValuePerResponse(
        parseFloat(
          ethers.utils.formatEther(
            distributionInfo?.amountPerResponse.toString()
          )
        )
      );
    }
  }, [distributionInfo?.amountPerResponse]);

  useEffect(() => {
    if (paymentType?.value === "lottery") {
      setValuePerResponse(0);
    } else if (paymentType?.value === "payPerResponse") {
      setMinResponses(0);
      setMinTimestamp(0);
    }
  }, [paymentType]);

  useEffect(() => {
    if (paymentType?.value === "payPerResponse") {
      if (valuePerResponse > value) {
        setIsError({
          ...isError,
          amountPerResponse: true,
        });
      } else {
        setIsError({
          ...isError,
          amountPerResponse: false,
          totalAmount: false,
        });
      }
    } else {
      setIsError({
        ...isError,
        totalAmount: false,
        amountPerResponse: false,
      });
    }
  }, [valuePerResponse, value]);

  return (
    <Modal handleClose={handleClose} title="Distribute Tokens">
      <AnimatePresence>
        {isAddTokenModalOpen && (
          <AddToken
            chainId={selectedNetwork?.value}
            chainName={selectedNetwork?.label}
            handleClose={() => setIsAddTokenModalOpen(false)}
          />
        )}
      </AnimatePresence>
      <Box padding="8">
        <Stack>
          <Stack>
            <Stack space="1">
              <Stack space="1">
                <Text variant="label">Pick Network & Token to distribute</Text>
              </Stack>
              <Box display="flex" gap="4">
                <Box width="1/3">
                  <Dropdown
                    options={networks}
                    selected={selectedNetwork}
                    onChange={setSelectedNetwork}
                    multiple={false}
                    isClearable={false}
                    placeholder="Select Network"
                  />
                </Box>
                <Box width="1/3">
                  <Dropdown
                    options={tokenOptions}
                    selected={selectedToken}
                    onChange={(option) => {
                      if (option?.value === "__custom__") {
                        setIsAddTokenModalOpen(true);
                        return;
                      }
                      setSelectedToken(option);
                    }}
                    multiple={false}
                    isClearable={false}
                  />
                </Box>
              </Box>
            </Stack>
            <Stack space="1">
              <Text variant="label">Total Amount</Text>
              <Box width="1/3">
                <Input
                  label=""
                  placeholder="Enter Total Amount in"
                  value={value}
                  onChange={(e) => {
                    setValue(parseFloat(e.target.value));
                  }}
                  type="number"
                  units={selectedToken?.label}
                />
              </Box>
              {isError.totalAmount && (
                <Text variant="small" color="red">
                  Amount To Pay Per Response cannot be greater than Total Amount
                </Text>
              )}
            </Stack>
            <Stack space="2">
              <Stack space="1">
                <Text variant="label">
                  Pay per response: Each responder gets paid, Lottery: Only
                  lucky responder get paid
                </Text>
              </Stack>
              <Select
                options={[
                  { label: "Pay per response", value: "payPerResponse" },
                  { label: "Lottery", value: "lottery" },
                ]}
                value={paymentType}
                onChange={setPaymentType}
                variant="secondary"
              />
            </Stack>
            {paymentType?.value === "payPerResponse" && (
              <Stack space="1">
                <Text variant="label">Amount To Pay Per Response</Text>
                <Box width="1/3">
                  <Input
                    label=""
                    placeholder="Enter Amount in"
                    value={valuePerResponse}
                    onChange={(e) => {
                      setValuePerResponse(parseFloat(e.target.value));
                    }}
                    type="number"
                    units={selectedToken?.label}
                    error={valuePerResponse > value}
                  />
                </Box>
                {isError.amountPerResponse && (
                  <Text variant="small" color="red">
                    Amount To Pay Per Response cannot be greater than Total
                    Amount
                  </Text>
                )}
              </Stack>
            )}
            <Stack space="0">
              {paymentType?.value === "lottery" &&
                lotteryClaimOptions === "minDays" && (
                  <Stack space="1">
                    <Text variant="label">
                      When can the lottery be claimed?
                    </Text>
                    <Box width="1/3">
                      <Input
                        label=""
                        placeholder="Min "
                        value={minTimestamp}
                        onChange={(e) => {
                          setMinTimestamp(parseInt(e.target.value));
                          setMinResponses(0);
                        }}
                        type="number"
                        units="days"
                      />
                    </Box>
                  </Stack>
                )}
              {paymentType?.value === "lottery" &&
                lotteryClaimOptions === "minResponses" && (
                  <Stack space="1">
                    <Text variant="label">
                      Minimum Responses after which lottery can be claimed
                    </Text>
                    <Box width="1/3">
                      <Input
                        label=""
                        placeholder=""
                        value={minResponses}
                        onChange={(e) => {
                          setMinResponses(parseInt(e.target.value));
                          setMinTimestamp(0);
                        }}
                        type="number"
                        units="responses"
                      />
                    </Box>
                  </Stack>
                )}
              {/* {paymentType?.value === "lottery" && (
                <Box width="1/3">
                  <PrimaryButton
                    variant="transparent"
                    onClick={() => {
                      setLotteryClaimOptions(
                        lotteryClaimOptions === "minDays"
                          ? "minResponses"
                          : "minDays"
                      );
                    }}
                  >
                    {lotteryClaimOptions === "minDays"
                      ? "Or set number or responses"
                      : "Or set minimum days"}
                  </PrimaryButton>
                </Box>
              )} */}
            </Stack>
          </Stack>
        </Stack>
        <Box
          marginTop="8"
          width="full"
          display="flex"
          justifyContent="flex-end"
        >
          <Box display="flex" flexDirection="column" gap="4" width="1/2">
            {value > 0 && (
              <Box marginRight="2">
                <Text variant="base">
                  {`${value} ${selectedToken?.label} will be escrowed for distribution`}
                </Text>
              </Box>
            )}
            <PrimaryButton
              loading={isLoading}
              disabled={
                isLoading ||
                value === 0 ||
                isError.totalAmount ||
                isError.amountPerResponse ||
                (paymentType?.value === "payPerResponse" &&
                  valuePerResponse === 0)
              }
              onClick={async () => {
                try {
                  setIsLoading(true);
                  if (!registry) return;
                  if (
                    selectedToken?.value !== "0x0" &&
                    !currentUser?.ethAddress
                  ) {
                    setIsLoading(false);
                    return;
                  }

                  const tx = await createSurvey(
                    selectedNetwork.value,
                    registry[selectedNetwork.value].surveyHubAddress,
                    selectedToken?.value,
                    value,
                    currentUser?.ethAddress || "",
                    paymentType?.value === "payPerResponse" ? 1 : 0,
                    valuePerResponse,
                    minTimestamp,
                    minResponses
                  );
                  if (!tx) {
                    setIsLoading(false);
                    return;
                  }
                  let lastSurveyId;
                  try {
                    lastSurveyId = await getLastSurveyId(
                      registry[selectedNetwork.value].surveyHubAddress,
                      selectedNetwork?.value
                    );
                  } catch (err) {
                    console.error(
                      "Unable to fetch last survey with error",
                      err
                    );
                    toast.error(
                      "Plugin was added, but something went wrong while fetching the survey id. Please contact support."
                    );
                  }

                  const res = await updateFormCollection(collection.id, {
                    formMetadata: {
                      ...collection.formMetadata,
                      surveyTokenId: lastSurveyId,
                      surveyChain: selectedNetwork,
                      surveyToken: selectedToken,
                      surveyTotalValue: value,
                      surveyDistributionType:
                        paymentType?.value === "payPerResponse" ? 1 : 0,
                      walletConnectionRequired: true,
                    },
                  });
                  updateCollection(res);
                  setIsLoading(false);
                  if (res) handleClose();
                } catch (e) {
                  console.error(e);
                  setIsLoading(false);
                  toast.error("Something went wrong");
                }
              }}
            >
              Confirm
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

DistributeERC20.defaultProps = {
  distributionInfo: {},
  conditionInfo: {},
};

export default DistributeERC20;
