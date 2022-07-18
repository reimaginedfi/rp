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
  useSwitchNetwork()

  return (
    <>
      <Head>
        <title>REFI Pro</title>
        <meta name="description" content="REFI Pro" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
          <UserStat />
        </>
      ) : chain && chain.id !== 1 ? (
        <Stack m="20%" align="center">
        <Heading>{chain!.name} is not a supported chain.</Heading>
        <Button variant="primary" onClick={() => switchNetwork?.(1)}>Switch chains</Button>
      </Stack>
      ) : (
        <Stack m="20%" align="center">
          <Heading>Connect your wallet first to see your vaults.</Heading>
          <RainbowConnectButton
                  chainStatus={"none"}
                  showBalance={false}
                />        </Stack>
      )}
    </>
  );
};
export default AdminPage;
