import Editor from "@/app/common/components/Editor";
import { NameInput } from "@/app/modules/PublicForm/FormFields";
import { getForm } from "@/app/services/Collection";
import { CollectionType, FormType } from "@/app/types";
import { Avatar, Box, Stack } from "degen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Footer from "./Footer";
import Messages from "./Messages";

type Props = {
  form: CollectionType | undefined;
  setForm: (form: CollectionType | FormType) => void;
  setCurrentPage: (page: string) => void;
};

const StartPage = ({ form, setCurrentPage, setForm }: Props) => {
  const router = useRouter();
  const { formId } = router.query;

  const [captchaVerified, setCaptchaVerified] = useState(false);

  useEffect(() => {
    void (async () => {
      console.log("formId", formId);
      if (formId) {
        const res: FormType = await getForm(formId as string);
        if (res.id) {
          setForm(res);
        } else toast.error("Error fetching form");
      }
    })();
  }, [formId]);

  if (form) {
    return (
      <Box
        style={{
          height: "calc(100vh - 20rem)",
        }}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Stack space="2">
          {form.formMetadata.logo && (
            <Avatar src={form.formMetadata.logo} label="" size="20" />
          )}
          <NameInput
            autoFocus
            value={form.name}
            disabled
            rows={Math.floor(form.name?.length / 20) + 1}
          />
          {form.description && (
            <Editor value={form.description} isDirty={true} disabled />
          )}
          <Messages form={form} />
        </Stack>
        <Footer
          collection={form}
          setCaptchaVerified={setCaptchaVerified}
          captchaVerified={captchaVerified}
          setCurrentPage={setCurrentPage}
        />
      </Box>
    );
  } else return null;
};

export default StartPage;
