import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  Action,
  CollectionType,
  Condition,
  Option,
  Trigger,
} from "@/app/types";
import { Box, Stack, Text, useTheme } from "degen";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import AddConditions from "../Common/AddConditions";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import SingleAction from "./Actions";
import SingleTrigger from "./Triggers";
import { validateActions } from "./Validation/ActionValidations";
import { validateConditions } from "./Validation/ConditionValidations";
import { validateTrigger } from "./Validation/TriggerValidations";

type Props = {
  automation: any;
  automationMode: string;
  onDelete: (automationId: string) => void;
  handleClose: () => void;
  onSave: (
    name: string,
    description: string,
    trigger: Trigger,
    action: Action[],
    conditions: Condition[],
    slug: string
  ) => void;
  onDisable: (automationId: string) => void;
  onMouseLeave: (
    name: string,
    description: string,
    trigger: Trigger,
    action: Action[],
    conditions: Condition[],
    isDirty: boolean
  ) => void;
};

export default function SingleAutomation({
  automation,
  automationMode,
  onDelete,
  onSave,
  onDisable,
  handleClose,
  onMouseLeave,
}: Props) {
  const { mode } = useTheme();
  const { localCircle: circle } = useCircle();
  // const { localCollection: collection } = useLocalCollection();
  const [whenOptions, setWhenOptions] = useState<Option[]>([]);
  const [collection, setCollection] = useState({} as CollectionType);
  const [thenOptions, setThenOptions] = useState<Option[]>([]);
  const [collectionOption, setCollectionOption] = useState<Option>(
    {} as Option
  );
  const [selectedWhenOption, setSelectedWhenOption] = useState({} as Option);
  const [selectedThenOptions, setSelectedThenOptions] = useState(
    [] as Option[]
  );
  const [trigger, setTrigger] = useState({} as Trigger);
  const [actions, setActions] = useState([] as Action[]);
  const [conditions, setConditions] = useState([] as Condition[]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [allPossibleActions, setAllPossibleActions] = useState({
    createCard: {
      id: "createCard",
      name: "Create Card",
      service: "collection",
      type: "createCard",
      data: {},
    },
    giveRole: {
      id: "giveRole",
      name: "Give Circle Role",
      service: "circle",
      type: "giveRole",
      data: {},
    },
    giveDiscordRole: {
      id: "giveDiscordRole",
      name: "Give Discord Role",
      service: "circle",
      type: "giveDiscordRole",
      data: {},
    },
    createDiscordChannel: {
      id: "createDiscordChannel",
      name: "Create Discord Channel",
      service: "discord",
      type: "createDiscordChannel",
      data: {},
    },
    sendEmail: {
      id: "sendEmail",
      name: "Send Email",
      service: "email",
      type: "sendEmail",
      data: {},
    },
    startVotingPeriod: {
      id: "startVotingPeriod",
      name: "Start Voting Period",
      service: "collection",
      type: "startVotingPeriod",
      data: {},
    },
  } as { [id: string]: Action });
  const [canSave, setCanSave] = useState(false);

  const collectionOptions = Object.values(circle.collections).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const { refetch: fetchCollection } = useQuery<CollectionType>(
    ["collection", collectionOption.value],
    () =>
      fetch(
        `${process.env.API_HOST}/collection/v1/${
          collectionOption.value as string
        }`,
        {
          credentials: "include",
        }
      ).then((res) => {
        if (res.status === 403) return { unauthorized: true };
        return res.json();
      }),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (collection?.id) {
      const whenOptions = Object.entries(
        (collection as CollectionType)?.properties
      )
        .filter((p) => p[1].type === "singleSelect")
        .map((p) => ({
          label: `"${p[1].name}" changes`,
          value: "dataChange",
          data: {
            fieldName: p[0],
            fieldType: p[1].type,
          },
        }));
      setWhenOptions([
        ...whenOptions,
        {
          label:
            (collection as CollectionType)?.collectionType === 0
              ? "New Response is added"
              : "New Card is added",
          value: "newData",
        },
      ]);

      const thenOptions = Object.entries(allPossibleActions)
        .filter((a) =>
          collection?.voting?.enabled ? true : a[0] !== "startVotingPeriod"
        )
        .map((a) => ({
          label: a[1].name,
          value: a[0],
        }));
      setThenOptions(thenOptions);
      if (automation) {
        setName(automation.name);
        setDescription(automation.description);
        const selectedWhenOption = whenOptions.find(
          (o) => o.data.fieldName === automation.trigger?.data?.fieldName
        ) as Option;
        setSelectedWhenOption(
          selectedWhenOption || {
            label: automation.trigger?.name || "Select trigger",
            value: automation.trigger?.type || "selectTrigger",
          }
        );
        setSelectedThenOptions(
          automation.actions.map((a: Action) => ({
            label: a.name,
            value: a.id,
          }))
        );
        setTrigger(automation.trigger);
        setActions(automation.actions);
        setConditions(automation.conditions || []);
      }
    }
  }, [automation, collection, collectionOption]);

  useEffect(() => {
    fetchCollection()
      .then((res) => {
        if (res.data) {
          setCollection(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong", {
          theme: "dark",
        });
      });
    setCanSave(
      validateActions(actions) &&
        validateTrigger(trigger) &&
        validateConditions(conditions) &&
        name !== ""
    );
  }, [actions, trigger, conditions, name, collectionOption]);

  useEffect(() => {
    const collection = Object.values(circle.collections).find(
      (c) => c.slug === automation.triggerCollectionSlug
    );
    setCollectionOption({
      label: collection?.name || "Select collection",
      value: collection?.id || "selectCollection",
    });
  }, []);

  console.log("automation", automation);

  return (
    <Box
      onMouseLeave={() =>
        onMouseLeave(name, description, trigger, actions, conditions, isDirty)
      }
    >
      {automation?.disabled && (
        <Box
          display="flex"
          flexDirection="row"
          gap="1"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Text variant="small">This automation is disabled</Text>
        </Box>
      )}
      <Box
        display="flex"
        flexDirection="row"
        width="full"
        gap="2"
        marginTop="2"
      >
        <Box
          display="flex"
          flexDirection="column"
          gap="1"
          justifyContent="flex-start"
          alignItems="flex-start"
          style={{ width: "80%" }}
        >
          <NameInput
            placeholder="Enter name"
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setIsDirty(true);
            }}
          />
          <DescriptionInput
            placeholder="Enter Description"
            mode={mode}
            autoFocus
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setIsDirty(true);
            }}
          />
        </Box>

        <PrimaryButton
          variant="secondary"
          onClick={() => {
            onSave(
              name,
              description,
              trigger,
              actions,
              conditions,
              (collection as CollectionType)?.slug
            );
            if (automationMode === "create") handleClose();
            setIsDirty(false);
          }}
          disabled={!canSave || !isDirty}
        >
          Save
        </PrimaryButton>
        {automationMode === "edit" && (
          <PrimaryButton
            variant="tertiary"
            onClick={() => onDisable(automation.id)}
          >
            {automation.disabled ? "Enable" : "Disable"}
          </PrimaryButton>
        )}
        {automationMode === "edit" && (
          <PrimaryButton
            variant="tertiary"
            onClick={() => onDelete(automation.id)}
          >
            Delete
          </PrimaryButton>
        )}
      </Box>
      <ScrollContainer
        width="full"
        paddingRight={{
          xs: "2",
          md: "4",
          lg: "8",
        }}
        paddingY="4"
      >
        <Box>
          <Text variant="large" weight="semiBold" color="accent">
            Select Project Or Form
          </Text>
          <AutomationCard mode={mode} backgroundColor="foregroundTertiary">
            <Box width="full">
              <Dropdown
                options={collectionOptions}
                selected={collectionOption}
                onChange={(value) => {
                  setCollectionOption(value);
                  setIsDirty(true);
                  fetchCollection();
                }}
                multiple={false}
                isClearable={false}
              />
            </Box>
          </AutomationCard>

          {collection?.id && (
            <Box>
              <Box
                marginTop={{
                  xs: "2",
                  md: "4",
                }}
              >
                <Text variant="large" weight="semiBold" color="accent">
                  When
                </Text>
                <AutomationCard
                  mode={mode}
                  backgroundColor="foregroundTertiary"
                >
                  <Box width="full">
                    <Dropdown
                      options={whenOptions}
                      selected={selectedWhenOption}
                      onChange={(value) => {
                        let subType;
                        if (value.value === "dataChange") {
                          subType = value.data.fieldType;
                        }
                        setTrigger({
                          id: value.value,
                          type: value.value,
                          subType,
                          name: value.label,
                          data: value.data,
                          service: "collection",
                        });
                        setSelectedWhenOption(value);
                        setIsDirty(true);
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
                      collection={collection}
                      setTrigger={(trig) => {
                        setTrigger(trig);
                        setIsDirty(true);
                      }}
                    />
                  )}{" "}
                </AutomationCard>
              </Box>

              <Box
                marginTop={{
                  xs: "2",
                  md: "4",
                }}
              >
                <Text variant="large" weight="semiBold" color="accent">
                  Then
                </Text>
                <Stack>
                  {actions.map((action, index) => (
                    <AutomationCard
                      mode={mode}
                      key={index}
                      backgroundColor="foregroundTertiary"
                    >
                      <Box width="full">
                        <Dropdown
                          options={thenOptions}
                          selected={selectedThenOptions[index]}
                          onChange={(value) => {
                            const newActions = [...actions];
                            newActions[index] = allPossibleActions[value.value];
                            setActions(newActions);
                            const newSelectedThenOptions = [
                              ...selectedThenOptions,
                            ];
                            newSelectedThenOptions[index] = value;
                            setSelectedThenOptions(newSelectedThenOptions);
                            setIsDirty(true);
                          }}
                          multiple={false}
                          isClearable={false}
                          placeholder={`Add action`}
                        />
                      </Box>
                      <SingleAction
                        actionType={selectedThenOptions[index].value}
                        action={action}
                        setAction={(action) => {
                          const newActions = [...actions];
                          newActions[index] = action;
                          setActions(newActions);
                          setIsDirty(true);
                        }}
                        actionMode="edit"
                        collection={collection}
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
                            const newSelectedThenOptions = [
                              ...selectedThenOptions,
                            ];
                            newSelectedThenOptions.splice(index, 1);
                            setSelectedThenOptions(newSelectedThenOptions);

                            setIsDirty(true);
                          }}
                        >
                          Remove Action
                        </PrimaryButton>
                      </Box>
                    </AutomationCard>
                  ))}
                </Stack>
                <Box
                  style={{
                    width: "80%",
                  }}
                  marginTop={{
                    xs: "0",
                    md: "4",
                  }}
                >
                  <PrimaryButton
                    variant="tertiary"
                    onClick={() => {
                      setActions([
                        ...actions,
                        allPossibleActions[thenOptions[0].value],
                      ]);
                      setSelectedThenOptions([
                        ...selectedThenOptions,
                        thenOptions[0],
                      ]);
                      setIsDirty(true);
                    }}
                  >
                    Add Action
                  </PrimaryButton>
                </Box>
              </Box>
              <Box
                marginTop={{
                  xs: "4",
                  md: "8",
                }}
              >
                <Text variant="large" weight="semiBold" color="accent">
                  Only If
                </Text>
                <AddConditions
                  viewConditions={conditions}
                  setViewConditions={(conditions) => {
                    setConditions(conditions);
                    setIsDirty(true);
                  }}
                  firstRowMessage="It is true that"
                  buttonText="Add Condition"
                  collection={collection}
                />
              </Box>
            </Box>
          )}
        </Box>
      </ScrollContainer>
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
    padding: 0.5rem;
    margin: 0;
    height: auto;
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
`;

const ScrollContainer = styled(Box)`
  ::-webkit-scrollbar {
    width: 5px;
  }
  @media (max-width: 768px) {
    height: 25rem;
  }
  height: 28.5rem;
  overflow-y: auto;
`;

export const NameInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
`;

export const DescriptionInput = styled.input<{ mode: string }>`
  width: 100%;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.2rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
`;
