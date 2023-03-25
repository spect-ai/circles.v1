import { Input } from "degen";
import React, { useState } from "react";
import { fetchEnsAddress } from "@wagmi/core";
import { ethers } from "ethers";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function EthAddressField({ value, onChange, disabled }: Props) {
  const [error, setError] = useState("");
  const [tempValue, setTempValue] = useState(value || "");
  return (
    <Input
      label=""
      value={tempValue}
      onChange={(e) => {
        const value = e.target.value as `0x${string}`;
        setTempValue(value);
        if (value.endsWith(".eth")) {
          fetchEnsAddress({
            name: value,
            chainId: 1,
          }).then((address) => {
            console.log(address);
            if (
              !address ||
              !ethers.utils.isAddress(address) ||
              address === null
            ) {
              setError("Invalid ENS name");
            } else {
              setError("");
              onChange(value);
            }
          });
        } else {
          if (!ethers.utils.isAddress(value)) {
            setError("Invalid address or ENS name");
          } else {
            setError("");
            onChange(value);
          }
        }
      }}
      disabled={disabled}
      placeholder="Enter EthAddress (0x...) or ENS name"
      error={error}
    />
  );
}
