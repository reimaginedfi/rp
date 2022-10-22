import {
  Badge,
  Flex,
  GridItem,
  Heading,
  Link,
  Skeleton,
  Spinner,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatNumber,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { commify, formatUnits } from "ethers/lib/utils";
import moment from "moment";
import { useContext, useEffect } from "react";
import { useBlockNumber } from "wagmi";
import { DebankData } from "../../pages";
import supabaseClient from "../../utils/supabaseClient";
import { useVaultState } from "../hooks/useVault";
import ProgressBar from "../ui/ProgressBar";
import { truncate } from "../utils/stringsAndNumbers";
import { useCompleteAum } from "../Vault/hooks/usePreviewAum";

export const VaultHeroLeft = () => {

  const previewAum = useContext(DebankData);

  // VAULT META DATA - used to display vault info
  const { epoch, aum, aumCap, rawGains, factor, previewValue } =
    useCompleteAum(previewAum);

  // VAULT CONTRACT - fetches current vault state
  const vaultState = useVaultState(BigNumber.from(epoch.data ?? 0).toNumber());

  // MANAGEMENT BLOCK -
  const lastManagementBlock = BigNumber.from(
    vaultState.data?.lastManagementBlock ?? 0
  ).toNumber();

  // CURRENT CHAIN BLOCK - to calculate against management block
  // const blockNumber = useBlockNumber({
  //   watch: true,
  // });

  const { data: blockNumber, isError, isLoading } = useBlockNumber()

  console.log(lastManagementBlock)

  // const formatDate = () => {
  //   const today = new Date();
  //   const yyyy = today.getFullYear();
  //   let mm: number | string = today.getMonth() + 1; // Months start at 0!
  //   let dd: number | string = today.getDate();

  //   if (dd < 10) dd = "0" + dd;
  //   if (mm < 10) mm = "0" + mm;

  //   const formattedToday = yyyy + "-" + mm + "-" + dd;
  //   return formattedToday;
  // };`

  // console.log(epoch, aum, rawGains, factor, previewValue);


  useEffect(() => {
    const storeData = async () => {
      // console.log("getData executing");
      const { data, error } = await supabaseClient
        .from("rp_data")
        .select("*")
        .order("created_at", { ascending: true });

        console.log(data, error)

      if (data && !error) {
        // console.log("supabaseData: ", data);
        if (factor && rawGains && epoch.data && previewValue && aum.data) {
          const epochData = epoch.data?.toString();
          const percentageChange =
            (factor >= 1 ? "+" : "") + ((factor - 1) * 100).toFixed(2);
          const amountChange =
            (factor >= 1 ? "+" : "-") +
            truncate(commify(formatUnits(rawGains.abs().toString(), 6)), 2);

          const amountBefore = truncate(
            commify(formatUnits(aum?.data?._hex, 6)),
            2
          );
          const amountAfter = truncate(
            commify(formatUnits(previewValue, 6)),
            2
          );

          const days = moment().diff(
            moment(data[data.length - 1].created_at),
            "days"
          );

          // const hours = moment().diff(
          //   moment(data[data.length - 1].created_at),
          //   "hours",
          //   true
          // );

          // console.log("days: ", days);

          console.log("hours: ", days);

          if (days >= 1) {
            // console.log("inserting data");
            const { data, error } = await supabaseClient
              .from("rp_data")
              .insert([
                {
                  epoch_number: epochData,
                  percentage_change: percentageChange,
                  amount_change: amountChange,
                  amount_before: amountBefore,
                  amount_after: amountAfter,
                },
              ]);
            // console.log("supabaseData after inserting: ", data);
            // console.log("supabaseError after inserting: ", error);
          }
        }
      }
      if (error) {
        console.log("supabaseError: ", error);
      }
    };
    if (
      factor &&
      rawGains &&
      epoch &&
      // !(lastManagementBlock > (blockNumber ?? 0)) &&
      !(aumCap.data?.toString() === "0.0")
    ) {
      storeData();
    }
  }, [factor]);

  if (
    vaultState.isLoading ||
    isLoading ||
    epoch.isLoading ||
    aumCap.isLoading
  ) {
    return (
      <GridItem display={"grid"} placeContent="center">
        <Spinner />
      </GridItem>
    );
  }

  if (aumCap.data?.toString() === "0.0") {
    return (
      <GridItem>
        {" "}
        <Flex justify="center" align="center">
          <Heading
            variant="medium"
            textAlign="center"
            color="brand"
            lineHeight="1.5rem"
          >
            This Vault is being initialized
          </Heading>
        </Flex>
      </GridItem>
    );
  }

  // if (lastManagementBlock > (blockNumber ?? 0)) {
  //   return (
  //     <GridItem justifyContent={"center"}>
  //       <Badge colorScheme="orange" variant={"outline"}>
  //         Validating
  //       </Badge>
  //       <Text mt={4}>Vault will reopen at block {lastManagementBlock}</Text>
  //       <Stack pt={4}>
  //         <ProgressBar
  //           // color="orange"
  //           partial={(blockNumber ?? 0) - lastManagementBlock + 6000}
  //           total={6000}
  //         />
  //         <Text>
  //           {lastManagementBlock - blockNumber} blocks remaining
  //         </Text>
  //       </Stack>
  //     </GridItem>
  //   );
  // }

  return (
    <GridItem justifySelf="center" textAlign="center">
      <Badge colorScheme="green" variant={"outline"}>
        Running
      </Badge>
      <Stat mt={"0.5rem"}>
        {/* @ts-expect-error */}
        <Skeleton isLoaded={!previewAum?.isValidating && !aum.isLoading}>
          <StatNumber>
                    {factor >= 1 ? "+" : ""}
            {((factor - 1) * 100).toFixed(2)}%
          </StatNumber>
        </Skeleton>
        {/* @ts-expect-error */}
        <Skeleton isLoaded={!previewAum?.isValidating && !aum.isLoading}>
          <Tooltip
            label={`Projected AUM: ${commify(
              formatUnits(previewValue, 6)
            )} USDC`}
            aria-label="A tooltip"
          >
            <Link
              isExternal
              href="https://debank.com/profile/0x4457df4a5bccf796662b6374d5947c881cc83ac7"
            >
              <StatHelpText>
                <StatArrow
                  type={rawGains.isNegative() ? "decrease" : "increase"}
                />
                {truncate(
                  commify(formatUnits(rawGains.abs().toString(), 6)),
                  2
                )}{" "}
                USDC
              </StatHelpText>
            </Link>
          </Tooltip>
        </Skeleton>
      </Stat>
      <Text
        style={{
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          WebkitBackgroundClip: "text",
        }}
        bg="radial-gradient(136.45% 135.17% at 9.91% 100%, #FF3F46 0%, #FF749E 57.68%, #FFE3AB 100%)"
        fontSize="24px"
        fontWeight={700}
      >
        EPOCH {epoch.data?.toString()}
      </Text>
    </GridItem>
  );
};
