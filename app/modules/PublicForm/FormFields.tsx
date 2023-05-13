/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { isEmail, isURL, logError } from "@/app/common/utils/utils";
import {
  addData,
  getForm,
  updateCollectionData,
} from "@/app/services/Collection";
import {
  CollectionType,
  Condition,
  ConditionGroup,
  FormType,
  Property,
  UserType,
} from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "@emotion/styled";
// import PublicField from "./Fields/PublicField";
import { AnimatePresence } from "framer-motion";
// import {
//   compose,
//   createCeramicSession,
//   loadCeramicSession,
// } from "@/app/services/Ceramic";
// import { useAccount } from "wagmi";
import { useProfile } from "../Profile/ProfileSettings/LocalProfileContext";
import { useAtom } from "jotai";
import { connectedUserAtom } from "@/app/state/global";
import Stepper from "@/app/common/components/Stepper";
import { satisfiesConditions } from "../Collection/Common/SatisfiesFilter";

import dynamic from "next/dynamic";
import PublicField from "./Fields/PublicField";
import { satisfiesAdvancedConditions } from "../Collection/Common/SatisfiesAdvancedFilter";

const StartPage = dynamic(
  () => import("../Collection/Form/FormBuilder/StartPage")
);
const ConnectPage = dynamic(
  () => import("../Collection/Form/FormBuilder/ConnectPage")
);
const CollectPage = dynamic(
  () => import("../Collection/Form/FormBuilder/CollectPage")
);
const CollectPayment = dynamic(() => import("./Fields/CollectPayment"));
const SubmittedPage = dynamic(
  () => import("../Collection/Form/FormBuilder/SubmittedPage")
);
const ConnectDiscordPage = dynamic(
  () => import("../Collection/Form/FormBuilder/ConnectDiscordPage")
);
const Modal = dynamic(() => import("@/app/common/components/Modal"));

// const PublicField = dynamic(() => import("./Fields/PublicField"), {
//   ssr: false,
// });

const NotificationPreferenceModal = dynamic(
  () => import("./Fields/NotificationPreferenceModal")
);

type Props = {
  form: FormType | undefined;
  setForm: (form: FormType) => void;
};

