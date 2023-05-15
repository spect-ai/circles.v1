import { connectedUserAtom } from "@/app/state/global";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { joinCircleFromInvite } from ".";
import { logError } from "@/app/common/utils/utils";

export default function useJoinCircle() {
  const router = useRouter();
  const { inviteCode, circleId } = router.query;
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);

  useEffect(() => {
    if (inviteCode && connectedUser) {
      console.log({ inviteCode, circleId });
      const asyncJoin = async () => {
        const res = await joinCircleFromInvite(
          circleId as string,
          inviteCode as string
        );
        if (res.id) {
          window.location.replace(`/${res.slug}`);
          toast("You have joined the space!", {
            theme: "dark",
          });
        } else {
          logError(res.error);
        }
      };
      void asyncJoin();
    }
    if (inviteCode && connectedUser === undefined) {
      toast.error("You must connect your wallet to join a circle");
    }
  }, [inviteCode, circleId, connectedUser, router]);
}
