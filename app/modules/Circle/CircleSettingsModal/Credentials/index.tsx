import PrimaryButton from "@/app/common/components/PrimaryButton";
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
import { useCircle } from "../../CircleContext";

const Credentials = () => {
  const router = useRouter();
  const { circle: cId } = router.query;
  const { data: circle } = useQuery<CircleType>(["circle", cId], {
    enabled: false,
  });
  const { setHasMintkudosCredentialsSetup, setMintkudosCommunityId } =
    useCircle();
  const [kudosCommunityId, setKudosCommunityId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const res = await updatePrivateCircleCredentials(circle?.id, {
      mintkudosApiKey: apiKey,
      mintkudosCommunityId: kudosCommunityId,
    });
    if (res) {
      setHasMintkudosCredentialsSetup(true);
      setMintkudosCommunityId(kudosCommunityId);

      // Handle the case where api key or community id is emptied
      if (!apiKey || !kudosCommunityId) setHasMintkudosCredentialsSetup(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (circle?.id) {
      setIsLoading(true);
      getPrivateCircleCredentials(circle.id)
        .then((res) => {
          if (res) {
            const properties = res as GetPrivateCirclePropertiesDto;
            setApiKey(properties.mintkudosApiKey || "");
            setKudosCommunityId(properties.mintkudosCommunityId || "");
            if (properties.mintkudosApiKey && properties.mintkudosCommunityId) {
              setHasMintkudosCredentialsSetup(true);
              setMintkudosCommunityId(properties.mintkudosCommunityId);
            }
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <Box>
      <Stack>
        <Input
          label=""
          placeholder="Mintkudos Community Id"
          value={kudosCommunityId}
          onChange={(e) => setKudosCommunityId(e.target.value)}
        />
        <Input
          label=""
          placeholder="Mintkudos API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />

        <Box marginTop="4" width="full">
          <PrimaryButton onClick={onSubmit} loading={isLoading}>
            Update Mintkudos Credentials
          </PrimaryButton>
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Box display="flex" flexDirection="column">
              <Box
                marginTop="2"
                cursor="pointer"
                onClick={() => {
                  window.open("https://discord.gg/jXtNXTcN87", "_blank");
                }}
              >
                <Text>How to generate credentials?</Text>
              </Box>
              <Box
                marginTop="2"
                cursor="pointer"
                onClick={() => {
                  window.open("https://mintkudos.xyz/", "_blank");
                }}
              >
                <Text>What is Mintkudos?</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Credentials;
