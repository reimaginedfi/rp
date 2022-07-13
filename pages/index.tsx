import { VisuallyHidden, Heading, Stack } from "@chakra-ui/react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Logo } from "../components/Logo";

const PageContent = dynamic(() => import("../components/PageContent"), {
  ssr: false,
});

const AdminPage = () => {
  const OldContent = () => <><VisuallyHidden>
    <Heading>REFI Pro</Heading>
  </VisuallyHidden><Stack as="main" minH="100vh" spacing={0}>
      <Logo />
      <PageContent />
    </Stack></> 
  return (
    <>
      <Head>
        <title>REFI Pro</title>
        <meta name="description" content="REFI Pro" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <OldContent /> */}
    </>
  );
};
export default AdminPage;
