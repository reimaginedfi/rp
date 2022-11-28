import {Flex, Image, Text, Button, useColorMode} from "@chakra-ui/react";


export default function Hero() {
    const {colorMode} = useColorMode();

    return (
        <Flex
        direction="column"
        dir="column"
        bg={colorMode === "dark" ? "darkbg" : "lightbg"}
        overflow="hidden"
        gap={{ base: "3rem", xl: "5rem" }}
        py="5rem"
        alignItems={"start"}
      >    
      <Image src={colorMode === "dark" ? "/icons/hero-dark.svg" : "/icons/hero-light.svg"} h="85px" w="85px" />
      <Text textAlign="start" w="50%" variant="normal"><b>155</b> Capital is an actively managed fund for protocol <b>treasuries</b>, large <b>institutions</b>, and well-capitalized retail <b>investors</b> seeking professional exposure to decentralized finance.</Text>

      <Button variant="primary">
        <Text zIndex="2">Invest</Text>
      </Button>
      </Flex>
    )
}