import Editor from "@/app/common/components/Editor";
import { CollectionType, UserType } from "@/app/types";
import { Button, Page, Stepper, Text } from "@avp1598/vibes";
import { Box, Stack, useTheme } from "degen";
import { useQuery } from "react-query";

type Props = {
  form: CollectionType;
  setData?: (data: any) => void;
  setCurrentPage: (page: string) => void;
  currentPage: string | undefined;
  onStepChange: (step: number) => void;
  setUpdateResponse?: (updateResponse: boolean) => void;
  setSubmitted?: (submitted: boolean) => void;
  preview?: boolean;
};

const SubmittedPage = ({
  form,
  setCurrentPage,
  currentPage,
  onStepChange,
  setUpdateResponse,
  setData,
  setSubmitted,
  preview,
}: Props) => {
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  return (
    <Page>
      <Box
        style={{
          minHeight: "calc(100vh - 20rem)",
          width: "100%",
        }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box marginBottom="8">
          <Stepper
            steps={form.formMetadata.pageOrder.length}
            currentStep={form.formMetadata.pageOrder.indexOf(currentPage || "")}
            onStepChange={onStepChange}
          />
        </Box>
        <Stack align="center" space="8">
          {/* <Text type="heading">{form.formMetadata.messageOnSubmission}</Text> */}
          {/* <Editor value={form.formMetadata.messageOnSubmission} disabled /> */}
          <Text
            type="description"
            description={form.formMetadata.messageOnSubmission}
          />
          <Box marginBottom="8" />
          {!preview && form.parents[0].pricingPlan === 0 && (
            <Stack>
              <Stack align={"center"}>
                <Text type="label">Powered By</Text>
                <a
                  href="https://spect.network/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text type="heading" weight="bold">
                    Spect
                  </Text>
                </a>
                <Text>💪 Powerful Web3 Forms, Projects and Automations 🤝</Text>
                <a href="/" target="_blank">
                  <Button
                    onClick={() => {
                      const mixpanel = require("mixpanel-browser");
                      process.env.NODE_ENV === "production" &&
                        mixpanel.track("Create your own form", {
                          form: form?.name,
                          sybilEnabled:
                            form?.formMetadata.sybilProtectionEnabled,
                          user: currentUser?.username,
                        });
                    }}
                  >
                    Build With Spect
                  </Button>
                </a>
              </Stack>
            </Stack>
          )}
        </Stack>
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          padding="4"
        >
          {/* <Box paddingX="5" paddingBottom="4">
          <a href="/" target="_blank">
            <PrimaryButton>Create your own form</PrimaryButton>
          </a>
        </Box> */}
          <Stack
            direction={{
              xs: "vertical",
              md: "horizontal",
            }}
            justify="center"
          >
            {form.formMetadata.updatingResponseAllowed &&
              form.formMetadata.active &&
              !form.formMetadata.allowAnonymousResponses && (
                <Button
                  variant="tertiary"
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
                </Button>
              )}
            {form.formMetadata.multipleResponsesAllowed &&
              form.formMetadata.active && (
                <Button
                  variant="tertiary"
                  onClick={() => {
                    setCurrentPage("start");
                    setUpdateResponse && setUpdateResponse(false);
                    setSubmitted && setSubmitted(false);

                    const tempData: any = {};
                    setData && setData(tempData);
                  }}
                >
                  Submit another response
                </Button>
              )}
          </Stack>
        </Box>
      </Box>
    </Page>
  );
};

export default SubmittedPage;
