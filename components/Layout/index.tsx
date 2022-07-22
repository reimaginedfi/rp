import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  useColorMode,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React from "react";
import {
  lightTheme,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import { HiSun, HiMoon } from "react-icons/hi";

interface LayoutProps {
  children: JSX.Element;
  chains: any;
}

const Layout: React.FC<LayoutProps> = ({ children, chains }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const router = useRouter();

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
        w="100vw"
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
        >
          <Flex
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
          <Flex gap="1rem">
            <Button
              variant="ghost"
              onClick={toggleColorMode}
              display={{ base: "none", md: "flex" }}
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
        <Box w="full">{children}</Box>
      </Box>
    </RainbowKitProvider>
  );
};

export default Layout;
