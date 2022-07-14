import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Progress,
  Button,
  Text,
  Heading,
  useColorMode,
  Box,
  Spacer,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";

import VaultProgressBar from "./VaultProgressBar"

type VaultProps = {
  vaultName: string;
  asset: string | undefined;
  currentAum: string;
  aumCap: string;
  epoch: string | undefined;
};

const VaultComp = ({
  vaultName,
  asset,
  currentAum,
  aumCap,
  epoch,
}: VaultProps) => {
  const { colorMode } = useColorMode();

  return (
    <Accordion bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"} allowToggle borderWidth='1px' borderColor='#232323' borderRadius='1rem'>
      <AccordionItem border="1px solid #232323" borderRadius="0.5rem">
        <AccordionButton
          _focus={{
            borderBottom: "1px solid #232323"
          }}
        >
          <Flex w="full" justify="space-between" alignItems="center">
            <Flex direction="row" alignItems="center">
              <Heading variant="large">{vaultName! || "Vault"}</Heading>
              <Text ml="0.5rem" variant="medium">
                ({asset})
              </Text>
            </Flex>
            <AccordionIcon />
          </Flex>
        </AccordionButton>

        <AccordionPanel>
          <Grid
            mb="2rem"
            gap={6}
            templateColumns="repeat(2, 1fr)"
            fontFamily={"Inter"}
            w="full"
          >
            <GridItem textAlign="center">
              <Text fontSize="32px" fontWeight={600}>
                +25%
              </Text>
              <Text fontSize="24px">+125k {asset}</Text>
              <Text
                style={{
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                }}
                bg="radial-gradient(136.45% 135.17% at 9.91% 100%, #FF3F46 0%, #FF749E 57.68%, #FFE3AB 100%)"
                fontSize="24px"
                fontWeight={700}
              >
                EPOCH 2
              </Text>
            </GridItem>

            <GridItem  textAlign="center">
              <Image
                m="auto"
                w="8rem"
                h="8rem"
                src="/usdc-logo.png"
                alt="USDC"
              />
            </GridItem>
            <GridItem alignItems='center'>
              <Button w="full" variant="primary">
                Deposit
              </Button>
            </GridItem>
            <GridItem>
              <Button w="full" variant="ghost">
                Withdraw
              </Button>
            </GridItem>
          </Grid>
          <Flex my={2} alignItems="center">
            <Box mr={2} rounded={"full"} w="11px" h="11px" bg="#C51E25" />
            <Text variant="large">AUM</Text>
            <Spacer />
            <Text variant="large">
              {currentAum} / {aumCap}
            </Text>
          </Flex>

          <VaultProgressBar
            currentAum={parseInt(currentAum)}
            aumCap={parseInt(aumCap)}
            remainingDeposits="500"
          />
          <Flex alignItems={"center"}>
            <Box mr={2} rounded={"full"} w="11px" h="11px" bg="#E9A9AB" />
            <Text variant="medium">Pending Deposits</Text>
            <Spacer />
            <Text variant="medium">500 USDC</Text>
          </Flex>
          {/* <Progress
            borderRadius="1rem"
            value={parseInt(currentAum)}
            max={parseInt(aumCap)}
            size="md"
            colorScheme="red"
          /> */}
         
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default VaultComp;
