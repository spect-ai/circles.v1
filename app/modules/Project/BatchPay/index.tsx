import Modal from "@/app/common/components/Modal";
import { Button, IconEth, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tippy";
import ApproveToken from "./ApproveToken";
import {
  BatchPayContext,
  useProviderBatchPayContext,
} from "./context/batchPayContext";
import CurrencyPayment from "./CurrencyPayment";
import SelectCards from "./SelectCards";
import TokenPayment from "./TokenPayment";

export default function BatchPay() {
  const context = useProviderBatchPayContext();

  const { setIsOpen, isOpen, step } = context;
  return (
    <BatchPayContext.Provider value={context}>
      <Button
        data-tour="header-batch-pay-button"
        size="small"
        variant="transparent"
        shape="circle"
        onClick={(e: any) => {
          setIsOpen(true);
        }}
      >
        <Tooltip html={<Text>Batch Pay</Text>}>
          <IconEth />
        </Tooltip>
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal
            title="Batch Payment"
            handleClose={() => setIsOpen(false)}
            height="40rem"
            size="large"
          >
            {step === 0 && <SelectCards />}
            {step === 1 && <CurrencyPayment />}
            {step === 2 && <ApproveToken />}
            {step === 3 && <TokenPayment />}
          </Modal>
        )}
      </AnimatePresence>
    </BatchPayContext.Provider>
  );
}
