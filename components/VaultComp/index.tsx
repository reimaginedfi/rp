import { useContext, useEffect, useState } from "react";

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
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";

//Icons
import { InfoOutlineIcon } from "@chakra-ui/icons";

//Tools
import { useAccount, useContractRead, useBlockNumber } from "wagmi";
import dynamic from "next/dynamic";
import { ContractConfig } from "../../contracts";
import { commify } from "ethers/lib/utils";
import {BigNumber} from 'ethers';
import { truncate } from "../utils/stringsAndNumbers";
import { Number } from "../Number";
import useWindowSize from "react-use/lib/useWindowSize";

//Fetching stuff
import millify from "millify";
import { useVaultMeta, useVaultState } from "../hooks/useVault";

//Components
import VaultActivityAccordion from "./accordions/VaultActivityAccordion";
import VaultPerformanceAccordion from "./accordions/VaultPerformanceAccordion";
import UserStatsAccordion from "./accordions/UserStatsAccordion";
import { VaultHeroLeft } from "./VaultHeroLeft";
import { VaultTitle } from "./VaultTitle";
import { VaultTruncated } from "./VaultTruncated";

//UI
import Confetti from "react-confetti";
import ProgressBar from "../ui/ProgressBar";

//Modals
import WithdrawModal from "./modals/withdrawModal";
import { DepositButton } from "./modals/DepositButton";
import {Charts} from "../Charts";
import ChartsModal from "./modals/vaultPerformanceModal";
import { DebankData } from "../../pages";

type VaultProps = {
  currentAum: string;
  aumCap: string;
  epoch: number | undefined;
  pendingDeposit: string;
  contractConfig: ContractConfig;
};

const FarmerSettingsAccordion = dynamic(
  () => import("./accordions/FarmerSettingsAccordion"),
  {
    ssr: false,
  }
);

