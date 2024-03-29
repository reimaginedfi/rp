import { useContext, useState } from "react";

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
import { ContractsMap } from "../../contracts";
import { commify } from "ethers/lib/utils";
import { NumberComp } from "../Number";

//Fetching stuff
import millify from "millify";
import { useVaultMeta, useVaultState } from "../hooks/useVault";

//Components
import VaultActivityAccordion from "./accordions/VaultActivityAccordion";
import VaultPerformanceAccordion from "./accordions/VaultPerformanceAccordion";
import UserStatsAccordion from "./accordions/UserStatsAccordion";
import VaultAssetsAccordion from "./accordions/VaultAssetsAccordion";
import VaultDetailsAccordion from "./accordions/VaultDetailsAccordion";
import { VaultHeroLeft } from "./VaultHeroLeft";
import { VaultTitle } from "./VaultTitle";
import { VaultTruncated } from "./VaultTruncated";

//UI
import ProgressBar from "../ui/ProgressBar";

//Modals
import WithdrawModal from "./modals/withdrawModal";
import { DepositButton } from "./modals/DepositButton";
import ChartsModal from "./modals/vaultPerformanceModal";
import { VaultData } from "../../pages";

type VaultProps = {
  currentAum: string;
  aumCap: string;
  epoch: number | undefined;
  pendingDeposit: string;
  contractConfig: ContractsMap;
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
  // const address = "0x4457Df4a5bcCF796662b6374D5947c881Cc83AC7"

  const [totalAumLabel, setIsTotalAumLabel] = useState<boolean>(false);
  const [totalDeposited, setCurrentDepositsLabel] = useState<boolean>(false);
  const value = useContext(VaultData);

  const {
    isOpen: withdrawIsOpen,
    onOpen: onOpenWithdraw,
    onClose: onCloseWithdraw,
  } = useDisclosure();

  const { isOpen: isWarningVisible, onClose } = useDisclosure({
    defaultIsOpen: true,
  });

  //VAULT META - fetches vault information from the contract
  const { farmer } = useVaultMeta(contractConfig);

  // const {
  //   sharesValue,
  //   user,
  //   hasPendingDeposit,
  //   hasPendingDepositValue,
  //   totalDeposited,
  // } = useVaultUser(contractConfig, address ?? "");

  const vaultState: any = useVaultState(BigInt(epoch ?? 0));

  // MANAGEMENT BLOCK -
  const lastManagementBlock = Number(
    vaultState.data?.[6] ?? 0
  )

  // CURRENT CHAIN BLOCK - to calculate against management block
  const blockNumber = useBlockNumber({
    watch: true,
  });

  const isManagementPhase = vaultState.data && Number(vaultState!.data[6]) > Number(blockNumber.data);

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

                  {isManagementPhase ? (
                    <></>
                  ) : (
                    <>
                      <GridItem alignItems="center">
                        <DepositButton />
                      </GridItem>
                      <GridItem>
                        <Button
                          w="full"
                          variant="ghost"
                          onClick={onOpenWithdraw}
                        >
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
                    <InfoOutlineIcon
                      w={3.5}
                      h={3.5}
                      onMouseEnter={() => setIsTotalAumLabel(true)}
                      onMouseLeave={() => setIsTotalAumLabel(false)}
                      onClick={() => setIsTotalAumLabel(true)}
                    />
                  </Tooltip>
                  <Spacer />

                  <Tooltip label={`${commify(currentAum)} USDC`}>
                    <Text variant="medium">
                      <NumberComp>{millify(+currentAum)}</NumberComp>
                    </Text>
                  </Tooltip>
                  <Text variant="medium"> / </Text>
                  <Tooltip label={`${commify(aumCap)} USDC`}>
                    <Text variant="medium">
                      <NumberComp>{millify(+aumCap)}</NumberComp>
                    </Text>
                  </Tooltip>

                  <Text variant="medium">USDC</Text>
                </Flex>

                <Flex px="1rem">
                  <ProgressBar
                    partial={Number(currentAum)}
                    total={Number(aumCap)}
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
                    <InfoOutlineIcon
                      w={3.5}
                      h={3.5}
                      onMouseEnter={() => setCurrentDepositsLabel(true)}
                      onMouseLeave={() => setCurrentDepositsLabel(false)}
                      onClick={() => setCurrentDepositsLabel(true)}
                    />
                  </Tooltip>
                  <Spacer />
                  <Tooltip label={`${commify(pendingDeposit)} USDC`}>
                    <Text variant="medium">
                      <NumberComp>{millify(+pendingDeposit)}</NumberComp> USDC
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

                <UserStatsAccordion previewAum={(value as any).previewAum} />
                {/* <VaultAssetsAccordion /> */}
                <VaultDetailsAccordion contractConfig={contractConfig} currentAum={currentAum} aumCap={aumCap} />
                {farmer.data && farmer.data.toString() === address && (
                  <FarmerSettingsAccordion contractConfig={contractConfig} />
                 )}
                {/* <VaultActivityAccordion contractConfig={contractConfig} /> */}
                <VaultPerformanceAccordion />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>

      {withdrawIsOpen && (
        <WithdrawModal onClose={onCloseWithdraw} isOpen={withdrawIsOpen} />
      )}
    </>
  );
};

export default VaultComp;
