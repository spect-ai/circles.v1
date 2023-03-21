import Editor from "@/app/common/components/Editor";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { NameInput } from "@/app/modules/PublicForm/FormFields";
import { getForm } from "@/app/services/Collection";
import { CollectionType, FormType } from "@/app/types";
import { Avatar, Box, Stack, Text } from "degen";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

type Props = {
  form: CollectionType | undefined;
  setForm: (form: CollectionType | FormType) => void;
  setCurrentPage: (page: string) => void;
  setLoading: (loading: boolean) => void;
};

const StartPage = ({ form, setCurrentPage, setLoading, setForm }: Props) => {
  const router = useRouter();
  const { formId } = router.query;
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
          <Box display="flex" flexDirection="column" marginTop="4" gap="4">
            {form.formMetadata.formRoleGating &&
              form.formMetadata.formRoleGating.length > 0 && (
                <Text weight="semiBold" variant="large">
                  This form is role gated
                </Text>
              )}
            {form.formMetadata.mintkudosTokenId && (
              <Text weight="semiBold" variant="large">
                This form distributes soulbound tokens to responders
              </Text>
            )}
            {form.formMetadata.surveyTokenId && (
              <Text weight="semiBold" variant="large">
                This form distributes erc20 tokens to responders
              </Text>
            )}
            {form.formMetadata.sybilProtectionEnabled && (
              <Text weight="semiBold" variant="large">
                This form is Sybil protected
              </Text>
            )}
            {form.formMetadata.poapEventId && (
              <Text weight="semiBold" variant="large">
                This form distributes POAP tokens to responders
              </Text>
            )}
            {form.formMetadata.walletConnectionRequired && (
              <Text weight="semiBold" variant="large">
                This form requires you to connect your wallet
              </Text>
            )}
          </Box>
        </Stack>
        <Stack direction="horizontal" justify="space-between">
          <Box paddingX="5" paddingBottom="4" width="1/2" />
          <Box paddingX="5" paddingBottom="4" width="1/2">
            <PrimaryButton
              onClick={() => {
                // if (connectedUser) {
                //   setCurrentPage(form.formMetadata.pageOrder[2]);
                // } else {
                //   setCurrentPage("connect");
                // }
                setCurrentPage(form.formMetadata.pageOrder[1]);
              }}
            >
              Start
            </PrimaryButton>
          </Box>
        </Stack>
      </Box>
    );
  } else return null;
};

export default StartPage;
