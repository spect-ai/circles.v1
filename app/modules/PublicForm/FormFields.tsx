/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addData, updateCollectionData } from "@/app/services/Collection";
import { FormType, Registry } from "@/app/types";
import { Box, Text } from "degen";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import PublicField from "./PublicField";

type Props = {
  form: FormType;
};

export default function FormFields({ form }: Props) {
  const [data, setData] = useState<any>({});
  const [memberOptions, setMemberOptions] = useState([]);
  const [updateResponse, setUpdateResponse] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitAnotherResponse, setSubmitAnotherResponse] = useState(false);
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
    if (form?.id) {
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
      setData(tempData);
    }
  }, [form]);

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
      {form.propertyOrder.map((propertyName) => (
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
      </Box>
    </Container>
  );
}

const Container = styled(Box)`
  width: 80%;
  border-width: 2px;
  padding: 2rem;
  overflow-y: auto;
  height: calc(100vh - 10rem);
  margin-right: 4rem;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
`;
