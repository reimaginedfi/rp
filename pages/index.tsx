import {
  VisuallyHidden,
  Heading,
  Button,
  Stack,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Logo } from "../components/Logo";
import VaultComp from "../components/VaultComp";
import { useSwitchNetwork, useNetwork } from "wagmi";
import { vaults } from "../contracts";
import { Vault } from "../components/Vault";
import UserStat from "../components/UserStat";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { NextSeo } from "next-seo";

const PageContent = dynamic(() => import("../components/PageContent"), {
  ssr: false,
});

const AdminPage = () => {
  const OldContent = () => (
    <>
      <VisuallyHidden>
        <Heading>REFI Pro</Heading>
      </VisuallyHidden>
      <Stack as="main" minH="100vh" spacing={0}>
        <Logo />
        <PageContent />
      </Stack>
    </>
  );

  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
    
    const title = "REFI Pro";
    const description = "$REFI is DeFi, reimagined.";
  return (
    <>
      <NextSeo
      title={title}
      description={description}
      openGraph={{
        title,
        description,
        url: "https://pro.reimagined.fi/",
        images: [
          {
            url: "https://pro.reimagined.fi/OG.jpeg",
            width: 1024,
            height: 1024,
            alt: "Refi",
          },
        ],
      }}
    />

      {chain && chain?.id in vaults ? (
        <>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(auto-fit, 500px)",
            }}
            alignItems="center"
            justifyContent="center"
            m="auto"
          >
            {vaults[chain!.id].map((contractConfig) => (
              <GridItem key={contractConfig.addressOrName} mx="5%" my="15%">
                <Vault
                  key={contractConfig.addressOrName}
                  contractConfig={contractConfig}
                />
              </GridItem>
            ))}
          </Grid>
          {/*<UserStat />*/}
        </>
      ) : chain && chain.id !== 1 ? (
        <Stack m="auto" mt="20%" w="full" align="center" gap="0.5rem">
          <Heading>{chain!.name} is not a supported chain.</Heading>
          <Button variant="primary" onClick={() => switchNetwork?.(1)}>
            Switch chains
          </Button>
        </Stack>
      ) : (
        <Stack m="auto" mt="20%" w="full" align="center" gap="0.5rem">
          <Heading variant="big" textAlign="center">
            Connect your wallet to see your vaults.
          </Heading>
          <RainbowConnectButton chainStatus={"none"} showBalance={false} />{" "}
        </Stack>
      )}
    </>
  );
};
export default AdminPage;
