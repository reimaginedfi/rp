import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import Charts from "../Charts";

const ChartAccordian = () => {
  return (
    <Box>
      <Tabs>
        <TabList>
          <Tab>Whole Data</Tab>
          <Tab>Epoch Wise</Tab>
        </TabList>
        <TabPanels>
          <TabPanel w="37rem" h="150px">
            <Charts />
          </TabPanel>
          <TabPanel w="37rem" h="150px">
            <Charts />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ChartAccordian;
