import {
  Box,
  Heading,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorMode,
  useDisclosure,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { Charts } from "../../Charts";
import { VaultData } from "../../../pages";

import { InfoOutlineIcon, ExternalLinkIcon } from "@chakra-ui/icons";

import { truncate } from "../../utils/stringsAndNumbers";
import  groupBy from "lodash/groupBy";

interface performanceDataProps {
  percentage_change: string;
  created_at: string;
  amount_after: string;
  amount_before: string;
  epoch_number: string;
}

const ChartsModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [pastEpochData, setPastEpochData] = useState<any[]>([]);
  const [groupedEpochData, setGroupedEpochData] = useState<Array<[]>>([]);
  const [fullPerformance, setFullPerformance] = useState<number>(0);
  const value = useContext(VaultData);


  useEffect(() => {
      const renamedData = value!.performanceData!.map(
        ({
          percentage_change,
          created_at,
          amount_after,
          epoch_number,
          ...rest
        }: performanceDataProps) => ({
          ...rest,
          Change: percentage_change,
          Date: created_at,
          Amount: amount_after.replaceAll(",", ""),
          Epoch: epoch_number,
        })
      );
      setPastEpochData(renamedData);
      setGroupedEpochData(groupBy(renamedData, item => item.Epoch) as any)
  }, [value]);

  useEffect(() => {
    if (fullPerformance === 0 && Object.keys(groupedEpochData).length) {

      let performance = [];
 
      for (let key in groupedEpochData) {
        let epochData: any = groupedEpochData[key];
        let epochChange = epochData[epochData.length - 1].Change;
        performance.push(epochChange);
      }

      let total = performance.reduce((a, b) => Number(a) + Number(b), 0);
     
      setFullPerformance(
        (total) / Object.keys(groupedEpochData).length
      );
    }
  }, [pastEpochData]);

  const InfoData = ({ heading, tooltipText, performance, value }: any) => {
    return (
      <Flex p="4px" direction="column" alignItems="center" gap="12px">
        <Flex direction="row" align="center">
          <Text
            fontSize={{ base: "12px", md: "0.875rem" }}
            lineHeight="1rem"
            color={colorMode === "dark" ? "#A0A0A0" : "#6F6F6F"}
            mr="0.25rem"
          >
            {heading}
          </Text>
          <Tooltip
            label={tooltipText}
            aria-label="A tooltip"
            bg={colorMode === "dark" ? "white" : "black"}
            mt="0.1rem"
          >
            <InfoOutlineIcon w={3.5} h={3.5} />
          </Tooltip>
        </Flex>
        <Text
          fontStyle="medium"
          fontWeight="600"
          fontSize={{ base: "14px", md: "16px" }}
          color={performance > 0 ? "green.500" : "red.500"}
        >
          {value}
        </Text>
      </Flex>
    );
  };

  return (
    <>
      <Flex
        onClick={onOpen}
        w="full"
        h="full"
        _hover={{ cursor: "pointer" }}
        direction="column"
      >
        <Flex direction="column" align="center" justify="center">
        <Heading variant="medium" _hover={{ cursor: "pointer" }} mb="0.3rem">
            Annualized Gains{" "}
            <Tooltip
            label="Click chart for more info"
            aria-label="A tooltip"
            bg={colorMode === "dark" ? "white" : "black"}
          >
            <InfoOutlineIcon w={3.5} h={3.5} />
          </Tooltip>
          </Heading>
        <Text
          fontStyle="medium"
          fontWeight="600"
          fontSize={{ base: "14px", md: "16px" }}
          color={fullPerformance > 0 ? "green.500" : "red.500"}
        >
          {fullPerformance > 0 && "+"}{truncate(
                          (fullPerformance * 12).toString(),
                          2
                        )}%
        </Text>
        </Flex>
        <Charts forHero epoch={0} data={pastEpochData} />
        <Text
          fontSize="0.75rem"
          _hover={{ cursor: "pointer" }}
          onClick={onOpen}
        >
          View More <ExternalLinkIcon w={2.5} h={2.5} />
        </Text>
      </Flex>

      <Modal isCentered size="xl" onClose={onClose!} isOpen={isOpen!}>
        <ModalOverlay onClick={onClose} />
        <ModalContent overflow="visible">
          <ModalHeader>
            <Heading variant="large" textAlign="center">
              Performance
            </Heading>
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody px="0.25rem">
            <Box>
              <Tabs colorScheme="red" variant="enclosed">
                <TabList>
                  <Tab>All Epochs</Tab>
                  {Object.keys(groupedEpochData).map((key) => (
                    <Tab key={key}>Epoch {key}</Tab>
                  ))}

                </TabList>
                <TabPanels>
                  <TabPanel maxW={"100%"} w="37rem" h="250px">
                    <Flex my={3} direction="row" justify="space-around">
                      <InfoData
                        heading={"Average per Epoch"}
                        tooltipText={
                          "How much the vault has grown every epoch (averaged from all epochs)"
                        }
                        performance={fullPerformance}
                        value={`${fullPerformance > 0 && "+"}${truncate(
                          fullPerformance.toString(),
                          2
                        )}%`}
                      />
                      <InfoData
                        heading={"Annualized Gains"}
                        tooltipText={
                          "Probable gains from performance of all epochs (current and past) averaged and extended over a 12-month period."
                        }
                        performance={fullPerformance}
                        value={`${fullPerformance > 0 && "+"}${truncate(
                          (fullPerformance * 12).toString(),
                          2
                        )}%`}
                      />
                    </Flex>
                    <Charts epoch={0} data={pastEpochData} />
                  </TabPanel>

                  {Object.values(groupedEpochData).map((key: any) => {
                      let epochChange = key[key.length - 1].Change;

                      return (
                    <TabPanel key={key[0].Epoch} maxW={"100%"} w="37rem" h="200px">
                    <Flex my={2} direction="row" justify="center">
                      <InfoData
                        heading={"Total Gain"}
                        tooltipText={`Final performance of epoch (${epochChange.length} days)`}
                        performance={
                          epochChange
                        }
                        value={`${
                          epochChange.includes("+") ? "" : ""
                        }${
                          key.length !== 0 && epochChange
                        }%`}
                      />
                    </Flex>
                    <Charts epoch={key[0].Epoch} data={key} />
                  </TabPanel>
                 )})}
                </TabPanels>
              </Tabs>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChartsModal;
