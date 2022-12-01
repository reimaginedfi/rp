import {
  Flex,
  Grid,
  Text,
  Image,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  useColorMode,
  Link
} from "@chakra-ui/react";

export default function Values() {
  const { colorMode } = useColorMode();

  const values = [
    {
      title: "Transparency",
      text: "Don’t Trust, Verify. Unlike traditional funds, at 155 you know exactly where your capital is and how it’s being utilized.",
      image: colorMode === "dark" ? "/icons/transparency-dark.svg" : "/icons/transparency-light.svg",
      link: "https://etherscan.io/address/0x00000008786611c72a00909bd8d398b1be195be3",
    },
    {
      title: "Safe",
      text: "155 Capital is secured by Fireblocks, the #1 institutional digital asset custody solution.",
        image: colorMode === "dark" ? "/icons/safety-dark.svg" : "/icons/safety-light.svg",
      link: "https://fireblocks.com/",
    },
    {
      title: "Profitable",
      text: "Maintaining profitability through the volatility of crypto markets is difficult. Allow our world-class team of DeFi-native investors to do it for you.",
        image: colorMode === "dark" ? "/icons/profitability-dark.svg" : "/icons/profitability-light.svg",
      link: "https://medium.com/155-capital/thirty-days-of-defi-1f3b0b5b5f8a",
    },
  ];

  return (
    <Accordion allowToggle defaultIndex={[0]}>
      <AccordionItem border="none" w="100%">
        <AccordionButton border="none" _hover={{bg: "none"}}>
          <Flex flex="1" textAlign="left" direction="row" alignItems={"center"}>
            <AccordionIcon
              ml="-1rem"
              fontSize="2rem"
              color={colorMode === "dark" ? "darktext" : "lighttext"}
            />
            <Text variant="normal">VALUES</Text>
            <AccordionIcon
              fontSize="2rem"
              color={colorMode === "dark" ? "darktext" : "lighttext"}
              fontWeight="100"
            />
          </Flex>
        </AccordionButton>
        <AccordionPanel pb={4}>
            {values.map((value, index) => (
              <Grid
              key={index}
              gridTemplateColumns={{base: "none", md: "300px 2fr"}}
              gridAutoFlow="row"
              dir={{base: "row", md: "column"} as any}
              py="2rem"
              >
                <Flex direction="row" alignItems="center" my="1rem" _first={{alignSelf: "start"}}>
                <Image src={value.image} h="1.5rem"/>
                <Text
                  variant="normal"
                  ml="1rem"
                  color={colorMode === "dark" ? "darktext" : "lighttext"}
                  w={{base: "100%", md: "50%"}}
                >
                  {value.title}
                </Text>
                </Flex>
                <Text
                  variant={{base: "small", md: "normal"}}
                  ml={{base: "0", md: "1rem"}}
                  color={colorMode === "dark" ? "darktext" : "lighttext"}
                  w="100%"
                >
                  {value.text}
                  <Link _hover={{
            textDecoration: "none !important"}} px="none" href={value.link} isExternal>
                <Text  variant="link2" px="0">{"Learn More >"}</Text>
               </Link>
                </Text>
              </Grid>
            ))}
          </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
