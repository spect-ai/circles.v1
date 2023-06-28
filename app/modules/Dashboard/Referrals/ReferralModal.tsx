import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { Box, Button, Stack, Text } from "degen";
import React, { useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { toast } from "react-toastify";

type Props = {
  handleClose: () => void;
};

const ReferralModal = ({ handleClose }: Props) => {
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [whitelisted, setWhitelisted] = useState(false);

  useEffect(() => {
    (async () => {
      if (whitelisted) {
        const referralCode = await (
          await fetch(`${process.env.API_HOST}/user/v1/referralCode`, {
            credentials: "include",
          })
        ).text();
        setReferralCode(referralCode);
      }
    })();
  }, [whitelisted]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const isWhitelisted = await (
        await fetch(`${process.env.API_HOST}/user/v1/isWhitelisted`, {
          credentials: "include",
        })
      ).text();
      setWhitelisted(isWhitelisted === "true");
      setLoading(false);
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
          {whitelisted ? (
            <Stack>
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
          ) : (
            <Stack>
              <Text>
                You need to be whitelisted to participate in the Spect Affiliate
                program. Fill the form below to apply for whitelisting.
              </Text>
              <Box width="1/2">
                <a
                  href="http://localhost:3000/r/41de13a4-a76e-48e4-8e86-97569b1bbc83"
                  target="_blank"
                >
                  <PrimaryButton>Whitelist form</PrimaryButton>
                </a>
              </Box>
            </Stack>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default ReferralModal;
