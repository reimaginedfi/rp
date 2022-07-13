import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

interface LayoutProps {
  children: JSX.Element;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode();
  return (
    <Box
      bg={colorMode === "dark" ? "#161616" : "#FCFCFC"}
      w="100vw"
      h="100vh"
      color={colorMode === "dark" ? "rgba(255, 255, 255, 0.92)" : "#1A202C"}
      p={5}
    >
      <Flex w="full" justify={"space-between"} alignItems="center">
        <Text>REFI Pro</Text>
        <ConnectButton chainStatus={'none'} showBalance={false} />
      </Flex>
      {children}
    </Box>
  );
};

export default Layout;
