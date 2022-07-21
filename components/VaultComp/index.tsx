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
import UserStat from "../UserStat";
import { ContractConfig } from "../../contracts";


type VaultProps = {
  vaultName: string;
  asset: string | undefined;
  currentAum: string;
  aumCap: string;
  epoch: string | undefined;
  pendingDeposit: string;
  contractConfig: ContractConfig
};

const VaultComp = ({
  vaultName,
  asset,
  currentAum,
  aumCap,
  epoch,
  pendingDeposit,
  contractConfig
}: VaultProps) => {
  const { colorMode } = useColorMode();
  const {isOpen: depositIsOpen, onOpen: onOpenDeposit, onClose: onCloseDeposit} = useDisclosure();
  const {isOpen: withdrawIsOpen, onOpen: onOpenWithdraw, onClose: onCloseWithdraw} = useDisclosure();

  return (
    <>
    <Accordion defaultIndex={[0]} bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"} allowToggle border={colorMode === "dark" ? "1px solid #232323" : "1px solid #F3F3F3"} borderTopRadius="1rem">
      <AccordionItem border="none">
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

        <AccordionPanel p="0">
        <Grid
            mb="2rem"
            gap={6}
            templateColumns="repeat(2, 1fr)"
            fontFamily={"Inter"}
            w="full"
            px="1rem"
          >
            {aumCap === '0.0' ? <Flex justify="center" align="center"><Heading variant="medium" textAlign="center" color="brand" lineHeight="1.5rem">This Vault is being initialized</Heading></Flex> : <GridItem textAlign="center">
              <Text fontSize="32px" fontWeight={600}>
                0%
              </Text>
              <Text fontSize="24px">0 {asset}</Text>
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
            </GridItem>}

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
              <Button disabled={aumCap === '0.0'} w="full" variant="primary" onClick={onOpenDeposit}>
                Deposit
              </Button>
            </GridItem>
            <GridItem>
              <Button disabled={aumCap === '0.0'} w="full" variant="ghost" onClick={onOpenWithdraw}>
                Withdraw
              </Button>
            </GridItem>
          </Grid>
          <Flex             px="1rem"
 my={2} alignItems="center">
            <Box mr={2} rounded={"full"} w="11px" h="11px" bg="#C51E25" />
            <Text variant="large">AUM</Text>
            <Spacer />
            <Text variant="large">
              {currentAum} / {aumCap}
            </Text>
          </Flex>
          <Flex             px="1rem"
>
<VaultProgressBar
            currentAum={parseInt(currentAum)}
            aumCap={parseInt(aumCap)}
            remainingDeposits={pendingDeposit}
          />
          </Flex>
    
          
          <Flex             px="1rem" alignItems={"center"}>
            <Box mr={2} rounded={"full"} w="11px" h="11px" bg="#E9A9AB" />
            <Text variant="medium">Pending Deposits</Text>
            <Spacer />
            <Text variant="medium">{pendingDeposit} USDC</Text>
          </Flex>

          <Accordion mt="1rem" allowToggle border="none">
                  <AccordionItem border="none">
                    <AccordionButton justifyItems="space-between"  justifyContent="space-between">
                      <Heading variant="medium">
                      Show User Stats
                      </Heading>
                      <AccordionIcon/>
                    </AccordionButton>
                  <AccordionPanel       bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}>
                  <UserStat contractConfig={contractConfig} />
                  </AccordionPanel>
                  </AccordionItem>
          </Accordion>

        </AccordionPanel>
      </AccordionItem>
    </Accordion>

    {depositIsOpen && <DepositModal onClose={onCloseDeposit} isOpen={depositIsOpen} />}
    {withdrawIsOpen && <WithdrawModal onClose={onCloseWithdraw} isOpen={withdrawIsOpen}  />}

    </>
  );
};

export default VaultComp;
