import Modal from "@/app/common/components/Modal";
import PrimaryButton from "@/app/common/components/PrimaryButton";
import queryClient from "@/app/common/utils/queryClient";
import { useGlobal } from "@/app/context/globalContext";
import { Box, Button, Stack } from "degen";
import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { SiweMessage } from "siwe";
import { useConnect, useDisconnect } from "wagmi";

export default function ConnectModal() {
  const { connectors, pendingConnector, connectAsync } = useConnect();
  const { connectUser } = useGlobal();

  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const [isLoading, setIsLoading] = useState(false);

  const connectAndLogin = async (connector: any, connectorIndex: number) => {
    const res = await connectAsync(connector); // `connectAsync` from `useConnect`
    const nonceRes = await fetch(`${process.env.API_HOST}/auth/nonce`, {
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

    console.log(JSON.stringify({ message, signature }));

    const verifyRes = await fetch(`${process.env.API_HOST}/auth/connect`, {
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
      connectUser(verifyResJson.id);
    } else {
      throw new Error("Error verifying message");
    }
    localStorage.setItem("connectorIndex", connectorIndex.toString());
  };

  return (
    <>
      <Box paddingX="2">
        <PrimaryButton onClick={() => setIsOpen(true)}>Connect</PrimaryButton>
      </Box>
      <AnimatePresence>
        {isOpen && (
          <Modal title="Choose Wallet" handleClose={handleClose} size="small">
            <Box padding="8">
              <Stack>
                {connectors.map((connector, index) => (
                  <Button
                    width="full"
                    variant="tertiary"
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => {
                      setIsLoading(true);
                      connectAndLogin(connector, index)
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
