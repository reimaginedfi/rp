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
import { HiSave } from "react-icons/hi";

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


export default function VaultActivityAccordion({contractConfig}: any) {
const { colorMode } = useColorMode();

const { data: vaultActivity, error } = useSWR(
    `https://api.etherscan.io/api?module=account&action=tokentx&tokenaddress=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&address=${contractConfig?.addressOrName}&startblock=0&endblock=99999999999999999&page=1&offset=1000&sort=asc&apikey=${process.env.NEXT_PUBLIC_SC_ETHERSCAN}`,
    fetcher
    );

const [vaultTxns, setVaultTxns] = useState<any[]>([]);

useEffect(() => {
    if (vaultActivity?.data)
    setVaultTxns(vaultActivity.data?.result?.reverse?.());
}, [vaultActivity]);

return (
    <Accordion
    borderRadius="1rem"
    pt="1rem"
    allowToggle
    border="none"
  >
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
        <Grid templateColumns="repeat(4, 1fr)">
          <Text
            variant="medium"
            color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
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
          <Text
            variant="medium"
            color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
            textAlign={"center"}
          >
            Value (USDC)
          </Text>
        </Grid>

        {vaultTxns.length > 1 ? (
          vaultTxns.map((txn: any) => {
            if (txn.tokenSymbol !== "USDC") {
              return;
            }
            return (
              <Grid
                key={txn.hash}
                templateColumns="repeat(4, 1fr)"
                alignContent="center"
                justifyContent={"center"}
                py="0.5rem"
              >
                <Flex
                  direction="row"
                  gap="0.25rem"
                  alignItems="center"
                >
                  {txn.to === contractConfig.addressOrName ? (
                    <HiSave />
                  ) : txn.to ===
                    "0x4457df4a5bccf796662b6374d5947c881cc83ac7" ? (
                    <GiPayMoney />
                  ) : (
                    <GiReceiveMoney />
                  )}
                  <Heading
                    fontWeight="400"
                    variant="small"
                    textAlign={"center"}
                  >
                    {txn.to === contractConfig.addressOrName
                      ? "Deposit"
                      : txn.to ===
                        "0x4457df4a5bccf796662b6374d5947c881cc83ac7"
                      ? "Farmer"
                      : "Withdraw"}
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
                      color={
                        colorMode === "dark"
                          ? "#EDEDED"
                          : "#171717"
                      }
                    >
                      {trimAddress(txn.hash, 4, -3)}
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
                    color={
                      colorMode === "dark" ? "#EDEDED" : "#171717"
                    }
                    textAlign={"center"}
                  >
                    {moment
                      .unix(txn.timeStamp)
                      .format("ll")
                      .toString()}
                  </Text>
                </Flex>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  textAlign={"center"}
                >
                  <Text
                    variant="medium"
                    color={
                      colorMode === "dark" ? "#EDEDED" : "#171717"
                    }
                    textAlign={"center"}
                  >
                    {truncate(commify(+txn.value / 1000000), 2)}
                  </Text>
                </Flex>
              </Grid>
            );
          })
        ) : (
          <SkeletonText />
        )}
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
)

}