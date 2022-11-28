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
} from "@chakra-ui/react";

export default function Values() {
  const { colorMode } = useColorMode();

  const values = [
    {
      title: "Transparency",
      text: "Don’t Trust, Verify. Unlike traditional funds, at 155 you know exactly where your capital is and how it’s being utilized. All of our investments are on-chain and visible 24/7/365.",
      image: colorMode === "dark" ? "/icons/transparency-dark.svg" : "/icons/transparency-light.svg",
    },
    {
      title: "Safe",
      text: "155 Capital is secured by Fireblocks, the #1 institutional digital asset custody solution. Their proprietary wallet technology and multi-party computation (MPC) provide multi-layered digital asset custody security.",
        image: colorMode === "dark" ? "/icons/safety-dark.svg" : "/icons/safety-light.svg",
    },
    {
      title: "Profitable",
      text: "Maintaining profitability through the volatility of crypto markets is difficult. Allow our world-class team of DeFi-native investors to do it for you. We’re plugged into the latest protocols, narratives, and macro happenings; more importantly, we understand the strategies & timing to capitalize on these opportunities.",
        image: colorMode === "dark" ? "/icons/profitability-dark.svg" : "/icons/profitability-light.svg",
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
            {values.map((value) => (
              <Grid
              gridTemplateColumns="300px 2fr"
              dir={{base: "row", md: "column"} as any}
              py="2rem"
              >
                <Flex direction="row" alignItems="center">
                <Image src={value.image} h="1.5rem"/>
                <Text
                  variant="normal"
                  ml="1rem"
                  color={colorMode === "dark" ? "darktext" : "lighttext"}
                  w={{base: "20%", md: "50%"}}
                >
                  {value.title}
                </Text>
                </Flex>
                <Text
                  variant="normal"
                  ml="1rem"
                  color={colorMode === "dark" ? "darktext" : "lighttext"}
                  w="100%"
                >
                  {value.text}
                </Text>
              </Grid>
            ))}
          </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
