import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  UseDisclosureReturn,
  Text,
  Button,
  ModalFooter,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import {
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ContractConfig } from "../../../contracts";
import { useVaultMeta } from "../../hooks/useVault";
import { truncate } from "../../utils/stringsAndNumbers";

export const EndEpochModal = ({
  disclosure,
  contractConfig,
}: {
  disclosure: UseDisclosureReturn;
  contractConfig: ContractConfig;
}) => {
  const toast = useToast();
  const { epoch } = useVaultMeta(contractConfig);
  const [aumString, setAumString] = useState("0.0");
  const aumBN = parseUnits(aumString, 6);
  const preview = useContractRead({
    ...contractConfig,
    functionName: "previewProgress",
    args: [aumBN],
  });

  const progressEpoch = useContractWrite({
    ...contractConfig,
    functionName: "progressEpoch",
    args: [aumBN],
    onMutate: (variables) => {
      console.log(variables);
    },
  });

  useWaitForTransaction({
    confirmations: 1,
    wait: progressEpoch.data?.wait,
    onSuccess: (data) => {
      if (data.status === 1) {
        toast({
          title: "Epoch Progressed",
          description: progressEpoch.data?.hash,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        disclosure.onClose();
      }
    },
  });

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
                    {commify(
                      truncate(
                        formatUnits(
                          preview.data.totalAssetsToTransfer.toString(),
                          6
                        ),
                        2
                      )
                    )}{" "}
                    USDC {preview.data.shouldTransferToFarm ? "to" : "from"}{" "}
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
                  progressEpoch.write();
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
