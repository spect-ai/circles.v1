import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useCredentials from "@/app/services/Credentials";
import {
  getPrivateCircleCredentials,
  GetPrivateCirclePropertiesDto,
} from "@/app/services/PrivateCircle";
import {
  KudosRequestType,
  KudosType,
  Permissions,
  UserType,
} from "@/app/types";
import { Box, Input, Stack, Text, Textarea } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCollection } from "../Context/LocalCollectionContext";

export default function SendKudos() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    circle,
    hasMintkudosCredentialsSetup,
    setHasMintkudosCredentialsSetup,
    setMintkudosCommunityId,
    mintkudosCommunityId,
  } = useCircle();
  const { localCollection: collection, setLocalCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [headlineContent, setHeadlineContent] = useState(
    "Thanks for filling up the form!"
  );
  const { mintKudos, recordCollectionKudos } = useCredentials();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [perm, setPerm] = useState({} as Permissions);

  useEffect(() => {
    fetch(
      `${process.env.API_HOST}/circle/myPermissions?circleIds=${circle?.id}`,
      {
        credentials: "include",
      }
    )
      .then((res) => {
        res
          .json()
          .then((permissions: Permissions) => {
            setPerm(permissions);
            if (permissions?.distributeCredentials) {
              getPrivateCircleCredentials(circle?.id)
                .then((creds: GetPrivateCirclePropertiesDto | boolean) => {
                  const credentials = creds as GetPrivateCirclePropertiesDto;
                  if (
                    credentials &&
                    credentials.mintkudosApiKey &&
                    credentials.mintkudosCommunityId
                  ) {
                    setHasMintkudosCredentialsSetup(true);
                    setMintkudosCommunityId(credentials.mintkudosCommunityId);
                  }
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <PrimaryButton onClick={() => setIsOpen(true)}>Send Kudos</PrimaryButton>
      {
        <AnimatePresence>
          {isOpen && !hasMintkudosCredentialsSetup && (
            <Modal
              title="Guild Integration"
              handleClose={() => setIsOpen(false)}
              size="small"
            >
              <Box padding="8" width="full">
                <Stack>
                  <Box
                    width="full"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <PrimaryButton
                      loading={loading}
                      onClick={async () => {
                        setLoading(true);

                        setLoading(false);
                      }}
                    >
                      Save
                    </PrimaryButton>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box
                        margin="4"
                        cursor="pointer"
                        width="2/3"
                        onClick={() => {
                          window.open("https://guild.xyz/explorer", "_blank");
                        }}
                      >
                        <Text>{`I haven't setup my guild yet`}</Text>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Modal>
          )}
          {isOpen && circle.guildxyzId && (
            <Modal
              size="small"
              title="Send Kudos 🎉"
              handleClose={() => setIsOpen(false)}
            >
              <Box
                paddingTop="2"
                paddingRight="8"
                paddingLeft="8"
                paddingBottom="4"
              >
                <Box padding="1" paddingTop="4" paddingBottom="4" width="full">
                  <Stack>
                    <Textarea
                      label="Headline"
                      value={headlineContent}
                      onChange={(e) => setHeadlineContent(e.target.value)}
                      maxLength={50}
                    />
                  </Stack>
                </Box>
                {/* <Box width="1/2" paddingRight="8" paddingBottom="4">
                    <SoulboundToken
                      content={`${headlineContent}`}
                      issuedBy={`${circle?.name}`}
                      issuedOn={new Date().toISOString().slice(0, 10)}
                      issuerAvatar={`${circle?.avatar}`}
                    />
                  </Box> */}
                <PrimaryButton
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);

                    const res = await mintKudos(
                      {
                        headline: headlineContent,
                        creator: currentUser?.ethAddress as string,
                        totalClaimCount: 10000,
                        isSignatureRequired: false,
                        isAllowlistRequired: false,
                      } as KudosRequestType,
                      mintkudosCommunityId
                    );
                    if (res) {
                      recordCollectionKudos(res.operationId);
                    }
                    setLoading(false);
                    if (res) {
                      setIsOpen(false);
                    }
                  }}
                >
                  Mint
                </PrimaryButton>
              </Box>
            </Modal>
          )}
        </AnimatePresence>
      }
    </>
  );
}
