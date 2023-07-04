import PrimaryButton from "@/app/common/components/PrimaryButton";
import { DollarOutlined } from "@ant-design/icons";
import { Box, Heading, IconClose, Input, Stack, Text } from "degen";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useCircle } from "../Circle/CircleContext";
import { toast } from "react-toastify";
import { useState } from "react";

type Props = {
  handleClose: () => void;
};

const paidPlan = [
  "Everything in Free",
  "Unlimited form plugins",
  "Response Analytics",
  "No Spect branding at the end of form",
  "2000 automation runs per month",
  "Unlimited projects with unlimited rows",
  "Unlimited workstreams",
  "5 members in space",
  "$10 per additional member",
];

const Subscription = ({ handleClose }: Props) => {
  const [loading, setLoading] = useState(false);

  const { circle, fetchCircle } = useCircle();
  const [members, setMembers] = useState(5 + (circle?.topUpMembers || 0));
  const [refCode, setRefCode] = useState("");

  return (
    <Box padding="8">
      <Stack align="center">
        {!circle?.pricingPlan ? (
          <Heading>Premium Plan - 29$</Heading>
        ) : (
          <Heading>You are on Premium Plan</Heading>
        )}
        {paidPlan.map((item) => (
          <Box width="1/2">
            <Stack key={item} direction="horizontal" align="center" space="2">
              <Box color="green" marginTop="1">
                <AiOutlineCheckCircle size={18} />
              </Box>
              <Text align="left">{item}</Text>
            </Stack>
          </Box>
        ))}
        <Box width="1/2">
          <Stack align="center">
            <Text variant="label">Number of members</Text>
            {/* <NumericSelect
                count={members}
                onChange={(value) => {
                  if (value >= 5) {
                    setMembers(value);
                  }
                }}
              /> */}
            <Input
              label=""
              type="number"
              value={members}
              onChange={(e) => {
                setMembers(parseInt(e.target.value));
              }}
              min={5}
              suffix="members"
              disabled={circle?.pricingPlan === 1}
            />
            {circle?.pricingPlan === 0 && !circle.referredBy && (
              <Input
                label="Optional referral code"
                value={refCode}
                onChange={(e) => {
                  setRefCode(e.target.value);
                }}
                placeholder="Referral code"
              />
            )}
          </Stack>
        </Box>
        <Box width="1/2">
          {!circle?.pricingPlan ? (
            <PrimaryButton
              loading={loading}
              icon={<DollarOutlined />}
              onClick={async () => {
                setLoading(true);
                const { url, message } = await fetch(
                  `${process.env.API_HOST}/circle/v1/${circle?.id}/upgradePlan`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      memberTopUp: members > 5 ? members - 5 : 0,
                      refCode,
                    }),
                    credentials: "include",
                  }
                ).then((res) => res.json());

                if (!url) {
                  toast.error(message);
                  setLoading(false);
                  return;
                }
                setLoading(false);
                console.log({ url });
                window.open(url, "_self");
              }}
            >
              Pay
            </PrimaryButton>
          ) : (
            <PrimaryButton
              variant="tertiary"
              loading={loading}
              icon={<IconClose size="5" />}
              onClick={async () => {
                setLoading(true);
                const { message } = await fetch(
                  `${process.env.API_HOST}/circle/v1/${circle?.id}/cancelPlan`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }
                ).then((res) => res.json());
                if (message) {
                  toast.error(message);
                  setLoading(false);
                  return;
                }
                setTimeout(async () => {
                  await fetchCircle();
                  handleClose();
                  setLoading(false);
                }, 5000);
              }}
            >
              Cancel Plan
            </PrimaryButton>
          )}
        </Box>
        <a
          href="https://spect.network/pricing"
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: "1rem",
          }}
        >
          <Text variant="label">See pricing</Text>
        </a>
      </Stack>
    </Box>
  );
};

export default Subscription;
