import PublicFormLayout from "@/app/common/layout/PublicLayout/PublicFormLayout";
import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import {
  CircleContext,
  useProviderCircleContext,
} from "@/app/modules/Circle/CircleContext";
import {
  LocalProfileContext,
  useProviderLocalProfile,
} from "@/app/modules/Profile/ProfileSettings/LocalProfileContext";
import PublicForm from "@/app/modules/PublicForm";
import { FormType } from "@/app/types";
import { Box, Text } from "degen";
import { GetServerSidePropsContext, NextPage } from "next";
import React from "react";

interface Props {
  slug: string;
  form?: FormType;
}

const FormPage: NextPage<Props> = ({ slug, form }: Props) => {
  console.log({ form, slug });
  if (!form) {
    return (
      <>
        <MetaHead
          title={"Oh no! Failed to fetch form"}
          description={
            "Incentivized forms for communities to collect feedback, run surveys, onboarding, and more."
          }
          image={
            "https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset"
          }
        />
        <PublicFormLayout>
          <Box padding="8">
            <Text>Failed to fetch</Text>
          </Box>
        </PublicFormLayout>
      </>
    );
  }

  const context = useProviderCircleContext();
  const profileContext = useProviderLocalProfile();

  return (
    <>
      <MetaHead
        title={form.name}
        description={
          form.description ||
          "Incentivized forms for communities to collect feedback, run surveys, onboarding, and more."
        }
        image={
          form.formMetadata.cover ||
          form.formMetadata.logo ||
          "https://ik.imagekit.io/spectcdn/spect_landscape.pngcz0kiyzu43m_fb9pRIjVW?updatedAt=1681837726214"
        }
      />
      <LocalProfileContext.Provider value={profileContext}>
        <CircleContext.Provider value={context}>
          <PublicFormLayout>
            <PublicForm form={form} />
          </PublicFormLayout>
        </CircleContext.Provider>
      </LocalProfileContext.Provider>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  const slug = params?.formId;

  if (!slug) return { props: { form: null } };

  console.log({ slug });
  console.time("fetch");

  const res = await (
    await fetch(
      `${process.env.SERVERSIDE_API_HOST}/collection/v1/public/slug/${slug}`
    )
  )?.json();

  console.log({ name: res.name });

  if (!res?.id) {
    return {
      props: {
        form: null,
      },
    };
  }

  console.timeEnd("fetch");

  return {
    props: {
      slug,
      form: res,
    },
  };
}

export default FormPage;
