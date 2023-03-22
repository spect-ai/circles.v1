import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { NameInput } from "@/app/modules/PublicForm/FormFields";
import { getForm } from "@/app/services/Collection";
import { CollectionType, FormType } from "@/app/types";
import { Avatar, Box, Stack } from "degen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Captcha from "./Captcha";
import Messages from "./Messages";

type Props = {
  form: CollectionType | undefined;
  setForm: (form: CollectionType | FormType) => void;
  setCurrentPage: (page: string) => void;
  setLoading: (loading: boolean) => void;
};

const StartPage = ({ form, setCurrentPage, setLoading, setForm }: Props) => {
  const router = useRouter();
  const { formId } = router.query;

  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [verifyingCaptcha, setVerifyingCaptcha] = useState(false);

  useEffect(() => {
    void (async () => {
      console.log("formId", formId);
      if (formId) {
        setLoading(true);
        const res: FormType = await getForm(formId as string);
        if (res.id) {
          setForm(res);
        } else toast.error("Error fetching form");
        setLoading(false);
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
        <Stack direction="horizontal" justify="space-between">
          <Box paddingX="5" paddingBottom="4" width="1/2" />
          <Box paddingX="5" paddingBottom="4" width="1/2">
            <Stack>
              {form.formMetadata.captchaEnabled && (
                <Captcha
                  setCaptchaVerified={setCaptchaVerified}
                  setVerifyingCaptcha={setVerifyingCaptcha}
                />
              )}
              <PrimaryButton
                disabled={form.formMetadata.captchaEnabled && !captchaVerified}
                onClick={() => {
                  setCurrentPage(form.formMetadata.pageOrder[1]);
                }}
              >
                Start
              </PrimaryButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    );
  } else return null;
};

export default StartPage;
