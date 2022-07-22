import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  AccordionIcon,
  VisuallyHidden,
  Heading,
  Button,
  Stack,
  Grid,
  GridItem,
  useColorMode,
} from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Logo } from "../components/Logo";
import VaultComp from "../components/VaultComp";
import { useSwitchNetwork, useNetwork } from "wagmi";
import { vaults } from "../contracts";
import { Vault } from "../components/Vault";
import { NextSeo } from "next-seo";

const PageContent = dynamic(() => import("../components/PageContent"), {
  ssr: false,
});

const Page = () => {
  const title = "REFI Pro";
  const description = "$REFI is DeFi, reimagined.";

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        twitter={{
          handle: "@reimaginedfi",
          site: "@reimaginedfi",
          cardType: "summary_large_image",
        }}
        openGraph={{
          title,
          description,
          url: "https://pro.reimagined.fi/",
          images: [
            {
              url: "https://pro.reimagined.fi/og.png",
              width: 1200,
              height: 628,
              alt: "Refi",
            },
          ],
        }}
      />

      <PageContent />
    </>
  );
};
export default Page;
