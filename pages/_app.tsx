import { ThemeProvider } from "degen";
import "degen/styles";
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useRef } from "react";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";

import "../styles/globals.css";
import "@/app/styles/DateTimePicker.css";
import "react-toastify/dist/ReactToastify.css";

import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from "wagmi";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import GlobalContextProvider from "@/app/context/globalContext";

const alchemyId = process.env.ALCHEMY_KEY;

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ alchemyId }),
  publicProvider(),
]);

// Set up wagmi client
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = useRef(new QueryClient());
  const router = useRouter();
  const url = `https:/circles.spect.network/${router.route}`;
  return (
    <WagmiConfig client={wagmiClient}>
      <ThemeProvider defaultMode="dark" defaultAccent="purple">
        <QueryClientProvider client={queryClient.current}>
          <GlobalContextProvider>
            <Hydrate state={pageProps.dehydratedState}>
              <AnimatePresence
                exitBeforeEnter
                initial={false}
                onExitComplete={() => window.scrollTo(0, 0)}
              >
                <Component {...pageProps} canonical={url} key={url} />
              </AnimatePresence>
            </Hydrate>
          </GlobalContextProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </WagmiConfig>
  );
}

export default MyApp;