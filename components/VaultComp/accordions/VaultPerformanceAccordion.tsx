import { useContext, useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Grid,
  Heading,
  SkeletonText,
  Text,
  useColorMode,
  Stat,
  StatArrow,
} from "@chakra-ui/react";

import { VaultData } from "../../../pages";

import { commify } from "ethers/lib/utils";
import moment from "moment";
export default function VaultPerformanceAccordion() {
  const { colorMode } = useColorMode();

  const value = useContext(VaultData);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <Accordion borderRadius="1rem" pt="1rem" allowToggle border="none">
      <AccordionItem border="none">
        <AccordionButton
          borderRadius="1rem"
          justifyItems="space-between"
          justifyContent="space-between"
        >
          <Heading variant="medium">Vault Performance</Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel w="full" display={"grid"}>
          <Grid templateColumns="repeat(4, 1fr)">
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
              Epoch
            </Text>
            <Text
              variant="medium"
              color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
              textAlign={"center"}
            >
              PnL %
            </Text>
            <Text
              variant="medium"
              color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
              textAlign={"center"}
            >
              PnL (USDC)
            </Text>
          </Grid>
          {value!.performanceData.length > 1 ? (
            value!.performanceData.slice(-10).map((data: any) => {
              return (
                <Grid
                  key={data.id}
                  templateColumns="repeat(4, 1fr)"
                  alignContent="center"
                  justifyContent={"center"}
                  py="0.5rem"
                >
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Text
                      variant="medium"
                      color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                    >
                      {moment(
                        new Date(data.created_at).toISOString().substring(0, 10)
                      ).format("ll")}
                    </Text>
                  </Flex>
                  <Flex direction="row" gap="0.25rem" alignItems="center">
                    <Heading
                      fontWeight="400"
                      variant="small"
                      textAlign={"center"}
                      w="full"
                    >
                      {data.epoch_number}
                    </Heading>
                  </Flex>
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Text
                      variant="medium"
                      color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                      textAlign={"center"}
                    >
                      {data.percentage_change}%
                    </Text>
                  </Flex>
                  <Stat
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Text
                      variant="medium"
                      color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                      textAlign={"center"}
                    >
                      <StatArrow
                        type={
                          data.amount_change.includes("-")
                            ? "decrease"
                            : "increase"
                        }
                      />
                      {data.amount_change.includes("--")
                        ? data.amount_change.substring(1)
                        : data.amount_change.includes(",") ||
                          data.amount_change.length <= 7
                        ? data.amount_change
                        : commify(data.amount_change)}
                    </Text>
                  </Stat>
                </Grid>
              );
            }).reverse()
          ) : (
            <SkeletonText />
          )}
            <Flex
            direction="column"
            gap="0.25rem"
            alignItems="center"
            justifyContent="center"
            ml={{ base: "0", md: "1rem" }}
          >
            <Button
              onClick={() => setShowDropdown(!showDropdown)}
              cursor="pointer"
              w="100%"
              variant="secondary"
            >
              {showDropdown ? "Show Less" : `Show ${value!.performanceData.length - 10} more days...`}
            </Button>
          </Flex>
          {showDropdown && (
            [...value!.performanceData].slice(0, -10).map((data: any) => {
              return (
                <Grid
                  key={data.id}
                  templateColumns="repeat(4, 1fr)"
                  alignContent="center"
                  justifyContent={"center"}
                  py="0.5rem"
                >
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Text
                      variant="medium"
                      color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                    >
                      {moment(
                        new Date(data.created_at).toISOString().substring(0, 10)
                      ).format("ll")}
                    </Text>
                  </Flex>
                  <Flex direction="row" gap="0.25rem" alignItems="center">
                    <Heading
                      fontWeight="400"
                      variant="small"
                      textAlign={"center"}
                      w="full"
                    >
                      {data.epoch_number}
                    </Heading>
                  </Flex>
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Text
                      variant="medium"
                      color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                      textAlign={"center"}
                    >
                      {data.percentage_change}%
                    </Text>
                  </Flex>
                  <Stat
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Text
                      variant="medium"
                      color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                      textAlign={"center"}
                    >
                      <StatArrow
                        type={
                          data.amount_change.includes("-")
                            ? "decrease"
                            : "increase"
                        }
                      />
                      {data.amount_change.includes("--")
                        ? data.amount_change.substring(1)
                        : data.amount_change.includes(",") ||
                          data.amount_change.length <= 7
                        ? data.amount_change
                        : commify(data.amount_change)}
                    </Text>
                  </Stat>
                </Grid>
              );
            }).reverse())}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
