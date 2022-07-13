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
  return (
    <>
      <Head>
        <title>REFI Pro</title>
        <meta name="description" content="REFI Pro" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <OldContent /> */}

      <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }}>
        {[1, 2, 3].map((i) => (
          <GridItem key={i}>
            <VaultComp />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};
export default AdminPage;
