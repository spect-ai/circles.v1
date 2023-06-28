import { ThemeProvider } from "degen";
import "degen/styles";
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
  Chain,
} from "@wagmi/core/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import queryClient from "@/app/common/utils/queryClient";
import { useEffect } from "react";
import ErrorFallBack from "@/app/common/components/Error";
import * as gtag from "../../lib/gtag";

import "@rainbow-me/rainbowkit/styles.css";

import {
  RainbowKitProvider,
  darkTheme,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";

import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { SiweMessage } from "siwe";
import { UserType } from "@/app/types";
import { useAtom } from "jotai";
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

import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import useProfileUpdate from "@/app/services/Profile/useProfileUpdate";
import { H } from "highlight.run";
import { ErrorBoundary } from "@highlight-run/react";

import { AuthProvider } from "@arcana/auth";
import { ArcanaConnector } from "@arcana/auth-wagmi";

const auth = new AuthProvider(`${process.env.NEXT_PUBLIC_ARCANA_CLIENT_ID}`); // Singleton

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
          auth,
        },
      });
      return {
        connector,
      };
    },
  };
};

const isProd = process.env.NODE_ENV === "production";

const nodes = {
  "1": {
    http: `https://eth-mainnet.g.alchemy.com/v2/97jAndtiByElrpSUeLEP7oZsXl-1V675`,
    webSocket: `wss://eth-mainnet.g.alchemy.com/v2/97jAndtiByElrpSUeLEP7oZsXl-1V675`,
  },
  "137": {
    http: `https://rpc.ankr.com/polygon`,
  },
  "10": {
    http: `https://rpc.ankr.com/optimism`,
  },
  "42161": {
    http: `https://rpc.ankr.com/arbitrum`,
  },
  "5": {
    http: `https://eth-goerli.g.alchemy.com/v2/0wWffTxNefWtkV482CskpmcyKsV1hZGs`,
  },
  "80001": {
    http: `https://rpc.ankr.com/polygon_mumbai`,
  },
  "43114": {
    http: `https://rpc.ankr.com/avalanche-c`,
  },
  "56": {
    http: `https://rpc.ankr.com/bsc`,
  },
  "100": {
    http: `https://rpc.ankr.com/gnosis`,
  },
  "43113": {
    http: `https://api.avax-test.network/ext/bc/C/rpc`,
  },
  "250": {
    http: `https://rpc.ankr.com/fantom`,
  },
} as { [key: string]: { http: string; webSocket?: string } };

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
    jsonRpcProvider({
      rpc: (chain) => {
        return nodes[chain.id.toString()];
      },
    }),
    publicProvider(),
  ]
);

// const { connectors } = getDefaultWallets({
//   appName: "Spect Circles",
//   chains,
// });

const connectors = (chains: Chain[]) =>
  connectorsForWallets([
    {
      groupName: "Social Auth",
      wallets: [ArcanaRainbowConnector(chains) as any],
    },
    {
      groupName: "Wallets",
      wallets: [
        metaMaskWallet({
          chains,
          projectId: "a71a2b69b4ce96eaa0799a1448eb16c9",
        }),
        rainbowWallet({
          chains,
          projectId: "a71a2b69b4ce96eaa0799a1448eb16c9",
          name: "Spect",
        }),
        trustWallet({ chains, projectId: "a71a2b69b4ce96eaa0799a1448eb16c9" }),
        walletConnectWallet({
          chains,
          projectId: "a71a2b69b4ce96eaa0799a1448eb16c9",
        }),
        coinbaseWallet({ chains, appName: "Spect" }),
      ],
    },
  ]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: connectors(chains),
  provider,
});

process.env.NODE_ENV === "production" &&
  H.init(process.env.NEXT_PUBLIC_HIGHLIGHT_CLIENT_ID || "", {
    tracingOrigins: true,
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: true,
    },
    integrations: {
      mixpanel: {
        projectToken: process.env.MIXPANEL_TOKEN,
      },
    },
  });

type Props = {
  children: React.ReactNode;
  pageProps: any;
};
function Root({ children, pageProps }: Props) {
  const router = useRouter();
  const url = `https:/circles.spect.network/${router.route}`;

  const { ref } = router.query;

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
        `${process.env.API_HOST}/auth/connect?ref=${ref}`,
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

      if (res.username?.startsWith("fren") && connector?.id === "arcana-auth") {
        const user = await (connector as any).auth.getUser();
        setTimeout(() => {
          updateProfile({
            email: user.email,
            username: user.name || res.username || "",
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

  const { hostname } = useLocation();

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
                  <ApolloProvider client={client}>
                    <ErrorBoundary fallback={ErrorFallBack}>
                      {children}
                    </ErrorBoundary>
                    <AnimatePresence>
                      {isScribeOpen && (
                        <ScribeEmbed
                          handleClose={() => setIsScribeOpen(false)}
                          src={scribeUrl}
                        />
                      )}
                    </AnimatePresence>
                  </ApolloProvider>
                </Hydrate>
              </QueryClientProvider>
            </ThemeProvider>
          </FlagsProvider>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
    </WagmiConfig>
  );
}

export default Root;
