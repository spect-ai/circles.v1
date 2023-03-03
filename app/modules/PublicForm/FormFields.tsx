/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { isEmail, isURL } from "@/app/common/utils/utils";
import { useGlobal } from "@/app/context/globalContext";
import {
  addData,
  getForm,
  updateCollectionData,
} from "@/app/services/Collection";
import {
  Condition,
  FormType,
  KudosType,
  POAPEventType,
  Registry,
  UserType,
} from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { isAddress } from "ethers/lib/utils";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import FormResponse from "./FormResponse";
import PublicField from "./PublicField";
import mixpanel from "@/app/common/utils/mixpanel";
import NotificationPreferenceModal from "./NotificationPreferenceModal";
import { AnimatePresence } from "framer-motion";
import { satisfiesConditions } from "../Collection/Common/SatisfiesFilter";
import CheckBox from "@/app/common/components/Table/Checkbox";
import CollectPayment from "./CollectPayment";
import {
  compose,
  createCeramicSession,
  loadCeramicSession,
} from "@/app/services/Ceramic";
import { useAccount } from "wagmi";
import Modal from "@/app/common/components/Modal";
import { useProfile } from "../Profile/ProfileSettings/LocalProfileContext";
import { getPoap } from "@/app/services/Poap";
import {
  getSurveyConditionInfo,
  getSurveyDistributionInfo,
  hasClaimedSurveyToken,
  isEligibleToClaimSurveyToken,
} from "@/app/services/SurveyProtocol";
import { getPassportScoreAndCredentials } from "@/app/services/Credentials/AggregatedCredentials";

