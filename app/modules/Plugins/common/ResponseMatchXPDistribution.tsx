import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { Box, Input, Stack, Text } from "degen";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import PublicField from "../../PublicForm/Fields/PublicField";
import { logError } from "@/app/common/utils/utils";
import { satisfiesAdvancedConditions } from "../../Collection/Common/SatisfiesAdvancedFilter";
import { ConditionGroup } from "@/app/types";

export type Props = {
  setModalModal: (mode: string) => void;
  data: any;
  setData: (value: any) => void;
  totalXp: number;
  setTotalXp: (value: number) => void;
  xp: { [key: string]: number };
  setXp: (value: { [key: string]: number }) => void;
};

export const quizValidFieldTypes = [
  "singleSelect",
  "multiSelect",
  "number",
  "date",
];
export default function ResponseMatchXPDistribution({
  setModalModal,
  data,
  setData,
  totalXp,
  setTotalXp,
  xp,
  setXp,
}: Props) {
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [validFields, setValidFields] = useState([] as string[]);

  const [localData, setLocalData] = useState(data);
  const numQuestions = validFields.filter(
    (propertyId) => localData[propertyId] !== undefined
  ).length;

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
              setModalModal("setXp");
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
        <Text variant="label">How much total XP do responders get?</Text>
        <Box
          width={{
            xs: "full",
            md: "1/2",
            lg: "1/3",
          }}
          onClick={() => {
            toast.info(
              "The total XP responders get is the sum of the XP they get for each correct answer. It is automatically calculated & cannot be changed."
            );
          }}
        >
          <Input
            label
            type="number"
            value={totalXp}
            disabled={true}
            units="XP"
          />
        </Box>
      </Box>
      <Box>
        <Text variant="label">
          Add XP for each field and set the correct answer
        </Text>
        {validFields &&
          validFields.map((propertyId) => {
            return (
              <Stack direction="horizontal" justify="space-between">
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
                <Box marginTop="4" width="24">
                  <Input
                    label
                    placeholder="Set"
                    type="number"
                    value={xp?.[propertyId]}
                    disabled={false}
                    units="XP"
                    onChange={(e) => {
                      const updatedXp = {
                        ...xp,
                        [propertyId]: parseInt(e.target.value) || 0,
                      };
                      setXp(updatedXp);
                      setTotalXp(
                        Object.values(updatedXp).reduce((a, b) => a + b, 0)
                      );
                    }}
                  />
                </Box>
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
              setModalModal("setXp");
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
              if (totalXp === 0 || isNaN(totalXp)) {
                toast.error("Total XP must be a number greater than 0");
                return;
              }
              const fieldsWithValidLocalData = {} as { [key: string]: boolean };
              for (const [propertyId, value] of Object.entries(
                localData || {}
              )) {
                console.log({ value });
                if (value === undefined) {
                  fieldsWithValidLocalData[propertyId] = false;
                } else if (
                  collection.properties[propertyId].type === "singleSelect" &&
                  !localData[propertyId]?.value
                ) {
                  fieldsWithValidLocalData[propertyId] = false;
                } else if (
                  collection.properties[propertyId].type === "multiSelect" &&
                  !localData[propertyId]?.length
                ) {
                  fieldsWithValidLocalData[propertyId] = false;
                } else if (
                  collection.properties[propertyId].type === "number" &&
                  !localData[propertyId] &&
                  localData[propertyId] !== 0
                ) {
                  fieldsWithValidLocalData[propertyId] = false;
                } else if (
                  collection.properties[propertyId].type === "date" &&
                  !localData[propertyId]
                ) {
                  fieldsWithValidLocalData[propertyId] = false;
                } else fieldsWithValidLocalData[propertyId] = true;
              }

              console.log({ fieldsWithValidLocalData });
              for (const propertyId of Object.keys(xp)) {
                if (xp[propertyId] && !fieldsWithValidLocalData[propertyId]) {
                  toast.error(
                    `Please set the correct answer for the field "${collection.properties[propertyId].name}"`
                  );
                  return;
                }
              }

              for (const propertyId of Object.keys(
                fieldsWithValidLocalData || {}
              )) {
                if (
                  !xp[propertyId] &&
                  xp[propertyId] !== 0 &&
                  fieldsWithValidLocalData[propertyId]
                ) {
                  toast.error(
                    `Please set the XP for the field "${collection.properties[propertyId].name}"`
                  );
                  return;
                }
              }

              setLoading(true);

              const res = await updateFormCollection(collection.id, {
                formMetadata: {
                  ...collection.formMetadata,
                  zealyXpPerField: xp,
                  responseDataForZealy: localData,
                  zealyXP: totalXp,
                },
              });
              if (res.id) {
                updateCollection(res);
              } else {
                logError("Error updating collection");
              }

              setLoading(false);
              setTotalXp(totalXp);
              setData(localData);
              setModalModal("setXp");
            }}
          >
            {"Save"}
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
