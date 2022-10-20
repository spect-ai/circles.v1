import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import ClickableTag from "@/app/common/components/EditTag/ClickableTag";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Chain, Milestone, Registry, Reward, Token } from "@/app/types";
import {
  Box,
  IconPlusSmall,
  Input,
  useTheme,
  Text,
  IconEth,
  Stack,
  Tag,
  Button,
} from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocalCollection } from "../Collection/Context/LocalCollectionContext";
import { DateInput } from "../Collection/Form/Field";
import RewardModal from "../Collection/TableView/RewardModal";

type Props = {
  form: any;
  dataId?: string;
  milestoneId?: string;
  propertyName: string;
  handleClose: () => void;
  addMilestone: (
    milestone: Milestone,
    dataId: string,
    propertyName: string
  ) => void;
};

export default function MilestoneModal({
  propertyName,
  dataId,
  milestoneId,
  form,
  handleClose,
  addMilestone,
}: Props) {
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();
  const { data: registry } = useQuery<Registry>(
    ["registry", form.parents[0].slug],
    {
      enabled: false,
    }
  );

  const [chain, setChain] = useState({} as Chain);
  const [token, setToken] = useState({} as Token);
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const { mode } = useTheme();

  useEffect(() => {
    if (milestoneId && dataId) {
      const milestone = form[dataId][propertyName].find(
        (milestone: Milestone) => milestone.id === milestoneId
      );
      if (milestone) {
        setTitle(milestone.title);
        setDescription(milestone.description);
        setDate(milestone.dueDate);
        setChain(milestone.reward.chain);
        setToken(milestone.reward.token);
        setValue(milestone.reward.value);
      }
    }
  }, []);

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={`Add Milestone`}
    >
      <Box
        padding="8"
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        gap="4"
      >
        <Box>
          <Box display="flex" flexDirection="row" alignItems="center" gap="2">
            <Text variant="label">Title</Text>
            <Tag size="small" tone="accent">
              Required
            </Tag>
          </Box>
          <Input
            label=""
            placeholder={`Enter Milestone Title`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Box>
        <Box>
          <Text variant="label">Description</Text>
          <Box
            marginTop="2"
            width="full"
            borderWidth="0.375"
            padding="4"
            borderRadius="large"
            maxHeight="64"
            overflow="auto"
          >
            <Editor
              value={description}
              onSave={(value) => {
                setDescription(value);
              }}
              placeholder={`Enter Description, press / for commands`}
              isDirty={true}
            />
          </Box>
        </Box>
        <Box>
          <Text variant="label">Reward</Text>
          <Box display="flex" flexDirection="row" alignItems="center" gap="2">
            <Box width="72" marginTop="2">
              <Dropdown
                options={[
                  {
                    value: "1",
                    label: "Ethereum",
                  },
                ]}
                selected={{
                  value: "1",
                  label: "Ethereum",
                }}
                onChange={(option) => {}}
                multiple={false}
                isClearable={false}
              />
            </Box>
            <Box width="72" marginTop="2">
              <Dropdown
                options={[
                  {
                    value: "1",
                    label: "Ethereum",
                  },
                ]}
                selected={{
                  value: "1",
                  label: "Ethereum",
                }}
                onChange={(option) => {}}
                multiple={false}
                isClearable={false}
              />
            </Box>
            <Input
              label=""
              placeholder={`Enter Reward Amount`}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box>
          <Text variant="label">Due Date</Text>
          <Box width="56">
            <DateInput
              placeholder={`Enter Milestone Due Date`}
              value={date}
              type="date"
              mode={mode}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </Box>
        </Box>
        <Box
          marginTop="4"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
        >
          <Button
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            marginRight="2"
            variant="secondary"
            size="small"
            width="32"
            onClick={() => {
              addMilestone(
                {
                  title,
                  description,
                  dueDate: date,
                  reward: {
                    value: parseFloat(value),
                    token,
                    chain,
                  },
                },
                dataId || "",
                propertyName
              );
            }}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
