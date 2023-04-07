import { connectedUserAtom } from "@/app/state/global";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { joinCircleFromInvite } from ".";

export default function useJoinCircle() {
  const router = useRouter();
  const { inviteCode, circleId } = router.query;
  const [connectedUser] = useAtom(connectedUserAtom);

  useEffect(() => {
    if (inviteCode && connectedUser) {
      const asyncJoin = async () => {
        const res = await joinCircleFromInvite(
          circleId as string,
          inviteCode as string
        );
        if (res.id) {
          window.location.replace(`/${res.slug}`);
          toast("You have joined the circle!", {
            theme: "dark",
          });
        } else {
          toast.error("Something went wrong", {
            theme: "dark",
          });
        }
      };
      asyncJoin();
    }
    if (inviteCode && connectedUser === undefined) {
      toast.error("You must connect your wallet to join a circle");
    }
  }, [inviteCode, circleId, connectedUser, router]);
}
