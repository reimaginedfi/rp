import {
  useColorMode,
  Flex,
  Text,
  HStack,
  Heading,
  Link,
  Image,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
export default function Footer() {
  const { colorMode } = useColorMode();
  const router = useRouter();

  const links = [
    ["Telegram", "https://t.me/reimaginedfi"],
    ["Discord", "https://discord.gg/CJSDJn8a56"],
    ["Twitter", "https://twitter.com/ReimaginedFi"],
  ];

  return (
    <>
      <Flex paddingTop="3rem" px={{base: "none", md: "2rem", lg: "4rem"}}>
        <HStack w="100%" height="20vh" justifyContent="space-between" px="16px">
          <Flex
            
            justifySelf="start"
            direction="row"
            alignItems="center"
            _hover={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
            h="56px"
          >
            <Image
              src={colorMode === "dark" ? "/logo/dark.svg" : "/logo/light.svg"}
              // height="56px"
              width={{base: "2.25rem", md: "56px"}}
              alt="155 Capital Logo"
            />
            <Heading
              variant="normal"
              fontWeight="400"
              ml="0.5rem"
              color={colorMode === "dark" ? "darktext" : "lighttext"}
              fontSize={{base: "0.5rem", md: "1.75rem", lg: "2rem"}}            >
              Capital
            </Heading>
          </Flex>
          <HStack
            w="100%"
            spacing="1em"
            justifyContent="end"
            alignItems="space-evenly"
            alignContent="center"
          >
            {links.map((link) => (
              <Link
                _hover={{
                  textDecoration: "none",
                }}
                href={link[1]}
                isExternal
              >
                <Text variant="link" fontSize={{base: "0.5rem", md: "1.75rem", lg: "2rem"}}>{link[0]}</Text>
              </Link>
            ))}
          </HStack>
        </HStack>
      </Flex>
    </>
  );
}