export const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/v1/me`, {
    credentials: "include",
  });
  return await res.json();
};

function FormFields({ form, setForm }: Props) {
  const [data, setData] = useState<any>({});
  const [memberOptions, setMemberOptions] = useState([]);
  const [updateResponse, setUpdateResponse] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [connectedUser] = useAtom(connectedUserAtom);
  const [verificationToken, setVerificationToken] = useState("");
  const { onSaveProfile, email, setEmail } = useProfile();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [respondAsAnonymous, setRespondAsAnonymous] = useState(
    form?.formMetadata.allowAnonymousResponses || false
  );
  const [notificationPreferenceModalOpen, setNotificationPreferenceModalOpen] =
    useState(false);
  const { data: currentUser } = useQuery<UserType>("getMyUser", getUser, {
    enabled: false,
  });
  const [requiredFieldsNotSet, setRequiredFieldsNotSet] = useState(
    {} as { [key: string]: boolean }
  );
  const [fieldHasInvalidType, setFieldHasInvalidType] = useState(
    {} as { [key: string]: boolean }
  );
  const [discordUser, setDiscordUser] = useState(
    {} as {
      id: string;
      username: string;
      discriminator: string;
      avatar: string;
    }
  );
  const [currentPage, setCurrentPage] = useState("start");
  const [timeSpent, setTimeSpent] = useState({
    start: { enter: Date.now(), time: 0 },
  } as {
    [key: string]: { enter: number; time: number };
  });

  const checkRequired = (data: any) => {
    if (!form) return false;
    const requiredFieldsNotSet = {} as { [key: string]: boolean };

    const currentFields = form.formMetadata.pages[currentPage].properties;

    currentFields.forEach((propertyId) => {
      const property = form.properties[propertyId];
      if (
        property.required &&
        property.isPartOfFormView &&
        isEmpty(propertyId, data[propertyId]) &&
        satisfiesConditions(
          data,
          form.properties,
          form.properties[propertyId].viewConditions as Condition[]
        )
      ) {
        requiredFieldsNotSet[propertyId] = true;
      }
    });
    setRequiredFieldsNotSet(requiredFieldsNotSet);
    return Object.keys(requiredFieldsNotSet).length === 0;
  };

  const checkValue = (data: any) => {
    if (!form) return false;
    const fieldHasInvalidType = {} as { [key: string]: boolean };
    const currentFields = form.formMetadata.pages[currentPage || ""].properties;
    currentFields.forEach((propertyId) => {
      if (isIncorrectType(propertyId, data[propertyId])) {
        fieldHasInvalidType[propertyId] = true;
      }
    });
    setFieldHasInvalidType(fieldHasInvalidType);
    return Object.keys(fieldHasInvalidType).length === 0;
  };

  useEffect(() => {
    if (form?.parents) {
      void (async () => {
        const res = await (
          await fetch(
            `${process.env.API_HOST}/circle/${form.parents[0].id}/memberDetails?circleIds=${form.parents[0].id}`
          )
        ).json();
        const fetchedMemberOptions = res.members?.map((member: string) => ({
          label: res.memberDetails && res.memberDetails[member]?.username,
          value: member,
        }));
        if (fetchedMemberOptions.length !== memberOptions.length) {
          setMemberOptions(fetchedMemberOptions);
        }
      })();
    }
  }, [form]);

  useEffect(() => {
    if (form) {
      const tempData: any = {};
      if (form?.formMetadata.previousResponses?.length > 0 && submitted) {
        const lastResponse =
          form.formMetadata.previousResponses[
            form.formMetadata.previousResponses.length - 1
          ];
        setRespondAsAnonymous(
          lastResponse["anonymous"] || form.formMetadata.allowAnonymousResponses
        );
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
          } else if (form.properties[propertyId].type === "singleSelect") {
            tempData[propertyId] =
              lastResponse[propertyId] ||
              // @ts-ignore
              {};
          } else if (
            ["multiSelect", "user[]", "milestone", "multiURL"].includes(
              form.properties[propertyId].type
            )
          ) {
            tempData[propertyId] = lastResponse[propertyId] || [];
          } else if (
            ["reward", "payWall"].includes(form.properties[propertyId].type)
          ) {
            tempData[propertyId] = lastResponse[propertyId];
          } else {
            tempData[propertyId] = lastResponse[propertyId] || "";
          }
        });
      }
      if (Object.keys(tempData).length > 0) setData(tempData);
    }
  }, [form, updateResponse, submitted]);

  useEffect(() => {
    if (form && form.formMetadata.previousResponses?.length > 0) {
      setSubmitted(true);

      if (form.formMetadata.surveyTokenId) {
        setCurrentPage("collect");
      } else setCurrentPage("submitted");
    }
  }, [form?.name, form?.formMetadata.previousResponses?.length]);

  const onSubmit = async (form: CollectionType) => {
    const toast = await (await import("react-toastify")).toast;
    if (
      !email &&
      (form.formMetadata.surveyTokenId ||
        form.formMetadata.surveyTokenId === 0) &&
      form.formMetadata.surveyDistributionType === 0
    ) {
      setEmailModalOpen(true);
      return;
    }
    let res;
    if (
      form.formMetadata.paymentConfig?.type === "paywall" &&
      form.formMetadata.paymentConfig?.required &&
      !data["__payment__"]
    ) {
      toast.error("This form is paywalled, please pay to submit this form");
      return;
    }

    if (!form.formMetadata.active) {
      toast.error("This form is not accepting responses");
      return;
    }

    if (!checkRequired(data)) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!checkValue(data)) return;
    setSubmitting(true);
    if (updateResponse) {
      const lastResponse =
        form.formMetadata.previousResponses[
          form.formMetadata.previousResponses.length - 1
        ];
      res = await updateCollectionData(form.id || "", lastResponse.slug, {
        ...data,
        anonymous: form.formMetadata.allowAnonymousResponses,
      });
    } else {
      res = await addData(
        form.id || "",
        data,
        !connectedUser ? true : form.formMetadata.allowAnonymousResponses,
        verificationToken
      );
    }
    const resAfterSave = await getForm(form.slug);
    const mixpanel = (await import("@/app/common/utils/mixpanel")).default;
    if (res.id) {
      toast.success("Form submitted successfully");
      setForm(resAfterSave);
      setSubmitted(true);
      setCurrentPage(
        form.formMetadata.pages["collect"] ? "collect" : "submitted"
      );
      setUpdateResponse(false);
      process.env.NODE_ENV === "production" &&
        mixpanel.track("Form Submit", {
          form: form.name,
          sybilEnabled: form.formMetadata.sybilProtectionEnabled,
          user: currentUser?.username,
          circle: form.parents[0].slug,
        });

      // try {
      //   let totalTimeSpent = {} as { [key: string]: number };
      //   for (let key in timeSpent) {
      //     totalTimeSpent[key] = timeSpent[key].time;
      //   }
      //   console.log({ totalTimeSpent });
      //   await fetch(
      //     `${process.env.API_HOST}/collection/v1/${form?.id}/updateTimeSpentMetrics`,
      //     {
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       method: "PATCH",
      //       body: JSON.stringify({
      //         timeSpent: totalTimeSpent,
      //         type: "page",
      //       }),
      //     }
      //   );
      // } catch (e) {
      //   console.log(e);
      // }
    } else {
      logError("Error adding data");
      process.env.NODE_ENV === "production" &&
        mixpanel.track("Form Submit Failed", {
          form: form.name,
          sybilEnabled: form.formMetadata.sybilProtectionEnabled,
          user: currentUser?.username,
          circle: form.parents[0].slug,
        });
    }
    setSubmitting(false);
  };

  const isIncorrectType = (propertyName: string, value: any) => {
    switch (form?.properties[propertyName]?.type) {
      case "email":
        return value && !isEmail(value);

      case "singleURL":
        return value && !isURL(value);

      default:
        return false;
    }
  };

  const isEmpty = (propertyName: string, value: any) => {
    switch (form?.properties[propertyName].type) {
      case "longText":
      case "shortText":
      case "ethAddress":
      case "user":
      case "date":
      case "singleURL":
      case "email":
        return !value;
      case "singleSelect":
        return !value || !value.value || !value.label;
      case "multiURL":
      case "multiSelect":
      case "milestone":
      case "user[]":
        return !value || value.length === 0;
      case "reward":
        return !value?.value;
      case "payWall":
        return !value?.some((v: any) => v.txnHash);
      case "discord":
        return !value?.id;
      case "github":
        return !value?.id;
      case "twitter":
        return !value?.id;
      case "telegram":
        return !value?.id;
      default:
        return false;
    }
  };

  const updateRequiredFieldNotSet = (propertyName: string, value: any) => {
    if (!isEmpty(propertyName, value)) {
      setRequiredFieldsNotSet((prev) => {
        const temp = { ...prev };
        delete temp[propertyName];
        return temp;
      });
    }
  };

  const updateFieldHasInvalidType = (propertyName: string, value: any) => {
    if (!isIncorrectType(propertyName, value)) {
      setFieldHasInvalidType((prev) => {
        const temp = { ...prev };
        delete temp[propertyName];
        return temp;
      });
    }
  };

  useEffect(() => {
    if (currentPage) {
      void (async () => {
        try {
          const res = await fetch(
            `${process.env.API_HOST}/collection/v1/${form?.id}/updateMetrics`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "PATCH",
              body: JSON.stringify({
                pageId: currentPage,
              }),
            }
          );
        } catch (err) {
          console.log({ err });
        }
      })();
    }
  }, [currentPage]);

  return (
    <Container borderRadius="2xLarge">
      <Stack align="center">
        {form && (
          <Stepper
            steps={form.formMetadata.pageOrder.length}
            currentStep={form.formMetadata.pageOrder.indexOf(currentPage || "")}
            onStepChange={async (step) => {
              const toast = await (await import("react-toastify")).toast;

              if (submitted) {
                setCurrentPage(form.formMetadata.pageOrder[step]);
              } else if (updateResponse || !submitted) {
                // can only go back
                if (
                  step < form.formMetadata.pageOrder.indexOf(currentPage || "")
                ) {
                  setCurrentPage(form.formMetadata.pageOrder[step]);
                } else {
                  if (currentPage === "start") {
                    toast.error(
                      "You can get started by clicking on the start button"
                    );
                  } else {
                    toast.error("You can only go back");
                  }
                }
              } else {
                setCurrentPage(form.formMetadata.pageOrder[step]);
              }
            }}
          />
        )}
        <Box marginBottom="4" />
      </Stack>
      {emailModalOpen && (
        <Modal
          title="Please enter email"
          size="small"
          handleClose={() => {
            if (email) onSaveProfile();
            setEmailModalOpen(false);
          }}
        >
          <Box padding="8" display="flex" flexDirection="column" gap="2">
            <Text variant="label">
              This form is incentivized using a lottery mechanism. Please enter
              your email to get notified upon winning.
            </Text>
            <Input
              label=""
              placeholder="Email"
              value={email}
              inputMode="email"
              type="email"
              error={email && !isEmail(email)}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Box>
        </Modal>
      )}
      <AnimatePresence>
        {notificationPreferenceModalOpen && (
          <NotificationPreferenceModal
            handleClose={() => setNotificationPreferenceModalOpen(false)}
          />
        )}
      </AnimatePresence>
      {Array.from({ length: 1 }).map((_, i) => {
        if (currentPage === "start") {
          return (
            <StartPage
              form={form as CollectionType}
              setCurrentPage={setCurrentPage}
              setForm={setForm}
              key={i}
            />
          );
        } else if (currentPage === "connect" && form) {
          return (
            <ConnectPage
              form={form as CollectionType}
              setForm={setForm}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              key={i}
            />
          );
        } else if (currentPage === "connectDiscord" && form) {
          return (
            <ConnectDiscordPage
              form={form as CollectionType}
              data={data}
              setData={setData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              verificationToken={verificationToken}
              setVerificationToken={setVerificationToken}
              discordUser={discordUser}
              setDiscordUser={setDiscordUser}
              key={i}
            />
          );
        } else if (currentPage === "collect") {
          return (
            <CollectPage
              setForm={setForm}
              form={form as CollectionType}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              key={i}
            />
          );
        } else if (currentPage === "submitted" && form) {
          return (
            <SubmittedPage
              form={form as CollectionType}
              setCurrentPage={setCurrentPage}
              setUpdateResponse={setUpdateResponse}
              setSubmitted={setSubmitted}
              setData={setData}
              key={i}
            />
          );
        } else {
          if (form) {
            const pages = form.formMetadata.pages;
            const pageOrder = form.formMetadata.pageOrder;
            const fields = pages[currentPage || ""]?.properties;

            return (
              <FormFieldContainer
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                overflow="auto"
                key={i}
              >
                <Stack>
                  {fields.map((field) => {
                    if (form.properties[field]?.isPartOfFormView) {
                      return (
                        <PublicField
                          form={form}
                          propertyId={field}
                          data={data}
                          setData={setData}
                          memberOptions={memberOptions}
                          requiredFieldsNotSet={requiredFieldsNotSet}
                          key={field}
                          updateRequiredFieldNotSet={updateRequiredFieldNotSet}
                          fieldHasInvalidType={fieldHasInvalidType}
                          updateFieldHasInvalidType={updateFieldHasInvalidType}
                          disabled={submitted ? !updateResponse : false}
                        />
                      );
                    }
                  })}
                  {fields.every((field: string) => {
                    return !satisfiesAdvancedConditions(
                      data,
                      form.properties as { [propertyId: string]: Property },
                      form.properties[field].advancedConditions ||
                        ({} as ConditionGroup)
                    );
                  }) && (
                    <Box>
                      <Text variant="label">
                        No fields to display on this page
                      </Text>
                    </Box>
                  )}

                  {form.formMetadata.paymentConfig &&
                    !pages[pageOrder[pageOrder.indexOf(currentPage || "") + 1]]
                      .movable && (
                      <Box marginBottom="8">
                        <CollectPayment
                          paymentConfig={form.formMetadata.paymentConfig}
                          circleSlug={form.parents[0].slug}
                          circleId={form.parents[0].id}
                          data={data}
                          setData={setData}
                        />
                      </Box>
                    )}
                </Stack>
                <Stack direction="horizontal" justify="space-between">
                  <Box
                    paddingX="5"
                    paddingBottom="4"
                    width={{
                      xs: "40",
                      md: "56",
                    }}
                  >
                    <PrimaryButton
                      variant="transparent"
                      onClick={() => {
                        setCurrentPage(
                          pageOrder[pageOrder.indexOf(currentPage || "") - 1]
                        );
                      }}
                    >
                      Back
                    </PrimaryButton>
                  </Box>
                  {pages[pageOrder[pageOrder.indexOf(currentPage || "") + 1]]
                    .movable ||
                  (submitted && !updateResponse) ? (
                    <Box
                      paddingX="5"
                      paddingBottom="4"
                      width={{
                        xs: "40",
                        md: "56",
                      }}
                    >
                      <PrimaryButton
                        onClick={async () => {
                          if (!checkRequired(data)) {
                            const toast = await (
                              await import("react-toastify")
                            ).toast;
                            toast.error("Please fill all required fields");
                            return;
                          }
                          if (!checkValue(data)) return;
                          setCurrentPage(
                            pageOrder[pageOrder.indexOf(currentPage) + 1]
                          );
                        }}
                      >
                        Next
                      </PrimaryButton>
                    </Box>
                  ) : (
                    <Box
                      paddingX="5"
                      paddingBottom="4"
                      width={{
                        xs: "40",
                        md: "56",
                      }}
                    >
                      <PrimaryButton
                        onClick={() => form && onSubmit(form as CollectionType)}
                        loading={submitting}
                      >
                        Submit
                      </PrimaryButton>
                    </Box>
                  )}
                </Stack>
              </FormFieldContainer>
            );
          }
        }
      })}
    </Container>
  );
}

const Container = styled(Box)`
  @media (max-width: 768px) {
    padding: 0rem;
    margin-right: 0rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    padding: 2rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 1024px) and (max-width: 1280px) {
    padding: 2rem;
    margin-bottom: 0.5rem;
  }
  padding: 2rem;
  padding-bottom: 1rem;

  min-height: calc(100vh - 15rem);

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  overflow-y: auto;
`;

const FormFieldContainer = styled(Box)`
  min-height: calc(100vh - 15rem);

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  overflow-y: auto;
`;

export const NameInput = styled.textarea`
  resize: none;
  background: transparent;
  border: 0;
  border-style: none;
  border-color: transparent;
  outline: none;
  outline-offset: 0;
  box-shadow: none;
  font-size: 1.8rem;
  font-family: Inter;
  caret-color: rgb(191, 90, 242);
  color: rgb(191, 90, 242);
  font-weight: 600;
  overflow: hidden;
`;

export default React.memo(FormFields);

FormFields.whyDidYouRender = true;
