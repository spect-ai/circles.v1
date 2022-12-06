import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
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
import {
  Box,
  Button,
  IconSparkles,
  Input,
  MediaPicker,
  Stack,
  Text,
  Textarea,
} from "degen";
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
import mixpanel from "@/app/common/utils/mixpanel";

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
  const [kudos, setKudos] = useState({} as KudosType);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(kudos?.imageUrl || "");
  const [asset, setAsset] = useState({} as File);
  const [assetToUse, setAssetToUse] = useState("defaultOrangeRed");
  const [numberOfKudosToMint, setNumberOfKudosToMint] = useState(
    collection.formMetadata.numOfKudos || 1000
  );
  const [assetUrl, setAssetUrl] = useState(
    "https://spect.infura-ipfs.io/ipfs/QmU2pYbqiVnNc7WKQ9yBkEmUvxWg6Ha1LAzpHdCSABwct7"
  );
  const [filenameExceedsLimit, setFilenameExceedsLimit] = useState(false);

  const [communityKudosDesigns, setCommunityKudosDesigns] = useState(
    [] as CommunityKudosType[]
  );

  const uploadFile = async (file: File) => {
    if (file) {
      setUploading(true);
      const { imageGatewayURL } = await storeImage(file);
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
                .catch((err) => console.error(err));
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circle?.id]);

  useEffect(() => {
    if (collection.formMetadata.mintkudosTokenId) {
      setLoading(true);
      getKudos(collection.formMetadata.mintkudosTokenId)
        .then((res) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  useEffect(() => {
    if (isOpen)
      getCommunityKudosDesigns()
        .then((res) => {
          setCommunityKudosDesigns(res);
        })
        .catch((err) => {
          console.error(err);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hasMintkudosCredentialsSetup]);

  return (
    <Stack space="2">
      <Text variant="label">Distribute Soulbound tokens to responders</Text>
      {!loading && kudos.imageUrl && (
        <Box
          display="flex"
          flexDirection={{
            xs: "column",
            md: "row",
          }}
          width="full"
          id="imagecontainer"
        >
          <Box
            width={{
              xs: "full",
              md: "1/2",
            }}
            marginBottom="4"
            id="imagebox"
          >
            <Image
              src={`${kudos.imageUrl}`}
              width="100%"
              height="100%"
              objectFit="contain"
              alt="Kudos img"
              layout="responsive"
            />
          </Box>
          <Box
            marginLeft={{
              xs: "0",
              md: "4",
            }}
          >
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

      {!collection.formMetadata.mintkudosTokenId && (
        <Box
          width={{
            xs: "full",
            md: "1/2",
          }}
        >
          <PrimaryButton
            onClick={() => setIsOpen(true)}
            icon={<IconSparkles />}
          >
            Send Kudos
          </PrimaryButton>
        </Box>
      )}
      {
        <AnimatePresence>
          {/* {isOpen && !hasMintkudosCredentialsSetup && (
            <Modal
              title="Mintkudos Integration"
              handleClose={() => setIsOpen(false)}
              size="small"
              zIndex={2}
            >
              <Box padding="8">
                <Credentials />
              </Box>
            </Modal>
          )} */}
          {isOpen && (
            <Modal
              size="medium"
              title="Send Kudos 🎉"
              handleClose={() => setIsOpen(false)}
              zIndex={2}
            >
              <Box
                display="flex"
                flexDirection={{
                  xs: "column",
                  md: "row",
                }}
                padding={{
                  xs: "4",
                  md: "8",
                }}
                justifyContent="center"
                alignItems="flex-start"
                width="full"
              >
                <Box
                  width={{
                    xs: "full",
                    md: "1/2",
                  }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Box
                    marginY="4"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    marginRight={{
                      xs: "0",
                      md: "8",
                    }}
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
                        marginY="4"
                      >
                        {communityKudosDesigns.map((k: CommunityKudosType) => (
                          <Box key={k.nftTypeId}>
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
                <Box
                  width={{
                    xs: "full",
                    md: "1/2",
                  }}
                >
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
                        label="Choose or drag and drop custom design"
                        uploaded={!!uploadedImage}
                        onChange={async (f) => {
                          if (f.name?.length > 20) {
                            setFilenameExceedsLimit(true);
                            return;
                          } else setFilenameExceedsLimit(false);
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
                          setFilenameExceedsLimit(false);
                        }}
                        uploading={uploading}
                        maxSize={10}
                      />
                      <Input
                        label="Number of Kudos"
                        value={numberOfKudosToMint}
                        type="number"
                        min={1}
                        max={10000}
                        required={true}
                        onChange={(e) =>
                          setNumberOfKudosToMint(parseInt(e.target.value))
                        }
                      />
                      {filenameExceedsLimit && (
                        <Text variant="small" color="red">
                          Please add a file with filename less than 20
                          characters.
                        </Text>
                      )}
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
                        process.env.NODE_ENV === "production" &&
                          mixpanel.track("Form Mint Kudos", {
                            user: currentUser?.username,
                            form: collection.name,
                          });
                        const res = await mintKudos(
                          {
                            headline: headlineContent,
                            creator: currentUser?.ethAddress as string,
                            totalClaimCount: numberOfKudosToMint || 10000,
                            isSignatureRequired: false,
                            isAllowlistRequired: false,
                          } as KudosRequestType,
                          mintkudosCommunityId?.length > 0
                            ? mintkudosCommunityId
                            : "c6c9a5ff-9d3c-4858-ade1-354e1ecd0cb0",
                          communityAsset?.nftTypeId || assetToUse
                        );
                        if (res) {
                          recordCollectionKudos(
                            res.operationId,
                            numberOfKudosToMint
                          );
                        }
                        setLoading(false);
                        if (res) {
                          setIsOpen(false);
                        }
                      } catch (err: unknown) {
                        setLoading(false);
                        console.log(err);
                      }
                    }}
                  >
                    Send Kudos to Responders
                  </Button>
                </Box>
              </Box>
            </Modal>
          )}
        </AnimatePresence>
      }
    </Stack>
  );
}
