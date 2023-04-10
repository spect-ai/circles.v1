import PrimaryButton from "@/app/common/components/PrimaryButton";
import { CollectionType } from "@/app/types";
import { Box, Stack } from "degen";
import Captcha from "./Captcha";

type Props = {
  collection: CollectionType;
  setCaptchaVerified: (value: boolean) => void;
  captchaVerified: boolean;
  setCurrentPage: (page: string) => void;
};

const Footer = ({
  collection,
  setCaptchaVerified,
  captchaVerified,
  setCurrentPage,
}: Props) => (
  <Stack direction="horizontal" justify="space-between">
    <Box paddingX="5" paddingBottom="4" width="1/2" />
    <Box
      paddingX="5"
      paddingBottom="4"
      width={{
        xs: "40",
        md: "56",
      }}
    >
      <Stack>
        <Box
          style={{
            marginLeft: "-7rem",
          }}
        >
          {collection.formMetadata.captchaEnabled && (
            <Captcha setCaptchaVerified={setCaptchaVerified} />
          )}
        </Box>
        <PrimaryButton
          disabled={collection.formMetadata.captchaEnabled && !captchaVerified}
          onClick={() => {
            setCurrentPage(collection.formMetadata.pageOrder[1]);
          }}
        >
          Start
        </PrimaryButton>
      </Stack>
    </Box>
  </Stack>
);

export default Footer;
