import { CollectionType } from "@/app/types";
import { Box, Stack } from "degen";
import Captcha from "./Captcha";
import { Button } from "@avp1598/vibes";

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
}: Props) => {
  return (
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
          {collection.formMetadata.captchaEnabled && (
            <Captcha setCaptchaVerified={setCaptchaVerified} />
          )}
          <Button
            disabled={
              collection.formMetadata.captchaEnabled && !captchaVerified
            }
            onClick={() => {
              setCurrentPage(collection.formMetadata.pageOrder[1]);
            }}
          >
            Start
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Footer;
