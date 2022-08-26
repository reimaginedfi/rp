import {
  Alert,
  AlertIcon,
  Image,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  useDisclosure,
  useToast,
  useColorMode,
  Grid,
  GridItem,
  Box,
} from "@chakra-ui/react";
import ProgressBar from "../../ui/ProgressBar";
import { BigNumber } from "ethers";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
import { truncate, noSpecialCharacters } from "../../utils/stringsAndNumbers";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { vaultConfigs, vaults } from "../../../contracts";
import { useVaultDeposit, useVaultUser, useVaultMeta } from "../../hooks/useVault";
import { DangerToast, SuccessToast } from "../../Toasts";
import getErrorMessage from "../../utils/errors";

import { InfoOutlineIcon } from "@chakra-ui/icons";

interface TokenInputProps {
  amount: string;
  setAmount: (amount: string) => void;
  balanceDisplay: string;
  meetsMinimum: boolean;
  depositAllowed: boolean;
  minimumDeposit: any;
}

const TokenInput: React.FC<TokenInputProps> = ({
  amount,
  setAmount,
  balanceDisplay,
  meetsMinimum,
  depositAllowed,
  minimumDeposit,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Stack
      w={"full"}
      alignItems="stretch"
      p={2}
      border={+amount > +balanceDisplay ? "solid 1px red" : (null as any)}
      borderRadius="8px"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderRadius="md"
        my={1}
      >
        <Flex alignItems={"center"} py={1} px={2} mr={2} alignSelf="stretch">
          <Image mr="0.25rem" w="1.5rem" h="1.5rem" src="/icons/usdc.svg" />
          <Text fontSize="1.5rem">USDC</Text>
        </Flex>
        <NumberInput
          placeholder={"0.0"}
          min={0}
          step={1000}
          flex={1}
          value={truncate(amount, 2)}
          onChange={setAmount}
          allowMouseWheel
          bg={colorMode === "dark" ? "#373737" : "#F3F3F3"}
          borderRadius="1rem"
          inputMode="numeric"
        >
          <NumberInputField
            onChange={(e) => setAmount(e.target.value.toString())}
            textAlign="right"
            border="none"
            fontSize="1.5rem"
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      <Flex justifyContent={"space-between"} alignContent="center">
        <Text variant="extralarge" fontSize="sm" mr={2} alignSelf="center">
          Balance: {commify(truncate(balanceDisplay, 2))} USDC
        </Text>
        <Button
          onClick={() => setAmount(balanceDisplay)}
          variant={"tertiary"}
          p={4}
          fontSize="1rem"
        >
          Max
        </Button>
      </Flex>
      <ProgressBar total={+balanceDisplay} partial={+amount} size="0.5rem" />
      {+amount > +balanceDisplay && (
        <Text fontSize="xs" color={"red"}>
          Exceeds wallet balance
        </Text>
      )}

      {(!meetsMinimum || (!depositAllowed && amount !== "")) && (
        <Text fontSize="xs" color={"red"}>
          Minimum deposit is{" "}
          {minimumDeposit.data
            ? commify(
                ~~formatUnits(
                  BigNumber.from(minimumDeposit!.data!._hex!).toNumber(),
                  6
                )
              )
            : "25,000"}{" "}
          USDC
        </Text>
      )}
    </Stack>
  );
};

interface DepositButtonProps {
  depositSuccess: string;
  setDepositSuccess: React.Dispatch<React.SetStateAction<string>>;
  approvalSuccess: string;
  setApprovalSuccess: React.Dispatch<React.SetStateAction<string>>;
}

