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
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import supabaseClient from "../../../utils/supabaseClient";
import { Charts } from "../../Charts";

import { InfoOutlineIcon } from "@chakra-ui/icons";

const ChartsModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode } = useColorMode();
  const [pastEpochData, setPastEpochData] = useState<any[]>([]);
  const [epoch2Data, setepoch2Data] = useState<any[]>([]);
  const [epoch3Data, setepoch3Data] = useState<any[]>([]);

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
        ({ percentage_change, created_at, amount_after, epoch_number, ...rest }) => ({
          ...rest,
          Change: percentage_change,
          Date: created_at,
          Amount: amount_after,
          Epoch: epoch_number
        })
      );
      setPastEpochData(renamedData);
      setepoch2Data(renamedData.filter((item) => item.Epoch === "2"));
      setepoch3Data(renamedData.filter((item) => item.Epoch === "3"));
    };
    getData();
  }, []);

  useEffect(() => {

    {pastEpochData.forEach((item) => {
        console.log(item.Change);
    })
        
        // .reduce((a, b) => a + b, 0) / arr.length}

  }}, [pastEpochData, epoch2Data, epoch3Data])

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
        <Charts forHero wholeData data={pastEpochData} />
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
              Performance Charts
            </Heading>
          </ModalHeader>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ModalBody
            px="0.25rem"
            borderTop="solid 1px"
            borderColor={colorMode === "dark" ? "#232323" : "#F3F3F3"}
          >
            <Box>
              <Tabs variant="enclosed">
                <TabList>
                  <Tab>All Epochs</Tab>
                  <Tab>Epoch 2</Tab>
                  <Tab>Epoch 3</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel maxW={"100%"} w="37rem" h="150px">
                    <Text>Total Performance: </Text>
                    <Charts wholeData data={pastEpochData} />
                  </TabPanel>
                  <TabPanel maxW={"100%"} w="37rem" h="150px">
                    <Charts data={epoch2Data} />
                  </TabPanel>
                  <TabPanel maxW={"100%"} w="37rem" h="150px">
                    <Charts epoch3 data={epoch3Data} />
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
