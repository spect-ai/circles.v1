import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Input, Text } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import PublicField from "../../PublicForm/PublicField";

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
  const validFields = collection.propertyOrder.filter(
    (propertyName) =>
      collection.properties[propertyName].isPartOfFormView &&
      quizValidFieldTypes.includes(collection.properties[propertyName].type)
  );

  const [minNumOfAnswers, setMinNumOfAnswers] = useState(
    minimumNumberOfAnswersThatNeedToMatch
  );
  const [localData, setLocalData] = useState(data);

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
              onChange={(e) => {
                if (parseInt(e.target.value) > validFields.length) return;
                setMinNumOfAnswers(parseInt(e.target.value));
              }}
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
            variant="secondary"
            onClick={async () => {
              if (
                Object.keys(localData).length < Object.keys(validFields).length
              ) {
                toast.error("Please fill out all fields");
                return;
              }
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

                updateCollection(res);
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

                updateCollection(res);
              }
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
