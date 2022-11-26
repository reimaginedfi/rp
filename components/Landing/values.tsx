import {
  Flex,
  Grid,
  Text,
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
    },
    {
      title: "Safe",
      text: "155 Capital is secured by Fireblocks, the #1 institutional digital asset custody solution. Their proprietary wallet technology and multi-party computation (MPC) provide multi-layered digital asset custody security.",
    },
    {
      title: "Profitable",
      text: "Maintaining profitability through the volatility of crypto markets is difficult. Allow our world-class team of DeFi-native investors to do it for you. We’re plugged into the latest protocols, narratives, and macro happenings; more importantly, we understand the strategies & timing to capitalize on these opportunities.",
    },
  ];

  return (
    <Accordion allowToggle defaultIndex={[0]}>
      <AccordionItem border="none" w="70%">
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
            //   gridTemplateAreas='"title text text"'
              gridTemplateColumns="300px 2fr"
              py="2rem"
              >
                <Text
                    // gridArea="title"
                  variant="normal"
                  ml="1rem"
                  color={colorMode === "dark" ? "darktext" : "lighttext"}
                  w="50%"
                >
                  {value.title}
                </Text>
                <Text
                    // gridArea="text"
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
