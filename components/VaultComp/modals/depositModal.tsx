import { useState, useEffect } from "react";

import {
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  Modal,
  ModalHeader,
  ModalBody,
  Heading,
  Input,
  Button,
  Grid,
  Text,
  useColorMode,
  Flex,
  Stack,
} from "@chakra-ui/react";
//Wagmi
import { useNetwork } from "wagmi";

//Vaults
import { useVaultDeposit } from "../../hooks/useVault";
import { vaults } from "../../../contracts";

type ModalProps = {
  onClose?: () => void;
  isOpen?: boolean;
};

export default function DepositModal({ isOpen, onClose }: ModalProps) {
  const { colorMode } = useColorMode();
  const { chain } = useNetwork();

  const [contractConfig, setContractConfig] = useState<any>();
  const [amount, setAmount] = useState<string>();

  useEffect(() => {
    vaults[chain!.id].map((contract) => setContractConfig(contract));
  }, [vaults]);

  // const {    balance,
  //     balanceDisplay,
  //     allowance,
  //     isAllowed,
  //     approve,
  //     isApproving,
  //     approveMax,
  //     isApprovingMax,
  //     storeAsset,
  //     isStoring} = useVaultDeposit(contractConfig!, amount!);

  return (
    <Modal
      isCentered
      scrollBehavior="inside"
      size="md"
      onClose={onClose!}
      isOpen={isOpen!}
    >
      <ModalOverlay onClick={onClose} />
      <ModalContent>
        <ModalHeader>
          <Heading variant="large" textAlign="center">
            DEPOSIT
          </Heading>
        </ModalHeader>
        <ModalCloseButton _focus={{ boxShadow: "none" }} />

        <ModalBody
          px="0.25rem"
          borderTop="solid 1px"
          borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
        >
          

          <Button variant="primary">Deposit {amount!}</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
