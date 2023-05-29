import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import { DollarOutlined } from "@ant-design/icons";
import { Box, Heading, IconClose, Input, Stack, Text } from "degen";
import React, { useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useCircle } from "../Circle/CircleContext";

type Props = {
  handleClose: () => void;
};

const paidPlan = [
  "Everything in Free",
  "Unlimited form plugins",
  "Response Analytics",
  "No Spect branding at the end of form",
  "200 automations",
  "Unlimited projects with unlimited rows",
  "Unlimited workstreams",
  "5 members in space",
  "$10 per additional member",
];

const UpgradePlan = ({ handleClose }: Props) => {
  const [loading, setLoading] = useState(false);

  const { circle, fetchCircle } = useCircle();
  const [members, setMembers] = useState(5 + (circle?.topUpMembers || 0));

  return (
    <Modal title="" handleClose={handleClose}>
      <Box padding="8">
        <Stack align="center">
          <Heading>Premium Plan</Heading>
          {paidPlan.map((item) => (
            <Stack key={item} direction="horizontal" align="center" space="2">
              <Box color="green" marginTop="1">
                <AiOutlineCheckCircle size={18} />
              </Box>
              <Text>{item}</Text>
            </Stack>
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
            </Stack>
          </Box>
          <Box width="1/2">
            {circle?.pricingPlan === 0 ? (
              <PrimaryButton
                loading={loading}
                icon={<DollarOutlined />}
                onClick={async () => {
                  setLoading(true);
                  const { url } = await fetch(
                    `${process.env.API_HOST}/circle/v1/${circle?.id}/upgradePlan`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        memberTopUp: members - 5,
                      }),
                    }
                  ).then((res) => res.json());
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
                  await fetch(
                    `${process.env.API_HOST}/circle/v1/${circle?.id}/cancelPlan`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  ).then((res) => res.json());
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
        </Stack>
      </Box>
    </Modal>
  );
};

export default UpgradePlan;
