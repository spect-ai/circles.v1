import Accordian from "@/app/common/components/Accordian";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { updateFormCollection } from "@/app/services/Collection";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Box, Stack, useTheme, Text, Input, Button } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";
import { useLocalCollection } from "../../Collection/Context/LocalCollectionContext";
import ResponseMatchDistribution, {
  quizValidFieldTypes,
} from "../common/ResponseMatchDistribution";
import { logError } from "@/app/common/utils/utils";
import Modal from "@/app/common/components/Modal";
import ResponseMatchXPDistribution from "../common/ResponseMatchXPDistribution";
import { useCircle } from "../../Circle/CircleContext";
import useRoleGate from "@/app/services/RoleGate/useRoleGate";
import { AnimatePresence } from "framer-motion";
import ConnectZealyModal from "../../Circle/CircleSettingsModal/ConnectZealy/ConnectZealyModal";

export type Props = {
  handleClose: () => void;
  setupMode: boolean;
  setSetupMode: (value: boolean) => void;
};

export default function Zealy({ handleClose, setupMode, setSetupMode }: Props) {
  const { mode } = useTheme();
  const { localCollection: collection, updateCollection } =
    useLocalCollection();
  const [errorMessage, setErrorMessage] = useState("");
  const { circle } = useCircle();
  const [loading, setLoading] = useState(false);

  const [xp, setXp] = useState(
    collection.formMetadata.zealyXpPerField || ({} as { [key: string]: number })
  );
  const [totalXp, setTotalXp] = useState(collection.formMetadata.zealyXP || 0);
  const [responseData, setResponseData] = useState<any>(
    collection.formMetadata.responseDataForZealy || {}
  );
  const [modalMode, setModalMode] =
    useState<"distributeXpWhenResponsesMatch" | "setXp">("setXp");
  const zealyXpPerFieldIsSet = Object.keys(xp || {}).some(
    (propertyId) => xp[propertyId] > 0
  );

  return (
    <Box>
      {setupMode && !circle?.hasSetupZealy && (
        <ConnectZealyModal
          isOpen={setupMode}
          setIsOpen={() => {
            setSetupMode(false);
          }}
        />
      )}
      {circle?.hasSetupZealy && (
        <Modal
          title="Distribute XP on Zealy"
          size="small"
          handleClose={handleClose}
        >
          {modalMode === "setXp" && (
            <Box
              padding={{
                xs: "4",
                md: "8",
              }}
              width="full"
            >
              <Stack direction="vertical" space="4">
                <Stack direction="vertical" space="1">
                  <Text variant="label">
                    How much total XP do responders get?
                  </Text>
                  <Input
                    label
                    value={totalXp}
                    type="number"
                    onChange={(e) => setTotalXp(parseInt(e.target.value))}
                    units="XP"
                    disabled={zealyXpPerFieldIsSet}
                  />
                </Stack>
              </Stack>
              <Accordian
                name="Set XP for each field and distribute when responses match
            (ideal for quizzes)"
                defaultOpen={zealyXpPerFieldIsSet}
              >
                <Stack direction="vertical" space="2">
                  {!zealyXpPerFieldIsSet && (
                    <>
                      <PrimaryButton
                        variant="tertiary"
                        onClick={() => {
                          setModalMode("distributeXpWhenResponsesMatch");
                        }}
                      >
                        Set XP for each field
                      </PrimaryButton>
                    </>
                  )}
                  {zealyXpPerFieldIsSet && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      gap="2"
                      borderColor="backgroundSecondary"
                    >
                      <Stack
                        direction="horizontal"
                        space="2"
                        align="flex-start"
                      >
                        <Text color="green">
                          <CheckCircleOutlined />
                        </Text>
                        <Text>
                          {`You've set XP that will be distributed for each field.`}
                        </Text>
                      </Stack>
                      <Box marginLeft="4">
                        <Button
                          variant="tertiary"
                          size="small"
                          onClick={() =>
                            setModalMode("distributeXpWhenResponsesMatch")
                          }
                        >
                          Update
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Accordian>
              <Box display="flex" flexDirection="column" gap="2" marginTop="8">
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                >
                  <Text color="red">{errorMessage}</Text>
                </Box>

                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="flex-end"
                  alignItems="flex-start"
                  gap="2"
                >
                  {collection.formMetadata.zealyXP && (
                    <PrimaryButton
                      variant="tertiary"
                      loading={loading}
                      onClick={async () => {
                        setLoading(true);
                        const res = await updateFormCollection(collection.id, {
                          formMetadata: {
                            ...collection.formMetadata,
                            zealyXP: undefined,
                            zealyXpPerField: {},
                            responseDataForZealy: {},
                          },
                        });
                        if (!res?.id) {
                          logError("Update collection failed");
                          setLoading(false);
                          return;
                        }
                        updateCollection(res);
                        setLoading(false);
                        handleClose();
                      }}
                    >
                      Remove XPs
                    </PrimaryButton>
                  )}

                  {!collection.formMetadata.zealyXP && (
                    <PrimaryButton
                      variant="secondary"
                      loading={loading}
                      onClick={async () => {
                        setLoading(true);
                        console.log({
                          xp,
                          totalXp,
                          responseData,
                        });
                        if (!totalXp) {
                          toast.error("Please enter total XP");
                          setLoading(false);
                          return;
                        }
                        const res = await updateFormCollection(collection.id, {
                          formMetadata: {
                            ...collection.formMetadata,
                            zealyXP: totalXp,
                            zealyXpPerField: xp,
                            responseDataForZealy: responseData,
                          },
                        });
                        if (!res?.formMetadata?.zealyXP) {
                          logError("Update collection failed");
                          setLoading(false);
                          return;
                        }

                        updateCollection(res);
                        setLoading(false);
                        handleClose();
                      }}
                    >
                      Send XP to responders
                    </PrimaryButton>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {modalMode === "distributeXpWhenResponsesMatch" && (
            <Box
              padding={{
                xs: "4",
                md: "8",
              }}
              width="full"
            >
              <ResponseMatchXPDistribution
                setModalModal={setModalMode as any}
                data={responseData}
                setData={setResponseData}
                totalXp={totalXp}
                setTotalXp={setTotalXp}
                xp={xp}
                setXp={setXp}
              />
            </Box>
          )}
        </Modal>
      )}
    </Box>
  );
}
