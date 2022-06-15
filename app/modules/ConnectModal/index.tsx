import Modal from "@/app/common/components/Modal";
import { Box, Button, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { SiweMessage } from "siwe";
import { useConnect, useDisconnect } from "wagmi";

export default function ConnectModal() {
  const { connectors, pendingConnector, connectAsync } = useConnect();

  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const connectAndLogin = async (connector: any) => {
    const res = await connectAsync(connector); // `connectAsync` from `useConnect`
    const nonceRes = await fetch("http://localhost:3000/auth/nonce", {
      credentials: "include",
    });
    const message = new SiweMessage({
      domain: window.location.host,
      address: res.account,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId: res.chain?.id,
      nonce: await nonceRes.text(),
    });

    const signer = await connector.getSigner();
    const signature = await signer.signMessage(message.prepareMessage());

    const verifyRes = await fetch("http://localhost:3000/auth/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, signature }),
      credentials: "include",
    });
    const verifyResJson = await verifyRes.json();
    console.log({ verifyResJson });

    if (verifyResJson.id) {
      queryClient.setQueryData("getMyUser", verifyResJson);
    } else {
      throw new Error("Error verifying message");
    }
  };

  return (
    <>
      <Button size="small" onClick={() => setIsOpen(true)}>
        Connect
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Choose Wallet" handleClose={handleClose} size="small">
            <Box padding="8">
              <Stack>
                {connectors.map((connector) => (
                  <Button
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => {
                      setIsLoading(true);
                      connectAndLogin(connector)
                        .then(() => {
                          handleClose();
                        })
                        .catch((err) => {
                          console.log({ err });
                          toast(err.message, {
                            theme: "dark",
                          });
                          disconnect();
                        })
                        .finally(() => {
                          setIsLoading(false);
                        });
                    }}
                    width="full"
                    variant="tertiary"
                    loading={isLoading && connector.id === pendingConnector?.id}
                  >
                    {connector.name}
                    {!connector.ready && " (unsupported)"}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
