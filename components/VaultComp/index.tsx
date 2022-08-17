import { useEffect, useState } from "react";

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
import { commify } from "ethers/lib/utils";
import moment from "moment";
import useWindowSize from "react-use/lib/useWindowSize";
import { useAccount, useContractRead } from "wagmi";
import { ContractConfig } from "../../contracts";
import DepositModal from "./modals/depositModal";
import WithdrawModal from "./modals/withdrawModal";
import VaultProgressBar from "./VaultProgressBar";

import dynamic from "next/dynamic";
import Confetti from "react-confetti";
import { useVaultMeta } from "../hooks/useVault";
import { Number } from "../Number";
import { trimAddress, truncate } from "../utils/stringsAndNumbers";
import { UserSection } from "./sections/UserSection";
import { VaultHeroLeft } from "./VaultHeroLeft";
import { VaultTitle } from "./VaultTitle";
import { VaultTruncated } from "./VaultTruncated";

import { InfoOutlineIcon } from "@chakra-ui/icons";

import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { HiSave } from "react-icons/hi";

//Fetching stuff
import axios from "axios";
import axiosRetry from "axios-retry";
import millify from "millify";
import useSWR from "swr";

axiosRetry(axios, {
  retries: 10, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 3000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default three requests are retried
    return error!.response!.status === 503;
  },
});

export const fetcher: any = async (url: string) =>
  await axios({
    method: "GET",
    url: url,
  }).catch((error) => {
    if (error.response.status !== 200) {
      throw new Error(
        `API call failed with status code: ${error.response.status} after 3 retry attempts`
      );
    }
  });

type VaultProps = {
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
  currentAum,
  aumCap,
  epoch,
  pendingDeposit,
  contractConfig,
}: VaultProps) => {
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const [depositSuccess, setDepositSuccess] = useState<boolean>(false);

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

  const [vaultTxns, setVaultTxns] = useState<any[]>([]);

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

  const { data: vaultActivity, error } = useSWR(
    `https://api.etherscan.io/api?module=account&action=tokentx&tokenaddress=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&address=${contractConfig?.addressOrName}&startblock=0&endblock=99999999999999999&page=1&offset=1000&sort=asc&apikey=${process.env.NEXT_PUBLIC_SC_ETHERSCAN}`,
    fetcher
  );

  useEffect(() => {
    if (vaultActivity?.data)
      setVaultTxns(vaultActivity.data?.result?.reverse?.());
  }, [vaultActivity]);

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
                  <VaultProgressBar
                    currentAum={parseInt(currentAum)}
                    aumCap={parseInt(aumCap)}
                    remainingDeposits={pendingDeposit}
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

                <UserSection />
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
                      <Heading variant="medium">Vault Activity</Heading>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel w="full" display={"grid"}>
                      <Grid templateColumns="repeat(4, 1fr)">
                        <Text
                          variant="medium"
                          color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
                        >
                          Action
                        </Text>
                        <Text
                          variant="medium"
                          color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
                          textAlign={"center"}
                        >
                          TxN
                        </Text>
                        <Text
                          variant="medium"
                          color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
                          textAlign={"center"}
                        >
                          Date
                        </Text>
                        <Text
                          variant="medium"
                          color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
                          textAlign={"center"}
                        >
                          Value (USDC)
                        </Text>
                      </Grid>

                      {vaultTxns.length > 1 ? (
                        vaultTxns.map((txn: any) => {
                          if (txn.tokenSymbol !== "USDC") {
                            return;
                          }
                          return (
                            <Grid
                              key={txn.hash}
                              templateColumns="repeat(4, 1fr)"
                              alignContent="center"
                              justifyContent={"center"}
                              py="0.5rem"
                            >
                              <Flex
                                direction="row"
                                gap="0.25rem"
                                alignItems="center"
                              >
                                {txn.to === contractConfig.addressOrName ? (
                                  <HiSave />
                                ) : txn.to ===
                                  "0x4457df4a5bccf796662b6374d5947c881cc83ac7" ? (
                                  <GiPayMoney />
                                ) : (
                                  <GiReceiveMoney />
                                )}
                                <Heading
                                  fontWeight="400"
                                  variant="small"
                                  textAlign={"center"}
                                >
                                  {txn.to === contractConfig.addressOrName
                                    ? "Deposit"
                                    : txn.to ===
                                      "0x4457df4a5bccf796662b6374d5947c881cc83ac7"
                                    ? "Farmer"
                                    : "Withdraw"}
                                </Heading>
                              </Flex>
                              <Flex
                                alignItems="center"
                                justifyContent="center"
                                textAlign={"center"}
                              >
                                <Link
                                  target="_blank"
                                  href={`https://etherscan.io/tx/` + txn.hash}
                                >
                                  <Text
                                    variant="medium"
                                    color={
                                      colorMode === "dark"
                                        ? "#EDEDED"
                                        : "#171717"
                                    }
                                  >
                                    {trimAddress(txn.hash, 4, -3)}
                                  </Text>
                                </Link>
                              </Flex>
                              <Flex
                                alignItems="center"
                                justifyContent="center"
                                textAlign={"center"}
                              >
                                <Text
                                  variant="medium"
                                  color={
                                    colorMode === "dark" ? "#EDEDED" : "#171717"
                                  }
                                  textAlign={"center"}
                                >
                                  {moment
                                    .unix(txn.timeStamp)
                                    .format("ll")
                                    .toString()}
                                </Text>
                              </Flex>
                              <Flex
                                alignItems="center"
                                justifyContent="center"
                                textAlign={"center"}
                              >
                                <Text
                                  variant="medium"
                                  color={
                                    colorMode === "dark" ? "#EDEDED" : "#171717"
                                  }
                                  textAlign={"center"}
                                >
                                  {truncate(commify(+txn.value / 1000000), 2)}
                                </Text>
                              </Flex>
                            </Grid>
                          );
                        })
                      ) : (
                        <SkeletonText />
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
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
