import queryClient from "@/app/common/utils/queryClient";
import { useAtom } from "jotai";
import { useDisconnect } from "wagmi";
import {
  authStatusAtom,
  connectedUserAtom,
  isProfilePanelExpandedAtom,
} from "@/app/state/global";
import PrimaryButton from "../PrimaryButton";
import { Button } from "@avp1598/vibes";

type Props = {
  publicForm?: boolean;
};

export default function Logout({ publicForm }: Props) {
  const { disconnect } = useDisconnect();
  const [, setAuthenticationStatus] = useAtom(authStatusAtom);
  const [, setConnectedUser] = useAtom(connectedUserAtom);
  const [, setIsProfilePanelExpanded] = useAtom(isProfilePanelExpandedAtom);

  if (publicForm)
    return (
      <Button
        variant="secondary"
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
      </Button>
    );

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