const VaultComp = ({
  currentAum,
  aumCap,
  epoch,
  pendingDeposit,
  contractConfig,
}: VaultProps) => {
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const [depositSuccess, setDepositSuccess] = useState<string>("");
  const [approvalSuccess, setApprovalSuccess] = useState<string>("");
  const previewAum = useContext(DebankData);

  //MODAL OPEN/CLOSE STATES
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

  //VAULT META - fetches vault information from the contract
  const { assetToken, farmer } = useVaultMeta(contractConfig);

  const feeReceiver = useContractRead({
    ...contractConfig,
    functionName: "feeDistributor",
    watch: true,
  });

  const { width, height } = useWindowSize();
  // const {
  //   sharesValue,
  //   user,
  //   hasPendingDeposit,
  //   hasPendingDepositValue,
  //   totalDeposited,
  // } = useVaultUser(contractConfig, address ?? "");

  const vaultState = useVaultState(BigNumber.from(epoch ?? 0).toNumber());

    // MANAGEMENT BLOCK -
    const lastManagementBlock = BigNumber.from(
      vaultState.data?.lastManagementBlock ?? 0
    ).toNumber();
  
    // CURRENT CHAIN BLOCK - to calculate against management block
    const blockNumber = useBlockNumber({
      watch: true,
    });

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
                    <VaultTitle />
                    <AccordionIcon />
                  </Flex>
                  {!isExpanded && <VaultTruncated />}
                </Stack>
              </AccordionButton>

              <AccordionPanel p="0">
                <Grid
                  mt="1rem"
                  mb="2rem"
                  gap={6}
                  templateColumns={"repeat(2, 1fr)"}
                  fontFamily={"Inter"}
                  w="full"
                  px="1rem"
                >
                  <VaultHeroLeft />
                  <GridItem textAlign="center">
                  <ChartsModal />

                  </GridItem>

                  {lastManagementBlock > (blockNumber.data ?? 0) ? (
                     <></>
                  ) : ( 
                    <>
                    <GridItem alignItems="center">
                     <DepositButton
                       depositSuccess={depositSuccess}
                       setDepositSuccess={setDepositSuccess}
                       approvalSuccess={approvalSuccess}
                       setApprovalSuccess={setApprovalSuccess}
                     />
                   </GridItem>
                   <GridItem>
                     <Button w="full" variant="ghost" onClick={onOpenWithdraw}>
                       Withdraw
                     </Button>
                   </GridItem>
                    </>
                  )}
                </Grid>
                {+pendingDeposit + +currentAum > 0 &&
                  (+pendingDeposit + +currentAum) / +aumCap > 0.95 &&
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
                  <Text mr={1} variant="medium">
                    AUM
                  </Text>
                  <Tooltip
                    hasArrow
                    label="Total USDC value of assets deposited and managed by farmer"
                    bg={colorMode === "dark" ? "white" : "black"}
                  >
                    <InfoOutlineIcon w={3.5} h={3.5} />
                  </Tooltip>
                  <Spacer />

                  <Tooltip label={`${commify(currentAum)} USDC`}>
                    <Text variant="medium">
                      <Number>{millify(+currentAum)}</Number>
                    </Text>
                  </Tooltip>
                  <Text variant="medium"> / </Text>
                  <Tooltip label={`${commify(aumCap)} USDC`}>
                    <Text variant="medium">
                      <Number>{millify(+aumCap)}</Number>
                    </Text>
                  </Tooltip>

                  <Text variant="medium">USDC</Text>
                </Flex>

                <Flex px="1rem">
                  <ProgressBar
                    partial={parseInt(currentAum)}
                    total={parseInt(aumCap)}
                    remaining={pendingDeposit}
                  />
                </Flex>
                <Flex px="1rem" alignItems={"center"}>
                  <Box mr={2} rounded={"full"} w="11px" h="11px" bg="#E9A9AB" />
                  <Text mr={1} variant="medium">
                    Pending Deposits
                  </Text>
                  <Tooltip
                    hasArrow
                    label="Deposits made currently not shown in the vault's AUM (waiting for next epoch)"
                    bg={colorMode === "dark" ? "white" : "black"}
                  >
                    <InfoOutlineIcon w={3.5} h={3.5} />
                  </Tooltip>
                  <Spacer />
                  <Tooltip label={`${commify(pendingDeposit)} USDC`}>
                    <Text variant="medium">
                      <Number>{millify(+pendingDeposit)}</Number> USDC
                    </Text>
                  </Tooltip>
                </Flex>
                {/* <Accordion
                  borderRadius="1rem"
                  defaultChecked={true}
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
                      <Heading variant="medium">Charts</Heading>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel
                      borderRadius="1rem"
                      bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
                    >
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion> */}

                <UserStatsAccordion previewAum={previewAum} />
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
                        <Text variant="medium">Deposit Fee</Text>
                        <Spacer />
                        {feeReceiver.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Text variant="medium">2%</Text>
                        )}
                      </Flex>
                      <Flex alignItems={"center"}>
                        <Text variant="medium">Withdraw Fee</Text>
                        <Spacer />
                        {feeReceiver.isLoading ? (
                          <SkeletonText />
                        ) : (
                          <Text variant="medium">0%</Text>
                        )}
                      </Flex>
                      <Flex alignItems={"center"}>
                        <Text variant="medium">
                          Performance Fee (of profits)
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
                <VaultActivityAccordion contractConfig={contractConfig} />
                <VaultPerformanceAccordion />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>

      <Confetti
        run={depositSuccess === "true"}
        recycle={false}
        width={width}
        height={height}
        numberOfPieces={500}
        onConfettiComplete={() => {
          setDepositSuccess("");
        }}
      />

      {withdrawIsOpen && (
        <WithdrawModal onClose={onCloseWithdraw} isOpen={withdrawIsOpen} />
      )}
    </>
  );
};

export default VaultComp;
