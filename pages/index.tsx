import {
  VisuallyHidden,
  Heading,
  Stack,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Logo } from "../components/Logo";
import VaultComp from "../components/VaultComp";
import { useAccount, useNetwork } from "wagmi";
import { vaults } from "../contracts";
import { Vault } from "../components/Vault";
import UserStat from "../components/UserStat";

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

  if (chain && chain?.id in vaults) {
    return (
      <>
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        >
          {[1, 2, 3].map(i => vaults[chain.id].map((contractConfig) => (
            <GridItem key={contractConfig.addressOrName} mx="5%" my="15%">
              <Vault
                key={contractConfig.addressOrName}
                contractConfig={contractConfig}
              />
            </GridItem>
          )))}
        </Grid>
        <UserStat />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>REFI Pro</title>
        <meta name="description" content="REFI Pro" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};
export default AdminPage;
