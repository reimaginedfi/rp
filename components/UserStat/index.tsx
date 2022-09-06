import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { commify, formatUnits } from "ethers/lib/utils";
import { useAccount, useContractWrite } from "wagmi";
import { useVaultUser } from "../hooks/useVault";
import { truncate } from "../utils/stringsAndNumbers";
import { useContractConfig, useWatchVault } from "../Vault/ContractContext";
import { useCompleteAum } from "../Vault/hooks/usePreviewAum";
import { useVaultAssetToken } from "../Vault/hooks/useVaultAsset";
import {millify} from 'millify'

const UserStat = () => {
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const contractConfig = useContractConfig();
  const {
    user,
    sharesValue,
    hasPendingDeposit,
    totalDeposited,
  } = useVaultUser(contractConfig, address ?? "");

  const updatePendingDeposit = useContractWrite({
    ...contractConfig,
    functionName: "updatePendingDepositState",
    args: [address],
    mode: "recklesslyUnprepared",
  });

  const userResult = useWatchVault("vaultUsers", {
    args: [address],
  });
  const totalAssets = useWatchVault("totalAssets");
  const totalSupply = useWatchVault("totalSupply");
  const asset = useVaultAssetToken();

  const isLoading =
    !userResult.data || !totalAssets.data || !totalSupply.data || !asset.data;

  // pending deposit: userResult.data[0]
  // vault tokens balance: userResult.data[2]
  // total value: pd + vt * totalAssets / totalSupply
  const totalValue = isLoading
    ? BigNumber.from(0)
    : userResult.data?.[0].toNumber() !== 0
    ? BigNumber.from(userResult.data?.[2] ?? 0)
        .mul(totalAssets.data!)
        .div(totalSupply.data!)
        .add(userResult.data?.[0] ?? 0)
    : BigNumber.from(0);

  const { factor, isAumLoading } = useCompleteAum();

  const unrealizedBN = isAumLoading
    ? totalValue.toNumber()
    : totalValue.toNumber() * factor;

  const unrealized = (unrealizedBN / 1000000).toFixed(2);

  const value = BigNumber.from(sharesValue?.data?._hex! ?? 0)

  const totalValueVT = isAumLoading
    ? 0
    : (value.toNumber() * factor) / 1000000;

  const pnlVT = totalValueVT - value.toNumber() / 1000000;

  return (
    <Stack p={{ base: 1, md: 3 }}>
      <Stack
        w="100%"
        direction="row"
        justifyContent="center"
        alignContent={"center"}
      >
        <Flex gap={1} alignItems="center" direction={"row"}>
          <Text variant={"medium"} textAlign="center">
            Total Asset Value
          </Text>
          <Tooltip
            justifySelf="center"
            hasArrow
            label="Sum of total deposits plus total gains not yet withdrawn"
            bg={colorMode === "dark" ? "white" : "black"}
          >
            <InfoOutlineIcon w={3.5} h={3.5} />
          </Tooltip>
        </Flex>
      </Stack>
      <Box>
        <Heading
          textAlign={"center"}
          variant={"big"}
          textShadow={"1px 1px 2rem rgb(200 100 100 / 50%)"}
          my={0}
          py={0}
        >
          {unrealizedBN ? unrealized : totalValueVT && totalValueVT.toFixed(2)}
        </Heading>
        <Text textAlign={"center"} mt={-2} mb={4}>
          {asset.data?.symbol}
        </Text>
      </Box>
      <Stack
        w="100%"
        direction="row"
        justifyContent="center"
        alignContent={"center"}
      >
        <Flex gap={1} alignItems="center" direction={"row"}>
          <Text variant={"medium"} textAlign="center">
            PnL this epoch
          </Text>
          <Tooltip
            justifySelf="center"
            hasArrow
            label="Total gains or losses from all deposits not yet withdrawn"
            bg={colorMode === "dark" ? "white" : "black"}
          >
            <InfoOutlineIcon w={3.5} h={3.5} />
          </Tooltip>
        </Flex>
      </Stack>
      <Box>
        <Heading
          textAlign={"center"}
          textShadow={"1px 1px 2rem rgb(200 100 100 / 50%)"}
          my={0}
          py={0}
        >
          {unrealizedBN
            ? (+unrealized - totalValue.toNumber() / 1000000).toFixed(2)
            : pnlVT.toFixed(2)}
        </Heading>
        <Text textAlign={"center"} mt={-2} mb={4}>
          {asset.data?.symbol}
        </Text>
      </Box>
      <Stack
        w="100%"
        direction="row"
        justifyContent="center"
        alignContent={"center"}
      >
        <Flex gap={1} alignItems="center" direction={"row"}>
          <Text variant={"medium"} textAlign="center">
            Total Deposits
          </Text>
          <Tooltip
            justifySelf="center"
            hasArrow
            label="How much you've deposited so far (not including any gains from AUM or VT tokens)"
            bg={colorMode === "dark" ? "white" : "black"}
          >
            <InfoOutlineIcon w={3.5} h={3.5} />
          </Tooltip>
        </Flex>
      </Stack>
      <Box>
        <Heading
          textAlign={"center"}
          variant={"big"}
          textShadow={"1px 1px 2rem rgb(200 100 100 / 50%)"}
          my={0}
          py={0}
        >
          {truncate(formatUnits(totalDeposited, 6), 2)}
        </Heading>
        <Text textAlign={"center"} mt={-2} mb={4}>
          {asset.data?.symbol}
        </Text>
      </Box>
      <Stack
        w="100%"
        direction="row"
        justifyContent="center"
        alignContent={"center"}
      >
        <Flex gap={1} alignItems="center" direction={"row"}>
          <Text variant={"medium"} textAlign={"center"}>
            Vault Tokens{" "}
          </Text>
          <Tooltip
            justifySelf="center"
            hasArrow
            label="You can transform your deposited USDC into VT tokens for withdrawals"
            bg={colorMode === "dark" ? "white" : "black"}
          >
            <InfoOutlineIcon w={3.5} h={3.5} />
          </Tooltip>
        </Flex>

        {hasPendingDeposit.data && (
          <Button
            size={"xs"}
            colorScheme="orange"
            // variant={"outline"}
            isLoading={updatePendingDeposit.isLoading}
            onClick={() => {
              updatePendingDeposit.write();
            }}
          >
            Claim Pending
          </Button>
        )}
      </Stack>
      <Box>
        <Heading
          textAlign={"center"}
          textShadow={"1px 1px 2rem rgb(200 100 100 / 50%)"}
          my={0}
          py={0}
        >
          {user.data && commify(
            formatUnits(
              sharesValue.data ? parseInt(sharesValue!.data!._hex!, 16) : parseInt(user?.data.vaultShares),
              6
            )
          )}
        </Heading>
        <Text textAlign={"center"} mt={-2} mb={4}>
          VT
        </Text>
      </Box>
      {/* <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
        w="full"
        m="auto"
        gap="1rem"
      >
        <GridItem>
          <Grid
            pt={{ base: "1rem", md: "0" }}
            borderRadius="1rem"
            placeContent="center"
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
              <Text variant="small">Total Deposits</Text>
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
                {hasPendingDeposit.data && (
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
      </Grid> */}
    </Stack>
  );
};

export default UserStat;
