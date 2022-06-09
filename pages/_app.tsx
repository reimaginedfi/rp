import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  Theme,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import merge from "lodash.merge";
import { withCappedText } from "@gvrs/chakra-capsize/theme";

import ibmPlexMono from "@capsizecss/metrics/iBMPlexMono";
import { Global } from "@emotion/react";
import { infuraProvider } from "wagmi/providers/infura";

const { chains, provider } = configureChains(
  [chain.rinkeby, chain.mainnet],
  [
    // alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),

    infuraProvider({ infuraId: "9aa3d95b3bc440fa88ea12eaa4456161" }),
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
const rainbowTheme: Theme = lightTheme({
  fontStack: "rounded",
  borderRadius: "small",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={chakraTheme} resetCSS>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={rainbowTheme}
          showRecentTransactions={true}
        >
          <Global
            styles={`
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;1,300&display=swap');            `}
          />
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
