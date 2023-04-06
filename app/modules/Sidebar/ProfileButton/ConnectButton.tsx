import PrimaryButton from "@/app/common/components/PrimaryButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { disconnect } from "@wagmi/core";
import { Box, Stack, Text } from "degen";
import { BiLogIn } from "react-icons/bi";
import queryClient from "@/app/common/utils/queryClient";
import { authStatusAtom, connectedUserAtom } from "@/app/state/global";
import { useAtom } from "jotai";

type Props = {
  variant?: "primary" | "secondary" | "tertiary" | "transparent";
  text?: string;
};

export const Connect = ({ variant = "secondary", text }: Props) => {
  const [, setAuthenticationStatus] = useAtom(authStatusAtom);
  const [, setConnectedUser] = useAtom(connectedUserAtom);
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <PrimaryButton
                    onClick={openConnectModal}
                    variant={variant}
                    icon={<BiLogIn size="16" />}
                  >
                    {text || "Sign In"}
                  </PrimaryButton>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <Box borderWidth="0.375" borderRadius="2xLarge" padding="2">
                  <Stack direction="horizontal" align="center" justify="center">
                    <Text size="extraSmall" font="mono" weight="bold">
                      Connected with {account.displayName}
                    </Text>
                  </Stack>
                  <Box marginTop="2" paddingRight="4">
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Box
                        cursor="pointer"
                        onClick={async () => {
                          await fetch(
                            `${process.env.API_HOST}/auth/disconnect`,
                            {
                              method: "POST",
                              credentials: "include",
                            }
                          );
                          disconnect();
                          queryClient.setQueryData("getMyUser", null);
                          void queryClient.invalidateQueries("getMyUser");
                          setAuthenticationStatus("unauthenticated");
                          setConnectedUser("");
                        }}
                      >
                        <Text
                          size="extraSmall"
                          font="mono"
                          weight="bold"
                          color="accent"
                        >
                          Disconnect
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
