import { Box, Flex, Heading, Text, useColorMode } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React from "react";

interface LayoutProps {
  children: JSX.Element;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode();
  
  const router = useRouter();

  return (
    <Box
      bg={colorMode === "dark" ? "#161616" : "#FCFCFC"}
      w="100vw"
      minH={'100vh'}
      h="full"
      color={colorMode === "dark" ? "rgba(255, 255, 255, 0.92)" : "#1A202C"}
    >
      <Flex
        position="sticky"
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
        <Heading 
        fontFamily="Clash Display" 
        variant={"large"} 
        onClick={() => router.push('/')}
        _hover={{cursor: 'pointer'}}
        >
          REFI Pro
        </Heading>
        <ConnectButton chainStatus={"none"} showBalance={false} />
      </Flex>
      <Box w='full'>{children}</Box>
    </Box>
  );
};

export default Layout;
