import { Button, Grid, GridItem, Heading, Stack } from "@chakra-ui/react";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { useNetwork, useSwitchNetwork } from "wagmi";

import { vaults } from "../contracts";
import { Vault } from "./Vault";

export const PageContent = ({previewAum}: {previewAum: any}) => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  return (
    <>
      {chain && chain?.id in vaults ? (
        <>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(auto-fit, 500px)",
            }}
            minH="100vh"
            m="auto"
            placeContent={"center"}
            py={16}
          >
            {vaults[chain.id].map((contractConfig) => (
              <GridItem
                key={contractConfig.addressOrName}
                m={{ base: "5%", md: "2.5%" }}
              >
                <Vault previewAum={previewAum} contractConfig={contractConfig} />
              </GridItem>
            ))}
          </Grid>
        </>
      ) : chain && chain.id !== 1 ? (
        <Stack textAlign='center' m="auto" mt="20%" w="full" align="center" gap="0.5rem">
          <Heading>{chain.name} is not a supported chain.</Heading>
          <Button variant="primary" onClick={() => switchNetwork?.(1)}>
            Switch chains
          </Button>
        </Stack>
      ) : (
        <Grid minH={"100vh"} placeContent="center">
          <Stack m="auto" mt="20%" w="full" align="center" gap="0.5rem">
            <Heading variant="big" textAlign="center">
              Connect your wallet to see your vaults.
            </Heading>
            <RainbowConnectButton chainStatus={"none"} showBalance={false} />{" "}
          </Stack>
        </Grid>
      )}
    </>
  );
};

export default PageContent;
