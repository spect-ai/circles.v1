import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack, Tag, Text } from "degen";
import React, { useState } from "react";
import useERC20 from "@/app/services/Payment/useERC20";
import { Chain, Option, Registry } from "@/app/types";
import { AnimatePresence } from "framer-motion";
import { addToken } from "@/app/services/Payment";
import Loader from "@/app/common/components/Loader";
import { useCircle } from "../../CircleContext";
import Dropdown from "@/app/common/components/Dropdown";
import { updateCircle } from "@/app/services/UpdateCircle";
import { logError } from "@/app/common/utils/utils";
import { toast } from "react-toastify";
import { ethers } from "ethers";

interface Props {
  chainName: string;
  chainId: string;
  handleClose: () => void;
}

export default function AddAddress({ chainName, chainId, handleClose }: Props) {
  const [network, setNetwork] = useState({
    label: chainName,
    value: chainId,
  });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { circle, setCircleData, registry } = useCircle();

  const options = Object.values(registry as Registry)?.map((r) => ({
    label: r.name,
    value: r.chainId,
  }));
  return (
    <Modal handleClose={handleClose} title="Add Token" size="small">
      <Box padding="8">
        <Stack>
          <Dropdown
            multiple={false}
            options={options}
            selected={network as Option}
            onChange={(option) => {
              setNetwork(option);
            }}
            isClearable={false}
            placeholder="Select Network"
          />
          <Input
            label=""
            placeholder="On Chain Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <PrimaryButton
            loading={loading}
            onClick={async () => {
              if (
                circle?.whitelistedAddresses?.[network.value]?.includes(address)
              ) {
                toast.warn("Address already whitelisted");
                return;
              }
              if (ethers.utils.isAddress(address) === false) {
                toast.error(
                  "Invalid address, please enter a valid ethereum address"
                );
                return;
              }
              setLoading(true);
              const res = await updateCircle(
                {
                  whitelistedAddresses: {
                    ...circle?.whitelistedAddresses,
                    [network.value]: [
                      ...(circle?.whitelistedAddresses?.[network.value] || []),
                      address,
                    ],
                  },
                },
                circle?.id || ""
              );
              console.log({ res });
              setLoading(false);
              if (res) {
                setCircleData(res);
                handleClose();
              } else {
                logError("Error updating whitelisted addresses");
              }
            }}
          >
            Add
          </PrimaryButton>
        </Stack>
      </Box>
    </Modal>
  );
}
