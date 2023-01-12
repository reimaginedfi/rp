import { useContext } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Grid,
  Heading,
  SkeletonText,
  Text,
  useColorMode,
  Stat,
  StatArrow,
  Image
} from "@chakra-ui/react";

import { VaultData } from "../../../pages";

import { commify } from "ethers/lib/utils";
import { truncate } from "../../utils/stringsAndNumbers";
export default function VaultAssetsAccordion() {
  const { colorMode } = useColorMode();

  const value = useContext(VaultData);

  const chainValues = value!.chainList.filter((chain: any) => chain.usd_value !== 0)

  return (
    <Accordion borderRadius="1rem" pt="1rem" allowToggle border="none">
      <AccordionItem border="none">
        <AccordionButton
          borderRadius="1rem"
          justifyItems="space-between"
          justifyContent="space-between"
        >
          <Heading variant="medium">Vault Asset Value</Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel w="full" display={"grid"}>
          <Grid templateColumns="repeat(2, 1fr)">
            <Text
              variant="medium"
              color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
              textAlign={"center"}
            >
              Chain
            </Text>
            <Text
              variant="medium"
              color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
              textAlign={"center"}
            >
              Value
            </Text>
           </Grid>

          {chainValues.length > 1 ? (
            chainValues.map((data: any) => {
              return (
                <Grid
                  key={data.community_id}
                  templateColumns="repeat(2, 1fr)"
                  alignContent="center"
                  justifyContent={"center"}
                  py="0.5rem"
                >
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Image
                    src={data.logo_url}
                    alt={data.name}
                    w="1.5rem"
                    h="1.5rem"
                    />
                    <Text
                      variant="medium"
                      color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                    >
                      {data.name}
                    </Text>
                  </Flex>
                  <Flex direction="row" gap="0.25rem" alignItems="center">
                    <Heading
                      fontWeight="400"
                      variant="small"
                      textAlign={"center"}
                      w="full"
                    >
                      ${truncate(commify(data.usd_value), 2)}
                    </Heading>
                  </Flex>
                </Grid>
              );
            }).reverse()
          ) : (
            <SkeletonText />
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
