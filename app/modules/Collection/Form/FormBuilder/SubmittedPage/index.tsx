import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CollectionType } from "@/app/types";
import { Box, Stack, Text } from "degen";
import Image from "next/image";

type Props = {
  form: CollectionType;
  setData?: (data: any) => void;
  setCurrentPage: (page: string) => void;
  setUpdateResponse?: (updateResponse: boolean) => void;
  setSubmitted?: (submitted: boolean) => void;
};

const SubmittedPage = ({
  form,
  setCurrentPage,
  setUpdateResponse,
  setData,
  setSubmitted,
}: Props) => {
  return (
    <Box
      style={{
        height: "calc(100vh - 20rem)",
      }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Stack align="center">
        <Image src="/spectForm.gif" width="512" height="512" />
        <Text>{form.formMetadata.messageOnSubmission}</Text>
      </Stack>
      <Box
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        padding="4"
      >
        <Box paddingX="5" paddingBottom="4">
          <a href="/" target="_blank">
            <PrimaryButton>Create your own form</PrimaryButton>
          </a>
        </Box>
        <Stack
          direction={{
            xs: "vertical",
            md: "horizontal",
          }}
          justify="center"
        >
          {form.formMetadata.updatingResponseAllowed &&
            form.formMetadata.active &&
            form.formMetadata.walletConnectionRequired && (
              <PrimaryButton
                variant="transparent"
                onClick={() => {
                  const tempData: any = {};
                  const lastResponse =
                    form.formMetadata.previousResponses[
                      form.formMetadata.previousResponses.length - 1
                    ];
                  form.propertyOrder.forEach((propertyId) => {
                    if (!form.properties[propertyId].isPartOfFormView) return;
                    if (
                      [
                        "longText",
                        "shortText",
                        "ethAddress",
                        "user",
                        "date",
                        "number",
                        "singleURL",
                        "email",
                      ].includes(form.properties[propertyId].type)
                    ) {
                      tempData[propertyId] = lastResponse[propertyId] || "";
                    } else if (
                      form.properties[propertyId].type === "singleSelect"
                    ) {
                      tempData[propertyId] =
                        lastResponse[propertyId] ||
                        // @ts-ignore
                        {};
                    } else if (
                      [
                        "multiSelect",
                        "user[]",
                        "milestone",
                        "multiURL",
                      ].includes(form.properties[propertyId].type)
                    ) {
                      tempData[propertyId] = lastResponse[propertyId] || [];
                    } else if (
                      ["reward", "payWall"].includes(
                        form.properties[propertyId].type
                      )
                    ) {
                      tempData[propertyId] = lastResponse[propertyId];
                    } else {
                      tempData[propertyId] = lastResponse[propertyId] || "";
                    }
                  });
                  setData && setData(tempData);
                  setCurrentPage("start");
                  setUpdateResponse && setUpdateResponse(true);
                }}
              >
                Update response
              </PrimaryButton>
            )}
          {form.formMetadata.multipleResponsesAllowed &&
            form.formMetadata.active && (
              <PrimaryButton
                variant="transparent"
                onClick={() => {
                  setCurrentPage("start");
                  setUpdateResponse && setUpdateResponse(false);
                  setSubmitted && setSubmitted(false);

                  const tempData: any = {};
                  form.propertyOrder.forEach((propertyId) => {
                    if (
                      [
                        "longText",
                        "shortText",
                        "ethAddress",
                        "user",
                        "date",
                        "number",
                      ].includes(form.properties[propertyId].type)
                    ) {
                      tempData[propertyId] = "";
                    } else if (
                      form.properties[propertyId].type === "singleSelect"
                    ) {
                      // @ts-ignore
                      tempData[propertyId] = {};
                    } else if (
                      ["multiSelect", "user[]"].includes(
                        form.properties[propertyId].type
                      )
                    ) {
                      tempData[propertyId] = [];
                    }
                  });

                  setData && setData(tempData);
                }}
              >
                Submit another response
              </PrimaryButton>
            )}
        </Stack>
      </Box>
    </Box>
  );
};

export default SubmittedPage;
