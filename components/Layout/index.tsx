import {
  Box,
  Button,
  Flex,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  Drawer,
  Heading,
  Text,
  Image,
  VStack,
  Link,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React from "react";
import {
  lightTheme,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import NextLink from "next/link";

import { HiMenu, HiSun, HiMoon, HiChevronDown } from "react-icons/hi";
import { RiArrowRightUpLine } from "react-icons/ri";

interface LayoutProps {
  children: JSX.Element;
  chains: any;
}

const refiLinks = [
  ["REFI Token", "https://reimagined.fi"],
  ["Blog", "https://reimaginedfi.medium.com/"],
  [
    "Smart Contract",
    "https://etherscan.io/address/0x00000008786611c72a00909bd8d398b1be195be3",
  ],
];

const Layout: React.FC<LayoutProps> = ({ children, chains }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const router = useRouter();

  const {
    isOpen: isRefiLinks,
    onOpen: openRefiLinks,
    onClose: closeRefiLinks,
  } = useDisclosure();

  const menuToggle = useDisclosure();

  return (
    <RainbowKitProvider
      chains={chains}
      showRecentTransactions={true}
      theme={
        colorMode === "light"
          ? lightTheme({
              accentColor: "linear-gradient(180deg, #F3484F 0%, #C51E25 100%)",
            })
          : darkTheme({
              accentColor: "linear-gradient(180deg, #F3484F 0%, #C51E25 100%)",
            })
      }
    >
      <Box
        bg={colorMode === "dark" ? "#161616" : "#FCFCFC"}
        minH={"100vh"}
        h="full"
        color={colorMode === "dark" ? "rgba(255, 255, 255, 0.92)" : "#1A202C"}
      >
        <Flex
          position="absolute"
          top={0}
          // zIndex="sticky"
          w="100%"
          justifyContent="space-between"
          p="16px"
          h="56px"
          bg={{ base: colorMode === "dark" ? "#161616" : "#FCFCFC" }}
          borderBottom="1px solid"
          borderColor={colorMode === "dark" ? "#2E2E2E" : "#E8E8E8"}
          alignItems="center"
          pos="sticky"
          zIndex="popover"
        >
          <Button
            display={{ base: "flex", md: "none" }}
            alignItems="center"
            variant="ghost"
            onClick={menuToggle && menuToggle.onOpen}
            aria-label="hamburger"
          >
            <HiMenu />
          </Button>
          <Flex
            display={{ base: "none", md: "flex" }}
            direction="row"
            _hover={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            <Image
              src={colorMode === "dark" ? "/logo/dark.svg" : "/logo/light.svg"}
              alt="refi-pro-logo"
            />
            <Heading
              variant="large"
              fontWeight="light"
              ml="0.5rem"
              color="#BF9209"
            >
              PRO
            </Heading>
          </Flex>
          <Flex
            display={{ base: "none", md: "flex" }}
            alignSelf={"center"}
            alignItems="center"
            justifySelf="center"
            gap="2rem"
          >
          <NextLink href="/vaults">
            <Text
              p="8px"
              _hover={{
                bg: "none",
                cursor: "pointer",
                textColor: colorMode === "dark" ? "#7E7E7E" : "#858585",
              }}
            >
              Vaults
            </Text>
          </NextLink>
          <NextLink href="/about">
            <Text
              p="8px"
              _hover={{
                bg: "none",
                cursor: "pointer",
                textColor: colorMode === "dark" ? "#7E7E7E" : "#858585",
              }}
            >
              About
            </Text>
          </NextLink>
            <Link href="https://refi.gitbook.io/refi-pro/"
                            _hover={{
                              bg: "none",
                              cursor: "pointer",
                              textColor: colorMode === "dark" ? "#7E7E7E" : "#858585",
                            }}
            >
              Docs <RiArrowRightUpLine style={{ verticalAlign: "middle" }} />
            </Link>

            <Menu isOpen={isRefiLinks}>
              <MenuButton
                px="0"
                as={Button}
                bg="none"
                fontWeight="400"
                _hover={{
                  bg: "none",
                  cursor: "pointer",
                  textColor: colorMode === "dark" ? "#7E7E7E" : "#858585",
                }}
                _active={{
                  bg: "none",
                  cursor: "pointer",
                  textColor: colorMode === "dark" ? "#7E7E7E" : "#858585",
                  boxShadow: "none",
                }}
                _focus={{
                  bg: "none",
                  cursor: "pointer",
                  textColor: colorMode === "dark" ? "#7E7E7E" : "#858585",
                  boxShadow: "none",
                }}
                target="_blank"
                rightIcon={<HiChevronDown />}
                onMouseEnter={openRefiLinks}
                onMouseLeave={closeRefiLinks}
              >
                Links
              </MenuButton>

              <MenuList
                onMouseEnter={openRefiLinks}
                onMouseLeave={closeRefiLinks}
                bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
                borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
              >
                {" "}
                {refiLinks.map((refilink, index) => {
                  return (
                    <MenuItem
                      key={index}
                      as={Link}
                      href={refilink[1]}
                      isExternal
                      _hover={{
                        bg: "none",
                        textDecoration: "none",
                        textColor: colorMode === "dark" ? "#7E7E7E" : "#858585",
                        boxShadow: "none",
                      }}
                      _focus={{
                        bg: "none",
                        cursor: "pointer",
                        boxShadow: "none",
                      }}
                    >
                      {refilink[0]}&nbsp;
                      <RiArrowRightUpLine vertical-align="-10%" />
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </Flex>
          <Flex gap="1rem">
            <Button
              variant="ghost"
              onClick={toggleColorMode}
            >
              {colorMode === "dark" ? <HiSun /> : <HiMoon />}
            </Button>{" "}
            <ConnectButton
              chainStatus={"none"}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </Flex>
        </Flex>
        <LandingMenu menuToggle={menuToggle} />

        <Box w="full">{children}</Box>
      </Box>
    </RainbowKitProvider>
  );
};

export default Layout;

export function LandingMenu({ menuToggle }: any) {
  const { colorMode } = useColorMode();

  const router = useRouter();

  return (
    <Drawer
      isOpen={menuToggle.isOpen}
      onClose={menuToggle.onClose}
      placement="left"
    >
      <DrawerOverlay display={{ base: "flex", md: "none" }} />
      <DrawerContent
        bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
        minW="70vw"
        display={{ base: "flex", md: "none" }}
        pt="1rem"
      >
        <DrawerCloseButton top="2%" _focus={{ boxShadow: "none" }} />
        <DrawerHeader
          bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
          px="18px"
          borderBottom="1px dashed"
          borderColor={colorMode === "dark" ? "#2E2E2E" : "#E8E8E8"}
        >
          <NextLink href="/" passHref>
            <Flex
              display={{ base: "flex", md: "none" }}
              alignItems="center"
              cursor="pointer"
              width="150px"
              height="64px"
            >
              <Image
                src={
                  colorMode === "dark" ? "/logo/dark.svg" : "/logo/light.svg"
                }
                alt="refi-pro-logo"
              />
              <Heading
                variant="large"
                fontWeight="light"
                ml="0.5rem"
                color="#BF9209"
              >
                PRO
              </Heading>
            </Flex>
          </NextLink>
        </DrawerHeader>
        <VStack
          p="18px"
          pt="24px"
          h="full"
          overflow="hidden"
          borderRight="1px solid"
          borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
          alignItems="left"
          spacing="12px"
          overflowY="auto"
        >
          <Text
            fontWeight="400"
            fontStyle="normal"
            color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
            fontSize="0.875rem"
            lineHeight="1rem"
          >
            REFI Pro Links
          </Text>
          <NextLink href={router.pathname === "/about" ? "/" : "/about"}>
            <Text
              p="8px"
              _hover={{
                bg: "none",
                cursor: "pointer",
                textColor: colorMode === "dark" ? "#7E7E7E" : "#858585",
              }}
              fontSize="0.875rem"
            >
              {router.pathname === "/about" ? "Home" : "About"}
            </Text>
          </NextLink>
          <Link
            p="8px"
            fontSize="0.875rem"
            href="https://refi.gitbook.io/refi-pro/"
          >
            Docs <RiArrowRightUpLine style={{ verticalAlign: "middle" }} />
          </Link>
          {refiLinks.map((refilink, index) => (
            <Link key={index} href={refilink[1]} isExternal>
              <Text
                p="8px"
                fontWeight="400"
                fontStyle="normal"
                color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                _hover={{
                  bg: colorMode === "dark" ? "#161616" : "#F3F3F3",
                  color: colorMode === "dark" ? "#A0A0A0" : "#6F6F6F",
                }}
                borderRadius="8px"
                fontSize="0.875rem"
                lineHeight="1rem"
              >
                {refilink[0]} <RiArrowRightUpLine vertical-align="-10%" />
              </Text>
            </Link>
          ))}
        </VStack>
      </DrawerContent>
    </Drawer>
  );
}
