import { Button, Grid, GridItem, Heading, Stack } from "@chakra-ui/react";
import { useNetwork, useSwitchNetwork } from "wagmi";

import { createContext } from "react";
import { BigNumber } from "ethers";

import { vaults } from "../contracts";
import { Vault } from "../components/Vault";

import supabaseClient from "../utils/supabaseClient";

interface defaultValues {
    previewAum: string,
    performanceData: any
  }
  
export const VaultData = createContext<defaultValues | undefined>(undefined);

export const Vaults = ({ previewAum, performanceData }: defaultValues ) => {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const value: any = {
    previewAum,
    performanceData
  };

  return (
    <VaultData.Provider value={value}>

   {vaults ? (
        <>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              md: "repeat(auto-fit, 500px)",
            }}
            minH="100vh"
            m="auto"
            placeContent={"center"}
            py={16}
          >
            {vaults.map((contractConfig) => (
              <GridItem
                key={contractConfig.addressOrName}
                m={{ base: "5%", md: "2.5%" }}
              >
                <Vault contractConfig={contractConfig} />
              </GridItem>
            ))}
          </Grid>
        </>
      ) : chain && chain?.id !== 1 && (
        <Stack textAlign='center' m="auto" mt="20%" w="full" align="center" gap="0.5rem">
          <Heading>{chain.name} is not a supported chain.</Heading>
          <Button variant="primary" onClick={() => switchNetwork?.(1)}>
            Switch chains
          </Button>
        </Stack>
      )
      // ) : (
      //   <Grid minH={"100vh"} placeContent="center">
      //     <Stack m="auto" mt="20%" w="full" align="center" gap="0.5rem">
      //       <Heading variant="big" textAlign="center">
      //         Connect your wallet to see your vaults.
      //       </Heading>
      //       <RainbowConnectButton chainStatus={"none"} showBalance={false} />{" "}
      //     </Stack>
      //   </Grid>
      // )
      }
    </VaultData.Provider>   
  );
};

export const getStaticProps = async () => {
    const { data: performanceData } = await supabaseClient
    .from("rp_data")
    .select("*")
    .order("created_at", { ascending: true });
  
    const totalBalance = await fetch(
      "https://pro-openapi.debank.com/v1/user/total_balance?id=0x4457Df4a5bcCF796662b6374D5947c881Cc83AC7",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // AccessKey: "c13d8b424d6ad424066da28410f1752f7622dcb6",
          AccessKey: process.env.NEXT_PUBLIC_DEBANK_API!,
        },
      }
    );
  
    const usdc = await fetch(
      "https://pro-openapi.debank.com/v1/token?chain_id=eth&id=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // AccessKey: "c13d8b424d6ad424066da28410f1752f7622dcb6",
          AccessKey: process.env.NEXT_PUBLIC_DEBANK_API!,
        },
      }
    );
  
    const { total_usd_value } = await totalBalance.json();
    const { price } = await usdc.json();
  
    const debank = BigNumber.from(Math.ceil((total_usd_value / price) * 1e6));
  
    // EDIT THIS for adjustments (not from debank)
    const adjustments = BigNumber.from(0);
    const adjustmentsNotes = "MLP Position";
  
    const data = {
      total_usd_value,
      usdPerUsdc: price,
      debank,
      adjustments,
      total_usdc_value: debank.add(adjustments),
      adjustmentsNotes,
    };
    return {
      props: {
        previewAum: JSON.stringify({ data }),
        performanceData: performanceData
      },
      revalidate: 14400
    };
  };

  export default Vaults;
