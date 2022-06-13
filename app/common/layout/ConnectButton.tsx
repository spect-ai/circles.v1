import ProfileModal from "@/app/modules/ProfileModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Avatar, Button } from "degen";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

export const ConnectComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <AnimatePresence>
        {isOpen && <ProfileModal handleClose={() => setIsOpen(false)} />}
      </AnimatePresence>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          return (
            <div
              {...(!mounted && {
                "aria-hidden": true,
                style: {
                  opacity: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                },
              })}
            >
              {(() => {
                if (!mounted || !account || !chain) {
                  return (
                    <Button
                      onClick={() => {
                        openConnectModal();
                      }}
                      size="small"
                    >
                      Connect Wallet
                    </Button>
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
                    <Button
                      onClick={openChainModal}
                      type="button"
                      shape="circle"
                      size="small"
                    >
                      {chain.hasIcon && (
                        <Avatar
                          src={chain.iconUrl}
                          label={chain.name as string}
                          size="10"
                        />
                      )}
                    </Button>
                    <Button
                      shape="circle"
                      variant="primary"
                      size="small"
                      onClick={() => setIsOpen(true)}
                    >
                      <Avatar label="avatar" src={""} size="10" placeholder />
                    </Button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </>
  );
};
