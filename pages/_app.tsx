import { ThemeProvider } from "degen";
import "degen/styles";
import type { AppProps } from "next/app";
import { Hydrate, QueryClientProvider } from "react-query";
import mixpanel from "@/app/common/utils/mixpanel";
import { FlagsProvider } from "react-feature-flags";
import {
  avalanche,
  bsc,
  mainnet,
  polygon,
  polygonMumbai,
  goerli,
  fantom,
  gnosis,
  optimism,
  arbitrum,
  avalancheFuji,
} from "@wagmi/core/chains";

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
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "@/app/common/components/Error";
import * as gtag from "../lib/gtag";

import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { SiweMessage } from "siwe";
import { UserType } from "@/app/types";
import { atom, useAtom } from "jotai";
import { flags } from "@/app/common/utils/featureFlags";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useLocation } from "react-use";
import ScribeEmbed from "@/app/common/components/Help/ScribeEmbed";

const isProd = process.env.NODE_ENV === "production";

const chainsObj = {
  fuji: {
    id: 43113,
    name: "Fuji",
    network: "fuji",
    nativeCurrency: {
      decimals: 18,
      name: "Avalanche",
      symbol: "AVAX",
    },
    rpcUrls: {
      default: "https://api.avax-test.network/ext/bc/C/rpc",
    },
    blockExplorers: {
      etherscan: { name: "SnowTrace", url: "https://testnet.snowtrace.io/" },
      default: { name: "SnowTrace", url: "https://testnet.snowtrace.io/" },
    },
    contracts: {
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 11907934,
      },
    },
  },
  avalanche: {
    id: 43114,
    name: "Avalanche",
    network: "avalanche",
    nativeCurrency: {
      decimals: 18,
      name: "Avalanche",
      symbol: "AVAX",
    },
    rpcUrls: {
      default: "https://api.avax.network/ext/bc/C/rpc",
    },
    blockExplorers: {
      etherscan: { name: "SnowTrace", url: "https://snowtrace.io" },
      default: { name: "SnowTrace", url: "https://snowtrace.io" },
    },
    contracts: {
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 11907934,
      },
    },
  },
  bsc: {
    id: 56,
    name: "Binance Smart Chain",
    network: "bsc",
    nativeCurrency: {
      decimals: 18,
      name: "BNB",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://rpc.ankr.com/bsc",
    },
    blockExplorers: {
      etherscan: { name: "BscScan", url: "https://bscscan.com" },
      default: { name: "BscScan", url: "https://bscscan.com" },
    },
    contracts: {
      multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11",
        blockCreated: 15921452,
      },
    },
  },
  gnosis: {
    id: 100,
    name: "Gnosis",
    network: "Gnosis",
    nativeCurrency: {
      decimals: 18,
      name: "xDAI",
      symbol: "xDAI",
    },
    rpcUrls: {
      default: "https://rpc.gnosischain.com",
    },
    blockExplorers: {
      etherscan: { name: "Gnosis Scan", url: "https://gnosisscan.io/" },
      default: { name: "Gnosis Scan", url: "https://gnosisscan.io/" },
    },
  },
};

const { chains, provider } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    goerli,
    polygonMumbai,
    avalanche,
    bsc,
    gnosis,
    avalancheFuji,
    fantom,
  ],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_KEY as string }),
    publicProvider(),
  ]
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

export const scribeOpenAtom = atom(false);
export const scribeUrlAtom = atom("");

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const url = `https:/circles.spect.network/${router.route}`;

  const { connectUser } = useGlobal();
  const [isScribeOpen, setIsScribeOpen] = useAtom(scribeOpenAtom);
  const [scribeUrl, setScribeUrl] = useAtom(scribeUrlAtom);

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
      console.log("connect user", res.username);
      connectUser(res.id);
      process.env.NODE_ENV === "production" &&
        mixpanel.track("User Connected", {
          user: res.username,
        });
      return Boolean(verifyRes.ok);
    },
    signOut: async () => {
      // await fetch(`${process.env.API_HOST}/auth/disconnect`, {
      //   method: "POST",
      //   credentials: "include",
      // });
      // setAuthenticationStatus("unauthenticated");
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

  const { hostname, pathname } = useLocation();

  const client = new ApolloClient({
    uri: hostname?.startsWith("circles")
      ? "https://hub.snapshot.org/graphql"
      : "https://testnet.snapshot.org/graphql",
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    void (async () => {
      try {
        const user: UserType = await (
          await fetch(`${process.env.API_HOST}/user/v1/me`)
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
        console.log({ e });
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
          <FlagsProvider value={flags}>
            <GlobalContextProvider>
              <ThemeProvider defaultAccent="purple" defaultMode="dark">
                <QueryClientProvider client={queryClient}>
                  <Hydrate state={pageProps}>
                    <ErrorBoundary FallbackComponent={ErrorFallBack}>
                      <ApolloProvider client={client}>
                        <Component {...pageProps} canonical={url} key={url} />
                        <AnimatePresence>
                          {isScribeOpen && (
                            <ScribeEmbed
                              handleClose={() => setIsScribeOpen(false)}
                              src={scribeUrl}
                            />
                          )}
                        </AnimatePresence>
                      </ApolloProvider>
                    </ErrorBoundary>
                  </Hydrate>
                </QueryClientProvider>
              </ThemeProvider>
            </GlobalContextProvider>
          </FlagsProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default MyApp;
