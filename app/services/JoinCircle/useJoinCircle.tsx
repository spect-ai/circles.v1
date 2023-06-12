import { connectedUserAtom } from "@/app/state/global";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { joinCircleFromInvite } from ".";
import { logError } from "@/app/common/utils/utils";
import { useQuery } from "react-query";
import { UserType } from "@/app/types";

export default function useJoinCircle() {
  const router = useRouter();
  const { inviteCode, circleId } = router.query;
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);
  const { data: currentUser } = useQuery<UserType>("getMyUser", {
    enabled: false,
  });

  useEffect(() => {
    if (
      inviteCode &&
      connectedUser &&
      !currentUser?.username?.startsWith("fren")
    ) {
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
      toast.error("You must connect your wallet to join a space");
    }
  }, [inviteCode, circleId, connectedUser, router, currentUser?.username]);
}
