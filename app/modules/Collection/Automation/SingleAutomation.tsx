import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Action, Option, Trigger } from "@/app/types";
import { DeleteOutlined } from "@ant-design/icons";
import { Box, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import SingleAction from "./Actions";
import SingleTrigger from "./Triggers";
import DataChange from "./Triggers/DataChange";

type Props = {
  automation: any;
};

export default function SingleAutomation({ automation }: Props) {
  const { mode } = useTheme();

  const { localCollection: collection } = useLocalCollection();
  const [whenOptions, setWhenOptions] = useState<Option[]>([]);
  const [thenOptions, setThenOptions] = useState<Option[]>([]);
  const [selectedWhenOption, setSelectedWhenOption] = useState({} as Option);
  const [selectedThenOptions, setSelectedThenOptions] = useState(
    [] as Option[]
  );
  const [trigger, setTrigger] = useState({} as Trigger);
  const [actions, setActions] = useState([] as Action[]);
  const [allPossibleActions, setAllPossibleActions] = useState({
    createCard: {
      id: "createCard",
      name: "Create Card",
      service: "project",
      type: "createCard",
      data: {},
    },
    createDiscordChannel: {
      id: "createDiscordChannel",
      name: "Create Discord Channel",
      service: "discord",
      type: "createDiscordChannel",
      data: {},
    },
    giveRole: {
      id: "giveRole",
      name: "Give Role",
      service: "circle",
      type: "giveRole",
      data: {},
    },
    sendEmail: {
      id: "sendEmail",
      name: "Send Email",
      service: "email",
      type: "sendEmail",
      data: {},
    },
  } as { [id: string]: Action });

  useEffect(() => {
    const whenOptions = Object.entries(collection.properties)
      .filter((p) => p[1].type === "singleSelect")
      .map((p) => ({
        label: `${p[1].name} changes`,
        value: "dataChange",
        data: {
          fieldName: p[0],
          fieldType: p[1].type,
        },
      }));
    setWhenOptions(whenOptions);

    const thenOptions = Object.entries(allPossibleActions).map((a) => ({
      label: a[1].name,
      value: a[0],
    }));
    setThenOptions(thenOptions);
  }, []);

  console.log({ trigger });
  console.log({ actions });

  return (
    <Box>
      <Box marginTop="4">
        <Text variant="large" weight="semiBold">
          When
        </Text>
        <AutomationCard mode={mode}>
          <Box width="full">
            <Dropdown
              options={whenOptions}
              selected={selectedWhenOption}
              onChange={(value) => {
                setTrigger({
                  id: value.value,
                  type: value.value,
                  name: value.label,
                  data: value.data,
                  service: "collection",
                });
                setSelectedWhenOption(value);
              }}
              multiple={false}
              isClearable={false}
            />
          </Box>
          {selectedWhenOption && (
            <SingleTrigger
              triggerMode="edit"
              triggerType={selectedWhenOption.value}
              trigger={trigger}
              setTrigger={(trig) => setTrigger(trig)}
            />
          )}{" "}
        </AutomationCard>
      </Box>
      <Box marginTop="4">
        <Text variant="large" weight="semiBold">
          Then
        </Text>
        {actions.map((action, index) => (
          <AutomationCard mode={mode} key={index} onClick={() => {}}>
            <Box width="full">
              <Dropdown
                options={thenOptions}
                selected={selectedThenOptions[index]}
                onChange={(value) => {
                  const newActions = [...actions];
                  newActions[index] = allPossibleActions[value.value];
                  setActions(newActions);
                  const newSelectedThenOptions = [...selectedThenOptions];
                  newSelectedThenOptions[index] = value;
                  setSelectedThenOptions(newSelectedThenOptions);
                }}
                multiple={false}
                isClearable={false}
                placeholder={`Add action`}
              />
              )
            </Box>
            <SingleAction
              actionType={selectedThenOptions[index].value}
              action={action}
              setAction={(action) => {
                const newActions = [...actions];
                newActions[index] = action;
                setActions(newActions);
                console.log({ actions });
              }}
              actionMode="edit"
            />
            <Box
              width="full"
              marginTop="4"
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
            >
              <PrimaryButton
                variant="tertiary"
                onClick={() => {
                  const newActions = [...actions];
                  newActions.splice(index, 1);
                  setActions(newActions);
                  const newSelectedThenOptions = [...selectedThenOptions];
                  newSelectedThenOptions.splice(index, 1);
                  setSelectedThenOptions(newSelectedThenOptions);
                }}
              >
                Remove
              </PrimaryButton>
            </Box>
          </AutomationCard>
        ))}
        <Box
          style={{
            width: "80%",
          }}
          marginTop="4"
        >
          <PrimaryButton
            variant="tertiary"
            onClick={() => {
              setActions([
                ...actions,
                allPossibleActions[thenOptions[0].value],
              ]);
              setSelectedThenOptions([...selectedThenOptions, thenOptions[0]]);
            }}
          >
            Add Action
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}

const AutomationCard = styled(Box)<{
  mode: string;
  width?: string;
  height?: string;
}>`
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    margin: 0;
    height: 55vh;
    margin-top: 0.5rem;
    align-items: flex-start;
  }

  width: 80%;
  height: ${(props) => props.height || "auto"};
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0px 1px 6px
    ${(props) =>
      props.mode === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.1)"};
  &:hover {
    box-shadow: 0px 3px 10px
      ${(props) =>
        props.mode === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.25)"};
    transition-duration: 0.7s;
  }
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  align-items: flex-start;
  position: relative;
  transition: all 0.5s ease-in-out;
  cursor: pointer;
`;
