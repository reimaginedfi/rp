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
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";

export default function UserStatsAccordion({previewAum}: { previewAum: any}) {
  const { colorMode } = useColorMode();
  const { address } = useAccount();
  const contractConfig = useContractConfig();
  const { user, sharesValue, hasPendingDeposit, updatePendingDeposit } = useVaultUser(
    contractConfig,
    address ?? ""
  );

  const [depositedUsdc, setDespositedUsdc] = useState<number | null>(null);

  useEffect(() => {
    const txnDetails = async () => {
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

      let depositedUsdc = 0;

      result.result.forEach((txn: any) => {
        if (
          txn.to.toString().toLowerCase() ==
          "0x00000008786611c72a00909bd8d398b1be195be3".toLowerCase()
        ) {
          depositedUsdc += +txn.value / 1000000;
        } else if (
          txn.from.toString().toLowerCase() ==
          "0x00000008786611c72a00909bd8d398b1be195be3".toLowerCase()
        ) {
          depositedUsdc -= +txn.value / 1000000;
        }
      });

      console.log("depositedUsdc: ", depositedUsdc);
      setDespositedUsdc(depositedUsdc);
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

  const { factor, isAumLoading } = useCompleteAum(previewAum);

  const unrealizedBN = isAumLoading
    ? totalValue.toNumber()
    : totalValue.toNumber() * factor;

  const unrealized = (unrealizedBN / 1000000).toFixed(2);

  const value = BigNumber.from(sharesValue?.data?._hex! ?? 0);

  const totalValueVT = isAumLoading ? 0 : (value.toNumber() * factor) / 1000000;

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
            Total USDC Deposited
          </Text>
          <Tooltip
            justifySelf="center"
            hasArrow
            label="Total amount of USDC tokens deposited into the vault"
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
          {depositedUsdc}
        </Heading>
        <Text textAlign={"center"} mt={-2} mb={4}>
          USDC
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
          {user.data &&
            commify(
              formatUnits(
                sharesValue.data
                  ? parseInt(sharesValue!.data!._hex!, 16)
                  : parseInt(user?.data.vaultShares),
                6
              )
            )}
        </Heading>
        <Text textAlign={"center"} mt={-2} mb={4}>
          VT
        </Text>
        {hasPendingDeposit.data &&(
        <Alert status="warning" borderRadius={"md"} py={1} px={2}>
        <AlertIcon boxSize={"1rem"}></AlertIcon>
        <AlertDescription>
          <Text fontSize={"xs"}>
            You have claimable Vault Tokens. They will be automatically claimed
            when you do another deposit, or you can claim them manually.
            Unclaimed VT will still count towards this epoch
            {"'"}s progressions.
          </Text>
        </AlertDescription>
      </Alert>)}
      </Box>
    </Stack>) : <Stack
    alignItems="center"
    >
    <Text mb="1rem" textAlign="center">Connect your wallet to view your stats</Text>
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
      </Stack>}
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
  );
};
