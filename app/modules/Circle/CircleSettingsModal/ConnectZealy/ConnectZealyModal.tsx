import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Input, Stack, Text } from "degen";
import { useState } from "react";
import { useCircle } from "../../CircleContext";
import { updateCircle } from "@/app/services/UpdateCircle";
import { toast } from "react-toastify";
import { updatePrivateCircleCredentials } from "@/app/services/PrivateCircle";
import { CircleType } from "@/app/types";

type Props = {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
};

export default function ConnectZealyModal({ setIsOpen, isOpen }: Props) {
  const { circle, setCircleData, privateCredentials, setPrivateCredentials } =
    useCircle();
  const [loading, setLoading] = useState(false);
  console.log({ privateCredentials });
  const [zealyApiKey, setZealyApiKey] = useState(
    privateCredentials.zealyApiKey || ""
  );
  const [zealyUrl, setZealyUrl] = useState(
    privateCredentials.zealySubdomain
      ? `https://zealy.io/c/${privateCredentials.zealySubdomain}/questboard`
      : ""
  );

  return (
    <Modal
      title="Zealy Integration"
      handleClose={() => setIsOpen(false)}
      size="small"
    >
      <Box padding="8" paddingTop="4">
        <Stack space="4">
          <Stack space="1">
            <Text variant="label">Zealy Questboard URL</Text>
            <Input
              label
              placeholder="https://zealy.io/c/buidl/questboard"
              value={zealyUrl}
              onChange={(e) => setZealyUrl(e.target.value)}
            />
          </Stack>{" "}
          <Stack space="1">
            <Text variant="label">API Key</Text>

            <Input
              label
              placeholder="API Key"
              value={zealyApiKey}
              onChange={(e) => setZealyApiKey(e.target.value)}
            />
          </Stack>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
            width="full"
            marginTop="6"
          >
            <Box display="flex" flexDirection="column">
              {/* <Box cursor="pointer" onClick={() => {}}>
                <Text variant="small">How do I generate an API Key?</Text>
              </Box>
              <Box cursor="pointer" onClick={() => {}}>
                <Text variant="small">Who can access this?</Text>
              </Box> */}
            </Box>
            <Box width="32">
              <PrimaryButton
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    const zUrl = new URL(zealyUrl);
                    const splitPath = zUrl.pathname.split("/");
                    console.log(splitPath);
                    if (splitPath.length < 3) {
                      throw new Error("Invalid Zealy URL");
                    }
                    const zealySubdomain = splitPath[2];
                    const res = await updatePrivateCircleCredentials(
                      circle?.id || "",
                      {
                        zealyApiKey,
                        zealySubdomain,
                      }
                    );
                    console.log({ res });
                    setPrivateCredentials(res);
                    setCircleData({
                      ...circle,
                      hasSetupZealy: true,
                    } as CircleType);
                  } catch (e) {
                    console.log(e);
                    toast.error("Invalid Zealy URL");
                    setLoading(false);
                    return;
                  }

                  setLoading(false);
                  setIsOpen(false);
                }}
              >
                Save
              </PrimaryButton>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
}
