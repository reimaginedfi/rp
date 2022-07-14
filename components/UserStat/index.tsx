import {
  Box,
  Flex,
  Grid,
  GridItem,
  Icon,
  Stack,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { HiCurrencyDollar, HiEye, HiEyeOff, HiSave } from "react-icons/hi";

const UserStat = () => {
  const { colorMode } = useColorMode();
  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      w={{ base: "90%", md: "70%", lg: "50%" }}
      bg={"transparent"}
      m="auto"
      gap="1rem"
      p={{ base: 1, md: 3 }}
    >
      <GridItem>
        <Flex p={5} borderRadius='1rem' alignItems='center' gap={6} w="full" bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}>
          <VStack
            rounded="full"
            bg={colorMode === "dark" ? "#3C181A" : "#FFEFEF"}
            w="2.5rem"
            h="2.5rem"
          >
            <Icon
              m="auto"
              w="1.25rem"
              h="1.25rem"
              as={HiCurrencyDollar}
              color={colorMode === "dark" ? "#F2555A" : "#DC3D43"}
            />
          </VStack>
          <Stack >
            <Text variant='medium'>Stored Value</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize={"24px"}
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: 'bold'}}>150,000</span> USDC
            </Text>
          </Stack>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex p={5} borderRadius='1rem' alignItems='center' gap={6} w="full" bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}>
          <VStack
            rounded="full"
            bg={colorMode === "dark" ? "#3C181A" : "#FFEFEF"}
            w="2.5rem"
            h="2.5rem"
          >
            <Icon
              m="auto"
              w="1.25rem"
              h="1.25rem"
              as={HiCurrencyDollar}
              color={colorMode === "dark" ? "#F2555A" : "#DC3D43"}
            />
          </VStack>
          <Stack >
            <Text variant='medium'>Total Deposited</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize={"24px"}
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: 'bold'}}>125,000</span> USDC
            </Text>
          </Stack>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex p={5} borderRadius='1rem' alignItems='center' gap={6} w="full" bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}>
          <VStack
            rounded="full"
            bg={colorMode === "dark" ? "#3C181A" : "#FFEFEF"}
            w="2.5rem"
            h="2.5rem"
          >
            <Icon
              m="auto"
              w="1.25rem"
              h="1.25rem"
              as={HiSave}
              color={colorMode === "dark" ? "#F2555A" : "#DC3D43"}
            />
          </VStack>
          <Stack >
            <Text variant='medium'>Total Withdrawn</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize={"24px"}
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: 'bold'}}>7,500</span> USDC
            </Text>
          </Stack>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex m='auto' p={5} borderRadius='1rem' alignItems='center' gap={6} w="fit-content" bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}>
          <Stack textAlign='center'>
            <Text variant='medium'>Pending Deposits</Text>
            <Text
              fontFamily="Inter"
              fontWeight={600}
              fontSize={"24px"}
              color={'rgba(255, 128, 43, 1)'}
            >
              False
            </Text>
          </Stack>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default UserStat;
