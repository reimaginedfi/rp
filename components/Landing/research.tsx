import { Flex, Text, Image, Link, useColorMode } from "@chakra-ui/react";

export default function Research() {
  const { colorMode } = useColorMode();

  const media = [
    {
      title: "The 155 Capital Fund",
      link: "https://medium.com/155-capital/the-155-capital-fund-1f3b0b5b5f8a",
      desc: "155 Capital is an actively managed fund for protocol treasuries.",
    },
    {
      title: "You're Not a Whale, You're a Dolphin",
      link: "https://medium.com/155-capital/youre-not-a-whale-youre-a-dolphin-2b2f1f2f1f1f",
      desc: "What is a whale? What is a dolphin? What is a minnow? What is a guppy?",
    },
    {
      title: "Thirty Days of DeFi",
      link: "https://medium.com/155-capital/thirty-days-of-defi-1f3b0b5b5f8a",
      desc: "A look at the DeFi ecosystem over the past 30 days.",
    },
  ];

  return (
    <Flex px="2rem">
      <Flex direction="column" py="2rem">
        <Flex alignItems="center" py="2rem">
          <Image
            px="1rem"
            src={
              colorMode === "dark"
                ? "/icons/research-dark.svg"
                : "/icons/research-light.svg"
            }
            h="1.5rem"
          />
          <Text variant="normal">Research & Media</Text>
        </Flex>
        <Flex gap="1rem" direction={{base: "column", md:"row"}}>
          {media.map((med) => (
            <Flex p={{base: "2rem", md: "3rem"}} w="fit-content" direction="column" border="1px solid" borderColor={colorMode === "dark" ? "darktext" : "lighttext"}>
              <Text mb="0.5rem" variant="normal">{med.title}</Text>
              <Text mb="0.5rem" variant="small">{med.desc}</Text>
              <Link _hover={{
            textDecoration: "none !important"}} px="none" href={med.link} isExternal>
                <Text variant="link2" px="0">{"Visit >"}</Text>
              </Link>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
