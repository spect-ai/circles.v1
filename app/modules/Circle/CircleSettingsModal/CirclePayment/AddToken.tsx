import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack, Text } from "degen";
import { useState } from "react";
import useERC20 from "@/app/services/Payment/useERC20";
import { Option, Registry } from "@/app/types";
import { addToken } from "@/app/services/Payment";
import Loader from "@/app/common/components/Loader";
import Dropdown from "@/app/common/components/Dropdown";
import { useCircle } from "../../CircleContext";

interface Props {
  chainName: string;
  chainId: string;
  handleClose: () => void;
}

const AddToken = ({ chainName, chainId, handleClose }: Props) => {
  const [network, setNetwork] = useState({
    label: chainName,
    value: chainId,
  });
  const [address, setAddress] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);
  const { symbol, name } = useERC20();
  const { circle, setRegistryData, registry } = useCircle();

  const options = Object.values(registry as Registry)?.map((r) => ({
    label: r.name,
    value: r.chainId,
  }));
  return (
    <Modal handleClose={handleClose} title="Add Token" size="small">
      <Box padding="8">
        {tokenLoading && <Loader loading text="Fetching" />}
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
            placeholder="Token Address"
            value={address}
            onChange={async (e) => {
              setAddress(e.target.value);
              setTokenLoading(true);
              try {
                setTokenSymbol(await symbol(e.target.value, network?.value));
                setTokenName(await name(e.target.value, network?.value));
              } catch (err) {
                console.error(err);
                setTokenLoading(false);
              }
              setTokenLoading(false);
            }}
          />

          <Text weight="semiBold">{tokenSymbol}</Text>
          <Text weight="semiBold">{tokenName}</Text>
          <PrimaryButton
            loading={loading}
            disabled={!tokenSymbol}
            onClick={async () => {
              setLoading(true);
              const res = await addToken(circle?.id || "", {
                chainId: network.value as string,
                address,
                symbol: tokenSymbol,
                name: tokenName,
              });
              setLoading(false);
              setRegistryData(res as Registry);
              res && handleClose();
            }}
          >
            Add
          </PrimaryButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AddToken;
