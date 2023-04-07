import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Registry } from "@/app/types";
import { Box, Button, IconPlusSmall, IconTrash, Input, Stack } from "degen";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight } from "react-feather";
import Token from "./Token";

export type Option = {
  label: string;
  value: string;
};

type Props = {
  paymentType: "paywall" | "donation";
  registry: Registry;
  networkOptions: Option[];
  network: Option;
  receiverAddress: string;
  addedTokens: Option[];
  tokenAmounts: {
    [tokenAddress: string]: string;
  };
  dollarAmounts: {
    [tokenAddress: string]: string;
  };
  onNetworkDelete: () => void;
  onNetworkChange: (network: Option) => void;
  onAddToken: () => void;
  onRemoveToken: (token: Option, index: number) => void;
  onUpdateToken: (token: Option, index: number) => void;
  onUpdateReceiverAddress: (address: string) => void;
  onTokenAmountChange: (token: Option, amount: string) => void;
  onDollarAmountChange: (token: Option, amount: string) => void;
};
const Chain = ({
  paymentType,
  registry,
  networkOptions,
  network,
  receiverAddress,
  addedTokens,
  tokenAmounts,
  dollarAmounts,
  onNetworkDelete,
  onNetworkChange,
  onAddToken,
  onRemoveToken,
  onUpdateToken,
  onUpdateReceiverAddress,
  onTokenAmountChange,
  onDollarAmountChange,
}: Props) => {
  const tokenOptions =
    registry &&
    Object.values(registry[network.value]?.tokenDetails || {}).map((token) => ({
      label: token.symbol,
      value: token.address,
    }));

  tokenOptions.unshift({
    label: "Add Token from address",
    value: "custom",
  });

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Box>
      <Stack>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          cursor="pointer"
          gap="4"
        >
          <Box width="1/3">
            <Dropdown
              options={networkOptions}
              selected={network}
              onChange={onNetworkChange}
              multiple={false}
              isClearable={false}
              placeholder="Select Network"
            />
          </Box>
          <Box width="2/3">
            <Input
              value={receiverAddress}
              onChange={(e) => onUpdateReceiverAddress(e.target.value)}
              label=""
              placeholder="Receiving Address"
            />
          </Box>
          <Button
            shape="circle"
            tone="red"
            size="small"
            variant="secondary"
            onClick={() => onNetworkDelete()}
          >
            <IconTrash />
          </Button>
          <Button
            shape="circle"
            size="small"
            variant="transparent"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronRight
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </Button>
        </Box>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden", marginLeft: "2rem" }}
            >
              {addedTokens?.map((token, index) => (
                <Token
                  tokenOptions={tokenOptions}
                  key={token.value}
                  token={token}
                  tokenAmount={tokenAmounts && tokenAmounts[token.value]}
                  dollarAmount={dollarAmounts && dollarAmounts[token.value]}
                  onRemoveToken={() => onRemoveToken(token, index)}
                  onTokenAmountChange={onTokenAmountChange}
                  onDollarAmountChange={onDollarAmountChange}
                  onUpdateToken={(tkn) => onUpdateToken(tkn, index)}
                  paymentType={paymentType}
                />
              ))}
              <Box marginTop="4" width="1/3" paddingRight="6">
                <PrimaryButton
                  onClick={() => {
                    onAddToken();
                  }}
                  variant="tertiary"
                  icon={<IconPlusSmall size="4" />}
                >
                  Add Token
                </PrimaryButton>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </Box>
  );
};

export default Chain;
