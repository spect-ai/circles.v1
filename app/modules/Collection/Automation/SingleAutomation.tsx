import Dropdown from "@/app/common/components/Dropdown";
import Modal from "@/app/common/components/Modal";
import { Action, Option } from "@/app/types";
import { Box, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import SingleAction from "./Actions";

type Props = {
  automation: any;
};

export default function SingleAutomation({ automation }: Props) {
  const { mode } = useTheme();

  const { localCollection: collection } = useLocalCollection();
  const [whenOptions, setWhenOptions] = useState<Option[]>([]);
  const [thenOptions, setThenOptions] = useState<Option[]>([]);
  const [options, setOptions] = useState([] as Option[]);
  const [selectedWhenOption, setSelectedWhenOption] = useState({} as Option);
  const [selectedThenOption, setSelectedThenOption] = useState({} as Option);
  const [selectedFromOption, setSelectedFromOption] = useState([] as Option[]);
  const [selectedToOption, setSelectedToOption] = useState([] as Option[]);
  const [actions, setActions] = useState([] as Action[]);
  const [openActionIndex, setOpenActionIndex] = useState(-1);
  const [allPossibleActions, setAllPossibleActions] = useState({
    createCard: {
      id: "createCard",
      name: "Create Card",
      service: "project",
      type: "internal",
      data: {},
    },
    createDiscordChannel: {
      id: "createDiscordChannel",
      name: "Create Discord Channel",
      service: "discord",
      type: "external",
      data: {},
    },
    giveRole: {
      id: "giveRole",
      name: "Give Role",
      service: "circle",
      type: "internal",
      data: {},
    },
    sendEmail: {
      id: "sendEmail",
      name: "Send Email",
      service: "email",
      type: "external",
      data: {},
    },
  } as { [id: string]: Action });

  useEffect(() => {
    const whenOptions = Object.entries(collection.properties)
      .filter((p) => p[1].type === "singleSelect")
      .map((p) => ({
        label: `${p[1].name} changes`,
        value: p[0],
      }));
    setWhenOptions(whenOptions);

    const thenOptions = Object.entries(allPossibleActions).map((a) => ({
      label: a[1].name,
      value: a[0],
    }));
    setThenOptions(thenOptions);
  }, []);

  useEffect(() => {
    if (
      selectedWhenOption &&
      collection.properties[selectedWhenOption?.value] &&
      collection.properties[selectedWhenOption.value].type
    ) {
      setOptions(
        collection.properties[selectedWhenOption?.value].options || []
      );
    }
  }, [selectedWhenOption]);

  return (
    <Box>
      <Text variant="label">{automation.name}</Text>
      <Text variant="small">{automation.description}</Text>

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
                setSelectedWhenOption(value);
              }}
              multiple={false}
              isClearable={false}
            />
          </Box>
          {selectedWhenOption &&
            collection.properties[selectedWhenOption?.value] &&
            collection.properties[selectedWhenOption.value].type ===
              "singleSelect" && (
              <>
                <Box
                  display="flex"
                  flexDirection="row"
                  gap="2"
                  width="full"
                  alignItems="center"
                  marginTop="2"
                  marginBottom="2"
                >
                  <Box width="1/4">
                    <Text variant="label">From</Text>
                  </Box>
                  <Dropdown
                    options={options}
                    selected={selectedFromOption}
                    onChange={(value) => {
                      setSelectedFromOption(value);
                    }}
                    multiple={true}
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="row"
                  gap="2"
                  width="full"
                  alignItems="center"
                >
                  <Box width="1/4">
                    <Text variant="label">To</Text>
                  </Box>{" "}
                  <Dropdown
                    options={options}
                    selected={selectedToOption}
                    onChange={(value) => {
                      setSelectedToOption(value);
                    }}
                    multiple={true}
                  />{" "}
                </Box>
              </>
            )}
        </AutomationCard>
      </Box>
      <Box marginTop="4">
        <Text variant="large" weight="semiBold">
          Then
        </Text>
        {actions.map((action, index) => (
          <AutomationCard
            mode={mode}
            key={index}
            width={
              openActionIndex === index && action.id === "sendEmail"
                ? "full"
                : undefined
            }
            height={
              openActionIndex === index && action.id === "sendEmail"
                ? "48"
                : undefined
            }
            onClick={() => {
              setSelectedThenOption({
                label: action.name,
                value: action.id,
              });
              setOpenActionIndex(index);
            }}
          >
            <Box width="full">
              {openActionIndex === index ? (
                <Dropdown
                  options={thenOptions}
                  selected={selectedThenOption}
                  onChange={(value) => {
                    setSelectedThenOption(value);
                  }}
                  multiple={false}
                  isClearable={false}
                  placeholder={`Add action`}
                />
              ) : (
                <Text variant="base">{action.name}</Text>
              )}
            </Box>
            {openActionIndex === index && (
              <SingleAction
                actionId={selectedThenOption.value}
                action={action}
                setAction={(action) => {
                  const newActions = [...actions];
                  newActions[index] = action;
                  setActions(newActions);
                  console.log({ actions });
                }}
                actionMode="edit"
              />
            )}
          </AutomationCard>
        ))}
        <AutomationCard mode={mode} marginTop="4">
          <Box width="full">
            <Dropdown
              options={thenOptions}
              selected={{ label: "Add action", value: "" }}
              onChange={(value) => {
                setActions([...actions, allPossibleActions[value.value]]);
                setSelectedThenOption(value);
                setOpenActionIndex(actions.length);
              }}
              multiple={false}
              isClearable={false}
              placeholder={`Add action`}
            />
          </Box>
        </AutomationCard>
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

  width: ${(props) => props.width || "18vw"};
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
