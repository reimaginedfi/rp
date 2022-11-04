import { useEffect, useState } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Grid,
  Heading,
  Link,
  SkeletonText,
  Text,
  useColorMode,
} from "@chakra-ui/react";

//Icons
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { HiSave, HiPlay, HiPlus } from "react-icons/hi";
import { AiFillUnlock, AiFillFastForward } from "react-icons/ai";
import {FaFileContract} from "react-icons/fa";

//Fetching stuff
import axios from "axios";
import axiosRetry from "axios-retry";
import useSWR from "swr";

//Tools
import moment from "moment";
import { trimAddress, truncate } from "../../utils/stringsAndNumbers";
import { commify } from "ethers/lib/utils";

export const fetcher: any = async (url: string) =>
  await axios({
    method: "GET",
    url: url,
  }).catch((error) => {
    if (error.response.status !== 200) {
      throw new Error(
        `API call failed with status code: ${error.response.status} after 3 retry attempts`
      );
    }
  });

axiosRetry(axios, {
  retries: 10, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return retryCount * 3000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default three requests are retried
    return error!.response!.status === 503;
  },
});

export default function VaultActivityAccordion({ contractConfig }: any) {
  const { colorMode } = useColorMode();

  const { data: vaultActivity, error } = useSWR(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${contractConfig?.addressOrName}&startblock=0&endblock=99999999&page=1&offset=10000&sort=desc&apikey=${process.env.NEXT_PUBLIC_SC_ETHERSCAN}`,
    fetcher
  );

  const [vaultTxns, setVaultTxns] = useState<any[]>([]);

  useEffect(() => {
    if (vaultActivity?.data) setVaultTxns(vaultActivity.data?.result);
  }, [vaultActivity]);

  return (
    <Accordion borderRadius="1rem" pt="1rem" allowToggle border="none">
      <AccordionItem border="none">
        <AccordionButton
          borderRadius="1rem"
          justifyItems="space-between"
          justifyContent="space-between"
        >
          <Heading variant="medium">Vault Activity</Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel w="full" display={"grid"}>
          <Grid templateColumns="repeat(3, 1fr)">
            <Text
              variant="medium"
              color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
              textAlign={"left"}
              ml={{ base: "0", md: "1.5rem" }}
            >
              Action
            </Text>
            <Text
              variant="medium"
              color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
              textAlign={"center"}
            >
              TxN
            </Text>
            <Text
              variant="medium"
              color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
              textAlign={"center"}
            >
              Date
            </Text>
            {/* <Text
              variant="medium"
              color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
              textAlign={"center"}
            >
              Value (USDC)
            </Text> */}
          </Grid>

          {vaultTxns.length > 1 ? (
            vaultTxns.map((txn: any) => {
              if (
                txn.functionName.includes("setFees") ||
                txn.functionName.includes("send") ||
                txn.functionName.includes("setAum") ||
                txn.functionName.includes("VaultConfig") ||
                txn.functionName.includes("IsFee") ||
                txn.isError === "1"
              ) {
                return;
              }
              return (
                <Grid
                  key={txn.hash}
                  templateColumns="repeat(3, 1fr)"
                  alignContent="center"
                  justifyContent={"center"}
                  py="0.5rem"
                >
                  <Flex
                    direction="row"
                    gap="0.25rem"
                    alignItems="center"
                    justifyContent="left"
                    ml={{ base: "0", md: "1rem" }}
                  >
                    {txn.functionName.includes("deposit") ? (
                      <HiSave />
                    ) : txn.functionName.includes("progressEpoch") ? (
                      <AiFillFastForward />
                    ) : txn.functionName.includes("withdraw") ? (
                      <GiReceiveMoney />
                    ) : txn.functionName.includes("unlock") ? (
                      <AiFillUnlock />
                    ) : txn.functionName.includes("DepositState") ? (
                      <GiPayMoney />
                    ) :
                    txn.functionName.includes("update") ? (<HiPlus/>) 
                    : (
                      txn.functionName.includes("start") ? <HiPlay />
                     : <FaFileContract/>)}
                    <Heading
                      fontWeight="400"
                      variant="small"
                      textAlign={"center"}
                    >
                      {txn.functionName.includes("deposit")
                        ? "Deposit"
                        : txn.functionName.includes("unlock")
                        ? "Unlock VT"
                        : txn.functionName.includes("progressEpoch")
                        ? "Next Epoch"
                        : txn.functionName.includes("withdraw")
                        ? "Withdraw"
                        : txn.functionName.includes("DepositState")
                        ? "Claim VT"
                        : txn.functionName.includes("update") ? "Update AUM"
                        : txn.functionName.includes("start") ? "Start Vault"
                        : "Contract"}
                    </Heading>
                  </Flex>
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Link
                      target="_blank"
                      href={`https://etherscan.io/tx/` + txn.hash}
                    >
                      <Text
                        variant="medium"
                        color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                      >
                        {trimAddress(txn.hash, 5, -4)}
                      </Text>
                    </Link>
                  </Flex>
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Text
                      variant="medium"
                      color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                      textAlign={"center"}
                    >
                      {moment.unix(txn.timeStamp).format("ll").toString()}
                    </Text>
                  </Flex>
                  {/* <Flex
                    alignItems="center"
                    justifyContent="center"
                    textAlign={"center"}
                  >
                    <Text
                      variant="medium"
                      color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                      textAlign={"center"}
                    >
                      {truncate(commify(+txn.value / 1000000), 2)}
                    </Text>
                  </Flex> */}
                </Grid>
              );
            })
          ) : (
            <SkeletonText />
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
