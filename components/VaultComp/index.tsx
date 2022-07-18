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
  useDisclosure
} from "@chakra-ui/react";

import VaultProgressBar from "./VaultProgressBar"
import DepositModal from "./modals/depositModal"
import WithdrawModal from "./modals/withdrawModal"

type VaultProps = {
  vaultName: string;
  asset: string | undefined;
  currentAum: string;
  aumCap: string;
  epoch: string | undefined;
  pendingDeposit: string;
};

const VaultComp = ({
  vaultName,
  asset,
  currentAum,
  aumCap,
  epoch,
  pendingDeposit
}: VaultProps) => {
  const { colorMode } = useColorMode();
  const {isOpen: depositIsOpen, onOpen: onOpenDeposit, onClose: onCloseDeposit} = useDisclosure()
  const {isOpen: withdrawIsOpen, onOpen: onOpenWithdraw, onClose: onCloseWithdraw} = useDisclosure()



  return (
    <>
    <Accordion  bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"} allowToggle border={colorMode === "dark" ? "1px solid #232323" : "1px solid #F3F3F3"} borderRadius="1rem">
      <AccordionItem>
        <>
        <AccordionButton borderRadius="1rem">
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
                GAIN: 
              </Text>
              <Text fontSize="24px">AMOUNT {asset}</Text>
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
                EPOCH {epoch}
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
              <Button w="full" variant="primary" onClick={onOpenDeposit}>
                Deposit
              </Button>
            </GridItem>
            <GridItem>
              <Button w="full" variant="ghost" onClick={onOpenWithdraw}>
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
            remainingDeposits={pendingDeposit}
          />
          
          <Flex alignItems={"center"}>
            <Box mr={2} rounded={"full"} w="11px" h="11px" bg="#E9A9AB" />
            <Text variant="medium">Pending Deposits</Text>
            <Spacer />
            <Text variant="medium">{pendingDeposit} USDC</Text>
          </Flex>

        </AccordionPanel>
        </>
      </AccordionItem>
    </Accordion>

    {depositIsOpen && <DepositModal onClose={onCloseDeposit} isOpen={depositIsOpen} />}
    {withdrawIsOpen && <WithdrawModal onClose={onCloseWithdraw} isOpen={withdrawIsOpen}  />}

    </>
  );
};

export default VaultComp;
