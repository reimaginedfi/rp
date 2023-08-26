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
import { useAccount } from "wagmi";
import { useVaultUser } from "../../hooks/useVault";
import { useContractConfig, useWatchVault } from "../../Vault/ContractContext";
import { useCompleteAum } from "../../Vault/hooks/usePreviewAum";
import { useVaultAssetToken } from "../../Vault/hooks/useVaultAsset";
import { commify } from "ethers/lib/utils";
import { formatUnits } from 'viem'
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
  // const address = "0xA216208daB8AEbA66080129Db856F4A84F0f809a"
  const contractConfig = useContractConfig();
  const {
    user,
    sharesValue,
    hasPendingDeposit,
    updatePendingDeposit,
    totalDeposited,
  } = useVaultUser(contractConfig, address ?? "");

  // console.log(user)
  // console.log(sharesValue)
  // console.log(hasPendingDeposit)
  // console.log(updatePendingDeposit)
  // console.log(totalDeposited)

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
        `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractConfig.token}&address=${address}&page=1&offset=500&startblock=0&endblock=27025780&sort=desc&apikey=39AQRIGRBAERBCDM7TUGXNYJN6MYXZ34BR`,
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
            contractConfig.address.toLowerCase()
          ) {
            // console.log('happenin13231323213123g')

            depositedUSDC += +txn.value / 1000000;
          }

        if (
          txn.from.toString().toLowerCase() ==
          contractConfig.address.toLowerCase()
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

  const totalAssets = useWatchVault("totalAssets");
  const totalSupply = useWatchVault("totalSupply");
  const asset = useVaultAssetToken();

  const isLoading =
    !user.data || !totalAssets.data || !totalSupply.data || !asset.data;

  // pending deposit: userResult.data[0]
  // vault tokens balance: userResult.data[2]
  // total value: pd + vt * totalAssets / totalSupply
  const totalValue = isLoading
    ? 0
    : user.data?.[0] !== 0
    ? (Number(user.data?.[2] ?? 0)
         * Number(totalAssets.data!)
         / Number(totalSupply.data!)
         + Number(user.data?.[0] ?? 0))
    : 0;

  const { factor } = useCompleteAum();

  const unrealizedBN = totalValue * factor;

  const unrealized = (unrealizedBN / 1000000).toFixed(2);

  const value = Number(sharesValue?.data ?? 0);

  const totalValueVT = (value * factor) / 1000000;

  const pnlVT = totalValueVT - value / 1000000;

  // console.log(unrealized, unrealizedBN, value, totalValueVT.toFixed(2), pnlVT);
  // console.log(formatUnits(totalValue, 6))
  // console.log(factor)
  // console.log(totalValue.toNumber())

  // console.log('USERSSS', hasPendingDeposit)

  // console.log('USERSSS', totalDeposited)
  // console.log('2222', depositedUsdc)

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
          {!isLoadingData && depositedUsdc === 0 && +formatUnits(user.data[2], 6) < 1 ? (
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
                        label="Total amount of USDC tokens deposited into the vault (may not show deposit fee)"
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
                      ) : totalDeposited !== 0 ? (
                        truncate(
                          commify(totalDeposited)!.toString(),
                          2
                        )
                      ) : (
                        truncate(commify(depositedUsdc), 2)
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
                      <Text variant={"medium"} textAlign={"center"}>
                        Vault Tokens{" "}
                      </Text>
                      <Tooltip
                        justifySelf="center"
                        hasArrow
                        label="You can transform your deposited USDC into VT tokens to show full asset value. VT tokens are withdrawable for USDC at any time."
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
                          truncate(
                            commify(formatUnits(user?.data[2], 6))!.toString(),
                            2
                          )
                        )
                      }
                    </Heading>
                    <Text textAlign={"center"} mt={-2} mb={4}>
                      VT
                    </Text>
                    {hasPendingDeposit.data && (
                      <Alert status="warning" borderRadius={"md"} py={1} px={2}>
                        <AlertIcon boxSize={"1rem"}></AlertIcon>
                        <AlertDescription>
                          <Text fontSize={"xs"}>
                            You have claimable VT tokens. They will be
                            automatically claimed if you make another deposit,
                            or you can claim them manually. Unclaimed VT will
                            still count towards this epoch
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
                        (+unrealized - totalValue / 1000000).toFixed(
                          2
                        )
                      ) : (
                        pnlVT.toFixed(2)
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
                        commify(unrealized)
                      ) : (
                        totalValueVT && +commify(totalValueVT.toFixed(2))
                      )}
                    </Heading>
                    <Text textAlign={"center"} mt={-2} mb={4}>
                      {asset.data?.symbol}
                    </Text>
                    {hasPendingDeposit.data && (
                      <Alert status="warning" borderRadius={"md"} py={1} px={2}>
                        <AlertIcon boxSize={"1rem"}></AlertIcon>
                        <AlertDescription>
                          <Text fontSize={"xs"}>
                            You have claimable VT so you cannot see full balance (deposits + total gains). Currently, you can only see your past deposits + current {"epoch's"} PnL.
                          </Text>
                        </AlertDescription>
                      </Alert>
                    )}
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
              )}
            </>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
