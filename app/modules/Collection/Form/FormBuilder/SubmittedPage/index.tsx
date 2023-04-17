import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CollectionType, UserType } from "@/app/types";
import { Box, Stack, Text, useTheme } from "degen";
import mixpanel from "mixpanel-browser";
import Image from "next/image";
import { useQuery } from "react-query";

type Props = {
  form: CollectionType;
  setData?: (data: any) => void;
  setCurrentPage: (page: string) => void;
  setUpdateResponse?: (updateResponse: boolean) => void;
  setSubmitted?: (submitted: boolean) => void;
  preview?: boolean;
};

const SubmittedPage = ({
  form,
  setCurrentPage,
  setUpdateResponse,
  setData,
  setSubmitted,
  preview,
}: Props) => {
  const { mode } = useTheme();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  console.log({ form: form.formMetadata });
  return (
    <Box
      style={{
        minHeight: "calc(100vh - 20rem)",
      }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Stack align="center" space="8">
        <Text size="headingTwo" align="center">
          {form.formMetadata.messageOnSubmission}
        </Text>
        <Box marginBottom="8" />
        {!preview && (
          <Stack>
            {/* <Image src="/spectDemo.gif" width="1727" height="1082" /> */}
            <img
              src="https://bafybeicot4vgylc7gimu5bzo7megpeo5po3ybp6lov3wft24b666wxzfh4.ipfs.w3s.link/spectDemoCompressed.gif"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
            <Stack align={"center"}>
              <Text variant="label" align="center">
                Powered By
              </Text>
              <a
                href="https://spect.network/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {mode == "dark" ? (
                  <Image
                    src={"/logo2.svg"}
                    alt="dark-mode-logo"
                    height={"35"}
                    width="138"
                  />
                ) : (
                  <Image
                    src={"/logo1.svg"}
                    alt="light-mode-logo"
                    height={"35"}
                    width="138"
                  />
                )}
              </a>{" "}
              <Text variant="large" align="center">
                💪 Powerful Web3 Forms, Projects and Automations 🤝
              </Text>
              <a href="/" target="_blank">
                <PrimaryButton
                  onClick={() => {
                    process.env.NODE_ENV === "production" &&
                      mixpanel.track("Create your own form", {
                        form: form?.name,
                        sybilEnabled: form?.formMetadata.sybilProtectionEnabled,
                        user: currentUser?.username,
                      });
                  }}
                >
                  Build With Spect
                </PrimaryButton>
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
