import { VisuallyHidden, Heading, Stack } from "@chakra-ui/react";
import Head from "next/head";
import { useSSR } from "../components/hooks/useSSR";
import { Logo } from "../components/Logo";
import { PageContent } from "../components/PageContent";

const AdminPage = () => {
  const isSSR = useSSR();
  return (
    <>
      <Head>
        <title>REFI Pro</title>
        <meta name="description" content="REFI Pro" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VisuallyHidden>
        <Heading>REFI Pro</Heading>
      </VisuallyHidden>
      <Stack as="main" minH="100vh" spacing={0}>
        <Logo />
        {!isSSR && <PageContent />}
      </Stack>
    </>
  );
};
export default AdminPage;
