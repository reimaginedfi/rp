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
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
  useDisclosure,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import supabaseClient from "../../../utils/supabaseClient";
import { Charts } from "../../Charts";

import { InfoOutlineIcon, ExternalLinkIcon } from "@chakra-ui/icons";

import { truncate } from "../../utils/stringsAndNumbers";

const ChartsModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [pastEpochData, setPastEpochData] = useState<any[]>([]);
  const [epoch2Data, setepoch2Data] = useState<any[]>([]);
  const [epoch3Data, setepoch3Data] = useState<any[]>([]);
  const [fullPerformance, setFullPerformance] = useState<number>(0);
  const [epoch2Performance, setEpoch2Performance] = useState<number>(0);
  const [epoch3Performance, setEpoch3Performance] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabaseClient
        .from("rp_data")
        .select("*")
        .order("created_at", { ascending: true });
      if (!data && error) {
        console.log("Error while fetching epoch data", error);
        alert("Error while fetching epoch data");
        return;
      }
      const renamedData = data.map(
        ({
          percentage_change,
          created_at,
          amount_after,
          epoch_number,
          ...rest
        }) => ({
          ...rest,
          Change: percentage_change,
          Date: created_at,
          Amount: amount_after,
          Epoch: epoch_number,
        })
      );
      setPastEpochData(renamedData);
      setepoch2Data(renamedData.filter((item) => item.Epoch === "2"));
      setepoch3Data(renamedData.filter((item) => item.Epoch === "3"));
    };
    getData();
  }, []);

  useEffect(() => {
    if (fullPerformance === 0 && pastEpochData.length) {
      let changeArray = pastEpochData.map((item) => +item.Change);

      setFullPerformance(
        changeArray.reduce((a, b) => a + b) / changeArray.length
      );
    }

    if (epoch2Performance === 0 && epoch2Data.length) {
      let changeArray = epoch2Data.map((item) => +item.Change);

      setEpoch2Performance(
        changeArray.reduce((a, b) => a + b, 0) / changeArray.length
      );
    }

    if (epoch3Performance === 0 && epoch3Data.length) {
      let changeArray = epoch3Data.map((item) => +item.Change);

      setEpoch3Performance(
        changeArray.reduce((a, b) => a + b, 0) / changeArray.length
      );
    }
  }, [pastEpochData, epoch2Data, epoch3Data]);

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
        <Flex direction="row" align="center" justify="center">
          <Heading mr="0.35rem" variant="medium" _hover={{ cursor: "pointer" }}>
            Vault Performance
          </Heading>
          <Tooltip
            label="Click chart to view more charts"
            aria-label="A tooltip"
            bg={colorMode === "dark" ? "white" : "black"}
            mt="0.1rem"
          >
            <InfoOutlineIcon w={3.5} h={3.5} />
          </Tooltip>
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
                </TabList>
                <TabPanels>
                  <TabPanel maxW={"100%"} w="37rem" h="250px" overflow="hidden">
                    <Flex my={3} direction="row" justify="space-around">
                    <InfoData 
                      heading={"Total Average Gain"}
                      tooltipText={"How much the vault has grown since inception (averaged from all epochs)"}
                      performance={fullPerformance}
                      value={`${fullPerformance > 0 && "+"}${truncate(fullPerformance.toString(), 2)}%`}
                    />
                      <InfoData
                        heading={"Annualized Gain"}
                        tooltipText={
                          "Probable gains from performance of all epochs (current and past) averaged and extended over a 12-month period                    "
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
                  <TabPanel maxW={"100%"} w="37rem" h="200px" overflow="hidden">
                    <Flex my={2} direction="row" justify="center">
                    <InfoData
                        heading={"Total Gain"}
                        tooltipText={
                          `Averaged from total daily gains of epoch 2 (${epoch2Data.length} days)`
                        }
                        performance={epoch2Performance}
                        value={`${epoch2Performance > 0 ? "+" : ""}${truncate(epoch2Performance.toString(), 2)}%`}
                      />
                                        </Flex>
                    <Charts epoch={2} data={epoch2Data} />
                  </TabPanel>
                  <TabPanel maxW={"100%"} w="37rem" h="200px" overflow="hidden">
                    <Flex my={2} direction="row" justify="center">
                    <InfoData
                        heading={"Total Gain"}
                        tooltipText={
                          `Averaged from total daily gains of epoch 3 (${epoch3Data.length} days)`
                        }
                        performance={epoch3Performance}
                        value={`${epoch3Performance > 0 ? "+" : ""}${truncate(epoch3Performance.toString(), 2)}%`}
                      />
                    </Flex>
                    <Charts epoch={3} data={epoch3Data} />
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
