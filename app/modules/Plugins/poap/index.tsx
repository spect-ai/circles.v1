import Accordian from "@/app/common/components/Accordian";
import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { updateFormCollection } from "@/app/services/Collection";
import { createPoap } from "@/app/services/Poap";
import { UserType } from "@/app/types";
import {
  Box,
  Button,
  FileInput,
  IconClose,
  Input,
  MediaPicker,
  Stack,
  Text,
  Textarea,
  useTheme,
  VisuallyHidden,
} from "degen";
import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { useCircle } from "../../Circle/CircleContext";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";

type Props = {
  handleClose: () => void;
};

export default function DistributePOAP({ handleClose }: Props) {
  const { mode } = useTheme();

  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const {} = useCircle();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(
    `Responded to ${collection.name}`.slice(0, 256)
  );
  const [description, setDescription] = useState("");
  const [eventUrl, setEventUrl] = useState(
    `https://circles.spect.network/r/${collection.slug}`
  );
  const [email, setEmail] = useState(currentUser?.email || "");
  let today = new Date();
  let fromNow2Days = new Date();
  fromNow2Days.setDate(today.getDate() + 2);
  let fromNow10Days = new Date();
  fromNow10Days.setDate(today.getDate() + 10);

  const [startDate, setStartDate] = useState(
    fromNow2Days.toJSON().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(fromNow10Days.toJSON().slice(0, 10));
  const [virtual, setVirtual] = useState(true);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState("" as any);
  const [numberOfPoaps, setNumberOfPoaps] = useState(1000);
  const [assetUrl, setAssetUrl] = useState("");
  const [modalMode, setModalMode] =
    useState<"createPoapFromScratch" | "importClaimCodes">("importClaimCodes");

  const [errorMessage, setErrorMessage] = useState("");
  const [poapEventId, setPoapEventId] = useState(
    collection.formMetadata?.poapEventId || ""
  );
  const [poapEditCode, setPoapEditCode] = useState(
    collection.formMetadata?.poapEditCode || ""
  );

  const validateClaimCodes = (codes: string[]) => {
    console.log({ codes });
    if (codes.length === 0) {
      setErrorMessage("Please add at least one claim code");
      return false;
    }
    for (const code of codes) {
      if (!code.includes("http://POAP.xyz/claim/")) {
        console.log({ code });
        setErrorMessage(
          "Please make sure all claim codes start with http://POAP.xyz/claim/"
        );
        return false;
      }
      if (code.split("http://POAP.xyz/claim/")[1].length !== 6) {
        setErrorMessage(
          "Please make sure all claim codes are 6 characters long"
        );
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  if (modalMode === "importClaimCodes") {
    return (
      <Modal
        size="small"
        title="Import POAP Event 🏅"
        handleClose={handleClose}
        zIndex={2}
      >
        <Box padding="8">
          <Stack direction="vertical" space="4">
            <Stack direction="vertical" space="1">
              <Text variant="label">Poap event id</Text>
              <Input
                label
                value={poapEventId}
                onChange={(e) => setPoapEventId(e.target.value)}
              />
            </Stack>
            <Stack direction="vertical" space="1">
              <Text variant="label">Poap edit code</Text>
              <Input
                label
                value={poapEditCode}
                onChange={(e) => setPoapEditCode(e.target.value)}
              />
            </Stack>
          </Stack>
          <Box display="flex" flexDirection="column" gap="2" marginTop="4">
            <Box display="flex" flexDirection="row" justifyContent="flex-end">
              <Text color="red">{errorMessage}</Text>
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
              alignItems="flex-start"
              gap="2"
            >
              {collection.formMetadata.poapEventId && (
                <PrimaryButton
                  variant="tertiary"
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const res = await updateFormCollection(collection.id, {
                      formMetadata: {
                        ...collection.formMetadata,
                        poapDistributionEnabled: false,
                        poapEventId: "",
                        poapEditCode: "",
                      },
                    });
                    updateCollection(res);
                    if (res) {
                      handleClose();
                    }

                    setLoading(false);
                  }}
                >
                  Disable POAP
                </PrimaryButton>
              )}
              {!collection.formMetadata.poapEventId && (
                <PrimaryButton
                  variant="secondary"
                  loading={loading}
                  onClick={async () => {
                    setLoading(true);
                    const res = await updateFormCollection(collection.id, {
                      formMetadata: {
                        ...collection.formMetadata,
                        poapDistributionEnabled: true,
                        poapEventId,
                        poapEditCode,
                        walletConnectionRequired: true,
                      },
                    });
                    updateCollection(res);
                    if (res) {
                      setLoading(false);
                    } else setLoading(false);
                  }}
                >
                  Add Poap Event
                </PrimaryButton>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }
  return (
    <Modal
      size="medium"
      title="Distribute POAPs 🏅"
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
              <MediaPicker
                defaultValue={{
                  type: "image/png, image/gif",
                  url: assetUrl,
                }}
                label="Drop your design here 😊"
                onChange={async (f) => {
                  console.log({ f });
                  const reader = new FileReader();
                  reader.readAsDataURL(f);
                  reader.onload = function () {
                    console.log({ lll: reader.result });
                    //setImage(reader.result as string);
                  };
                  reader.onerror = function (error) {
                    console.log("Error: ", error);
                  };
                  setImage(f);
                }}
                onReset={() => {
                  setImage("");
                }}
                uploading={uploading}
                maxSize={4}
                accept="image/png, image/gif"
              />
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
                <Stack direction="vertical" space="1">
                  <Stack direction="horizontal" space="2">
                    <Text variant="label">Name</Text>
                  </Stack>
                  <Textarea
                    label
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={256}
                    rows={2}
                  />
                </Stack>
                <Stack direction="vertical" space="1">
                  <Stack direction="horizontal" space="2">
                    <Text variant="label">Description</Text>
                  </Stack>
                  <Textarea
                    label
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={1500}
                  />
                </Stack>
                <Stack direction="vertical" space="1">
                  <Text variant="label">
                    Number of responders that get POAPs
                  </Text>
                  <Input
                    label
                    value={numberOfPoaps}
                    type="number"
                    min={1}
                    max={1000}
                    required={true}
                    onChange={(e) => setNumberOfPoaps(parseInt(e.target.value))}
                  />
                </Stack>
                <Stack direction="vertical" space="1">
                  <Text variant="label">Link a Url</Text>
                  <Input
                    label
                    value={eventUrl}
                    required={true}
                    inputMode="url"
                    onChange={(e) => setEventUrl(e.target.value)}
                  />
                </Stack>
                <Stack direction="horizontal" space="2" align="center">
                  <CheckBox
                    isChecked={!virtual}
                    onClick={async () => {
                      setVirtual(!virtual);
                    }}
                  />
                  <Text variant="base">
                    This form is shared at a physical event
                  </Text>
                </Stack>
                {!virtual && (
                  <Stack direction="horizontal" space="1">
                    <Stack direction="vertical" space="1">
                      <Text variant="label">Country</Text>
                      <Input
                        label
                        value={country}
                        required={true}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </Stack>
                    <Stack direction="vertical" space="1">
                      <Text variant="label">City</Text>

                      <Input
                        label
                        value={city}
                        required={true}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </Stack>
                  </Stack>
                )}
                <Accordian name="Advanced Settings" defaultOpen={false}>
                  <Stack direction="horizontal" space="1">
                    <Stack direction="vertical" space="1">
                      <Text variant="label">Start Date</Text>
                      <DateInput
                        placeholder={`Enter Start Date`}
                        value={startDate}
                        type="date"
                        mode={mode}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                        }}
                      />
                    </Stack>
                    <Stack direction="vertical" space="1">
                      <Text variant="label">End Date</Text>
                      <DateInput
                        placeholder={`Enter End Date`}
                        value={endDate}
                        type="date"
                        mode={mode}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}
                      />
                    </Stack>
                  </Stack>
                </Accordian>
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
                  const res = await createPoap(collection.id, {
                    name,
                    description,
                    requestedCodes: numberOfPoaps,
                    eventUrl,
                    image,
                    startDate,
                    endDate,
                    city,
                    country,
                    virtual,
                    email,
                  });
                  console.log({ res });
                  setLoading(false);
                } catch (err: unknown) {
                  setLoading(false);
                  console.log(err);
                }
              }}
            >
              Create POAP
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export const DateInput = styled.input<{ mode: string }>`
  padding: 0.7rem;
  border-radius: 0.55rem;
  border 1px solid ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.1)" : "rgb(20,20,20,0.1)"};
  background-color: ${(props) =>
    props.mode === "dark" ? "rgb(20,20,20)" : "rgb(255, 255, 255)"};
  width: 100%;
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.7)" : "rgb(20,20,20,0.7)"};
  outline: none;
  &:focus {
    border-color: rgb(191, 90, 242, 1);
  }
  transition: border-color 0.5s ease;
`;

const ClaimCodeContainer = styled.textarea<{ mode: string }>`
  width: 100%;
  border-radius: 1rem;
  border 1px solid ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255,0.1)" : "rgb(20,20,20,0.1)"};
  background-color: ${(props) =>
    props.mode === "dark" ? "rgb(20,20,20)" : "rgb(255, 255, 255)"};
  padding: 1rem;
  caret-color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
  color: ${(props) =>
    props.mode === "dark" ? "rgb(255, 255, 255, 0.7)" : "rgb(20, 20, 20, 0.7)"};
    line-height: 1.5;
    font-size: 1rem;
  font-family: Inter;
resize: none;
`;
