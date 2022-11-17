import "@rainbow-me/rainbowkit/styles.css";
import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import "@fontsource/inter";
import "@fontsource/inter/variable-full.css";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

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

export const Fonts = () => (
  <Global
    styles={`
    @font-face {
      font-family: "Clash Display";
      src: url("./fonts/ClashDisplay/ClashDisplay-Variable.ttf") format("ttf"),
      url("./fonts/ClashDisplay/ClashDisplay-Variable.woff") format("woff"),
      url("./fonts/ClashDisplay/ClashDisplay-Variable.woff2") format("woff2"),
      url("./fonts/ClashDisplay/ClashDisplay-Variable.eot") format("eot");
      font-display: fallback;
    }`}
  />
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <WagmiConfig client={wagmiClient}>
        <Fonts />
        <Layout chains={chains}>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
