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
import Image from "next/image";

export default function SendKudos() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    circle,
    hasMintkudosCredentialsSetup,
    setHasMintkudosCredentialsSetup,
    setMintkudosCommunityId,
    mintkudosCommunityId,
  } = useCircle();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [headlineContent, setHeadlineContent] = useState(
    "Thanks for filling up the form!"
  );
  const { mintKudos, recordCollectionKudos, getKudos } = useCredentials();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [perm, setPerm] = useState({} as Permissions);
  const [kudos, setKudos] = useState({} as KudosType);

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

  useEffect(() => {
    console.log("kekek");
    if (collection.mintkudosTokenId) {
      setLoading(true);
      getKudos(collection.mintkudosTokenId)
        .then((res) => {
          console.log(res);
          setKudos(res);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setKudos({} as KudosType);
    }
  }, [collection]);

  console.log(kudos.imageUrl);

  return (
    <>
      {!loading && kudos.imageUrl && (
        <Box display="flex" flexDirection="row" width="full">
          {" "}
          <Box width="1/2">
            {" "}
            <Image
              src="https://images.mintkudos.xyz/token/16.png"
              width="100%"
              height="100%"
              objectFit="contain"
              alt="Kudos img"
              layout="responsive"
            />
          </Box>
          <Box marginLeft="4">
            <Stack direction="vertical" space="4">
              <PrimaryButton onClick={() => setIsOpen(true)}>
                Update kudos
              </PrimaryButton>
              <PrimaryButton
                onClick={async () => {
                  const res = await (
                    await fetch(
                      `${process.env.API_HOST}/collection/v1/${collection.id}`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({
                          mintkudosTokenId: null,
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }
                    )
                  ).json();
                  updateCollection(res);
                }}
                variant="tertiary"
              >
                Remove kudos
              </PrimaryButton>
            </Stack>
          </Box>
        </Box>
      )}

      {!collection.mintkudosTokenId && (
        <Box width="48">
          <PrimaryButton onClick={() => setIsOpen(true)}>
            Send Kudos
          </PrimaryButton>
        </Box>
      )}
      {
        <AnimatePresence>
          {isOpen && !hasMintkudosCredentialsSetup && (
            <Modal
              title="Mintkudos Integration"
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
