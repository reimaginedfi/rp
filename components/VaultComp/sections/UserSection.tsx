import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  useColorMode,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";

import UserStat from "../../UserStat";
import { useWatchVault } from "../../Vault/ContractContext";

const useUserSection = () => {
  const { address } = useAccount();
  const { colorMode } = useColorMode();
  const accordionBg = colorMode === "dark" ? "#1C1C1C" : "#F8F8F8";

  const userHasPendingDeposit = useWatchVault("userHasPendingDeposit", {
    args: [address],
  });
  const shouldShowNotification =
    userHasPendingDeposit.data &&
    userHasPendingDeposit.data.toString() === "true";

  return {
    accordionBg,
    shouldShowNotification,
  };
};

export const UserSection = () => {
  const { accordionBg, shouldShowNotification } = useUserSection();
  return (
    <Accordion borderRadius="1rem" mt="1rem" allowToggle border="none">
      <AccordionItem border="none">
        <AccordionButton
          borderRadius="1rem"
          justifyItems="space-between"
          justifyContent="space-between"
        >
          <Heading variant="medium">
            Your Stats{" "}
            {/* {shouldShowNotification && (
              <Badge borderRadius={"md"} colorScheme="orange">
                1
              </Badge>
            )} */}
          </Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel
          p={{ base: 1, md: 3 }}
          borderRadius="1rem"
          bg={accordionBg}
        >
          {/* {shouldShowNotification && (
            
          )} */}
          <UserStat />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
