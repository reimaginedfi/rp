import { useState } from "react";

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
  useDisclosure,
  Link,
  SkeletonText,
  Stack,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  CloseButton,
} from "@chakra-ui/react";

import VaultProgressBar from "./VaultProgressBar";
import DepositModal from "./modals/depositModal";
import WithdrawModal from "./modals/withdrawModal";
import UserStat from "../UserStat";
import { ContractConfig } from "../../contracts";
import { commify } from "ethers/lib/utils";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useAccount, useContractRead } from "wagmi";

import Confetti from "react-confetti";
import { truncate } from "../utils/stringsAndNumbers";
import dynamic from "next/dynamic";
import { useVaultMeta } from "../hooks/useVault";

type VaultProps = {
  vaultName: string;
  asset: string | undefined;
  currentAum: string;
  aumCap: string;
  epoch: string | undefined;
  pendingDeposit: string;
  contractConfig: ContractConfig;
};

const FarmerSettingsAccordion = dynamic(
  () => import("./FarmerSettingsAccordion"),
  {
    ssr: false,
  }
);

const VaultComp = ({
  vaultName,
  asset,
  currentAum,
  aumCap,
  epoch,
  pendingDeposit,
  contractConfig,
}: VaultProps) => {
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const {
    isOpen: depositIsOpen,
    onOpen: onOpenDeposit,
    onClose: onCloseDeposit,
  } = useDisclosure();
  const {
    isOpen: withdrawIsOpen,
    onOpen: onOpenWithdraw,
    onClose: onCloseWithdraw,
  } = useDisclosure();
  const { isOpen: isWarningVisible, onClose } = useDisclosure({
    defaultIsOpen: true,
  });

  const { assetToken, farmer } = useVaultMeta(contractConfig);

  const feeReceiver = useContractRead({
    ...contractConfig,
    functionName: "feeDistributor",
    watch: true,
  });
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);

  return (
    <>
      <Accordion
        defaultIndex={[0]}
        bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
        allowToggle
        border={
          colorMode === "dark" ? "1px solid #232323" : "1px solid #F3F3F3"
        }
        borderRadius="1rem"
      >
        <AccordionItem border="none">
          {({ isExpanded }) => (
            <>
              <AccordionButton borderRadius="1rem">
                <Stack w="full">
                  <Flex w="full" justify="space-between" alignItems="center">
                    <Flex direction="row" alignItems="center">
                      <Heading variant="large">{vaultName! || "Vault"}</Heading>
                      <Text ml="0.5rem" variant="medium">
                        ({asset})
                      </Text>
                    </Flex>
                    <AccordionIcon />
                  </Flex>
                  {!isExpanded && (
                    <>
                      <VaultProgressBar
                        currentAum={parseInt(currentAum)}
                        aumCap={parseInt(aumCap)}
                        remainingDeposits={pendingDeposit}
                      />
                      <Flex alignItems={"center"}>
                        <Text variant="medium">Epoch {epoch}</Text>
                        <Spacer />
                        <Text variant="medium">
                          {truncate(commify(+pendingDeposit! + +currentAum), 2)}
                          /{truncate(commify(aumCap), 2)} USDC
                        </Text>
                      </Flex>
                    </>
                  )}
                </Stack>
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
                  {aumCap === "0.0" ? (
                    <Flex justify="center" align="center">
                      <Heading
                        variant="medium"
                        textAlign="center"
                        color="brand"
                        lineHeight="1.5rem"
                      >
                        This Vault is being initialized
                      </Heading>
                    </Flex>
                  ) : (
                    <GridItem textAlign="center">
                      <Text fontSize="32px" fontWeight={600}>
                        +0%
                      </Text>
                      <Text fontSize="24px">+0 {asset}</Text>
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
                  )}
                  <GridItem textAlign="center">
                    <Image
                      m="auto"
                      w="8rem"
                      h="8rem"
                      src="/usdc-logo.png"
                      alt="USDC"
                    />
                  </GridItem>

                  <GridItem alignItems="center">
                    <Button
                      disabled={aumCap === "0.0"}
                      w="full"
                      variant="primary"
                      onClick={onOpenDeposit}
                    >
                      Deposit
                    </Button>
                  </GridItem>
                  <GridItem>
                    <Button
                      disabled
                      w="full"
                      variant="ghost"
                      onClick={onOpenWithdraw}
                    >
                      Withdraw
                    </Button>
                  </GridItem>
                </Grid>
                {+pendingDeposit + +currentAum > 0 &&
                  (+pendingDeposit + +currentAum) / +aumCap > 0.8 &&
                  isWarningVisible && (
                    <Flex w="full" px={"1rem"}>
                      <Alert
                        status="error"
                        justifyContent={"space-between"}
                        borderRadius="lg"
                        py={"0.25rem"}
                        px={"0.5rem"}
                      >
                        <Flex>
                          <AlertIcon />

                          <AlertDescription fontSize={"xs"}>
                            Vault is almost full, deposits may fail.
                          </AlertDescription>
                        </Flex>
                        <CloseButton onClick={onClose} />
                      </Alert>
                    </Flex>
                  )}
                <Flex px="1rem" mt={2} alignItems="center">
                  <Box mr={2} rounded={"full"} w="11px" h="11px" bg="#C51E25" />
                  <Text variant="medium">AUM</Text>
                  <Spacer />
                  <Text variant="medium">
                    {commify(currentAum)} / {commify(aumCap)} USDC
                  </Text>
                </Flex>

                <Flex px="1rem">
                  <VaultProgressBar
                    currentAum={parseInt(currentAum)}
                    aumCap={parseInt(aumCap)}
                    remainingDeposits={pendingDeposit}
                  />
                </Flex>
                <Flex px="1rem" alignItems={"center"}>
                  <Box mr={2} rounded={"full"} w="11px" h="11px" bg="#E9A9AB" />
                  <Text variant="medium">Pending Deposits</Text>
                  <Spacer />
                  <Text variant="medium">
                    {truncate(commify(pendingDeposit!), 2)} USDC
                  </Text>
                </Flex>

                <Accordion
                  borderRadius="1rem"
                  mt="1rem"
                  allowToggle
                  border="none"
                >
                  <AccordionItem border="none">
                    <AccordionButton
                      borderRadius="1rem"
                      justifyItems="space-between"
                      justifyContent="space-between"
                    >
                      <Heading variant="medium">Your Vault Stats</Heading>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel
                      p={{ base: 1, md: 3 }}
                      borderRadius="1rem"
                      bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
                    >
                      <UserStat contractConfig={contractConfig} />
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                <Accordion
                  borderRadius="1rem"
                  pt="1rem"
                  allowToggle
                  border="none"
                >
                  <AccordionItem border="none">
                    <AccordionButton
                      borderRadius="1rem"
                      justifyItems="space-between"
                      justifyContent="space-between"
                    >
                      <Heading variant="medium">Vault Details</Heading>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel
                      borderRadius="1rem"
                      bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
                    >
                      <Flex alignItems={"center"}>
                        <Text variant="medium">Entry Fee</Text>
                        <Spacer />
                        {feeReceiver.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Text variant="medium">1%</Text>
                        )}
                      </Flex>
                      <Flex alignItems={"center"}>
                        <Text variant="medium">Exit Fee</Text>
                        <Spacer />
                        {feeReceiver.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Text variant="medium">1%</Text>
                        )}
                      </Flex>
                      <Flex alignItems={"center"}>
                        <Text variant="medium">
                          Management Fee (of profits)
                        </Text>
                        <Spacer />
                        {feeReceiver.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Text variant="medium">20%</Text>
                        )}
                      </Flex>
                      <Flex alignItems={"center"}>
                        <Text variant="medium">Minimum Size</Text>
                        <Spacer />
                        {feeReceiver.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Text variant="medium">0.01 USDC</Text>
                        )}
                      </Flex>
                      <Flex alignItems={"center"}>
                        <Text variant="medium">Vault Capacity</Text>
                        <Spacer />
                        {feeReceiver.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Text variant="medium">
                            {truncate(commify(aumCap.toString()), 1)} USDC
                          </Text>
                        )}
                      </Flex>

                      <Flex alignItems={"center"}>
                        <Text variant="medium">Farmer Address</Text>
                        <Spacer />
                        {farmer.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Link
                            href={`https://etherscan.io/address/${farmer.data}`}
                            isExternal
                          >
                            <Text variant="medium">
                              {`${farmer.data?.slice(
                                0,
                                6
                              )}...${farmer.data?.slice(-4)}`}{" "}
                              <ExternalLinkIcon mx="2px" />
                            </Text>
                          </Link>
                        )}
                      </Flex>
                      <Flex alignItems={"center"}>
                        <Text variant="medium">Fee Receiver</Text>
                        <Spacer />
                        {feeReceiver.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Link
                            href={`https://etherscan.io/address/${feeReceiver.data}`}
                            isExternal
                          >
                            <Text variant="medium">
                              {`${feeReceiver.data?.slice(
                                0,
                                6
                              )}...${feeReceiver.data?.slice(-4)}`}{" "}
                              <ExternalLinkIcon mx="2px" />
                            </Text>
                          </Link>
                        )}
                      </Flex>
                      <Flex alignItems={"center"}>
                        <Text variant="medium">Asset Address</Text>
                        <Spacer />
                        {assetToken.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Link
                            href={`https://etherscan.io/address/${assetToken.data?.address}`}
                            isExternal
                          >
                            <Text variant="medium">
                              {`${assetToken.data?.address.slice(
                                0,
                                6
                              )}...${assetToken.data?.address.slice(-4)}`}{" "}
                              <ExternalLinkIcon mx="2px" />
                            </Text>
                          </Link>
                        )}
                      </Flex>
                      <Flex alignItems={"center"}>
                        <Text variant="medium">Contract Address</Text>
                        <Spacer />
                        {farmer.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Link
                            href={`https://etherscan.io/address/${contractConfig.addressOrName}`}
                            isExternal
                          >
                            <Text variant="medium">
                              {`${contractConfig.addressOrName.slice(
                                0,
                                6
                              )}...${contractConfig.addressOrName.slice(
                                -4
                              )}`}{" "}
                              <ExternalLinkIcon mx="2px" />
                            </Text>
                          </Link>
                        )}
                      </Flex>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
                {farmer.data && farmer.data.toString() === address && (
                  <FarmerSettingsAccordion contractConfig={contractConfig} />
                )}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>

      {depositSuccess && <Confetti />}

      {depositIsOpen && (
        <DepositModal
          onClose={onCloseDeposit}
          isOpen={depositIsOpen}
          depositSuccess={depositSuccess!}
          setDepositSuccess={setDepositSuccess}
        />
      )}
      {withdrawIsOpen && (
        <WithdrawModal onClose={onCloseWithdraw} isOpen={withdrawIsOpen} />
      )}
    </>
  );
};

export default VaultComp;
