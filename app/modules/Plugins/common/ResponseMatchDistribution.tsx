import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Input, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import PublicField from "../../PublicForm/Fields/PublicField";
import { logError } from "@/app/common/utils/utils";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { satisfiesAdvancedConditions } from "../../Collection/Common/SatisfiesAdvancedFilter";
import { ConditionGroup } from "@/app/types";

export type Props = {
  setModalModal: (mode: string) => void;
  data: any;
  setData: (value: any) => void;
  minimumNumberOfAnswersThatNeedToMatch: number;
  setMinimumNumberOfAnswersThatNeedToMatch: (value: number) => void;
  responseMatchConditionForPlugin: "poap" | "mintkudos" | "erc20";
};

export const quizValidFieldTypes = [
  "singleSelect",
  "multiSelect",
  "number",
  "date",
];
export default function ResponseMatchDistribution({
  setModalModal,
  data,
  setData,
  minimumNumberOfAnswersThatNeedToMatch,
  setMinimumNumberOfAnswersThatNeedToMatch,
  responseMatchConditionForPlugin,
}: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [validFields, setValidFields] = useState([] as string[]);

  const [minNumOfAnswers, setMinNumOfAnswers] = useState(
    minimumNumberOfAnswersThatNeedToMatch
  );
  const [localData, setLocalData] = useState(data);
  const numQuestions = validFields.filter(
    (propertyId) => localData[propertyId] !== undefined
  ).length;

  useEffect(() => {
    if (minNumOfAnswers === 0 && validFields.length > 0) {
      setLocalData(
        validFields.reduce((acc, propertyId) => {
          if (
            ["number", "date"].includes(collection.properties[propertyId].type)
          ) {
            acc[propertyId] = "";
          } else if (
            collection.properties[propertyId].type === "singleSelect"
          ) {
            acc[propertyId] = {};
          } else if (collection.properties[propertyId].type === "multiSelect") {
            acc[propertyId] = [];
          }
          return acc;
        }, {} as Record<string, unknown>)
      );
      setMinNumOfAnswers(validFields.length);
    }
  }, [validFields]);

  useEffect(() => {
    setValidFields(
      collection.propertyOrder.filter(
        (propertyId) =>
          collection.properties[propertyId].isPartOfFormView &&
          quizValidFieldTypes.includes(
            collection.properties[propertyId].type
          ) &&
          satisfiesAdvancedConditions(
            localData,
            collection.properties,
            collection.properties[propertyId]
              .advancedConditions as ConditionGroup
          )
      )
    );
  }, [localData]);

  if (validFields.length === 0) {
    return (
      <Box display="flex" flexDirection="column" gap="4">
        <Text variant="large">
          {
            "No valid fields found. Please add at least one valid field to your form. Valid fields are: single select, multi select, date, and number."
          }
        </Text>
        <Box width={"1/2"}>
          <PrimaryButton
            variant="tertiary"
            onClick={() => {
              if (responseMatchConditionForPlugin === "poap") {
                setModalModal("importClaimCodes");
              } else if (responseMatchConditionForPlugin === "mintkudos") {
                setModalModal("createKudos");
              }
            }}
          >
            {"Back"}
          </PrimaryButton>
        </Box>
      </Box>
    );
  }
  return (
    <Box>
      <Box marginBottom="4">
        <Text variant="label">
          {"Minimum Number of Answers that Need to Match"}
          <Box
            width={{
              xs: "full",
              md: "1/2",
              lg: "1/3",
            }}
          >
            <Input
              label
              type="number"
              value={minNumOfAnswers}
              onChange={(e) => {
                if (parseInt(e.target.value) > numQuestions) return;
                setMinNumOfAnswers(parseInt(e.target.value));
              }}
              units={`/${numQuestions}`}
              max={numQuestions}
              min={1}
            />
          </Box>
        </Text>
      </Box>
      <Box>
        <Text variant="label">
          Pick the correct answers and select the questions you want to include
        </Text>
        {validFields &&
          validFields.map((propertyId) => {
            return (
              <Stack direction="horizontal">
                <Box marginTop="4">
                  <CheckBox
                    isChecked={localData[propertyId] !== undefined}
                    onClick={() => {
                      if (localData[propertyId] !== undefined) {
                        if (Object.keys(localData).length === 1) {
                          toast.error(
                            "You must have at least one answer selected"
                          );
                          return;
                        }
                        const newData = { ...localData };
                        delete newData[propertyId];
                        setLocalData(newData);
                        if (minNumOfAnswers > 1) {
                          setMinNumOfAnswers(minNumOfAnswers - 1);
                        }
                      } else {
                        if (
                          ["number", "date"].includes(
                            collection.properties[propertyId].type
                          )
                        ) {
                          setLocalData({
                            ...localData,
                            [propertyId]: "",
                          });
                        } else if (
                          collection.properties[propertyId].type ===
                          "singleSelect"
                        ) {
                          setLocalData({
                            ...localData,
                            [propertyId]: {},
                          });
                        } else if (
                          collection.properties[propertyId].type ===
                          "multiSelect"
                        ) {
                          setLocalData({
                            ...localData,
                            [propertyId]: [],
                          });
                        }
                      }
                    }}
                  />
                </Box>
                <PublicField
                  form={collection}
                  propertyId={propertyId}
                  data={localData}
                  setData={setLocalData}
                  memberOptions={[]}
                  requiredFieldsNotSet={{}}
                  key={propertyId}
                  updateRequiredFieldNotSet={() => {}}
                  fieldHasInvalidType={{}}
                  updateFieldHasInvalidType={() => {}}
                  disabled={false}
                  blockCustomValues={true}
                  hideDescription
                />
              </Stack>
            );
          })}
      </Box>
      <Box
        marginTop="4"
        display="flex"
        flexDirection="row"
        gap="2"
        width="full"
      >
        <Box width={"1/2"}>
          <PrimaryButton
            variant="tertiary"
            onClick={() => {
              if (responseMatchConditionForPlugin === "poap")
                setModalModal("importClaimCodes");
              else if (responseMatchConditionForPlugin === "mintkudos")
                setModalModal("createKudos");
            }}
          >
            {"Back"}
          </PrimaryButton>
        </Box>
        <Box width={"1/2"}>
          <PrimaryButton
            loading={loading}
            variant="secondary"
            onClick={async () => {
              if (minNumOfAnswers === 0 || isNaN(minNumOfAnswers)) {
                toast.error(
                  "Please set the minimum number of answers that need to match to a number greater than 0"
                );
                return;
              }
              if (
                Object.values(localData).filter((v) => {
                  // filter out empty strings and empty arrays and empty objects
                  if (typeof v === "string" && v.length === 0) return false;
                  if (Array.isArray(v) && v.length === 0) return false;
                  if (
                    typeof v === "object" &&
                    Object.entries(v || {}).length === 0
                  )
                    return false;
                  return Boolean(v);
                }).length < numQuestions
              ) {
                toast.error(
                  "Please fill out all the selected fields' correct answers"
                );
                return;
              }
              setLoading(true);
              if (
                responseMatchConditionForPlugin === "poap" &&
                collection.formMetadata?.poapEventId
              ) {
                const res = await updateFormCollection(collection.id, {
                  formMetadata: {
                    ...collection.formMetadata,
                    minimumNumberOfAnswersThatNeedToMatchForPoap:
                      minNumOfAnswers,
                    responseDataForPoap: localData,
                  },
                });
                if (res.id) {
                  updateCollection(res);
                } else {
                  logError("Error updating collection");
                }
              } else if (
                responseMatchConditionForPlugin === "mintkudos" &&
                collection.formMetadata?.mintkudosTokenId
              ) {
                const res = await updateFormCollection(collection.id, {
                  formMetadata: {
                    ...collection.formMetadata,
                    minimumNumberOfAnswersThatNeedToMatchForMintkudos:
                      minNumOfAnswers,
                    responseDataForMintkudos: localData,
                  },
                });
                if (res.id) {
                  updateCollection(res);
                } else {
                  logError("Error updating collection");
                }
              }
              setLoading(false);
              setMinimumNumberOfAnswersThatNeedToMatch(minNumOfAnswers);
              setData(localData);
              if (responseMatchConditionForPlugin === "poap")
                setModalModal("importClaimCodes");
              else if (responseMatchConditionForPlugin === "mintkudos")
                setModalModal("createKudos");
            }}
          >
            {"Save"}
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
