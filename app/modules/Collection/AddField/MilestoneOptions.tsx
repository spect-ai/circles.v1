import { Registry } from "@/app/types";
import { Box, Stack, Text } from "degen";
import { toast } from "react-toastify";
import styled from "styled-components";
import RewardTokenOptions from "./RewardTokenOptions";

const Input = styled.input`
  background-color: transparent;
  border: none;
  margin: 0.4rem;
  padding: 0.4rem;
  display: flex;
  border-style: none;
  border-color: transparent;
  border-radius: 0.4rem;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 400;
  opacity: "40%";
`;

type Props = {
  networks?: Registry;
  setNetworks: React.Dispatch<React.SetStateAction<Registry | undefined>>;
};

const MilestoneOptions = ({ networks, setNetworks }: Props) => (
  <Box display="flex" flexDirection="column" width="full" gap="4">
    <Text variant="label">Milestone Fields</Text>
    <Stack direction="horizontal" space="2" wrap>
      <Box display="flex" flexDirection="row" alignItems="center" gap="1">
        <Text>Title</Text>
        <Input
          type="checkbox"
          checked
          onChange={() => {
            toast.info("It will be possible to customize this soon!");
          }}
        />
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" gap="1">
        <Text>Description</Text>
        <Input
          type="checkbox"
          checked
          onChange={() => {
            toast.info("It will be possible to customize this soon!");
          }}
        />
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" gap="1">
        <Text>Due Date</Text>
        <Input
          type="checkbox"
          checked
          onChange={() => {
            toast.info("It will be possible to customize this soon!");
          }}
        />
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" gap="1">
        <Text>Reward</Text>
        <Input
          type="checkbox"
          checked
          onChange={() => {
            toast.info("It will be possible to customize this soon!");
          }}
        />
      </Box>
    </Stack>
    <RewardTokenOptions networks={networks} setNetworks={setNetworks} />
  </Box>
);

export default MilestoneOptions;
