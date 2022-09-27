import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import supabaseClient from "../../utils/supabaseClient";
import Charts from "../Charts";

const ChartAccordian = () => {
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
        ({ percentage_change, created_at, ...rest }) => ({
          ...rest,
          Change: percentage_change,
          Date: created_at,
        })
      );
      setPastEpochData(renamedData);
      setepoch2Data(renamedData.filter((item) => item.epoch_number === "2"));
      setepoch3Data(renamedData.filter((item) => item.epoch_number === "3"));
    };
    getData();
  }, []);

  return (
    <Box>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Whole Data</Tab>
          <Tab>Epoch Wise</Tab>
        </TabList>
        <TabPanels>
          <TabPanel w="37rem" h="150px">
            <Charts wholeData data={pastEpochData} />
          </TabPanel>
          <TabPanel>
            <Tabs isFitted variant="enclosed">
              <TabPanels>
                <TabPanel maxW={'100%'} w="37rem" h="150px">
                  <Charts data={epoch2Data} />
                </TabPanel>
                <TabPanel maxW={'100%'} w="37rem" h="150px">
                  <Charts data={epoch3Data} />
                </TabPanel>
              </TabPanels>
              <TabList>
                <Tab>Epoch 2</Tab>
                <Tab>Epoch 3</Tab>
              </TabList>
            </Tabs>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ChartAccordian;
