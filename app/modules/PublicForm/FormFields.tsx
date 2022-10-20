/* eslint-disable @typescript-eslint/ban-ts-comment */
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { addData, updateCollectionData } from "@/app/services/Collection";
import { FormType, KudosType, Registry } from "@/app/types";
import { Box } from "degen";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import styled from "styled-components";
import FormResponse from "./FormResponse";
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
  const [claimed, setClaimed] = useState(false);
  const [kudos, setKudos] = useState({} as KudosType);

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

  return (
    <Container borderRadius="2xLarge">
      {form.propertyOrder.map((propertyName) => (
        <PublicField
          form={form}
          propertyName={propertyName}
          data={data}
          setData={setData}
          memberOptions={memberOptions}
          key={propertyName}
        />
      ))}
      <Box width="1/4" paddingLeft="5">
        <PrimaryButton onClick={onSubmit}>Submit</PrimaryButton>
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