export const DepositButton: React.FC<DepositButtonProps> = ({
  depositSuccess,
  setDepositSuccess,
  approvalSuccess,
  setApprovalSuccess,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState<string>("0.0");
  const toast = useToast();
  const { chain } = useNetwork();
  const [contractConfig, setContractConfig] = useState<any>();
  const { epoch } = useVaultMeta(contractConfig);

  //CONTRACT READ FOR DEPOSIT FUNCTIONS
  const {
    balanceDisplay,
    approve,
    isApproving,
    isApproved,
    storeAsset,
    isStoring,
    storeAssetError,
    approveError,
    approveStatus,
    storeAssetStatus,
    depositData,
    approveData,
  } = useVaultDeposit(contractConfig, amount === "" ? "0" : amount);

      // CHECKS DEPOSIT TXN UNTIL IT SUCCEEDS
      const { isLoading } = useWaitForTransaction({
        hash: typeof depositData?.hash === "string" ? depositData?.hash : "",
        enabled: typeof depositData?.hash === "string",
        // onSuccess never fails
        //https://github.com/wagmi-dev/wagmi/discussions/428
        onSuccess: (data) => {
          if (data.status === 1) {
            setDepositSuccess("true");
          } else if (data.status === 0) {
            setDepositSuccess("false")
          }
        },
      });
    
      // CHECKS APPROVE TXN UNTIL IT SUCCEEDS
    const { isLoading: isLoadingApprove } = useWaitForTransaction({
      hash: typeof approveData?.hash === "string" ? approveData?.hash : "",
      enabled: typeof approveData?.hash === "string",
      // onSuccess never fails
      //https://github.com/wagmi-dev/wagmi/discussions/428
      onSuccess: (data) => {
        if (data.status === 1) {
          setApprovalSuccess("true");
        } else {
          data.status === 0;
        }
        {
          setApprovalSuccess("false");
        }
      },
    });

  const { colorMode } = useColorMode();

  const { address } = useAccount();

  // GETS CONTRACT CONFIG FROM VAULTS
  useEffect(() => {
    vaults[chain!.id].map((contract) => {
      setContractConfig(contract);
    });
  }, [chain, vaults]);

  const { totalDeposited } = useVaultUser(contractConfig, address ?? "");

  useEffect(() => {
    console.log("storeAssetError: ", storeAssetError);
    if (storeAssetError && storeAssetStatus === "error") {
      toast({
        variant: "danger",
        title: storeAssetError?.name,
        duration: 5000,
        render: () => (
          <DangerToast
            message={storeAssetError
              ?.toString()
              .substring(storeAssetError?.toString().indexOf(":"), -1)}
          />
        ),
      });
    }
  }, [storeAssetError, storeAssetStatus, toast]);

  useEffect(() => {
    console.log("approveError: ", approveError);
    if (approveError) {
      toast({
        variant: "danger",
        title: approveError?.name,
        duration: 5000,
        render: () => (
          <DangerToast
            message={approveError
              ?.toString()
              .substring(approveError?.toString().indexOf(":"), -1)}
          />
        ),
      });
    }
  }, [approveError, approvalSuccess, toast]);

  useEffect(() => {
    if (!isLoading && depositSuccess === "false") {
      toast({
        variant: "danger",
        title: storeAssetError?.name,
        duration: 5000,
        render: () => (
          <DangerToast
            message="Transaction error. Please, try again."
          />
        ),
      });
    }
  }, [toast, storeAssetError, isLoading, depositSuccess]);

  useEffect(() => {
    if (!isApproving && approveStatus === "success") {
      toast({
        variant: "success",
        duration: 5000,
        position: "bottom",
        render: () => (
          <SuccessToast message={`You have approved ${amount} USDC`} />
        ),
      });
    }
  }, [approveStatus, isApproving]);

  // HANDLES DEPOSIT function on button click
  const handleDeposit = async () => {
    if (!isApproved) {
      return;
    }
    try {
      await storeAsset();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: "danger",
        duration: 5000,
        position: "bottom",
        render: () => <DangerToast message={errorMessage} />,
      });
    }
  };

  // APPROVE ERC20 TOKEN on button click
  const handleApprove = async () => {
    try {
      await approve();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast({
        variant: "danger",
        position: "bottom",
        duration: 5000,
        render: () => <DangerToast message={errorMessage} />,
      });
    }
  };

  useEffect(() => {
    if (!isLoading && depositSuccess === "true") {
      toast({
        variant: "success",
        duration: 5000,
        position: "bottom",
        render: () => (
          <SuccessToast
            message={`You have deposited ${amount} USDC`}
            link={depositData?.hash}
          />
        ),
      });

      onClose!();
    }
  }, [isLoading, depositSuccess]);

  //VAULT CONTRAG CONFIG
  const vaultConfig = vaultConfigs[chain!.id][0];

  //CAN DEPOSIT / DEPOSIT ALLOWED - checks whether user meets the criteria (has enough REFI tokens, has deposited 25K before)
  const canDeposit = useContractRead({
    ...vaultConfig,
    functionName: "canDeposit",
    args: [address, parseUnits(amount === "" ? "0" : noSpecialCharacters(amount), 6)],
  });
  const depositAllowed = canDeposit.data?.toString() === "true";

  //MINIMUM DEPOSIT - fetches minimum deposit amount for users who have not deposited before
  const minimumDeposit = useContractRead({
    ...vaultConfig,
    functionName: "minimumStoredValueBeforeFees",
  });
  const meetsMinimum =
    +amount >=
    (minimumDeposit.data!
      ? +formatUnits(BigNumber.from(minimumDeposit?.data?._hex!).toNumber(), 6)
      : 25000);

  return (
    <>
      <Button variant="primary" w={"full"} onClick={onOpen}>
        Deposit
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader>
            Deposit to Vault <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Stack spacing={3}>
              <TokenInput
                amount={amount}
                setAmount={setAmount}
                balanceDisplay={balanceDisplay}
                depositAllowed={depositAllowed}
                meetsMinimum={meetsMinimum}
                minimumDeposit={minimumDeposit}
              />
              <Grid templateColumns="repeat(1, 1fr)" gap="0.5rem">
                <GridItem>
                  <Flex alignItems="center" justify="space-between">
                    <Text fontSize={"lg"} fontWeight="bold">
                      Total
                    </Text>

                    <Text fontSize={"lg"} fontWeight="bold" alignSelf="center">
                      {commify(truncate(noSpecialCharacters(amount), 2))} USDC
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem>
                  <Flex alignItems="center" justify="space-between">
                    <Text fontSize="lg" alignSelf="center">
                      Fees
                    </Text>
                    <Flex alignItems='center' gap={2}>
                      <Text>
                        {commify(truncate(((+noSpecialCharacters(amount) / 100) * 1).toString(), 2))}{" "}
                        USDC
                      </Text>
                      <Tooltip
                        hasArrow
                        label="REFI takes 1% of the amount you deposit to the vault as management fees."
                        bg={colorMode === "dark" ? "white" : "black"}
                      >
                        <InfoOutlineIcon w={3.5} h={3.5} />
                      </Tooltip>
                    </Flex>
                  </Flex>
                  </GridItem>
                  <GridItem>
                  <Flex alignItems="center" justify="space-between">
                    <Text fontSize="lg" alignSelf="center">
                      To deposit
                    </Text>
                    <Flex alignItems='center' gap={2}>
                      <Text>
                        {commify(truncate(((+noSpecialCharacters(amount) / 100) * 99).toString(), 2))}{" "}
                        USDC
                      </Text>
                      <Tooltip
                        hasArrow
                        label="Amount that goes into the vault (what you deposit minus the 1% fees)."
                        bg={colorMode === "dark" ? "white" : "black"}
                      >
                        <InfoOutlineIcon w={3.5} h={3.5} />
                      </Tooltip>
                    </Flex>
                    </Flex>
                  </GridItem>
              </Grid>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack w="full" textAlign={"left"}>
                <Button
                  isDisabled={
                    amount === "" ||
                    +amount + totalDeposited < 25000 ||
                    isApproving ||
                    canDeposit.isLoading
                  }
                  isLoading={isApproving || isLoading || isLoadingApprove || isStoring}
                  onClick={!isApproved ? handleApprove : handleDeposit}
                  w={"full"}
                  variant={isApproved ? "primary" : "secondary"}
                >
                  {isApproved ? "Deposit" : "Approve"}
                </Button>
              {/* )} */}
              {/* {amount === "" ||
              isApproving ||
              !isAllowed ||
              !depositAllowed ? null : (
                <Button
                  disabled={
                    amount === "" ||
                    isApproving ||
                    !isAllowed ||
                    !depositAllowed
                  }
                  isLoading={isStoring || isLoading}
                  onClick={handleDeposit}
                  minW={"10rem"}
                  variant="primary"
                >
                  Deposit
                  <Text fontWeight="light" ml="0.25rem">
                    {amount && `${commify(truncate(amount, 2))} USDC`}
                  </Text>
                </Button>
              )} */}
              <Button variant={"ghost"} w={"full"} onClick={onClose}>
                Cancel
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
