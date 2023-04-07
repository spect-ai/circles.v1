import Modal from "@/app/common/components/Modal";
import CheckBox from "@/app/common/components/Table/Checkbox";
import { createPoap } from "@/app/services/Poap";
import { Box, Button, Input, MediaPicker, Stack, Text, Textarea } from "degen";
import { useState } from "react";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";
import { toast } from "react-toastify";

import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import ResponseMatchDistribution from "../common/ResponseMatchDistribution";
import ImportClaimCodes from "./ImportClaimCodes";

type Props = {
  handleClose: () => void;
};

const DistributePOAP = ({ handleClose }: Props) => {
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });
  const { localCollection: collection } = useLocalCollection();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(
    `Responded to ${collection.name}`.slice(0, 256)
  );
  const [description, setDescription] = useState("");
  const [eventUrl, setEventUrl] = useState(
    `https://circles.spect.network/r/${collection.slug}`
  );
  const [email] = useState(currentUser?.email || "");
  const today = new Date();
  const fromNow2Days = new Date();
  fromNow2Days.setDate(today.getDate() + 2);
  const fromNow10Days = new Date();
  fromNow10Days.setDate(today.getDate() + 10);

  const [startDate] = useState(fromNow2Days.toJSON().slice(0, 10));
  const [endDate] = useState(fromNow10Days.toJSON().slice(0, 10));
  const [virtual, setVirtual] = useState(true);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [poapEventId, setPoapEventId] = useState(
    collection.formMetadata?.poapEventId || ""
  );
  const [poapEditCode, setPoapEditCode] = useState(
    collection.formMetadata?.poapEditCode || ""
  );
  const [uploading] = useState(false);
  const [image, setImage] = useState<File>();
  const [numberOfPoaps, setNumberOfPoaps] = useState(1000);
  const [assetUrl] = useState("");
  const [modalMode, setModalMode] =
    useState<
      | "createPoapFromScratch"
      | "importClaimCodes"
      | "distributePoapWhenResponsesMatch"
      | "distributePoapOnDiscordCallAttendance"
      | "createKudos"
    >("importClaimCodes");
  const [
    minimumNumberOfAnswersThatNeedToMatch,
    setMinimumNumberOfAnswersThatNeedToMatch,
  ] = useState(
    collection.formMetadata?.minimumNumberOfAnswersThatNeedToMatchForPoap || 0
  );

  const [responseData, setResponseData] = useState(
    collection.formMetadata?.responseDataForPoap || {}
  );
  if (
    ["importClaimCodes", "distributePoapWhenResponsesMatch"].includes(modalMode)
  ) {
    return (
      <Modal
        size={modalMode === "importClaimCodes" ? "small" : "medium"}
        title="Import POAP Event 🏅"
        handleClose={handleClose}
        zIndex={2}
      >
        <Box padding="8">
          {modalMode === "importClaimCodes" && (
            <ImportClaimCodes
              handleClose={handleClose}
              setModalMode={setModalMode}
              poapEditCode={poapEditCode}
              setPoapEditCode={setPoapEditCode}
              poapEventId={poapEventId}
              setPoapEventId={setPoapEventId}
              minimumNumberOfAnswersThatNeedToMatch={
                minimumNumberOfAnswersThatNeedToMatch
              }
              responseData={responseData}
            />
          )}
          {modalMode === "distributePoapWhenResponsesMatch" && (
            <ResponseMatchDistribution
              setModalModal={setModalMode}
              data={responseData}
              setData={setResponseData}
              minimumNumberOfAnswersThatNeedToMatch={
                minimumNumberOfAnswersThatNeedToMatch
              }
              setMinimumNumberOfAnswersThatNeedToMatch={
                setMinimumNumberOfAnswersThatNeedToMatch
              }
              responseMatchConditionForPlugin="poap"
            />
          )}
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
                  const reader = new FileReader();
                  reader.readAsDataURL(f);
                  reader.onerror = function (error) {
                    console.error("Error: ", error);
                  };
                  setImage(f);
                }}
                onReset={() => {
                  setImage(undefined);
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
                    required
                    onChange={(e) => setNumberOfPoaps(parseInt(e.target.value))}
                  />
                </Stack>
                <Stack direction="vertical" space="1">
                  <Text variant="label">Link a Url</Text>
                  <Input
                    label
                    value={eventUrl}
                    required
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
                        required
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </Stack>
                    <Stack direction="vertical" space="1">
                      <Text variant="label">City</Text>

                      <Input
                        label
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </Stack>
                  </Stack>
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
                  if (!image) {
                    toast.error("Please upload an image");
                    setLoading(false);
                    return;
                  }
                  await createPoap(collection.id, {
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
                  setLoading(false);
                } catch (err: unknown) {
                  setLoading(false);
                  console.error(err);
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
};

export default DistributePOAP;
