import Dropdown from "@/app/common/components/Dropdown";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import {
  addAutomation,
  removeAutomation,
  updateAutomation,
} from "@/app/services/UpdateCircle";
import {
  Action,
  CollectionType,
  Condition,
  ConditionGroup,
  Option,
  Trigger,
} from "@/app/types";
import { Box, IconPlusSmall, Stack, Text, useTheme } from "degen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Table } from "react-feather";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import { getViewIcon } from "../../CollectionProject/Heading";
import AddConditions from "../Common/AddConditions";
import { automationActionOptions } from "../Constants";
import SingleAction from "./Actions";
import SingleTrigger from "./Triggers";
import { getAutomationActionOptions } from "./utils";
import { validateActions } from "./Validation/ActionValidations";
import { validateConditions } from "./Validation/ConditionValidations";
import { validateTrigger } from "./Validation/TriggerValidations";
import { logError } from "@/app/common/utils/utils";
import AddAdvancedConditions from "../Common/AddAdvancedConditions";

type Props = {
  automation: any;
  automationMode: string;
  handleClose: () => void;
};

export default function SingleAutomation({
  automation,
  automationMode,
  handleClose,
}: Props) {
  const { mode } = useTheme();
  const { circle, setCircleData, fetchCircle } = useCircle();
  const router = useRouter();
  const [whenOptions, setWhenOptions] = useState<Option[]>([]);
  const [collection, setCollection] = useState({} as CollectionType);
  const [collectionOption, setCollectionOption] = useState<Option>(
    {} as Option
  );
  const [selectedWhenOption, setSelectedWhenOption] = useState({} as Option);
  const [selectedThenOptions, setSelectedThenOptions] = useState(
    [] as Option[]
  );

  const [trigger, setTrigger] = useState({} as Trigger);
  const [actions, setActions] = useState([] as Action[]);
  const [advancedConditions, setAdvancedConditions] = useState<ConditionGroup>(
    {} as ConditionGroup
  );
  const [name, setName] = useState(automation?.name || "");
  const [description, setDescription] = useState(automation?.description || "");
  const [actionValidationResults, setActionValidationResults] = useState({
    isValid: true,
    message: "",
    invalidActions: {},
  });
  const [nameValidationResults, setNameValidationResults] = useState({
    isValid: true,
    message: "",
  });
  const [
    collectionOptionValidationResults,
    setCollectionOptionValidationResults,
  ] = useState({
    isValid: true,
    message: "",
  });
  const [triggerValidationResults, setTriggerValidationResults] = useState({
    isValid: true,
    message: "",
  });
  const [saving, setSaving] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const collectionOptions = Object.values(circle?.collections || {}).map(
    (c) => ({
      label: c.name,
      value: c.id,
      icon: c.viewType ? (
        <Text color="textSecondary"> {getViewIcon(c.viewType || "")} </Text>
      ) : (
        <Text color="inherit">
          {" "}
          <Table size={18} style={{ marginTop: 4 }} />
        </Text>
      ),
    })
  );

  const onDisable = async () => {
    if (!circle) return;
    const res = await updateAutomation(circle.id as string, automation.id, {
      ...circle.automations[automation.id],
      disabled: !circle.automations[automation.id].disabled,
    });
    if (res) setCircleData(res);
  };

  const onSave = async (
    name: string,
    description: string,
    trigger: Trigger,
    actions: Action[],
    advancedConditions: ConditionGroup,
    slug: string
  ) => {
    if (!circle) return;
    const newAutomation = {
      name,
      description,
      trigger,
      actions,
      advancedConditions,
    };
    let res;
    if (automationMode === "create") {
      res = await addAutomation(circle?.id, {
        ...newAutomation,
        triggerCategory: "collection",
        triggerCollectionSlug: slug,
      });
      console.log({ res });
    } else {
      res = await updateAutomation(circle?.id, automation.id, newAutomation);
    }
    if (res) {
      void fetchCircle();
      handleClose();
    }
  };

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
      const paymentOptions =
        (collection as CollectionType)?.collectionType === 0
          ? []
          : [
              {
                label: "Payment is Completed for a card",
                value: "completedPayment",
              },
              {
                label: "Payment is Cancelled for a card",
                value: "cancelledPayment",
              },
            ];
      setWhenOptions([
        ...whenOptions,
        {
          label:
            (collection as CollectionType)?.collectionType === 0
              ? "New Response is added"
              : "New Card is added",
          value: "newData",
        },
        ...paymentOptions,
      ]);

      if (automation) {
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
        setAdvancedConditions(automation.advancedConditions || {});
      }
    }
  }, [automation, collection, collectionOption]);

  useEffect(() => {
    if (collectionOption?.value)
      fetchCollection()
        .then((res) => {
          if (res.data) {
            setCollection(res.data);
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong while fetching collection");
        });
  }, [actions, trigger, advancedConditions, name, collectionOption]);

  useEffect(() => {
    setName(automation?.name || "");
    setDescription(automation?.description || "");
    const collection = Object.values(circle?.collections || {}).find(
      (c) => c.slug === automation.triggerCollectionSlug
    );
    setCollectionOption({
      label: collection?.name || "",
      value: collection?.id || "",
    });
  }, [automation]);

  return (
    <Box>
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
        flexDirection={{
          xs: "column",
          lg: "row",
        }}
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
          {!nameValidationResults.isValid && (
            <Text color="red">{nameValidationResults.message}</Text>
          )}
          <NameInput
            placeholder="Enter name"
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <DescriptionInput
            placeholder="Enter Description"
            mode={mode}
            autoFocus
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Box>

        <PrimaryButton
          variant="secondary"
          loading={saving}
          onClick={async () => {
            try {
              setSaving(true);
              if (!name?.trim().length) {
                setNameValidationResults({
                  isValid: false,
                  message: "Name is required",
                });
                return;
              } else {
                setNameValidationResults({
                  isValid: true,
                  message: "",
                });
              }

              if (!collectionOption?.value) {
                setCollectionOptionValidationResults({
                  isValid: false,
                  message: "Project or Form is required",
                });
                return;
              } else {
                setCollectionOptionValidationResults({
                  isValid: true,
                  message: "",
                });
              }

              const triggerValidationResults = validateTrigger(trigger);
              setTriggerValidationResults(triggerValidationResults);
              if (!triggerValidationResults.isValid) return;

              const actionValidationResults = validateActions(actions);
              setActionValidationResults(actionValidationResults);
              if (!actionValidationResults.isValid) return;

              await onSave(
                name,
                description,
                trigger,
                actions,
                advancedConditions,
                (collection as CollectionType)?.slug
              );
              setSaving(false);
            } catch (err) {
              console.error(err);
              logError("Something went wrong while saving automation");
            } finally {
              setSaving(false);
            }
          }}
        >
          Save
        </PrimaryButton>
        {automationMode === "edit" && (
          <PrimaryButton
            variant="tertiary"
            loading={disabling}
            onClick={async () => {
              try {
                setDisabling(true);
                const res = await onDisable();
                setDisabling(false);
              } catch (err) {
                console.error(err);
                logError("Something went wrong while disabling automation");
              } finally {
                setDisabling(false);
              }
            }}
          >
            {automation.disabled ? "Enable" : "Disable"}
          </PrimaryButton>
        )}
        {automationMode === "edit" && (
          <PrimaryButton
            variant="tertiary"
            loading={deleting}
            onClick={async () => {
              setDeleting(true);
              try {
                const res = await removeAutomation(
                  automation.id,
                  circle?.id as string
                );
                if (res) {
                  void fetchCircle();
                }
                setDeleting(false);

                router.push({
                  pathname: router.pathname,
                  query: {
                    circle: router.query.circle,
                    tab: "automation",
                  },
                });
              } catch (err) {
                console.error(err);
                logError("Something went wrong while deleting automation");
              } finally {
                setDeleting(false);
              }
            }}
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
          <Text variant="base" weight="semiBold" color="accent">
            Select Project Or Form
          </Text>
          <AutomationCard mode={mode} backgroundColor="foregroundTertiary">
            <Box
              width="full"
              onClick={() => {
                if (automationMode === "edit")
                  toast.error(
                    "Cannot edit the project or form field for already existing automations. Please create a new automation."
                  );
              }}
            >
              <Dropdown
                options={collectionOptions}
                selected={collectionOption}
                onChange={(value) => {
                  setCollectionOption(value);

                  fetchCollection();
                }}
                multiple={false}
                isClearable={false}
                disabled={automationMode === "edit"}
              />
              {!collectionOptionValidationResults.isValid && (
                <Box marginTop="4">
                  <Text color="red">
                    {collectionOptionValidationResults.message}
                  </Text>
                </Box>
              )}
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
                <Text variant="base" weight="semiBold" color="accent">
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
                      }}
                      multiple={false}
                      isClearable={false}
                      portal={false}
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
                      }}
                      triggerValidationResults={triggerValidationResults}
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
                <Text variant="base" weight="semiBold" color="accent">
                  Then
                </Text>
                {actionValidationResults?.isValid === false && (
                  <Text color="red">{actionValidationResults?.message}</Text>
                )}
                <Stack>
                  {actions.map((action, index) => (
                    <AutomationCard
                      mode={mode}
                      key={index}
                      backgroundColor="foregroundTertiary"
                    >
                      <Box width="full">
                        <Dropdown
                          options={getAutomationActionOptions(
                            collection,
                            selectedWhenOption
                          )}
                          selected={selectedThenOptions[index]}
                          onChange={(action: any) => {
                            const newActions = [...actions];
                            newActions[index] = action;
                            setActions(newActions);

                            const newSelectedThenOptions = [
                              ...selectedThenOptions,
                            ];
                            newSelectedThenOptions[index] = action;
                            setSelectedThenOptions(newSelectedThenOptions);
                          }}
                          multiple={false}
                          isClearable={false}
                          portal={false}
                        />
                      </Box>
                      <SingleAction
                        actionType={selectedThenOptions[index]?.value}
                        action={action}
                        setAction={(action) => {
                          const newActions = [...actions];
                          newActions[index] = action;
                          setActions(newActions);
                        }}
                        actionMode="edit"
                        collection={collection}
                        invalidActions={
                          actionValidationResults?.invalidActions || {}
                        }
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
                          }}
                        >
                          Remove Action
                        </PrimaryButton>
                      </Box>
                    </AutomationCard>
                  ))}
                </Stack>
                <Box width="64" marginTop="4">
                  <PrimaryButton
                    variant="tertiary"
                    icon={<IconPlusSmall />}
                    onClick={() => {
                      setActions([
                        ...actions,
                        automationActionOptions[0].options[0] as Action,
                      ]);
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
                width="full"
              >
                <Text variant="base" weight="semiBold" color="accent">
                  Only
                </Text>
                {/* <AddConditions
                  viewConditions={conditions}
                  setViewConditions={(conditions) => {
                    setConditions(conditions);
                  }}
                  firstRowMessage="It is true that"
                  buttonText="Add Condition"
                  collection={collection}
                  dropDownPortal={false}
                /> */}
                <AddAdvancedConditions
                  rootConditionGroup={advancedConditions}
                  setRootConditionGroup={(conditions) => {
                    console.log(conditions);
                    setAdvancedConditions(conditions);
                  }}
                  firstRowMessage="When"
                  buttonText="Add Condition"
                  groupButtonText="Group Conditions"
                  collection={collection}
                  dropDownPortal={false}
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
  @media (max-width: 1420px) {
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

const ScrollContainer = styled(Box)<{}>`
  ::-webkit-scrollbar {
    width: 5px;
  }

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
  font-size: 1.4rem;
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
