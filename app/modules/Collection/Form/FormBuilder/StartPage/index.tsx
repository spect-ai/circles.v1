import Editor from "@/app/common/components/Editor";
import { NameInput } from "@/app/modules/PublicForm/FormFields";
import { getForm } from "@/app/services/Collection";
import { CollectionType, FormType } from "@/app/types";
import { Avatar, Box, Stack } from "degen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import Messages from "./Messages";
import { motion } from "framer-motion";
import { Logo, Page, Stepper, Text } from "@avp1598/vibes";

type Props = {
  form: CollectionType | undefined;
  setForm: (form: CollectionType | FormType) => void;
  currentPage: string | undefined;
  setCurrentPage: (page: string) => void;
  onStepChange: (step: number) => void;
};

const StartPage = ({
  form,
  currentPage,
  setCurrentPage,
  onStepChange,
  setForm,
}: Props) => {
  const router = useRouter();
  const { formId } = router.query;

  const [captchaVerified, setCaptchaVerified] = useState(false);

  useEffect(() => {
    void (async () => {
      if (formId && !form) {
        const res: FormType = await getForm(formId as string);
        if (res.id) {
          setForm(res);
        } else {
          const logError = (await import("@/app/common/utils/utils")).logError;
          logError("Error fetching form");
        }
      }
    })();
  }, [formId]);

  if (form) {
    return (
      <Page>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="motion page"
          style={{
            width: "100%",
          }}
        >
          <Box marginBottom="8">
            <Stepper
              steps={form.formMetadata.pageOrder.length}
              currentStep={form.formMetadata.pageOrder.indexOf(
                currentPage || ""
              )}
              onStepChange={onStepChange}
            />
          </Box>
          <Box
            style={{
              minHeight: "calc(100vh - 20rem)",
              width: "100%",
            }}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Stack space="2">
              {form.formMetadata.logo && <Logo src={form.formMetadata.logo} />}
              {/* <NameInput autoFocus value={form.name} disabled /> */}
              <Text type="heading" color="secondary">
                {form.name}
              </Text>
              {form.description && (
                <Text type="description" description={form.description} />
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
        </motion.div>
      </Page>
    );
  } else return null;
};

export default StartPage;
