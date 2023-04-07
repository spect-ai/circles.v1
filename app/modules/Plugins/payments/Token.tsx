import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Option } from "@/app/types";
import { Box, Button, IconTrash, Input, Stack, Text } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  paymentType: "paywall" | "donation";
  tokenOptions: Option[];
  token: Option;
  tokenAmount: string;
  dollarAmount: string;
  onRemoveToken: (token: Option) => void;
  onTokenAmountChange: (token: Option, amount: string) => void;
  onDollarAmountChange: (token: Option, amount: string) => void;
  onUpdateToken: (token: Option) => void;
};

const Token = ({
  paymentType,
  tokenOptions,
  token,
  tokenAmount,
  dollarAmount,
  onRemoveToken,
  onTokenAmountChange,
  onDollarAmountChange,
  onUpdateToken,
}: Props) => {
  const [settingToken, setSettingToken] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    if (tokenAmount) setSettingToken(true);
    if (dollarAmount) setSettingToken(false);
  }, [tokenAmount, dollarAmount]);

  return (
    <Stack space="0">
      <Stack direction="horizontal" align="center">
        <Box width="1/3">
          <Dropdown
            options={tokenOptions}
            selected={token}
            onChange={onUpdateToken}
            multiple={false}
            isClearable={false}
          />
        </Box>
        <Box width="2/3">
          {paymentType === "paywall" && (
            <Input
              value={settingToken ? tokenAmount : dollarAmount}
              onChange={(e) => {
                if (settingToken) {
                  onTokenAmountChange(token, e.target.value);
                  onDollarAmountChange(token, "");
                } else {
                  onDollarAmountChange(token, e.target.value);
                  onTokenAmountChange(token, "");
                }
              }}
              label=""
              placeholder="0.00"
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              units={settingToken ? token.label : "$"}
              type="number"
            />
          )}
        </Box>
        <Button
          shape="circle"
          tone="red"
          size="small"
          variant="secondary"
          onClick={() => onRemoveToken(token)}
        >
          <IconTrash />
        </Button>
      </Stack>
      <AnimatePresence>
        {isInputFocused && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden", marginLeft: "2rem" }}
          >
            <Stack direction="horizontal" align="center">
              <Box width="1/3" />
              <Box width="2/3" marginX="16">
                <PrimaryButton
                  variant="transparent"
                  onClick={() => setSettingToken(!settingToken)}
                >
                  <Text variant="label">
                    {settingToken ? "Add Dollar amount" : "Add Token amount"}
                  </Text>
                </PrimaryButton>
              </Box>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
};

export default Token;
