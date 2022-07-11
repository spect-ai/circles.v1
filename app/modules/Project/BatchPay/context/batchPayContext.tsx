import { BatchPayInfo } from "@/app/types";
import { createContext, useContext, useState } from "react";

interface BatchPayContextType {
  setIsOpen: (isOpen: boolean) => void;
  batchPayInfo: BatchPayInfo | undefined;
  setBatchPayInfo: (batchPayInfo: BatchPayInfo) => void;
  step: number;
  setStep: (step: number) => void;
  currencyCards: string[] | undefined;
  setCurrencyCards: (currencyCards: string[]) => void;
  tokenCards: string[] | undefined;
  setTokenCards: (tokenCards: string[]) => void;
}

export const BatchPayContext = createContext<BatchPayContextType>(
  {} as BatchPayContextType
);

export function useProviderBatchPayContext({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [batchPayInfo, setBatchPayInfo] = useState<BatchPayInfo>();
  const [step, setStep] = useState(-1);
  const [currencyCards, setCurrencyCards] = useState<string[]>();
  const [tokenCards, setTokenCards] = useState<string[]>();

  return {
    batchPayInfo,
    setBatchPayInfo,
    step,
    setStep,
    currencyCards,
    setCurrencyCards,
    tokenCards,
    setTokenCards,
    setIsOpen,
  };
}

export const useBatchPayContext = () => useContext(BatchPayContext);
