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
import {truncate} from '../utils/stringsAndNumbers'

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

  // const { data } = useContractRead({
  //   ...contractConfig,
  //   functionName: "getStoredValue",
  //   args: [address],
  //   watch: true,
  // });

  console.log(user)
  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      w="full"
      m="auto"
      gap="1rem"
      p={{ base: 1, md: 3 }}
    >
      <GridItem>
      <Grid borderRadius="1rem" alignItems="center" justifyItems="center" w="full" templateColumns="1fr 3fr">
          <VStack
            rounded="full"
            bg={colorMode === "dark" ? "#3C181A" : "#FFEFEF"}
            w="2.25rem"
            h="2.25rem"
          >
            <Icon
              m="auto"
              w="1rem"
              h="1rem"
              as={HiCurrencyDollar}
              color={colorMode === "dark" ? "#F2555A" : "#DC3D43"}
            />
          </VStack>
          <Stack>
            <Text variant="small">Shares Value</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize="1.25rem"
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: "bold" }}>
                {sharesValue.data ? parseInt(sharesValue!.data!._hex!, 16) : 0}
              </span>{" "}
              USDC
            </Text>
          </Stack>
        </Grid>
      </GridItem>
      <GridItem>
      <Grid pt={{base: "1rem", md: "0"}} borderRadius="1rem" alignItems="center" justifyItems="center" w="full" templateColumns="1fr 3fr">
          <VStack
            rounded="full"
            bg={colorMode === "dark" ? "#3C181A" : "#FFEFEF"}
            w="2.25rem"
            h="2.25rem"
          >
            <Icon
              m="auto"
              w="1rem"
              h="1rem"
              as={AiFillBank}
              color={colorMode === "dark" ? "#F2555A" : "#DC3D43"}
            />
          </VStack>
          <Stack>
            <Text variant="small">Total Deposited</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize="1.25rem"
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: "bold" }}>
              {BigNumber.isBigNumber(user!.data!.assetsDeposited!)
                  ? truncate(formatUnits((BigNumber.from(user!.data!.assetsDeposited!._hex)), 6), 2)
                  : 0}
              </span>{" "}
              USDC
            </Text>
          </Stack>
        </Grid>
      </GridItem>
      <GridItem>
      <Grid pt="1rem" borderRadius="1rem" alignItems="center" justifyItems="center" w="full" templateColumns="1fr 3fr">
          <VStack
            rounded="full"
            bg={colorMode === "dark" ? "#3C181A" : "#FFEFEF"}
            w="2.25rem"
            h="2.25rem"
          >
            <Icon
              m="auto"
              w="1rem"
              h="1rem"
              as={HiSave}
              color={colorMode === "dark" ? "#F2555A" : "#DC3D43"}
            />
          </VStack>
          <Stack>
            <Text variant="small">Withdrawable</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize="1.25rem"
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: "bold" }}>
                {user.data && parseInt(user.data!.sharesToRedeem, 16)}
              </span>{" "}
              USDC
            </Text>
          </Stack>
        </Grid>
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
