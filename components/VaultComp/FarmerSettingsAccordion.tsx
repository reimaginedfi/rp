import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Heading,
  AccordionIcon,
  AccordionPanel,
  Flex,
  Spacer,
  SkeletonText,
  useColorMode,
  Text,
  Link,
  Button,
  Stack,
} from "@chakra-ui/react";
import { commify, formatUnits } from "ethers/lib/utils";
import { truncate } from "lodash";
import farmer from "../../pages/farmer";
import { useVaultMeta } from "../hooks/useVault";

export const FarmerSettingsAccordion = ({ contractConfig }: any) => {
  const { colorMode } = useColorMode();
  const meta = useVaultMeta(contractConfig);
  return (
    <Accordion borderRadius="1rem" mt="1rem" allowToggle border="solid 1px red">
      <AccordionItem border="none">
        <AccordionButton
          borderRadius="1rem"
          justifyItems="space-between"
          justifyContent="space-between"
        >
          <Heading variant="medium">Farmer Settings</Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel
          borderRadius="1rem"
          bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
        >
          <Flex alignItems={"center"}>
            <Text variant="medium">Stored Fees</Text>
            <Spacer />
            {meta.storedFee.isLoading ? (
              <SkeletonText />
            ) : (
              <Text>
                {truncate(
                  commify(
                    formatUnits(
                      meta.storedFee.data?.toString() ?? "0",
                      meta.assetToken.data?.decimals ?? 6
                    )
                  )
                )}{" "}
                {meta.assetToken.data?.symbol}
              </Text>
            )}
          </Flex>
          <Stack>
            <Button w="full" variant="secondary">
              Claim Fees
            </Button>

            <Button w="full" variant="secondary">
              Update Fee Settings
            </Button>
            <Button w="full" variant="secondary">
              Update AUM Cap
            </Button>
            <Button w="full" variant="primary">
              End Epoch {meta.epoch.data && meta.epoch.data.toString()}
            </Button>
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default FarmerSettingsAccordion;
