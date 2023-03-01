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
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
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

type Props = {
  handleClose: () => void;
};

export default function SendKudos({ handleClose }: Props) {
  const [updateKudos, setUpdateKudos] = useState(false);

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
              getPrivateCircleCredentials(circle?.id || "")
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
    getCommunityKudosDesigns()
      .then((res) => {
        setCommunityKudosDesigns(res);
      })
      .catch((err) => {
        console.error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMintkudosCredentialsSetup]);

  return (
    <Modal
      size="medium"
      title="Send Kudos 🎉"
      handleClose={handleClose}
      zIndex={2}
    >
      <Box>
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
              {!kudos.imageUrl && communityKudosDesigns.length > 0 && (
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
                    disabled={!!kudos.imageUrl}
                  />
                </Stack>
                {!kudos.imageUrl && (
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
                )}
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
                  disabled={!!kudos.imageUrl}
                />
                {filenameExceedsLimit && (
                  <Text variant="small" color="red">
                    Please add a file with filename less than 20 characters.
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
            {kudos.imageUrl && (
              <PrimaryButton
                onClick={async () => {
                  setLoading(true);
                  const res = await (
                    await fetch(
                      `${process.env.API_HOST}/collection/v1/${collection.id}`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({
                          formMetadata: {
                            ...collection.formMetadata,
                            mintkudosTokenId: null,
                          },
                        }),
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                      }
                    )
                  ).json();
                  updateCollection(res);
                  setLoading(false);
                  handleClose();
                }}
                variant="tertiary"
                loading={loading}
                disabled={loading}
              >
                Remove kudos
              </PrimaryButton>
            )}
            {!kudos.imageUrl && (
              <Button
                loading={loading}
                width="full"
                size="small"
                variant="secondary"
                disabled={loading}
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
                    res && handleClose();
                  } catch (err: unknown) {
                    setLoading(false);
                    console.log(err);
                  }
                }}
              >
                Send Kudos to Responders
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