type Props = {
  form: FormType;
  setForm: (form: FormType) => void;
};

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/v1/me`, {
    credentials: "include",
  });
  return await res.json();
};

export default function FormFields({ form, setForm }: Props) {
  const [data, setData] = useState<any>({});
  const [memberOptions, setMemberOptions] = useState([]);
  const [updateResponse, setUpdateResponse] = useState(false);
  const [viewResponse, setViewResponse] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitAnotherResponse, setSubmitAnotherResponse] = useState(false);
  const [kudos, setKudos] = useState({} as KudosType);
  const [poap, setPoap] = useState({} as POAPEventType);
  const { connectedUser, connectUser } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(form.formMetadata.kudosClaimedByUser);
  const [surveyTokenClaimed, setSurveyTokenClaimed] = useState(false);
  const { onSaveProfile, email, setEmail } = useProfile();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [respondAsAnonymous, setRespondAsAnonymous] = useState(false);
  const [poapClaimed, setPoapClaimed] = useState(false);
  const [poapClaimCode, setPoapClaimCode] = useState("");
  const [distributionInfo, setDistributionInfo] = useState({} as any);
  const [conditionInfo, setConditionInfo] = useState({} as any);
  const [canClaimSurveyToken, setCanClaimSurveyToken] = useState(false);
  const [notificationPreferenceModalOpen, setNotificationPreferenceModalOpen] =
    useState(false);
  const [surveyIsLotteryYetToBeDrawn, setSurveyIsLotteryYetToBeDrawn] =
    useState(false);
  const { data: currentUser, refetch } = useQuery<UserType>(
    "getMyUser",
    getUser,
    {
      enabled: false,
    }
  );
  const [requiredFieldsNotSet, setRequiredFieldsNotSet] = useState(
    {} as { [key: string]: boolean }
  );
  const [fieldHasInvalidType, setFieldHasInvalidType] = useState(
    {} as { [key: string]: boolean }
  );

  const { data: registry, refetch: fetchRegistry } = useQuery<Registry>(
    ["registry", form.parents[0].slug],
    () =>
      fetch(
        `${process.env.API_HOST}/circle/slug/${form.parents[0].slug}/getRegistry`
      ).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  console.log({ form });

  const { address, connector } = useAccount();

  const checkRequired = (data: any) => {
    const requiredFieldsNotSet = {} as { [key: string]: boolean };
    form.propertyOrder.forEach((propertyId) => {
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
    const fieldHasInvalidType = {} as { [key: string]: boolean };
    form.propertyOrder.forEach((propertyId) => {
      if (isIncorrectType(propertyId, data[propertyId])) {
        fieldHasInvalidType[propertyId] = true;
      }
    });
    setFieldHasInvalidType(fieldHasInvalidType);
    return Object.keys(fieldHasInvalidType).length === 0;
  };

  useEffect(() => {
    if (form.formMetadata.poapEventId) {
      void (async () => {
        const res = await getPoap(
          form.formMetadata.poapEventId?.toString() || ""
        );
        setPoap(res);
        setPoapClaimed(res.claimed);
      })();
    }
  }, [form]);

  useEffect(() => {
    void fetchRegistry();
    // setClaimed(form.kudosClaimedByUser);
    setSubmitted(form.formMetadata.previousResponses?.length > 0);

    if (form.formMetadata.mintkudosTokenId) {
      void (async () => {
        const kudo = await (
          await fetch(
            `${process.env.MINTKUDOS_HOST}/v1/tokens/${form.formMetadata.mintkudosTokenId}`
          )
        ).json();
        setKudos(kudo);
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (form?.parents) {
      void (async () => {
        const res = await (
          await fetch(
            `${process.env.API_HOST}/circle/${form.parents[0].id}/memberDetails?circleIds=${form.parents[0].id}`
          )
        ).json();
        const memberOptions = res.members?.map((member: string) => ({
          label: res.memberDetails && res.memberDetails[member]?.username,
          value: member,
        }));
        setMemberOptions(memberOptions);
      })();
    }
  }, [form]);

  useEffect(() => {
    console.log({ f: form.formMetadata, registry });
    if (
      form?.formMetadata?.surveyTokenId ||
      form?.formMetadata?.surveyTokenId === 0
    ) {
      void (async () => {
        if (!registry) return;
        const distributionInfo = (await getSurveyDistributionInfo(
          form.formMetadata.surveyChain?.value || "",
          registry[form.formMetadata.surveyChain?.value || ""].surveyHubAddress,
          form.formMetadata.surveyTokenId as number
        )) as any;
        setDistributionInfo(distributionInfo);

        if (
          distributionInfo?.distributionType === 0 &&
          distributionInfo?.requestId?.toString() === "0"
        ) {
          setSurveyIsLotteryYetToBeDrawn(true);
        }

        const surveyTokenClaimed = await hasClaimedSurveyToken(
          form.formMetadata.surveyChain?.value || "",
          registry[form.formMetadata.surveyChain?.value || ""].surveyHubAddress,
          form.formMetadata.surveyTokenId as number,
          address as string
        );
        setSurveyTokenClaimed(surveyTokenClaimed as boolean);

        const canClaim = await isEligibleToClaimSurveyToken(
          form.formMetadata.surveyChain?.value || "",
          registry[form.formMetadata.surveyChain?.value || ""].surveyHubAddress,
          form.formMetadata.surveyTokenId as number,
          address as string,
          distributionInfo,
          surveyTokenClaimed as boolean
        );
        console.log({ canClaim });
        setCanClaimSurveyToken(canClaim as boolean);
      })();
    }
  }, [form, registry]);

  useEffect(() => {
    if (form) {
      setLoading(true);
      const tempData: any = {};
      if (updateResponse && form?.formMetadata.previousResponses?.length > 0) {
        const lastResponse =
          form.formMetadata.previousResponses[
            form.formMetadata.previousResponses.length - 1
          ];
        setRespondAsAnonymous(lastResponse["anonymous"]);
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
      setData(tempData);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, [form, updateResponse]);

  useEffect(() => {
    if (!connectedUser && currentUser?.id) {
      connectUser(currentUser.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, connectedUser]);

  useEffect(() => {
    refetch()
      .then((res) => {
        const data = res.data;
        if (data?.id) connectUser(data.id);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not fetch user data");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
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
    if (!currentUser?.email && form?.isAnOpportunity) {
      setNotificationPreferenceModalOpen(true);
      return;
    }
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
      setSubmitAnotherResponse(false);
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

  if (submitted && !submitAnotherResponse && !updateResponse) {
    return (
      <FormResponse
        form={form}
        setSubmitAnotherResponse={setSubmitAnotherResponse}
        setUpdateResponse={setUpdateResponse}
        setSubmitted={setSubmitted}
        kudos={kudos}
        claimed={claimed}
        setClaimed={setClaimed}
        surveyTokenClaimed={surveyTokenClaimed}
        setSurveyTokenClaimed={setSurveyTokenClaimed}
        setViewResponse={setViewResponse}
        poap={poap}
        poapClaimed={poapClaimed}
        setPoapClaimed={setPoapClaimed}
        poapClaimCode={poapClaimCode}
        canClaimSurveyToken={canClaimSurveyToken}
        surveyDistributionInfo={distributionInfo}
        surveyIsLotteryYetToBeDrawn={surveyIsLotteryYetToBeDrawn}
        registry={registry}
        setCanClaimSurveyToken={setCanClaimSurveyToken}
      />
    );
  }

  const isIncorrectType = (propertyName: string, value: any) => {
    switch (form.properties[propertyName]?.type) {
      case "email":
        return value && !isEmail(value);

      case "singleURL":
        return value && !isURL(value);

      default:
        return false;
    }
  };

  const isEmpty = (propertyName: string, value: any) => {
    switch (form.properties[propertyName].type) {
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

  if (!form.formMetadata.active) {
    return <Box />;
  }

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
      {!loading &&
        form.propertyOrder.map((propertyName) => {
          if (form.properties[propertyName].isPartOfFormView)
            return (
              <PublicField
                form={form}
                propertyName={propertyName}
                data={data}
                setData={setData}
                memberOptions={memberOptions}
                requiredFieldsNotSet={requiredFieldsNotSet}
                key={propertyName}
                updateRequiredFieldNotSet={updateRequiredFieldNotSet}
                fieldHasInvalidType={fieldHasInvalidType}
                updateFieldHasInvalidType={updateFieldHasInvalidType}
                disabled={viewResponse}
              />
            );
        })}

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
      )}
      {form.formMetadata.paymentConfig && (
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
      <Stack
        direction={{
          xs: "vertical",
          md: "horizontal",
        }}
      >
        {!viewResponse && (
          <Box width="full" paddingX="5">
            {/* {Object.keys(requiredFieldsNotSet).length > 0 && (
              <Text color="red" variant="small">
                {" "}
                {`Required fields are empty: ${Object.keys(
                  requiredFieldsNotSet
                ).join(",")}`}{" "}
              </Text>
            )} */}
            <PrimaryButton onClick={onSubmit} loading={submitting}>
              Submit
            </PrimaryButton>
          </Box>
        )}
        {(submitAnotherResponse || updateResponse) && (
          <Box width="full" paddingX="5">
            <PrimaryButton
              variant="tertiary"
              onClick={() => {
                setSubmitAnotherResponse(false);
                setUpdateResponse(false);
                setSubmitted(true);
              }}
            >
              {viewResponse ? "Back" : "Nevermind"}
            </PrimaryButton>
          </Box>
        )}
      </Stack>
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
    padding: 0rem 1rem;
    margin-bottom: 0.5rem;
  }

  @media (min-width: 1024px) and (max-width: 1280px) {
    padding: 0rem 1rem;
    margin-bottom: 0.5rem;
  }
  padding: 0rem 1rem;
  padding-bottom: 1rem;
`;
