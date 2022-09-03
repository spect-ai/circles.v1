import PrimaryButton from "@/app/common/components/PrimaryButton";
import { storeImage } from "@/app/common/utils/ipfs";
import {
  getPrivateCircleCredentials,
  GetPrivateCirclePropertiesDto,
  updatePrivateCircleCredentials,
} from "@/app/services/PrivateCircle";
import { CircleType } from "@/app/types";
import { Box, Input, Stack, Text } from "degen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function Credentials() {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const [kudosCommunityId, setKudosCommunityId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [design, setDesign] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);

    const res = await updatePrivateCircleCredentials(circle?.id, {
      mintkudosApiKey: apiKey,
      mintkudosCommunityId: kudosCommunityId,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (circle?.id) {
      setIsLoading(true);
      getPrivateCircleCredentials(circle.id)
        .then((res) => {
          if (res) {
            console.log(res);
            const properties = res as GetPrivateCirclePropertiesDto;
            setApiKey(properties.mintkudosApiKey || "");
            setKudosCommunityId(properties.mintkudosCommunityId || "");
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <Box>
      <Stack>
        <Input
          label=""
          placeholder="Mintkudos API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Input
          label=""
          placeholder="Mintkudos Community Id"
          value={kudosCommunityId}
          onChange={(e) => setKudosCommunityId(e.target.value)}
        />

        <Box marginTop="4" width="full">
          <PrimaryButton
            onClick={onSubmit}
            loading={isLoading}
            disabled={uploading}
            shape="circle"
          >
            Update Mintkudos Credentials
          </PrimaryButton>
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Box
              marginTop="2"
              cursor="pointer"
              onClick={() => {
                window.open("https://discord.gg/3By9PAAP", "_blank");
              }}
            >
              <Text>How to generate credentials?</Text>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
