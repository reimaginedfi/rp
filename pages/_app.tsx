import "@rainbow-me/rainbowkit/styles.css";
import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/pt-mono";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";

import Layout from "../components/Layout";
import theme from "../theme";

export const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID as string }),
    // publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "REFI Pro",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <WagmiConfig client={wagmiClient}>
        <Layout chains={chains}>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
