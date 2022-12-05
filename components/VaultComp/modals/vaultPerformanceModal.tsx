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
import supabaseClient from "../../../utils/supabaseClient";
import { Charts } from "../../Charts";
import { VaultData } from "../../../pages";

import { InfoOutlineIcon, ExternalLinkIcon } from "@chakra-ui/icons";

import { truncate } from "../../utils/stringsAndNumbers";

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
  const [epoch2Data, setepoch2Data] = useState<any[]>([]);
  const [epoch3Data, setepoch3Data] = useState<any[]>([]);
  const [epoch4Data, setepoch4Data] = useState<any[]>([]);
  const [epoch5Data, setepoch5Data] = useState<any[]>([]);
  const [epoch6Data, setepoch6Data] = useState<any[]>([]);
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
      setepoch2Data(renamedData.filter((item: any) => item.Epoch === "2"));
      setepoch3Data(renamedData.filter((item: any) => item.Epoch === "3"));
      setepoch4Data(renamedData.filter((item: any) => item.Epoch === "4"));
      setepoch5Data(renamedData.filter((item: any) => item.Epoch === "5"));
      setepoch6Data(renamedData.filter((item: any) => item.Epoch === "6"));
  }, [value]);

  useEffect(() => {
    if (fullPerformance === 0 && pastEpochData.length) {
      let epoch2 =
        epoch2Data.length !== 0 && epoch2Data[epoch2Data.length - 1].Change;
      let epoch3 =
        epoch3Data.length !== 0 && epoch3Data[epoch3Data.length - 1].Change;
      let epoch4 =
        epoch4Data.length !== 0 && epoch4Data[epoch4Data.length - 1].Change;
      let epoch5 = 
        epoch5Data.length !== 0 && epoch5Data[epoch5Data.length - 1].Change;
      let epoch6 = 
      epoch6Data.length !== 0 && epoch5Data[epoch5Data.length - 1].Change;

      setFullPerformance(
        (+epoch2 + +epoch3 + +epoch4 + +epoch5) / 4
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
                  <Tab>Epoch 2</Tab>
                  <Tab>Epoch 3</Tab>
                  <Tab>Epoch 4</Tab>
                  <Tab>Epoch 5</Tab>
                  <Tab>Epoch 6</Tab>
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
                  <TabPanel maxW={"100%"} w="37rem" h="200px">
                    <Flex my={2} direction="row" justify="center">
                      <InfoData
                        heading={"Total Gain"}
                        tooltipText={`Final performance of epoch 2 (${epoch2Data.length} days)`}
                        performance={
                          epoch2Data.length !== 0 &&
                          epoch2Data[epoch2Data.length - 1].Change
                        }
                        value={`${
                          epoch2Data.length !== 0 &&
                          epoch2Data[epoch2Data.length - 1].Change > 0
                            ? "+"
                            : ""
                        }${
                          epoch2Data.length !== 0 &&
                          truncate(epoch2Data[epoch2Data.length - 1].Change, 2)
                        }%`}
                      />
                    </Flex>
                    <Charts epoch={2} data={epoch2Data} />
                  </TabPanel>
                  <TabPanel maxW={"100%"} w="37rem" h="200px">
                    <Flex my={2} direction="row" justify="center">
                      <InfoData
                        heading={"Total Gain"}
                        tooltipText={`Final performance of epoch 3 (${
                          epoch3Data!.length
                        } days)`}
                        performance={
                          epoch3Data.length !== 0 &&
                          epoch3Data![epoch3Data.length - 1].Change
                        }
                        value={`${
                          epoch3Data.length !== 0 &&
                          truncate(epoch3Data![epoch3Data.length - 1].Change, 2)
                        }%`}
                      />
                    </Flex>
                    <Charts epoch={3} data={epoch3Data} />
                  </TabPanel>
                  <TabPanel maxW={"100%"} w="37rem" h="200px">
                    <Flex my={2} direction="row" justify="center">
                      <InfoData
                        heading={"Total Gain"}
                        tooltipText={`Final performance of epoch 4 (${epoch4Data.length} days)`}
                        performance={
                          epoch4Data.length !== 0 &&
                          epoch4Data[epoch4Data!.length - 1].Change
                        }
                        value={`${
                          epoch4Data.length !== 0 &&
                          truncate(epoch4Data[epoch4Data!.length - 1].Change, 2)
                        }%`}
                      />
                    </Flex>
                    <Charts epoch={4} data={epoch4Data} />
                  </TabPanel>
                  <TabPanel maxW={"100%"} w="37rem" h="200px">
                    <Flex my={2} direction="row" justify="center">
                      <InfoData
                        heading={"Total Gain"}
                        tooltipText={`Final performance of epoch 5 (${epoch5Data.length} days)`}
                        performance={
                          epoch5Data.length !== 0 ?
                          epoch5Data[epoch5Data!.length - 1].Change
                        : 0}
                        value={`${
                          epoch5Data.length !== 0 ?
                          truncate(epoch5Data[epoch5Data!.length - 1].Change, 2)
                        : 0}%`}
                      />
                    </Flex>
                    <Charts epoch={5} data={epoch5Data} />
                  </TabPanel>
                  <TabPanel maxW={"100%"} w="37rem" h="200px">
                    <Flex my={2} direction="row" justify="center">
                      <InfoData
                        heading={"Total Gain"}
                        tooltipText={`Final performance of epoch 6 (${epoch6Data.length} days)`}
                        performance={
                          epoch6Data.length !== 0 ?
                          epoch6Data[epoch6Data!.length - 1].Change
                        : 0}
                        value={`${
                          epoch6Data.length !== 0 ?
                          truncate(epoch6Data[epoch6Data!.length - 1].Change, 2)
                        : 0}%`}
                      />
                    </Flex>
                    <Charts epoch={6} data={epoch6Data} />
                  </TabPanel>
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
