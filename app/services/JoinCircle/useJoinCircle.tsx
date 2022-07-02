import { useGlobalContext } from "@/app/context/globalContext";
import { UserType } from "@/app/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { joinCircleFromInvite } from ".";

export default function useJoinCircle() {
  const router = useRouter();
  const { inviteCode, circleId } = router.query;
  const { connectedUser } = useGlobalContext();

  useEffect(() => {
    if (inviteCode && connectedUser) {
      console.log({ inviteCode, circleId });
      const asyncJoin = async () => {
        const res = await joinCircleFromInvite(
          circleId as string,
          inviteCode as string
        );
        if (res.id) {
          void router.push(`/${res.slug}`);
          toast("You have joined the circle!");
        } else {
          toast.error("Something went wrong");
        }
      };
      void asyncJoin();
    }
    if (inviteCode && connectedUser === undefined) {
      toast.error("You must connect your wallet to join a circle");
    }
  }, [inviteCode, circleId, connectedUser, router]);
}
