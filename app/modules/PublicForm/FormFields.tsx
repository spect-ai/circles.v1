/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { isEmail, isURL } from "@/app/common/utils/utils";
import {
  addData,
  getForm,
  updateCollectionData,
} from "@/app/services/Collection";
import { CollectionType, Condition, FormType, UserType } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import PublicField from "./PublicField";
import mixpanel from "@/app/common/utils/mixpanel";
import NotificationPreferenceModal from "./NotificationPreferenceModal";
import { AnimatePresence } from "framer-motion";
import {
  compose,
  createCeramicSession,
  loadCeramicSession,
} from "@/app/services/Ceramic";
import { useAccount } from "wagmi";
import Modal from "@/app/common/components/Modal";
import { useProfile } from "../Profile/ProfileSettings/LocalProfileContext";
import { useAtom } from "jotai";
import { connectedUserAtom } from "@/app/state/global";
import Stepper from "@/app/common/components/Stepper";
import Image from "next/image";
import StartPage from "../Collection/Form/FormBuilder/StartPage";
import ConnectPage from "../Collection/Form/FormBuilder/ConnectPage";
import { satisfiesConditions } from "../Collection/Common/SatisfiesFilter";
import CollectPage from "../Collection/Form/FormBuilder/CollectPage";

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
  const [loading, setLoading] = useState(false);

  const { onSaveProfile, email, setEmail } = useProfile();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [respondAsAnonymous, setRespondAsAnonymous] = useState(false);
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

  const [captchaVerified, setCaptchaVerified] = useState(false);

  // const { data: registry, refetch: fetchRegistry } = useQuery<Registry>(
  //   ["registry", form.parents[0].slug],
  //   () =>
  //     fetch(
  //       `${process.env.API_HOST}/circle/slug/${form.parents[0].slug}/getRegistry`
  //     ).then((res) => res.json()),
  //   {
  //     enabled: false,
  //   }
  // );

  const { address, connector } = useAccount();

  const [currentPage, setCurrentPage] = useState("start");

  const checkRequired = (data: any) => {
    if (!form) return false;
    const requiredFieldsNotSet = {} as { [key: string]: boolean };

    const currentFields = form.formMetadata.pages[currentPage].properties;

    currentFields.forEach((propertyId) => {
      const property = form.properties[propertyId];
      if (
        property.required &&
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
    if (form && form.formMetadata.previousResponses?.length > 0) {
      setSubmitted(true);
      setCurrentPage("submitted");
    }
  }, []);

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
          setMemberOptions(memberOptions);
        }
      })();
    }
  }, [form]);

  // useEffect(() => {
  //   if (
  //     form?.formMetadata?.surveyTokenId ||
  //     form?.formMetadata?.surveyTokenId === 0
  //   ) {
  //     void (async () => {
  //       if (!registry) return;
  //       const distributionInfo = (await getSurveyDistributionInfo(
  //         form.formMetadata.surveyChain?.value || "",
  //         registry[form.formMetadata.surveyChain?.value || ""].surveyHubAddress,
  //         form.formMetadata.surveyTokenId as number
  //       )) as any;
  //       console.log({ distributionInfo });
  //       setDistributionInfo(distributionInfo);

  //       if (
  //         distributionInfo?.distributionType === 0 &&
  //         distributionInfo?.requestId?.toString() === "0"
  //       ) {
  //         setSurveyIsLotteryYetToBeDrawn(true);
  //       }

  //       const surveyTokenClaimed = await hasClaimedSurveyToken(
  //         form.formMetadata.surveyChain?.value || "",
  //         registry[form.formMetadata.surveyChain?.value || ""].surveyHubAddress,
  //         form.formMetadata.surveyTokenId as number,
  //         address as string
  //       );
  //       setSurveyTokenClaimed(surveyTokenClaimed as boolean);

  //       const balanceInEscrow = (await getEscrowBalance(
  //         form.formMetadata.surveyChain?.value || "",
  //         registry[form.formMetadata.surveyChain?.value || ""].surveyHubAddress,
  //         form.formMetadata.surveyTokenId as number
  //       )) as BigNumber;
  //       const insufficientEscrowBalance =
  //         distributionInfo?.distributionType === 0
  //           ? balanceInEscrow.toString() === "0"
  //           : balanceInEscrow.lt(distributionInfo?.amountPerResponse || 0);
  //       console.log({ insufficientEscrowBalance });
  //       setEscrowHasInsufficientBalance(insufficientEscrowBalance);
  //       const canClaim =
  //         !insufficientEscrowBalance &&
  //         (await isEligibleToClaimSurveyToken(
  //           form.formMetadata.surveyChain?.value || "",
  //           registry[form.formMetadata.surveyChain?.value || ""]
  //             .surveyHubAddress,
  //           form.formMetadata.surveyTokenId as number,
  //           address as string,
  //           distributionInfo,
  //           surveyTokenClaimed as boolean
  //         ));

  //       console.log({ canClaim });
  //       setCanClaimSurveyToken(canClaim as boolean);
  //     })();
  //   }
  // }, [form, registry]);

  useEffect(() => {
    if (form) {
      const tempData: any = {};
      if (form?.formMetadata.previousResponses?.length > 0) {
        setLoading(true);
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
      } else {
        const tempData: any = {};
        setRespondAsAnonymous(form.formMetadata.allowAnonymousResponses);
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
          } else if (form.properties[propertyId].type === "singleSelect") {
            // @ts-ignore
            tempData[propertyId] = {};
          } else if (
            ["multiSelect", "user[]"].includes(form.properties[propertyId].type)
          ) {
            tempData[propertyId] = [];
          }
        });
      }
      // only if tempdata is not an empty object
      if (Object.keys(tempData).length > 0) setData(tempData);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, [form, updateResponse]);

  const onSubmit = async (form: CollectionType) => {
    if (!captchaVerified && form.formMetadata.captchaEnabled) {
      toast.error("Please verify captcha");
      return;
    }
    if (
      !email &&
      (form.formMetadata.surveyTokenId ||
        form.formMetadata.surveyTokenId === 0) &&
      form.formMetadata.surveyDistributionType === 0
    ) {
      setEmailModalOpen(true);
      return;
    }
    if (form.formMetadata.ceramicEnabled) {
      let session: any;
      setSubmitting(true);
      try {
        const loadedSession = await loadCeramicSession(address as string);
        console.log({ loadedSession });
        if (!loadedSession) {
          const newSession = await createCeramicSession(
            address as string,
            connector
          );
          console.log({ newSession });
          session = newSession;
        } else {
          session = loadedSession;
        }
        compose.setDID(session.did);
        const result: any = await compose.executeQuery(
          `
      mutation {
        createSpectForm(input: {content: {
          formId: "${form.slug}",
          data: "${JSON.stringify(data).replace(/"/g, '\\"')}",
          createdAt: "${new Date().toISOString()}",
          link: "https://circles.spect.network/r/${form.id}",
          origin: "https://circles.spect.network",
        }}) {
          document {
            id
          }
        }
      }
      `
        );
        const streamId = result.data.createSpectForm.document.id;
        data["__ceramic__"] = streamId;
      } catch (err) {
        console.log(err);
        toast.error("Could not upload data to Ceramic");
        setSubmitting(false);
        return;
      }
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
        anonymous: respondAsAnonymous,
      });
    } else {
      res = await addData(
        form.id || "",
        data,
        !connectedUser ? true : respondAsAnonymous
      );
    }
    const resAfterSave = await getForm(form.slug);
    if (res.id) {
      toast.success("Form submitted successfully");
      setForm(resAfterSave);
      setSubmitted(true);
      setCurrentPage(
        form.formMetadata.pages["collect"] ? "collect" : "submitted"
      );
      setUpdateResponse(false);
    } else {
      toast.error("Error adding data");
    }
    process.env.NODE_ENV === "production" &&
      mixpanel.track("Form Submit", {
        form: form.name,
        sybilEnabled: form.formMetadata.sybilProtectionEnabled,
        user: currentUser?.username,
        circle: form.parents[0].slug,
      });
    setSubmitting(false);
  };

  // if (submitted && !submitAnotherResponse && !updateResponse) {
  //   return (
  //     <FormResponse
  //       form={form}
  //       setSubmitAnotherResponse={setSubmitAnotherResponse}
  //       setUpdateResponse={setUpdateResponse}
  //       setSubmitted={setSubmitted}
  //       kudos={kudos}
  //       claimed={claimed}
  //       setClaimed={setClaimed}
  //       surveyTokenClaimed={surveyTokenClaimed}
  //       setSurveyTokenClaimed={setSurveyTokenClaimed}
  //       setViewResponse={setViewResponse}
  //       poap={poap}
  //       poapClaimed={poapClaimed}
  //       setPoapClaimed={setPoapClaimed}
  //       canClaimPoap={canClaimPoap}
  //       canClaimSurveyToken={canClaimSurveyToken}
  //       surveyDistributionInfo={distributionInfo}
  //       surveyIsLotteryYetToBeDrawn={surveyIsLotteryYetToBeDrawn}
  //       registry={registry}
  //       setCanClaimSurveyToken={setCanClaimSurveyToken}
  //       surveyHasInsufficientBalance={escrowHasInsufficientBalance}
  //     />
  //   );
  // }

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

  return (
    <Container borderRadius="2xLarge">
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
              setLoading={setLoading}
            />
          );
        } else if (currentPage === "connect" && form) {
          return (
            <ConnectPage
              form={form as CollectionType}
              setForm={setForm}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          );
        } else if (currentPage === "collect") {
          return (
            <CollectPage
              form={form as CollectionType}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          );
        } else if (currentPage === "submitted" && form) {
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
                          setCurrentPage("start");
                          setUpdateResponse(true);
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
                          setUpdateResponse(false);
                          setSubmitted(false);

                          const tempData: any = {};
                          setRespondAsAnonymous(
                            form.formMetadata.allowAnonymousResponses
                          );
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
                              form.properties[propertyId].type ===
                              "singleSelect"
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

                          setData(tempData);
                        }}
                      >
                        Submit another response
                      </PrimaryButton>
                    )}
                </Stack>
              </Box>
            </Box>
          );
        } else {
          if (form) {
            const pages = form.formMetadata.pages;
            const pageOrder = form.formMetadata.pageOrder;
            const fields = pages[currentPage || ""]?.properties;
            return (
              <FormFieldContainer
                style={{
                  height: "calc(100vh - 20rem)",
                }}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                overflow="auto"
              >
                <Stack>
                  {fields.map((field) => {
                    if (form.properties[field].isPartOfFormView) {
                      return (
                        <PublicField
                          form={form}
                          propertyName={field}
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
                </Stack>
                <Stack direction="horizontal" justify="space-between">
                  <Box paddingX="5" paddingBottom="4" width="1/2">
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
                    <Box paddingX="5" paddingBottom="4" width="1/2">
                      <PrimaryButton
                        onClick={() => {
                          if (!checkRequired(data)) {
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
                    <Box paddingX="5" paddingBottom="4" width="1/2">
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
      <Stack align="center">
        {form && (
          <Stepper
            steps={form.formMetadata.pageOrder.length}
            currentStep={form.formMetadata.pageOrder.indexOf(currentPage || "")}
            onStepChange={(step) => {
              if (submitted) {
                setCurrentPage(form.formMetadata.pageOrder[step]);
              } else if (updateResponse || !submitted) {
                // can only go back
                if (
                  step < form.formMetadata.pageOrder.indexOf(currentPage || "")
                ) {
                  setCurrentPage(form.formMetadata.pageOrder[step]);
                } else {
                  toast.error("You can only go back");
                }
              } else {
                setCurrentPage(form.formMetadata.pageOrder[step]);
              }
            }}
          />
        )}
      </Stack>
      {/* 
      {!viewResponse && form.formMetadata.allowAnonymousResponses && (
        <Box
          display="flex"
          flexDirection="row"
          gap="2"
          justifyContent="flex-start"
          alignItems="center"
          marginY={"3"}
        >
          <CheckBox
            isChecked={respondAsAnonymous}
            onClick={() => {
              if (connectedUser) {
                setRespondAsAnonymous(!respondAsAnonymous);
              }
            }}
          />
          <Text variant="base">Respond anonymously</Text>
        </Box>
      )} */}
      {/* {form.formMetadata.paymentConfig && (
        <Box marginBottom="8">
          <CollectPayment
            paymentConfig={form.formMetadata.paymentConfig}
            circleSlug={form.parents[0].slug}
            circleId={form.parents[0].id}
            data={data}
            setData={setData}
          />
        </Box>
      )} */}
      {/* {form.formMetadata.captchaEnabled && (
        <Reaptcha
          sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
          ref={captchaRef}
          onVerify={() => {
            setVerifyingCaptcha(true);
            captchaRef.current
              ?.getResponse()
              .then(async (res: any) => {
                const verify = await fetch("/api/verifyCaptcha", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ token: res }),
                });
                console.log({ verify });
                const data = await verify.json();
                console.log({ data });
                if (data.success) {
                  setCaptchaVerified(true);
                  setVerifyingCaptcha(false);
                } else {
                  toast.error("Captcha verification failed");
                  setCaptchaVerified(false);
                  setVerifyingCaptcha(false);
                }
              })
              .catch((err: any) => {
                console.log(err);
                setVerifyingCaptcha(false);
              });
          }}
        />
      )} */}
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

  height: calc(100vh - 15rem);

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  overflow-y: auto;
`;

const FormFieldContainer = styled(Box)`
  height: calc(100vh - 15rem);

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
