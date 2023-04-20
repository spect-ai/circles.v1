import { Button } from "degen";
import queryClient from "@/app/common/utils/queryClient";
import { useAtom } from "jotai";
import { useDisconnect } from "wagmi";
import {
  authStatusAtom,
  connectedUserAtom,
  isProfilePanelExpandedAtom,
} from "@/app/state/global";
import PrimaryButton from "../PrimaryButton";

export default function Logout() {
  const { disconnect } = useDisconnect();
  const [, setAuthenticationStatus] = useAtom(authStatusAtom);
  const [, setConnectedUser] = useAtom(connectedUserAtom);
  const [, setIsProfilePanelExpanded] = useAtom(isProfilePanelExpandedAtom);
  return (
    <PrimaryButton
      variant="tertiary"
      onClick={async () => {
        setIsProfilePanelExpanded(false);
        await fetch(`${process.env.API_HOST}/auth/disconnect`, {
          method: "POST",
          credentials: "include",
        });
        disconnect();
        queryClient.setQueryData("getMyUser", null);
        void queryClient.invalidateQueries("getMyUser");
        setAuthenticationStatus("unauthenticated");
        setConnectedUser("");
      }}
    >
      Logout
    </PrimaryButton>
  );
}
