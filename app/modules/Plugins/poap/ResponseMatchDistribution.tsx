import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Input, Text } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import { quizValidFieldTypes } from ".";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import PublicField from "../../PublicForm/PublicField";

export type Props = {
  setModalModal: (
    mode:
      | "createPoapFromScratch"
      | "importClaimCodes"
      | "distributePoapWhenResponsesMatch"
      | "distributePoapOnDiscordCallAttendance"
  ) => void;
  data: any;
  setData: (value: any) => void;
  minimumNumberOfAnswersThatNeedToMatch: number;
  setMinimumNumberOfAnswersThatNeedToMatch: (value: number) => void;
};

export default function ResponseMatchDistribution({
  setModalModal,
  data,
  setData,
  minimumNumberOfAnswersThatNeedToMatch,
  setMinimumNumberOfAnswersThatNeedToMatch,
}: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const validFields = collection.propertyOrder.filter(
    (propertyName) =>
      collection.properties[propertyName].isPartOfFormView &&
      quizValidFieldTypes.includes(collection.properties[propertyName].type)
  );

  const [minNumOfAnswers, setMinNumOfAnswers] = useState(
    minimumNumberOfAnswersThatNeedToMatch
  );
  const [localData, setLocalData] = useState(data);

  console.log({ localData, minNumOfAnswers });

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
              setModalModal("importClaimCodes");
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
              onChange={(e) => setMinNumOfAnswers(parseInt(e.target.value))}
              units={`/${validFields.length}`}
              max={validFields.length}
              min={0}
            />
          </Box>
        </Text>
      </Box>
      <Box>
        <Text variant="label">{"Pick Responses"}</Text>
        {!loading &&
          validFields &&
          validFields.map((propertyName) => {
            return (
              <PublicField
                form={collection}
                propertyName={propertyName}
                data={localData}
                setData={setLocalData}
                memberOptions={[]}
                requiredFieldsNotSet={{}}
                key={propertyName}
                updateRequiredFieldNotSet={() => {}}
                fieldHasInvalidType={{}}
                updateFieldHasInvalidType={() => {}}
                disabled={false}
                blockCustomValues={true}
              />
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
              setModalModal("importClaimCodes");
            }}
          >
            {"Back"}
          </PrimaryButton>
        </Box>
        <Box width={"1/2"}>
          <PrimaryButton
            variant="secondary"
            onClick={async () => {
              if (
                Object.keys(localData).length < Object.keys(validFields).length
              ) {
                toast.error("Please fill out all fields");
                return;
              }
              if (
                collection.formMetadata?.minimumNumberOfAnswersThatNeedToMatch >
                0
              ) {
                const res = await updateFormCollection(collection.id, {
                  formMetadata: {
                    ...collection.formMetadata,
                    minimumNumberOfAnswersThatNeedToMatch: minNumOfAnswers,
                    responseData: localData,
                    walletConnectionRequired: true,
                  },
                });
                updateCollection(res);
              }
              setMinimumNumberOfAnswersThatNeedToMatch(minNumOfAnswers);
              setData(localData);
              setModalModal("importClaimCodes");
            }}
          >
            {"Save"}
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
