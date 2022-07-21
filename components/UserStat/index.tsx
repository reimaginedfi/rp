import { useEffect, useState } from "react";
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
import { HiCurrencyDollar, HiSave } from "react-icons/hi";
import { AiFillBank } from "react-icons/ai";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { useVaultUser } from "../hooks/useVault";
import { vaults } from "../../contracts";
import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

const UserStat = ({ contractConfig }: any) => {
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const { chain } = useNetwork();
  // const [contractConfig, setContractConfig] = useState<any>();

  // useEffect(() => {
  //   vaults[chain!.id].map((contract) => setContractConfig(contract));
  // }, [vaults])

  const { sharesValue, user, hasPendingDeposit, hasPendingDepositValue } =
    useVaultUser(contractConfig, address ?? "");

  const { data } = useContractRead({
    ...contractConfig,
    functionName: "getStoredValue",
    args: [address],
    watch: true,
  });
  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      w="100%"
      m="auto"
      gap="1rem"
      p={{ base: 1, md: 3 }}
    >
      <GridItem>
        <Flex p={5} borderRadius="1rem" alignItems="center" gap={6} w="full">
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
          <Stack>
            <Text variant="medium">Shares Value</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize={"24px"}
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: "bold" }}>
                {sharesValue.data ? parseInt(sharesValue!.data!._hex!, 16) : 0}
              </span>{" "}
              USDC
            </Text>
          </Stack>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex
          p={5}
          borderRadius="1rem"
          alignItems="center"
          gap={6}
          w="full"
          bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
        >
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
              as={AiFillBank}
              color={colorMode === "dark" ? "#F2555A" : "#DC3D43"}
            />
          </VStack>
          <Stack>
            <Text variant="medium">Total Deposited</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize={"24px"}
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: "bold" }}>
                {BigNumber.isBigNumber(data)
                  ? formatUnits(BigNumber.from(data), 6)
                  : 0}
              </span>{" "}
              USDC
            </Text>
          </Stack>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex
          p={5}
          borderRadius="1rem"
          alignItems="center"
          gap={6}
          w="full"
          bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
        >
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
          <Stack>
            <Text variant="medium">Withdrawable</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize={"24px"}
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: "bold" }}>
                {user.data && parseInt(user.data!.sharesToRedeem, 16)}
              </span>{" "}
              USDC
            </Text>
          </Stack>
        </Flex>
      </GridItem>
      <GridItem>
        <Flex
          p={5}
          borderRadius="1rem"
          justify="center"
          alignItems="center"
          gap={6}
          w="full"
          bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
        >
          <Stack textAlign="center">
            <Text variant="medium">Pending Deposits</Text>
            <Text
              fontFamily="Inter"
              fontWeight={600}
              fontSize={"24px"}
              color={"rgba(255, 128, 43, 1)"}
            >
              {hasPendingDepositValue ? "TRUE" : "FALSE"}
            </Text>
          </Stack>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default UserStat;
