/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import { addData, updateCollectionData } from "@/app/services/Collection";
import { FormType, KudosType, Registry, UserType } from "@/app/types";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Box, Text } from "degen";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import FormResponse from "./FormResponse";
import PublicField from "./PublicField";

type Props = {
  form: FormType;
};

const getUser = async () => {
  const res = await fetch(`${process.env.API_HOST}/user/me`, {
    credentials: "include",
  });
  return await res.json();
};

export default function FormFields({ form }: Props) {
  const [data, setData] = useState<any>({});
  const [memberOptions, setMemberOptions] = useState([]);
  const [updateResponse, setUpdateResponse] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitAnotherResponse, setSubmitAnotherResponse] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [kudos, setKudos] = useState({} as KudosType);
  const { openConnectModal } = useConnectModal();
  const { connectedUser, connectUser } = useGlobal();
  const [loading, setLoading] = useState(false);
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

  const { refetch: fetchRegistry } = useQuery<Registry>(
    ["registry", form.parents[0].slug],
    () =>
      fetch(
        `${process.env.API_HOST}/circle/slug/${form.parents[0].slug}/getRegistry`
      ).then((res) => res.json()),
    {
      enabled: false,
    }
  );

  const checkRequired = (data: any) => {
    const requiredFieldsNotSet = {} as { [key: string]: boolean };
    form.propertyOrder.forEach((propertyId) => {
      const property = form.properties[propertyId];
      if (property.required && !data[propertyId]) {
        requiredFieldsNotSet[propertyId] = true;
      }
    });
    setRequiredFieldsNotSet(requiredFieldsNotSet);
    return Object.keys(requiredFieldsNotSet).length === 0;
  };

  useEffect(() => {
    void fetchRegistry();
    setClaimed(form.kudosClaimedByUser);
    setSubmitted(form.previousResponses?.length > 0);

    if (form.mintkudosTokenId) {
      void (async () => {
        const kudo = await (
          await fetch(
            `${process.env.MINTKUDOS_API_HOST}/v1/tokens/${form.mintkudosTokenId}`
          )
        ).json();
        setKudos(kudo);
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log({ form });
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
    if (form) {
      setLoading(true);
      const tempData: any = {};

      if (updateResponse && form?.previousResponses?.length > 0) {
        const lastResponse =
          form.previousResponses[form.previousResponses.length - 1];
        form.propertyOrder.forEach((propertyId) => {
          if (
            ["longText", "shortText", "ethAddress", "user", "date"].includes(
              form.properties[propertyId].type
            )
          ) {
            tempData[propertyId] = lastResponse[propertyId] || "";
          } else if (form.properties[propertyId].type === "singleSelect") {
            tempData[propertyId] =
              lastResponse[propertyId] ||
              // @ts-ignore
              form.properties[propertyId].options[0];
          } else if (
            ["multiSelect", "user[]"].includes(form.properties[propertyId].type)
          ) {
            tempData[propertyId] = lastResponse[propertyId] || [];
          }
        });
      } else {
        console.log("setting data to empty object");
        const tempData: any = {};
        form.propertyOrder.forEach((propertyId) => {
          if (
            ["longText", "shortText", "ethAddress", "user", "date"].includes(
              form.properties[propertyId].type
            )
          ) {
            tempData[propertyId] = "";
          } else if (form.properties[propertyId].type === "singleSelect") {
            // @ts-ignore
            tempData[propertyId] = form.properties[propertyId].options[0];
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
    if (!connectedUser && currentUser?.id) connectUser(currentUser.id);
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
    let res;
    if (!checkRequired(data)) return;
    if (updateResponse) {
      console.log("update");
      const lastResponse =
        form.previousResponses[form.previousResponses.length - 1];
      res = await updateCollectionData(form.id || "", lastResponse.slug, data);
    } else {
      console.log("add");
      res = await addData(form.id || "", data);
    }
    if (res.id) {
      toast.success("Form submitted successfully");
      // reset data
      const tempData: any = {};
      form.propertyOrder.forEach((propertyId) => {
        if (
          ["longText", "shortText", "ethAddress", "user", "date"].includes(
            form.properties[propertyId].type
          )
        ) {
          tempData[propertyId] = "";
        } else if (form.properties[propertyId].type === "singleSelect") {
          tempData[propertyId] = (
            form.properties[propertyId] as any
          ).options[0];
        } else if (
          ["multiSelect", "user[]"].includes(form.properties[propertyId].type)
        ) {
          tempData[propertyId] = [];
        }
      });
      setData(tempData);
      setSubmitted(true);
      setSubmitAnotherResponse(false);
      setUpdateResponse(false);
    } else {
      toast.error("Error adding data");
    }
  };

  if (submitted && !submitAnotherResponse && !updateResponse) {
    return (
      <FormResponse
        form={form}
        setSubmitAnotherResponse={setSubmitAnotherResponse}
        setUpdateResponse={setUpdateResponse}
        setSubmitted={setSubmitted}
        kudos={kudos}
      />
    );
  }

  const isEmpty = (propertyName: string, value: any) => {
    switch (form.properties[propertyName].type) {
      case "longText":
      case "shortText":
      case "ethAddress":
      case "user":
      case "date":
      case "email":
        return !value;
      case "singleSelect":
        return typeof value !== "object" || Object.keys(value).length === 0;
      case "multiSelect":
      case "user[]":
        return !value || value.length === 0;
      case "reward":
        return !value.value;
      case "milestone":
        return !value || value.length === 0;
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

  return (
    <Container borderRadius="2xLarge">
      {!loading &&
        form.propertyOrder.map((propertyName) => (
          <PublicField
            form={form}
            propertyName={propertyName}
            data={data}
            setData={setData}
            memberOptions={memberOptions}
            requiredFieldsNotSet={requiredFieldsNotSet}
            key={propertyName}
            updateRequiredFieldNotSet={updateRequiredFieldNotSet}
          />
        ))}
      <Box width="full">
        <Box
          paddingRight="5"
          gap="4"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          {connectedUser ? (
            <Box width="1/4" paddingLeft="5">
              {Object.keys(requiredFieldsNotSet).length > 0 && (
                <Text color="red" variant="small">
                  {" "}
                  {`Required fields are empty: ${Object.keys(
                    requiredFieldsNotSet
                  ).join(",")}`}{" "}
                </Text>
              )}
              <PrimaryButton onClick={onSubmit}>Submit</PrimaryButton>
            </Box>
          ) : (
            <Box width="1/4" paddingLeft="5">
              <PrimaryButton onClick={openConnectModal}>
                Connect Wallet
              </PrimaryButton>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

const Container = styled(Box)`
  width: 80%;
  border-width: 2px;
  padding: 2rem;
  overflow-y: auto;
  max-height: calc(100vh - 10rem);
  margin-right: 4rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
`;
