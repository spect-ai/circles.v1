import PrimaryButton from "@/app/common/components/PrimaryButton";
import { timeSince } from "@/app/common/utils/utils";
import { CircleType } from "@/app/types";
import { Box, Spinner, Stack, Text } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-grid-system";
import ReferralModal from "./ReferralModal";
import { toast } from "react-toastify";

const Referrals = () => {
  const [loading, setLoading] = useState(false);
  const [widthdrawing, setWidthdrawing] = useState(false);
  const [referrals, setReferrals] = useState<CircleType[]>();
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await (
        await fetch(`${process.env.API_HOST}/user/v1/referrals`, {
          credentials: "include",
        })
      ).json();
      console.log({ res });
      setReferrals(res);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <Box style={{ margin: "35vh 15vw" }}>
        <Stack align="center">
          <Spinner size="large" color="accent" />
        </Stack>
      </Box>
    );
  }

  if (!referrals?.length) {
    return (
      <Box style={{ margin: "35vh 15vw" }}>
        <AnimatePresence>
          {isReferralModalOpen && (
            <ReferralModal handleClose={() => setIsReferralModalOpen(false)} />
          )}
        </AnimatePresence>
        <Stack align="center">
          <Text color="accent">No referrals made yet</Text>
          <PrimaryButton onClick={() => setIsReferralModalOpen(true)}>
            Get Started
          </PrimaryButton>
        </Stack>
      </Box>
    );
  }

  return (
    <Box padding="4" overflow="auto">
      <Stack>
        <Box>
          <Stack direction="horizontal" space="2" align="center">
            <Text variant="label">Total Pending Bonus:</Text>
            <Text color="accent">
              {referrals?.reduce(
                (acc, curr) => acc + (curr.pendingBonus || 0),
                0
              )}
              $
            </Text>
            <PrimaryButton
              disabled={widthdrawing}
              loading={widthdrawing}
              size="extraSmall"
              onClick={async () => {
                setWidthdrawing(true);
                const withdrawRes = await (
                  await fetch(`${process.env.API_HOST}/user/v1/withdrawBonus`, {
                    credentials: "include",
                  })
                ).json();
                console.log({ withdrawRes });

                if (withdrawRes.statusCode === 500) {
                  toast.error(withdrawRes.message);
                } else if (withdrawRes.hash) {
                  toast.success("Withdrawal successful");
                  setHash(withdrawRes.txUrl);
                }
                const res = await (
                  await fetch(`${process.env.API_HOST}/user/v1/referrals`, {
                    credentials: "include",
                  })
                ).json();
                console.log({ res });
                setReferrals(res);
                setWidthdrawing(false);
              }}
            >
              Withdraw
            </PrimaryButton>
            {hash && (
              <a href={hash} target="_blank" rel="noreferrer">
                <Text color="accent">View Transaction</Text>
              </a>
            )}
          </Stack>
        </Box>
        <Row>
          <Col>
            <Text variant="label">Circle Name</Text>
          </Col>
          <Col>
            <Text variant="label">Top Up Members</Text>
          </Col>
          <Col>
            <Text variant="label">Created At</Text>
          </Col>
          <Col>
            <Text variant="label">Is Subscribed</Text>
          </Col>
          <Col>
            <Text variant="label">Pending Bonus</Text>
          </Col>
        </Row>
        {referrals?.map((referral) => (
          <Row>
            <Col>
              <Text>{referral.name}</Text>
            </Col>
            <Col>
              <Text>{referral.topUpMembers}</Text>
            </Col>
            <Col>
              <Text>{timeSince(new Date(referral.createdAt))} Ago</Text>
            </Col>
            <Col>
              <Text color={referral.pricingPlan === 1 ? "green" : "red"}>
                {referral.pricingPlan === 1 ? "Yes" : "No"}
              </Text>
            </Col>
            <Col>
              <Text color={referral.pendingBonus ? "green" : "red"}>
                {referral.pendingBonus ? referral.pendingBonus : 0} $
              </Text>
            </Col>
          </Row>
        ))}
      </Stack>
    </Box>
  );
};

export default Referrals;
