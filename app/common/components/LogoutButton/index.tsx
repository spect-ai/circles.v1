import { Button } from "degen";
import queryClient from "@/app/common/utils/queryClient";
import { useAtom } from "jotai";
import { useDisconnect } from "wagmi";
import {
  authStatusAtom,
  connectedUserAtom,
  isProfilePanelExpandedAtom,
} from "@/app/state/global";

const Logout = () => {
  const { disconnect } = useDisconnect();
  const [, setAuthenticationStatus] = useAtom(authStatusAtom);
  const [, setConnectedUser] = useAtom(connectedUserAtom);
  const [, setIsProfilePanelExpanded] = useAtom(isProfilePanelExpandedAtom);
  return (
    <Button
      size="small"
      variant="tertiary"
      onClick={async () => {
        setIsProfilePanelExpanded(false);
        await fetch(`${process.env.API_HOST}/auth/disconnect`, {
          method: "POST",
          credentials: "include",
        });
        disconnect();
        queryClient.setQueryData("getMyUser", null);
        queryClient.invalidateQueries("getMyUser");
        setAuthenticationStatus("unauthenticated");
        setConnectedUser("");
      }}
      width="full"
    >
      Logout
    </Button>
  );
};

export default Logout;
