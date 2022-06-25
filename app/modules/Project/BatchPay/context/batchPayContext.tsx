import { BatchPayInfo } from "@/app/types";
import { createContext, useContext, useState } from "react";

interface BatchPayContextType {
  isOpen: boolean;
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

export function useProviderBatchPayContext() {
  const [isOpen, setIsOpen] = useState(false);
  const [batchPayInfo, setBatchPayInfo] = useState<BatchPayInfo>();
  const [step, setStep] = useState(0);
  const [currencyCards, setCurrencyCards] = useState<string[]>();
  const [tokenCards, setTokenCards] = useState<string[]>();

  return {
    isOpen,
    setIsOpen,
    batchPayInfo,
    setBatchPayInfo,
    step,
    setStep,
    currencyCards,
    setCurrencyCards,
    tokenCards,
    setTokenCards,
  };
}

export const useBatchPayContext = () => useContext(BatchPayContext);
