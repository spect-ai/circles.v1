import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { useGlobal } from "@/app/context/globalContext";
import useCredentials from "@/app/services/Credentials";
import {
  getPrivateCircleCredentials,
  GetPrivateCirclePropertiesDto,
} from "@/app/services/PrivateCircle";
import {
  CommunityKudosType,
  KudosRequestType,
  KudosType,
  Permissions,
  UserType,
} from "@/app/types";
import { Box, Button, Input, MediaPicker, Stack, Text, Textarea } from "degen";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCollection } from "../Context/LocalCollectionContext";
import Credentials from "../../Circle/CircleSettingsModal/Credentials";
import Image from "next/image";
import { storeImage } from "@/app/common/utils/ipfs";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "react-tippy";
import styled from "styled-components";
import { AdditionalSettings } from "../Form/AdditionalSettings";

const ScrollContainer = styled(Box)`
  overflow-x: auto;
  max-width: 24rem;
`;

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
  const {
    mintKudos,
    recordCollectionKudos,
    getKudos,
    addCustomKudosDesign,
    getCommunityKudosDesigns,
  } = useCredentials();
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const [perm, setPerm] = useState({} as Permissions);
  const [kudos, setKudos] = useState({} as KudosType);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(kudos?.imageUrl || "");
  const [asset, setAsset] = useState({} as File);
  const [selectedNftTypeId, setSelectedNftTypeId] = useState("");
  const [assetToUse, setAssetToUse] = useState("defaultOrangeRed");
  const [assetUrl, setAssetUrl] = useState(
    "https://spect.infura-ipfs.io/ipfs/QmU2pYbqiVnNc7WKQ9yBkEmUvxWg6Ha1LAzpHdCSABwct7"
  );

  const [communityKudosDesigns, setCommunityKudosDesigns] = useState(
    [] as CommunityKudosType[]
  );

  const uploadFile = async (file: File) => {
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file);
      console.log({ imageGatewayURL });
      setUploadedImage(imageGatewayURL);
      setUploading(false);
      setAssetUrl(imageGatewayURL);
    }
  };

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

  useEffect(() => {
    if (isOpen)
      getCommunityKudosDesigns()
        .then((res) => {
          console.log(res);
          setCommunityKudosDesigns(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [isOpen]);

  return (
    <>
      {!collection.mintkudosTokenId && <Text variant="label">And</Text>}
      {collection.mintkudosTokenId && (
        <Text variant="label">And send the following kudos</Text>
      )}
      {!loading && kudos.imageUrl && (
        <Box display="flex" flexDirection="row" width="full">
          {" "}
          <Box width="1/2">
            {" "}
            <Image
              src={`${kudos.imageUrl}`}
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
      <Text variant="label">Some Additional Stuff</Text>
      <Stack direction="vertical" space="4">
        <AdditionalSettings />
      </Stack>

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
              <Box padding="8">
                <Credentials />
              </Box>
            </Modal>
          )}
          {isOpen && hasMintkudosCredentialsSetup && (
            <Modal
              size="medium"
              title="Send Kudos 🎉"
              handleClose={() => setIsOpen(false)}
            >
              <Box
                display="flex"
                flexDirection="row"
                paddingTop="4"
                paddingLeft="8"
                paddingRight="8"
                paddingBottom="4"
                justifyContent="center"
                alignItems="flex-start"
                width="full"
              >
                <Box
                  width="1/2"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Box
                    marginBottom="4"
                    marginTop="4"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    marginRight="8"
                  >
                    <Image
                      src={assetUrl}
                      width="250%"
                      height="250%"
                      objectFit="contain"
                      alt="Kudos img"
                    />
                    {communityKudosDesigns.length > 0 && (
                      <ScrollContainer
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        marginBottom="4"
                        marginTop="4"
                      >
                        {communityKudosDesigns.map((k: CommunityKudosType) => (
                          <Box margin="0.5" key={k.nftTypeId}>
                            <Image
                              src={k.previewAssetUrl}
                              width="100%"
                              height="100%"
                              objectFit="contain"
                              alt="Kudos img"
                              onClick={() => {
                                setAssetToUse(k.nftTypeId);
                                setAssetUrl(k.previewAssetUrl);
                              }}
                            />
                          </Box>
                        ))}
                      </ScrollContainer>
                    )}
                  </Box>
                </Box>
                <Box width="1/2">
                  <Box paddingBottom="4" width="full">
                    <Stack>
                      <Stack direction="horizontal" space="4">
                        <Textarea
                          label={
                            <Stack direction="horizontal" space="2">
                              <Text variant="label">Headline</Text>
                              <Tooltip title="The headline only shows up in the image for the default mintkudos image. For custom images, the headline is still added on chain with the NFT, however it doesn't show up in the image.">
                                <InfoCircleOutlined />
                              </Tooltip>
                            </Stack>
                          }
                          value={headlineContent}
                          onChange={(e) => setHeadlineContent(e.target.value)}
                          maxLength={50}
                        />
                      </Stack>
                      <MediaPicker
                        compact
                        defaultValue={{
                          type: "image/png",
                          url: uploadedImage,
                        }}
                        label="Choose or drag and drop custom kudos image"
                        uploaded={!!uploadedImage}
                        onChange={async (f) => {
                          await uploadFile(f);
                          setAsset(f);
                          setAssetToUse("custom");
                        }}
                        onReset={() => {
                          setUploadedImage("");
                          setAssetUrl(
                            "https://spect.infura-ipfs.io/ipfs/QmU2pYbqiVnNc7WKQ9yBkEmUvxWg6Ha1LAzpHdCSABwct7"
                          );
                          setAssetToUse("defaultOrangeRed");
                        }}
                        uploading={uploading}
                        maxSize={10}
                      />
                    </Stack>
                  </Box>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="flex-end"
                width="full"
                paddingBottom="8"
                paddingLeft="8"
                paddingRight="8"
              >
                <Box
                  width="1/2"
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                >
                  <Button
                    loading={loading}
                    width="full"
                    size="small"
                    variant="secondary"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        let communityAsset;
                        if (assetToUse === "custom" && asset && asset.name) {
                          communityAsset = await addCustomKudosDesign(
                            asset.name,
                            asset
                          );
                        }

                        const res = await mintKudos(
                          {
                            headline: headlineContent,
                            creator: currentUser?.ethAddress as string,
                            totalClaimCount: 10000,
                            isSignatureRequired: false,
                            isAllowlistRequired: false,
                          } as KudosRequestType,
                          mintkudosCommunityId,
                          communityAsset?.nftTypeId || assetToUse
                        );
                        if (res) {
                          recordCollectionKudos(res.operationId);
                        }
                        setLoading(false);
                        if (res) {
                          setIsOpen(false);
                        }
                      } catch (err: any) {
                        setLoading(false);
                        console.log(err);
                      }
                    }}
                  >
                    Mint
                  </Button>
                </Box>
              </Box>
            </Modal>
          )}
        </AnimatePresence>
      }
    </>
  );
}
