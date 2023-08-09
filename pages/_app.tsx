import "@rainbow-me/rainbowkit/styles.css";
import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import "@fontsource/inter";
import "@fontsource/inter/variable-full.css";
import { getDefaultWallets, connectorsForWallets } from "@rainbow-me/rainbowkit";

import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

import { infuraProvider } from "wagmi/providers/infura";
// import { publicProvider } from "wagmi/providers/public";

import Layout from "../components/Layout";
import theme from "../theme";

export const { chains, publicClient } = configureChains(
  [mainnet],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID as string }),
    // publicProvider(),
  ],
  { pollingInterval: 12_000 },
);

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string;

const { connectors } = getDefaultWallets({
  appName: 'REFI Pro',
  projectId: projectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

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
      <WagmiConfig config={wagmiConfig}>
        <Fonts />
        <Layout chains={chains}>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
