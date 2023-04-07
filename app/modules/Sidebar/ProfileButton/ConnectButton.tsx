import PrimaryButton from "@/app/common/components/PrimaryButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BiLogIn } from "react-icons/bi";

const Connect = () => (
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
                  icon={<BiLogIn size="16" />}
                >
                  Sign In
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
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={openChainModal}
                  style={{ display: "flex", alignItems: "center" }}
                  type="button"
                >
                  {chain.name}
                </button>
                <button onClick={openAccountModal} type="button">
                  {account.displayName}
                  {account.displayBalance ? ` (${account.displayBalance})` : ""}
                </button>
              </div>
            );
          })()}
        </div>
      );
    }}
  </ConnectButton.Custom>
);

export default Connect;
