import { Button } from "degen";
import queryClient from "@/app/common/utils/queryClient";
import { useAtom } from "jotai";
import { authStatusAtom } from "@/pages/_app";
import { useGlobal } from "@/app/context/globalContext";
import { useDisconnect } from "wagmi";

export default function Logout() {
  const { setIsProfilePanelExpanded, disconnectUser, connectedUser } =
    useGlobal();
  const { disconnect } = useDisconnect();
  const [authenticationStatus, setAuthenticationStatus] =
    useAtom(authStatusAtom);
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
        void queryClient.invalidateQueries("getMyUser");
        setAuthenticationStatus("unauthenticated");
        disconnectUser();
      }}
    >
      Logout
    </Button>
  );
}
