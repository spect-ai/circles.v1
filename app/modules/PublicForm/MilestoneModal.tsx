/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from "@/app/common/components/Dropdown";
import Editor from "@/app/common/components/Editor";
import Modal from "@/app/common/components/Modal";
import { Milestone, Option, Registry } from "@/app/types";
import { Box, Button, Input, Stack, Tag, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import { DateInput } from "../Collection/Form/Field";

type Props = {
  form: any;
  propertyName: string;
  data: any;
  handleClose: () => void;
  addMilestone: (milestone: Milestone) => void;
  modalMode: "create" | "edit";
  milestoneIndex?: number;
};

export default function MilestoneModal({
  form,
  propertyName,
  data,
  handleClose,
  addMilestone,
  modalMode,
  milestoneIndex,
}: Props) {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    propertyName &&
      (milestoneIndex || milestoneIndex === 0) &&
      modalMode === "edit"
      ? data[propertyName][milestoneIndex].description
      : ""
  );
  const [date, setDate] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rewardOptions = (form.properties[propertyName]?.rewardOptions ||
    {}) as Registry;
  const firstChainName =
    Object.values(rewardOptions).length > 0
      ? Object.values(rewardOptions)[0].name
      : "";
  const firstChainId =
    Object.keys(rewardOptions).length > 0 ? Object.keys(rewardOptions)[0] : "";
  const firstTokenSymbol = Object.values(
    rewardOptions[firstChainId]?.tokenDetails
  )[0].symbol;
  const firstTokenAddress = Object.keys(
    rewardOptions[firstChainId]?.tokenDetails
  )[0];

  const [tokenOptions, setTokenOptions] = useState<Option[]>([]);
  const [selectedChain, setSelectedChain] = useState<Option>({
    label: firstChainName,
    value: firstChainId,
  });
  const [selectedToken, setSelectedToken] = useState<Option>({
    label: firstTokenSymbol,
    value: firstTokenAddress,
  });

  const [requiredFieldsNotSet, setRequiredFieldsNotSet] = useState({
    title: false,
    description: false,
    date: false,
    reward: false,
  });

  const { mode } = useTheme();

  const isEmpty = (fieldName: string, value: any) => {
    switch (fieldName) {
      case "title":
      case "description":
      case "dueDate":
      case "reward":
        return !value;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (form.properties[propertyName]?.rewardOptions && selectedChain) {
      const tokens = Object.entries(
        rewardOptions[selectedChain.value].tokenDetails
      ).map(([address, token]) => {
        return {
          label: token.symbol,
          value: address,
        };
      });
      setSelectedToken(tokens[0]);
      setTokenOptions(tokens);
    }
  }, [form.properties, propertyName, rewardOptions, selectedChain]);

  useEffect(() => {
    if (modalMode === "edit" && (milestoneIndex || milestoneIndex === 0)) {
      const milestone = data[propertyName][milestoneIndex];
      console.log(milestone.description);
      if (milestone) {
        setTitle(milestone.title);
        setDescription(milestone.description);
        setDate(milestone.dueDate);
        setSelectedChain(milestone.reward?.chain || selectedChain);
        setSelectedToken(milestone.reward?.token || selectedToken);
        setValue(milestone.reward?.value || "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={`Add Milestone`}
    >
      <Box
        padding={{
          xs: "2",
          md: "8",
        }}
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
          {requiredFieldsNotSet["title"] && (
            <Text color="red" variant="small">
              This is a required field and cannot be empty
            </Text>
          )}
          <Input
            label=""
            placeholder={`Enter Milestone Title`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setRequiredFieldsNotSet({
                ...requiredFieldsNotSet,
                title: isEmpty("title", e.target.value),
              });
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
          <Stack
            direction={{
              xs: "vertical",
              md: "horizontal",
            }}
          >
            <Box
              width={{
                xs: "full",
                md: "72",
              }}
              marginTop="2"
            >
              <Dropdown
                options={
                  form.properties[propertyName]?.rewardOptions
                    ? Object.entries(
                        form.properties[propertyName].rewardOptions as Registry
                      ).map(([chainId, network]) => {
                        return {
                          label: network.name,
                          value: chainId,
                        };
                      })
                    : []
                }
                selected={selectedChain}
                onChange={(option) => {
                  setSelectedChain(option);
                }}
                multiple={false}
                isClearable={false}
              />
            </Box>
            <Box
              width={{
                xs: "full",
                md: "72",
              }}
              marginTop="2"
            >
              <Dropdown
                options={tokenOptions}
                selected={selectedToken}
                onChange={(option) => {
                  setSelectedToken(option);
                }}
                multiple={false}
                isClearable={false}
              />
            </Box>
            <Box
              width={{
                xs: "full",
                md: "72",
              }}
            >
              <Input
                label=""
                placeholder={`Enter Reward Amount`}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                units={selectedToken.label}
                type="number"
              />
            </Box>
          </Stack>
        </Box>
        <Box>
          <Text variant="label">Due Date</Text>
          <Box
            width={{
              xs: "full",
              md: "56",
            }}
          >
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
              if (!title) {
                setRequiredFieldsNotSet({
                  ...requiredFieldsNotSet,
                  title: true,
                });
                return;
              }

              addMilestone({
                title,
                description,
                dueDate: date,
                reward: {
                  value: parseFloat(value),
                  token: selectedToken,
                  chain: selectedChain,
                },
              });
            }}
          >
            {modalMode === "create" ? "Add" : "Update"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
