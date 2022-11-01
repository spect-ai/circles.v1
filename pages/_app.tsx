import { ThemeProvider } from "degen";
import "degen/styles";
import type { AppProps } from "next/app";
import { Hydrate, QueryClientProvider, useQuery } from "react-query";

import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

import "../styles/globals.css";
import "@/app/styles/DateTimePicker.css";
import "@/app/styles/GanttChart.css";
import "@/app/styles/Table.css";
import "react-toastify/dist/ReactToastify.css";
import "react-tippy/dist/tippy.css";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import queryClient from "@/app/common/utils/queryClient";
import GlobalContextProvider, { useGlobal } from "@/app/context/globalContext";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { SiweMessage } from "siwe";
import { UserType } from "@/app/types";
import { atom, useAtom } from "jotai";

const isProd = process.env.NODE_ENV === "production";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Spect Circles",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const authStatusAtom =
  atom<"loading" | "authenticated" | "unauthenticated">("loading");

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const url = `https:/circles.spect.network/${router.route}`;

  const { connectUser } = useGlobal();

  const [authenticationStatus, setAuthenticationStatus] =
    useAtom(authStatusAtom);

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const response = await fetch(`${process.env.API_HOST}/auth/nonce`, {
        credentials: "include",
      });
      const res = await response.text();
      return res;
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      const verifyRes = await fetch(`${process.env.API_HOST}/auth/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
        credentials: "include",
      });
      const res: UserType = await verifyRes.json();
      setAuthenticationStatus(
        verifyRes.ok ? "authenticated" : "unauthenticated"
      );
      queryClient.setQueryData("getMyUser", res);
      console.log("connect user", res.id);
      connectUser(res.id);
      return Boolean(verifyRes.ok);
    },
    signOut: async () => {
      await fetch(`${process.env.API_HOST}/auth/disconnect`, {
        method: "POST",
        credentials: "include",
      });
      setAuthenticationStatus("unauthenticated");
    },
  });

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      /* invoke analytics function only for production */
      if (isProd) gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    void (async () => {
      try {
        const user: UserType = await (
          await fetch(`${process.env.API_HOST}/user/me`)
        ).json();
        setAuthenticationStatus(
          user.ethAddress ? "authenticated" : "unauthenticated"
        );
        if (user.ethAddress) {
          queryClient.setQueryData("getMyUser", user);
          console.log("connectUser");
          connectUser && connectUser(user.id);
        }
      } catch (e) {
        console.error(e);
        setAuthenticationStatus("unauthenticated");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={authenticationStatus}
      >
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme()}
          modalSize={"compact"}
        >
          <GlobalContextProvider>
            <ThemeProvider defaultAccent="purple" defaultMode="dark">
              <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                  <AnimatePresence
                    exitBeforeEnter
                    initial={false}
                    onExitComplete={() => window.scrollTo(0, 0)}
                  >
                    <Component {...pageProps} canonical={url} key={url} />
                  </AnimatePresence>
                </Hydrate>
              </QueryClientProvider>
            </ThemeProvider>
          </GlobalContextProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default MyApp;
