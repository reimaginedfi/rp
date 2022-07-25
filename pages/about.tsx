import {Flex, Text, Heading, Link} from '@chakra-ui/react'
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";

const FAQ = dynamic(() => import("../components/about/faq"), {
    ssr: false,
  });

  const title = "REFI Pro About";
  const description = "$REFI is DeFi, reimagined.";

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
       <Flex direction="column" m="auto" w="100%"         alignContent="center"
        justifyContent="center" pb="5rem">
                <Heading
        textAlign="center"
        fontSize={{ xl: "40px", base: "32px" }}
        lineHeight={{ xl: "40px", base: "32px" }}
        fontWeight="600"
        mt="5%"
        mb="1.5%"
      >
        More About
        <Text
          display="inline"
          bgGradient="radial-gradient(128.15% 697.56% at 9.91% 100%, #FF3F46 0%, #FF749E 57.68%, #FFE3AB 100%)"
          bgClip="text"
          ml={2}
          overflowWrap="normal"
          wordBreak="keep-all"
        >
          REFI Pro
        </Text>
      </Heading>
      <Text         mb="1%"
 variant="large"        w={{ base: "90%", md: "70%" }}
alignSelf="center">
      ReFi Pro is the first crypto institutional on-chain asset management service for large institutional and retail investors that will be launched by the Reimagined Finance (ReFi) team.
Investors simply deposit capital into ReFi Pro vaults, which are built on the Ethereum chain. 
      </Text>
      <Text         mb="1%"
 variant="large"        w={{ base: "90%", md: "70%" }}
alignSelf="center">      The ReFi investment team subsequently deploys investor capital from these vaults onto various chains and protocols to generate alpha / yield for investors.
For more information about the main ReFi project, $REFI token and team, kindly visit our <Link color="brand" href="https://refi.gitbook.io/refi-pro/" isExternal>ReFi GitBook Docs.</Link>
      </Text>
        <FAQ/>
        </Flex>
        </>
    )
}