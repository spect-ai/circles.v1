import MetaHead from "@/app/common/seo/MetaHead/MetaHead";
import { FormType } from "@/app/types";
import { GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

const PublicFormLayout = dynamic(
  () => import("@/app/common/layout/PublicLayout/PublicFormLayout")
);

const PublicForm = dynamic(() => import("@/app/modules/PublicForm"));

interface Props {
  slug: string;
  form?: FormType;
}

const FormPage: NextPage<Props> = ({ slug, form }: Props) => {
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
          <div>
            <span>Failed to fetch</span>
          </div>
        </PublicFormLayout>
      </>
    );
  }

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

      <PublicForm form={form} />
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params, req } = context;
  const slug = params?.formId;

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=1, stale-while-revalidate"
  );

  if (!slug) return { props: { form: null } };

  const form = await (
    await fetch(
      `${process.env.SERVERSIDE_API_HOST}/collection/v1/public/slug/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: req.headers.cookie || "",
        },
        credentials: "include",
      }
    )
  )?.json();

  console.log({ form: form.name });

  if (!form?.id) {
    return {
      props: {
        form: null,
      },
    };
  }

  return {
    props: {
      slug,
      form,
    },
  };
}

export default FormPage;
