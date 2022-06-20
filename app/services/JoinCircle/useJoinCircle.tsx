import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { joinCircleFromInvite } from ".";

export default function useJoinCircle() {
  const router = useRouter();
  const { inviteCode, circleId } = router.query;

  const asyncJoin = async () => {
    const res = await joinCircleFromInvite(
      circleId as string,
      inviteCode as string
    );
    if (res.id) {
      void router.push(`/${res.slug}`);
      toast("You have joined the circle!", { theme: "dark" });
    }
  };

  useEffect(() => {
    if (inviteCode) {
      console.log({ inviteCode, circleId });
      void asyncJoin();
    }
  }, [inviteCode, circleId]);
}
