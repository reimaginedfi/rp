import {
  Alert,
  AlertIcon,
  Avatar,
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
  Progress,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  useDisclosure,
  useToast,
  useColorMode
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import {
  useAccount,
  useContractRead,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import { vaultConfigs, vaults } from "../../../contracts";
import { useVaultDeposit, useVaultUser } from "../../hooks/useVault";
import { DangerToast, SuccessToast } from "../../Toasts";
import getErrorMessage from "../../utils/errors";

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

  useEffect(() => {
    console.log({amount});
  }, [amount]);


  return (
    <Stack
      w={"full"}
      alignItems="stretch"
      p={2}
      border={+amount > +balanceDisplay ? "solid 1px red" : null as any}
      borderRadius="8px"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        borderRadius="md"
        my={1}
      >
        <Flex
          alignItems={"center"}
          py={1}
          px={2}
          mr={2}
          alignSelf="stretch"
        >
          <Avatar name="USDC" size={"xs"} mr={2} colorScheme="blue"/>
          <Text>USDC</Text>
        </Flex>
        <NumberInput
          placeholder={"0.0"}
          min={0}
          step={0.1}
          flex={1}
          value={amount}
          allowMouseWheel
        >
          <NumberInputField
            onChange={(e) => setAmount(e.target.value.toString())}
            textAlign="right"
          />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
      <Flex justifyContent={"space-between"} >
        <Flex>
          <Text fontSize="sm" mr={2} alignSelf="center">
            Balance: {balanceDisplay} USDC
          </Text>
          <Button
            onClick={() => setAmount(balanceDisplay)}
            variant={"ghost"}
            size="xs"
          >
            Max
          </Button>
        </Flex>
        <Text fontSize="sm" textAlign={"right"}>
          {balanceDisplay} USDC
        </Text>
      </Flex>
      <Progress size={"xs"} borderRadius="full" />
      {+amount > +balanceDisplay && (
        <Text fontSize="xs" color={"red"}>
          Exceeds wallet balance
        </Text>
      )}
      {!meetsMinimum || (!depositAllowed && amount !== "") ? (
        <Alert borderRadius={"1rem"} status="error">
          <AlertIcon />
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
        </Alert>
      ) : null}
    </Stack>
  );
};

interface DepositButtonProps {
  depositSuccess: boolean;
  setDepositSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  approvalSuccess: string;
  setApprovalSuccess: React.Dispatch<React.SetStateAction<string>>;
}

export const DepositButton: React.FC<DepositButtonProps> = ({
  depositSuccess,
  setDepositSuccess,
  approvalSuccess,
  setApprovalSuccess
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [amount, setAmount] = useState<string>("");
  const toast = useToast();
  const { chain } = useNetwork();
  const [contractConfig, setContractConfig] = useState<any>();

  //CONTRACT READ FOR DEPOSIT FUNCTIONS
  const {
    balanceDisplay,
    approve,
    isApproving,
    isAllowed,
    storeAsset,
    isStoring,
    storeAssetError,
    approveError,
    approveStatus,
    storeAssetStatus,
    depositData,
    approveData
  } = useVaultDeposit(contractConfig, amount === "" ? "0" : amount);

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
    if (approveError && approveStatus === "error") {
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
  }, [approveError, approveStatus, toast]);

  // useEffect(() => {
  //   if (approveStatus === "success") {
  //     toast({
  //       variant: "success",
  //       duration: 5000,
  //       position: "bottom",
  //       render: () => (
  //         <SuccessToast message={`You have approved ${amount} USDC`} />
  //       ),
  //     });
  //   }
  // }, [approveStatus]);

  // HANDLES DEPOSIT function on button click
  const handleDeposit = async () => {
    if (!isAllowed) {
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

  // CHECKS DEPOSIT TXN UNTIL IT SUCCEEDS
  const { isLoading } = useWaitForTransaction({
    hash: typeof depositData?.hash === "string" ? depositData?.hash : "",
    enabled: typeof depositData?.hash === "string",
    // onSuccess never fails
    //https://github.com/wagmi-dev/wagmi/discussions/428
    onSuccess: (data) => {
      if (data.status === 1) {
        setDepositSuccess(true);
      }
    },
  });

  useEffect(() => {
    if (depositSuccess) {
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
  }, [depositSuccess]);

  //VAULT CONTRAG CONFIG
  const vaultConfig = vaultConfigs[chain!.id][0];

  //CAN DEPOSIT / DEPOSIT ALLOWED - checks whether user meets the criteria (has enough REFI tokens, has deposited 25K before)
  const canDeposit = useContractRead({
    ...vaultConfig,
    functionName: "canDeposit",
    args: [address, parseUnits(amount === "" ? "0" : amount, 6)],
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

      const { isLoading: isLoadingApprove } = useWaitForTransaction({
        hash: typeof approveData?.hash === "string" ? approveData?.hash : "",
        enabled: typeof approveData?.hash === "string",
        // onSuccess never fails
        //https://github.com/wagmi-dev/wagmi/discussions/428
        onSuccess: (data) => {
          if (data.status === 1) {
            setApprovalSuccess('true');
          } else {data.status === 0} {
            setApprovalSuccess('false');
          }
        },
      });
    

  return (
    <>
      <Button w={"full"} onClick={onOpen}>
        Deposit
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader>
            Deposit to Vault <ModalCloseButton />
          </ModalHeader>
          <ModalBody
          >
            <Stack spacing={4}>
              <TokenInput
                amount={amount}
                setAmount={setAmount}
                balanceDisplay={balanceDisplay}
                depositAllowed={depositAllowed}
                meetsMinimum={meetsMinimum}
                minimumDeposit={minimumDeposit}
              />
              <TableContainer>
                <Table>
                  <Tbody>
                    <Tr>
                      <Td px={2} py={1}>
                        <Text fontSize={"lg"} fontWeight="bold">
                          Total
                        </Text>
                      </Td>
                      <Td px={2} py={1}>
                        <Flex justifyContent={"space-between"}>
                          <Text fontSize={"lg"} fontWeight="bold" alignSelf="center">
                            {+amount} USDC
                          </Text>
                          <Button
                            onClick={() => setAmount(balanceDisplay)}
                            variant={"ghost"}
                            fontSize="0.75rem"
                            py="0.15rem"
                          >
                            Max
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td px={2} py={1}>
                        Fees 
                      </Td>
                      <Td px={2} py={1}>
                        <Flex justifyContent={"space-between"}>
                          <Text>{(+amount / 100) * 2} USDC</Text>
                        </Flex>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Stack w="full">
              <Button
                isDisabled={
                  amount === "" ||
                  +amount + totalDeposited < 25000 ||
                  isApproving ||
                  canDeposit.isLoading
                }
                isLoading={isApproving}
                onClick={handleApprove}
                w={"full"}
              >
                Approve
              </Button>
              <Button
                disabled={
                  amount === "" || isApproving || !isAllowed || !depositAllowed
                }
                isLoading={isStoring || isLoading}
                onClick={handleDeposit}
                minW={"10rem"}
                variant="primary"
              >
                Deposit
                <Text fontWeight="light" ml="0.25rem">
                  {amount && `${amount} USDC`}
                </Text>
              </Button>
              <Button variant={"link"} w={"full"} onClick={onClose}>
                Cancel
              </Button>
              <Text
              variant="small"
              color={colorMode === "dark" ? "#A0A0A0" : "#6F6F6F"}
              alignSelf="center"
              justifySelf={"center"}
            >
              <b>NOTE:</b> You will need to allow REFI to use your USDC before
              depositting.
            </Text>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
