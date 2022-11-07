import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { isEmail } from "@/app/common/utils/utils";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { Box, Button, Input, Text } from "degen";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  handleClose: () => void;
};

export default function MilestoneModal({ handleClose }: Props) {
  const [selectedNotificationOption, setSelectedNotificationOption] =
    useState("email");
  const [email, setEmail] = useState("");
  const [emailIsVerified, setEmailIsVerified] = useState(false);
  const [emailIsEmptyWarning, setEmailIsEmptyWarning] = useState(false);
  const { updateProfile } = useProfileUpdate();

  return (
    <Modal
      handleClose={() => {
        handleClose();
      }}
      title={`Notification Preferences`}
    >
      <Box
        paddingTop={{
          xs: "1",
          md: "4",
        }}
        paddingLeft={{
          xs: "4",
          md: "8",
        }}
        paddingRight={{
          xs: "2",
          md: "8",
        }}
        width="full"
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Box>
          <Text variant="small">
            Since this form is an opportunity, you must enable notifications for
            further communication
          </Text>
        </Box>
        <Box
          paddingTop={{
            xs: "4",
            md: "8",
          }}
          width="full"
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          gap="4"
        >
          <Text variant="label">Preferred way to get notified (Pick one)</Text>
          <Box display="flex" flexDirection="row" alignItems="center" gap="2">
            <PrimaryButton
              variant={
                selectedNotificationOption === "email"
                  ? "secondary"
                  : "tertiary"
              }
              onClick={() => {
                setSelectedNotificationOption("email");
              }}
            >
              Email
            </PrimaryButton>
            <PrimaryButton
              variant={
                selectedNotificationOption === "epns&mailchain"
                  ? "secondary"
                  : "tertiary"
              }
              onClick={() => {}}
            >
              EPNS & Mailchain (Coming Soon)
            </PrimaryButton>
          </Box>
          {selectedNotificationOption === "email" && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap="2"
              width={{
                xs: "full",
                md: "1/2",
              }}
            >
              <Text variant="label">Email Address</Text>
              <Input
                label=""
                placeholder={`Enter email`}
                value={email}
                inputMode="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailIsEmptyWarning(false);
                }}
                error={email && !isEmail(email)}
              />
            </Box>
          )}
          <Box
            marginTop="4"
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            padding="8"
          >
            <Button
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              marginRight="2"
              variant="secondary"
              size="small"
              width="48"
              onClick={async () => {
                if (!email) {
                  setEmailIsEmptyWarning(true);
                  return;
                }
                const res = await updateProfile({
                  email,
                });
                console.log(res);
                toast("Profile updated successfully");
                handleClose();
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
