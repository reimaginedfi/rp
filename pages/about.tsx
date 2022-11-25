import { Flex, Text, Heading, Link } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";

const FAQ = dynamic(() => import("../components/about/faq"), {
  ssr: false,
});

const title = "155 Capital | About";
const description = "On-chain asset management.";

export default function About() {
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
          url: "https://155.capital/about",
          images: [
            {
              url: "https://155.capital/og.png",
              width: 1200,
              height: 628,
              alt: "155 Capital",
            },
          ],
        }}
      />
      <Flex
        direction="column"
        m="auto"
        w={{ base: "90%", md: "100%" }}
        alignContent="center"
        justifyContent="center"
        pb="5rem"
        pt={{ base: "5rem", md: "1rem" }}
        gap="1rem"
      >
        <Heading variant="normal" textAlign="center" fontWeight="400" mb="1rem">
          More About <b>155 Capital Vaults</b>
        </Heading>
        <Text
          variant="normal"
          w={{ base: "90%", md: "70%" }}
          alignSelf="center"
          textAlign={"center"}
        >
          On-chain asset management service for large institutional and
          high-net-wroth retail investors.
        </Text>
        <Text
          variant="normal"
          w={{ base: "90%", md: "70%" }}
          alignSelf="center"
          textAlign={"center"}
        >
          Investors simply deposit capital into 155 Capital vaults built on the
          Ethereum chain. 155 Capital then uses the deposited capital to invest
          in various chains and protocols to generate alpha / yield for
          investors.
        </Text>
        <Text
          variant="normal"
          w={{ base: "90%", md: "70%" }}
          alignSelf="center"
          textAlign={"center"}
        >
          For more information about the main ReFi team, kindly visit our{" "}
          <Link
            color="brand"
            href="https://refi.gitbook.io/refi-pro/"
            isExternal
            _hover={{ textDecoration: "none" }}
          >
            <Text variant="link"> GitBook Docs.</Text>
          </Link>
        </Text>
        <Text
          variant="normal"
          w={{ base: "90%", md: "70%" }}
          alignSelf="center"
          textAlign={"center"}
        >
          We answer the most common questions below:
        </Text>
        <FAQ />
      </Flex>
    </>
  );
}
