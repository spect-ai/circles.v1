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
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { SiweMessage } from "siwe";
import { UserType } from "@/app/types";
import { atom, useAtom } from "jotai";
import { flags } from "@/app/common/utils/featureFlags";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useLocation } from "react-use";
import ScribeEmbed from "@/app/common/components/Help/ScribeEmbed";
import {
  authStatusAtom,
  connectedUserAtom,
  scribeOpenAtom,
  scribeUrlAtom,
} from "@/app/state/global";

import { ArcanaConnector } from "@arcana/auth-wagmi";
import { metaMaskWallet, rainbowWallet } from "@rainbow-me/rainbowkit/wallets";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";

const ArcanaRainbowConnector = ({ chains }: any) => {
  return {
    id: "arcana-auth",
    name: "Use Discord, Github or Email",
    iconUrl:
      "https://spect.infura-ipfs.io/ipfs/QmcBLdB23dQkXdMKFHAjVKMKBPJF82XkqR5ZkxyCk6aset",
    iconBackground: "",
    createConnector: () => {
      const connector = new ArcanaConnector({
        chains,
        options: {
          //clientId : Arcana Unique App Identifier via Dashboard
          clientId: process.env.NEXT_PUBLIC_ARCANA_CLIENT_ID,
        },
      });
      return {
        connector,
      };
    },
  };
};

const isProd = process.env.NODE_ENV === "production";

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

// const { connectors } = getDefaultWallets({
//   appName: "Spect Circles",
//   chains,
// });

const connectors = (chains: any) =>
  connectorsForWallets([
    {
      groupName: "Social Auth",
      wallets: [ArcanaRainbowConnector({ chains })],
    },
    {
      groupName: "Wallets",
      wallets: [metaMaskWallet({ chains }), rainbowWallet({ chains })],
    },
  ]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: connectors(chains),
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const url = `https:/circles.spect.network/${router.route}`;

  const [isScribeOpen, setIsScribeOpen] = useAtom(scribeOpenAtom);
  const [scribeUrl, setScribeUrl] = useAtom(scribeUrlAtom);
  const [connectedUser, setConnectedUser] = useAtom(connectedUserAtom);
  const { connector } = useAccount();

  const [authenticationStatus, setAuthenticationStatus] =
    useAtom(authStatusAtom);

  const { updateProfile } = useProfileUpdate();

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
      const verifyRes: any = await fetch(
        `${process.env.API_HOST}/auth/connect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, signature }),
          credentials: "include",
        }
      );

      const res: UserType = await verifyRes.json();
      setAuthenticationStatus(
        verifyRes.ok ? "authenticated" : "unauthenticated"
      );
      queryClient.setQueryData("getMyUser", res);
      console.log("connect user", res.username);
      setConnectedUser(res.id);

      console.log("connector", connector?.id);
      localStorage.setItem("connectorId", connector?.id || "");

      if (res.username.startsWith("fren") && connector?.id === "arcana-auth") {
        const user = await (connector as any).auth.getUser();
        setTimeout(() => {
          updateProfile({
            email: user.email,
            username: user.name,
          });
        }, 1000);
      }
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
          console.log("CONNECT USER");
          setConnectedUser(user.id);
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
          </FlagsProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default MyApp;
