import Modal from "@/app/common/components/Modal";
import { Box, Button, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { toast } from "react-toastify";

type Props = {
  handleClose: () => void;
};

const ReferralModal = ({ handleClose }: Props) => {
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    (async () => {
      const referralCode = await (
        await fetch(`${process.env.API_HOST}/user/v1/referralCode`, {
          credentials: "include",
        })
      ).text();
      setReferralCode(referralCode);
    })();
  }, []);

  return (
    <Modal title="Spect Affiliate program" handleClose={handleClose}>
      <Box padding="8">
        <Stack>
          <Text>
            Spect Affiliate program is a way for you to earn money by referring
            new users to Spect. You can earn 20% of the fees paid by your
            referrals.
          </Text>
          <Text>Your referral link is:</Text>
          <Stack direction="horizontal" align="center" space="1">
            <Text color="accent">
              https://circles.spect.network/?ref={referralCode}
            </Text>
            <Button
              size="extraSmall"
              variant="transparent"
              shape="circle"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://circles.spect.network/?ref=${referralCode}`
                );
                toast.success("Copied to clipboard");
              }}
            >
              <BiCopy size={24} />
            </Button>
          </Stack>
          <Text>You can also use the following QR code:</Text>
          <img
            src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=https://circles.spect.network/?ref=${referralCode}&choe=UTF-8`}
            alt="QR code"
            style={{
              height: 300,
              width: 300,
              borderRadius: 14,
            }}
          />
        </Stack>
      </Box>
    </Modal>
  );
};

export default ReferralModal;
