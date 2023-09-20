import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormLabel,
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
  Spinner,
  Stack,
  UseDisclosureReturn,
  useToast,
} from "@chakra-ui/react";
import { commify } from "ethers/lib/utils";
import { formatUnits, parseUnits } from 'viem';
import { useState } from "react";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractsMap } from "../../../contracts";
import { useVaultMeta } from "../../hooks/useVault";
import { truncate } from "../../utils/stringsAndNumbers";
import getErrorMessage from "../../utils/errors";
import { DangerToast, SuccessToast } from "../../Toasts";

export const EndEpochModal = ({
  disclosure,
  contractConfig,
}: {
  disclosure: UseDisclosureReturn;
  contractConfig: ContractsMap;
}) => {
  const toast = useToast();
  const { epoch } = useVaultMeta(contractConfig);
  const [aumString, setAumString] = useState("0.0");
  const aumBN = parseUnits(Math.trunc(Number(aumString)).toString() ?? "0", 6);
  const preview: any = useContractRead({
    ...contractConfig,
    functionName: "previewProgress",
    args: [aumBN],
  });

  console.log(formatUnits(aumBN, 6));

  const progressEpoch = useContractWrite({
    ...contractConfig,
    functionName: "progressEpoch",
    args: [aumBN],
    onMutate: (variables: any) => {
      // console.log(variables);
    },
    // mode: "recklesslyUnprepared",
  });

  const handleEpoch = async () => {
    try {
      await progressEpoch.write();
    } catch (error) {
      console.log(error)
      const errorMessage = getErrorMessage(error);
      toast({
        variant: "danger",
        duration: 5000,
        position: "bottom",
        render: () => <DangerToast message={errorMessage} />,
      });
    }
  };

  useWaitForTransaction({
    confirmations: 1,
    hash: progressEpoch.data?.hash,
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast({
          title: "Epoch Progressed",
          description: progressEpoch.data?.hash,
          status: "success",
          duration: 9000,
          isClosable: true,
          render: () => <SuccessToast message={`You've successfuly progressed to ${Number(epoch.data)}`}/>,
        });
        disclosure.onClose();
      }
    },
  });

  // console.log(formatUnits(preview!.data?.[1], 6))

  return (
    <>
      <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>End Epoch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack w="full">
              <FormControl>
                <FormLabel>Current External Assets (USDC)</FormLabel>
                <NumberInput
                  m={0}
                  w="full"
                  precision={2}
                  step={1}
                  min={0}
                  value={aumString}
                  onChange={(value) => {
                    setAumString(value);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Stack w="full">
              <Alert
                status={preview.isError ? "error" : "warning"}
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="200px"
              >
                {preview.isLoading ? <Spinner /> : <AlertIcon />}
                <AlertTitle>Flow Preview</AlertTitle>
                {preview.data && (
                  <AlertDescription>
                    This will send{" "}
                    {                      truncate(commify( 
                          formatUnits(preview.data?.[1], 6)), 2)}
                    {" "}
                    {" "}
                    USDC {preview.data?.[0] ? "to" : "from"}{" "}
                    farmer address. You have enough balance to end the epoch.
                  </AlertDescription>
                )}
                {preview.isError && (
                  <>
                    <AlertDescription>
                      Preview failed with error code:{" "}
                      {(preview.error as any)?.errorSignature}
                    </AlertDescription>
                    <AlertDescription>
                      This transaction will revert.
                    </AlertDescription>
                  </>
                )}
              </Alert>
              <Button
                w="full"
                variant={"primary"}
                colorScheme="red"
                disabled={preview.isLoading || preview.isError || !epoch.data}
                onClick={() => {
                  handleEpoch();
                }}
              >
                End Epoch {epoch.data?.toString()}
              </Button>
              <Button w="full" variant={"ghost"} onClick={disclosure.onClose}>
                Close
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
