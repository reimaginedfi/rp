import { useState } from "react";

import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Link,
  SkeletonText,
  Spacer,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { commify } from "ethers/lib/utils";
import useWindowSize from "react-use/lib/useWindowSize";
import { useAccount, useBlockNumber, useContractRead } from "wagmi";
import { ContractConfig } from "../../contracts";
import UserStat from "../UserStat";
import DepositModal from "./modals/depositModal";
import WithdrawModal from "./modals/withdrawModal";
import VaultProgressBar from "./VaultProgressBar";

import dynamic from "next/dynamic";
import Confetti from "react-confetti";
import { useVaultMeta, useVaultState, useVaultUser } from "../hooks/useVault";
import { truncate } from "../utils/stringsAndNumbers";
import { BigNumber } from "ethers";
import { VaultHeroLeft } from "./VaultHeroLeft";

type VaultProps = {
  vaultName: string;
  asset: string | undefined;
  currentAum: string;
  aumCap: string;
  epoch: number | undefined;
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

  const { width, height } = useWindowSize();
  const {
    sharesValue,
    user,
    hasPendingDeposit,
    hasPendingDepositValue,
    totalDeposited,
  } = useVaultUser(contractConfig, address ?? "");
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
                  <VaultHeroLeft />
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
                      {hasPendingDeposit && (
                        <Alert
                          status="warning"
                          borderRadius={"md"}
                          py={1}
                          px={2}
                        >
                          <AlertIcon boxSize={"1rem"}></AlertIcon>
                          <AlertTitle fontSize={"xs"}>Pending VT</AlertTitle>
                          <AlertDescription>
                            <Text fontSize={"xs"}>
                              You can claim it manually or perform another
                              deposit
                            </Text>
                          </AlertDescription>
                        </Alert>
                      )}
                      <UserStat />
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
                          <Text variant="medium">25,000.00 USDC</Text>
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
                                8
                              )}...${farmer.data?.slice(-2)}`}{" "}
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
                                8
                              )}...${feeReceiver.data?.slice(-2)}`}{" "}
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
                                8
                              )}...${assetToken.data?.address.slice(-2)}`}{" "}
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
                                8
                              )}...${contractConfig.addressOrName.slice(
                                -2
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

      <Confetti
        run={depositSuccess}
        recycle={false}
        width={width}
        height={height}
        numberOfPieces={500}
        onConfettiComplete={() => {
          setDepositSuccess(false);
        }}
      />

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
