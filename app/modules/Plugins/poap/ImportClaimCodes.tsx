import Accordian from "@/app/common/components/Accordian";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Box, Stack, useTheme, Text, Input, Button } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import { quizValidFieldTypes } from "../common/ResponseMatchDistribution";
import { logError } from "@/app/common/utils/utils";

export type Props = {
  setModalMode: (
    mode:
      | "createPoapFromScratch"
      | "importClaimCodes"
      | "distributePoapWhenResponsesMatch"
      | "distributePoapOnDiscordCallAttendance"
  ) => void;
  handleClose: () => void;
  poapEventId: string;
  setPoapEventId: (value: string) => void;
  poapEditCode: string;
  setPoapEditCode: (value: string) => void;
  minimumNumberOfAnswersThatNeedToMatch: number;
  responseData: any;
};

export default function ImportClaimCodes({
  setModalMode,
  handleClose,
  poapEventId,
  setPoapEventId,
  poapEditCode,
  setPoapEditCode,
  minimumNumberOfAnswersThatNeedToMatch,
  responseData,
}: Props) {
  const { mode } = useTheme();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const validFieldsCount = collection.propertyOrder.filter(
    (propertyName) =>
      collection.properties[propertyName].isPartOfFormView &&
      quizValidFieldTypes.includes(collection.properties[propertyName].type)
  )?.length;

  return (
    <Box>
      <Stack direction="vertical" space="4">
        <Stack direction="vertical" space="1">
          <Text variant="label">Poap event id</Text>
          <Input
            label
            value={poapEventId}
            onChange={(e) => setPoapEventId(e.target.value)}
          />
        </Stack>
        <Stack direction="vertical" space="1">
          <Text variant="label">Poap edit code</Text>
          <Input
            label
            value={poapEditCode}
            onChange={(e) => setPoapEditCode(e.target.value)}
          />
        </Stack>
      </Stack>
      <Accordian
        name="Distribute when responses match (ideal for quizzes)"
        defaultOpen={minimumNumberOfAnswersThatNeedToMatch > 0 ? true : false}
      >
        <Stack direction="vertical" space="1">
          {!minimumNumberOfAnswersThatNeedToMatch && (
            <PrimaryButton
              variant="tertiary"
              onClick={() => {
                setModalMode("distributePoapWhenResponsesMatch");
              }}
            >
              Distribute POAP when Responses Match
            </PrimaryButton>
          )}
          {minimumNumberOfAnswersThatNeedToMatch > 0 && (
            <Box
              display="flex"
              flexDirection="column"
              gap="2"
              borderColor="backgroundSecondary"
            >
              <Stack direction="horizontal" space="2" align="flex-start">
                <Text color="green">
                  <CheckCircleOutlined />
                </Text>
                <Text>
                  {`Distributing POAP when ${minimumNumberOfAnswersThatNeedToMatch} or more answers match.`}
                </Text>
              </Stack>
              <Box marginLeft="4">
                <Button
                  variant="tertiary"
                  size="small"
                  onClick={() =>
                    setModalMode("distributePoapWhenResponsesMatch")
                  }
                >
                  Update
                </Button>
              </Box>
            </Box>
          )}
        </Stack>
      </Accordian>
      <Box display="flex" flexDirection="column" gap="2" marginTop="4">
        <Box display="flex" flexDirection="row" justifyContent="flex-end">
          <Text color="red">{errorMessage}</Text>
        </Box>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="flex-start"
          gap="2"
        >
          {collection.formMetadata.poapEventId && (
            <PrimaryButton
              variant="tertiary"
              loading={loading}
              onClick={async () => {
                setLoading(true);
                const res = await updateFormCollection(collection.id, {
                  formMetadata: {
                    ...collection.formMetadata,
                    poapEventId: "",
                    poapEditCode: "",
                    minimumNumberOfAnswersThatNeedToMatchForPoap: 0,
                    responseDataForPoap: {},
                  },
                });
                if (!res?.id) {
                  logError("Update collection failed");
                  setLoading(false);
                  return;
                }
                updateCollection(res);
                setLoading(false);
                handleClose();
              }}
            >
              Disable POAP
            </PrimaryButton>
          )}

          {!collection.formMetadata.poapEventId && (
            <PrimaryButton
              variant="secondary"
              loading={loading}
              onClick={async () => {
                setLoading(true);
                const res = await updateFormCollection(collection.id, {
                  formMetadata: {
                    ...collection.formMetadata,
                    poapEventId,
                    poapEditCode,
                    minimumNumberOfAnswersThatNeedToMatchForPoap:
                      minimumNumberOfAnswersThatNeedToMatch,
                    responseDataForPoap: responseData,
                  },
                });
                if (!res?.formMetadata?.poapEventId) {
                  logError("Update collection failed");
                  setLoading(false);
                  return;
                }

                updateCollection(res);
                setLoading(false);
                handleClose();
              }}
            >
              Add Poap Event
            </PrimaryButton>
          )}
        </Box>
      </Box>
    </Box>
  );
}
