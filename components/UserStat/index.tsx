import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  Stack,
  Tag,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { HiCurrencyDollar, HiSave } from "react-icons/hi";
import { AiFillBank } from "react-icons/ai";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { useVaultUser } from "../hooks/useVault";
import { vaults } from "../../contracts";
import { BigNumber } from "ethers";
import { commify, formatUnits, parseUnits } from "ethers/lib/utils";
import { truncate } from "../utils/stringsAndNumbers";
import { useContractConfig } from "../Vault";

const UserStat = () => {
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const contractConfig = useContractConfig();
  const {
    sharesValue,
    user,
    hasPendingDeposit,
    hasPendingDepositValue,
    totalDeposited,
  } = useVaultUser(contractConfig, address ?? "");

  const updatePendingDeposit = useContractWrite({
    ...contractConfig,
    functionName: "updatePendingDepositState",
    args: [address],
  });
  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      w="full"
      m="auto"
      gap="1rem"
      p={{ base: 1, md: 3 }}
    >
      <GridItem>
        <Grid
          pt={{ base: "1rem", md: "0" }}
          borderRadius="1rem"
          alignItems="center"
          w="full"
          templateColumns="1fr 3fr"
        >
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
            <Text variant="small">Pending Deposits</Text>
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize="1.25rem"
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: "bold" }}>
                {truncate(formatUnits(totalDeposited, 6), 2)}
              </span>{" "}
              USDC
            </Text>
          </Stack>
        </Grid>
      </GridItem>
      {/* <GridItem>
        <Flex
          p={5}
          borderRadius="1rem"
          justify="center"
          alignItems="center"
          gap={6}
          w="full"
          bg={colorMode === "dark" ? "#1C1C1C" : "#F8F8F8"}
        >
          <Stack textAlign={"center"}>
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
      </GridItem> */}
      <GridItem>
        <Grid
          borderRadius="1rem"
          alignItems="center"
          w="full"
          templateColumns="1fr 3fr"
        >
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
            <Text variant="small">Vault Tokens </Text>

            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize="1.25rem"
              color={colorMode === "dark" ? "#EDEDED" : "#171717"}
            >
              <span style={{ fontWeight: "bold" }}>
                {commify(
                  formatUnits(
                    sharesValue.data
                      ? parseInt(sharesValue!.data!._hex!, 16)
                      : 0,
                    6
                  )
                )}
              </span>{" "}
              VT{" "}
              {hasPendingDeposit && (
                <Button
                  size={"xs"}
                  colorScheme="orange"
                  variant={"outline"}
                  isLoading={updatePendingDeposit.isLoading}
                  onClick={() => {
                    updatePendingDeposit.write();
                  }}
                >
                  Claim Pending
                </Button>
              )}
            </Text>
          </Stack>
        </Grid>
      </GridItem>

      <GridItem>
        <Grid
          pt="1rem"
          borderRadius="1rem"
          alignItems="center"
          w="full"
          templateColumns="1fr 3fr"
        >
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
    </Grid>
  );
};

export default UserStat;
