import "@rainbow-me/rainbowkit/styles.css";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { withCappedText } from "@gvrs/chakra-capsize/theme";
import {
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import ibmPlexMono from "@capsizecss/metrics/iBMPlexMono";
import { Global } from "@emotion/react";
import { infuraProvider } from "wagmi/providers/infura";
import Layout from "../components/Layout";
import theme from "../theme";
import "@fontsource/inter/variable-full.css";
import "@fontsource/inter";

export const { chains, provider, webSocketProvider } = configureChains(
  process.env.NODE_ENV === "production"
    ? [chain.mainnet]
    : [chain.localhost, chain.hardhat, chain.rinkeby, chain.mainnet],
  [
    // alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
    infuraProvider({ infuraId: process.env.NEXT_PUBLIC_INFURA_ID }),
    publicProvider(),
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

const chakraTheme = extendTheme(
  {
    fonts: {
      heading: "IBM Plex Mono",
      body: "IBM Plex Mono",
    },
    capHeights: {
      sm: 10,
      md: 14,
      lg: 18,
      xl: 24,
    },
  },
  withCappedText({
    fontMetrics: {
      "IBM Plex Mono": ibmPlexMono,
      "Courier New": ibmPlexMono,
    },
  })
);

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
{ /*         <Global
            styles={`
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;1,300&display=swap');            `}
  />*/}
          <Layout chains={chains}>
            <Component {...pageProps} />
          </Layout>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
