import {
  Flex,
  Heading,
  Image,
  Text,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function Hero() {
  const { colorMode } = useColorMode();

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
      <Flex direction="row" alignItems="center" gap="3rem" px="1rem">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          <Image
            src={
              colorMode === "dark"
                ? "/icons/hero-dark.svg"
                : "/icons/hero-light.svg"
            }
            w={{ base: "150px", md: "85px" }}
          />
        </motion.div>
        <Heading variant={{ base: "large", md: "extralarge" }}>
          DeFi Asset Management Made Easy!
        </Heading>
      </Flex>

      <Text
        px="1rem"
        textAlign="start"
        w={{ base: "100%", md: "90%", lg: "50%" }}
        variant={{ base: "small", md: "normal" }}
      >
        <b>155</b> Capital is an actively managed fund for protocol{" "}
        <b>treasuries</b>, large <b>institutions</b>, and well-capitalized
        retail <b>investors</b> seeking professional exposure to decentralized
        finance.
      </Text>

      <Button variant="primary" alignSelf={{ base: "center", md: "start" }}>
        <Text zIndex="2">Invest</Text>
      </Button>
    </Flex>
  );
}
