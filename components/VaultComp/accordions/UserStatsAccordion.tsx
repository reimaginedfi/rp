import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { useVaultUser } from "../../hooks/useVault";
import { useContractConfig, useWatchVault } from "../../Vault/ContractContext";
import { useCompleteAum } from "../../Vault/hooks/usePreviewAum";
import { useVaultAssetToken } from "../../Vault/hooks/useVaultAsset";
import { commify, formatUnits } from "ethers/lib/utils";
import { truncate } from "../../utils/stringsAndNumbers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { DepositButton } from "../modals/DepositButton";

export default function UserStatsAccordion({
  previewAum,
}: {
  previewAum: any;
}) {
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const contractConfig = useContractConfig();
  const { user, sharesValue, hasPendingDeposit, updatePendingDeposit } =
    useVaultUser(contractConfig, address ?? "");
    
  const [depositedUsdc, setDespositedUsdc] = useState<number>(0);
  const [withdrawnUsdc, setWithdrawnUsdc] = useState<number>(0);
  const [usdcDepositedLabel, setUsdcDepositedLabel] = useState<boolean>(false);
  const [usdcWithdrawnLabel, setUsdcWithdrawnLabel] = useState<boolean>(false);
  const [pnlLabel, setPnlLabel] = useState<boolean>(false);
  const [currentValueLabel, setCurrentValueLabel] = useState<boolean>(false);
  const [VTTokensLabel, setVTTokensLabel] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  useEffect(() => {
    const txnDetails = async () => {
      setIsLoadingData(true);
      const data = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&address=${address}&page=1&offset=100&startblock=0&endblock=27025780&sort=desc&apikey=39AQRIGRBAERBCDM7TUGXNYJN6MYXZ34BR`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await data.json();

      let depositedUSDC = 0;
      let withdrawnUSDC = 0;

      await result.result.forEach((txn: any) => {
        if (
          txn.to.toString().toLowerCase() ==
          "0x00000008786611c72a00909bd8d398b1be195be3".toLowerCase()
        ) {
          depositedUSDC += +txn.value / 1000000;
        }

        if (
          txn.from.toString().toLowerCase() ==
          "0x00000008786611c72a00909bd8d398b1be195be3".toLowerCase()
        ) {
          withdrawnUSDC += +txn.value / 1000000;
        }
      });

      setDespositedUsdc(depositedUSDC);
      setWithdrawnUsdc(withdrawnUSDC);
      setIsLoadingData(false);
    };

    if (address) {
      txnDetails();
    }
  }, [address]);

  const accordionBg = colorMode === "dark" ? "#1C1C1C" : "#F8F8F8";

  const userHasPendingDeposit = useWatchVault("userHasPendingDeposit", {
    args: [address],
  });
  const shouldShowNotification =
    userHasPendingDeposit.data &&
    userHasPendingDeposit.data.toString() === "true";

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

  const { factor } = useCompleteAum();

  const unrealizedBN = totalValue.toNumber() * factor;

  const unrealized = (unrealizedBN / 1000000).toFixed(2);

  const value = BigNumber.from(sharesValue?.data?._hex! ?? 0);

  const totalValueVT = (value.toNumber() * factor) / 1000000;

  const pnlVT = totalValueVT - value.toNumber() / 1000000;

  // console.log(unrealized, unrealizedBN, value, totalValueVT, pnlVT);

  return (
    <Accordion borderRadius="1rem" mt="1rem" allowToggle border="none">
      <AccordionItem border="none">
        <AccordionButton
          borderRadius="1rem"
          justifyItems="space-between"
          justifyContent="space-between"
        >
          <Heading variant="medium">
            Your Stats{" "}
            {/* {shouldShowNotification && (
            <Badge borderRadius={"md"} colorScheme="orange">
              1
            </Badge>
          )} */}
          </Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel
          p={{ base: 1, md: 3 }}
          borderRadius="1rem"
          bg={accordionBg}
        >
           {!isLoadingData && depositedUsdc === 0 ? (
            <Flex m="auto" w="75%" direction="column">
            <Text my="1rem" variant={"large"} textAlign="center">
            You have not made a deposit yet
          </Text>
            <DepositButton />
            </Flex>
     ) : (
            <>
          {address ? (
            <Stack p={{ base: 1, md: 3 }}>
              <Stack
                w="100%"
                direction="row"
                justifyContent="center"
                alignContent={"center"}
              >
                <Flex gap={1} alignItems="center" direction={"row"}>
                  <Text variant={"medium"} textAlign="center">
                    Total Deposited
                  </Text>
                  <Tooltip
                    justifySelf="center"
                    hasArrow
                    label="Total amount of USDC tokens deposited into the vault"
                    bg={colorMode === "dark" ? "white" : "black"}
                    isOpen={usdcDepositedLabel}
                  >
                    <InfoOutlineIcon
                      w={3.5}
                      h={3.5}
                      onMouseEnter={() => setUsdcDepositedLabel(true)}
                      onMouseLeave={() => setUsdcDepositedLabel(false)}
                      onClick={() => setUsdcDepositedLabel(true)}
                    />
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
                  {isLoadingData ? (
                    <Spinner />
                  ) : depositedUsdc !== 0 ? (
                    truncate(commify(depositedUsdc!.toString()), 2)
                  ) : (
                    0
                  )}
                </Heading>
                <Text textAlign={"center"} mt={-2} mb={4}>
                  USDC
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
                    Current Asset Value
                  </Text>
                  <Tooltip
                    justifySelf="center"
                    hasArrow
                    label="Sum of total deposits plus total gains not yet withdrawn"
                    bg={colorMode === "dark" ? "white" : "black"}
                    isOpen={currentValueLabel}
                  >
                    <InfoOutlineIcon
                      w={3.5}
                      h={3.5}
                      onMouseEnter={() => setCurrentValueLabel(true)}
                      onMouseLeave={() => setCurrentValueLabel(false)}
                      onClick={() => setCurrentValueLabel(true)}
                    />
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
                  {isLoadingData ? (
                    <Spinner />
                  ) : unrealizedBN ? (
                    unrealized
                  ) : (
                    totalValueVT && totalValueVT.toFixed(2)
                  )}
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
                    isOpen={pnlLabel}
                  >
                    <InfoOutlineIcon
                      w={3.5}
                      h={3.5}
                      onMouseEnter={() => setPnlLabel(true)}
                      onMouseLeave={() => setPnlLabel(false)}
                      onClick={() => setPnlLabel(true)}
                    />
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
                  {isLoadingData ? (
                    <Spinner />
                  ) : unrealizedBN ? (
                    (+unrealized - totalValue.toNumber() / 1000000).toFixed(2)
                  ) : (
                    pnlVT.toFixed(2)
                  )}
                </Heading>
                <Text textAlign={"center"} mt={-2} mb={4}>
                  {asset.data?.symbol}
                </Text>
              </Box>
              {/* <Stack
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
      </Box> */}
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
                    isOpen={VTTokensLabel}
                  >
                    <InfoOutlineIcon
                      w={3.5}
                      h={3.5}
                      onMouseEnter={() => setVTTokensLabel(true)}
                      onMouseLeave={() => setVTTokensLabel(false)}
                      onClick={() => setVTTokensLabel(true)}
                    />
                  </Tooltip>
                </Flex>

                {hasPendingDeposit.data && (
                  <Button
                    size={"xs"}
                    colorScheme="orange"
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
                  {isLoadingData ? (
                    <Spinner />
                  ) : (
                    user.data &&
                    commify(
                      formatUnits(
                        sharesValue.data
                          ? parseInt(sharesValue!.data!._hex!, 16)
                          : parseInt(user?.data.vaultShares),
                        6
                      )
                    )
                  )}
                </Heading>
                <Text textAlign={"center"} mt={-2} mb={4}>
                  VT
                </Text>
                {hasPendingDeposit.data && (
                  <Alert status="warning" borderRadius={"md"} py={1} px={2}>
                    <AlertIcon boxSize={"1rem"}></AlertIcon>
                    <AlertDescription>
                      <Text fontSize={"xs"}>
                        You have claimable Vault Tokens. They will be
                        automatically claimed when you do another deposit, or
                        you can claim them manually. Unclaimed VT will still
                        count towards this epoch
                        {"'"}s progressions.
                      </Text>
                    </AlertDescription>
                  </Alert>
                )}
              </Box>
              <Stack
                w="100%"
                direction="row"
                justifyContent="center"
                alignContent={"center"}
              >
                <Flex gap={1} alignItems="center" direction={"row"}>
                  <Text variant={"medium"} textAlign="center">
                    Total Withdrawn
                  </Text>
                  <Tooltip
                    justifySelf="center"
                    hasArrow
                    label="Total amount of USDC tokens withdrawn from the vault"
                    bg={colorMode === "dark" ? "white" : "black"}
                    isOpen={usdcWithdrawnLabel}
                  >
                    <InfoOutlineIcon
                      w={3.5}
                      h={3.5}
                      onMouseEnter={() => setUsdcWithdrawnLabel(true)}
                      onMouseLeave={() => setUsdcWithdrawnLabel(false)}
                      onClick={() => setUsdcWithdrawnLabel(true)}
                    />
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
                  {isLoadingData ? (
                    <Spinner />
                  ) : withdrawnUsdc !== 0 ? (
                    truncate(commify(withdrawnUsdc!.toString()), 2)
                  ) : (
                    0
                  )}
                </Heading>
                <Text textAlign={"center"} mt={-2} mb={4}>
                  USDC
                </Text>
              </Box>
            </Stack>
          ) : (
            <Stack alignItems="center">
              <Text mb="1rem" textAlign="center">
                Connect your wallet to view your stats
              </Text>
              <ConnectButton
                chainStatus={"none"}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
              />
            </Stack>
          )}</>)}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
