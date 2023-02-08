import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import axios from "axios";
import { BigNumber } from "ethers";
import { createContext, useContext } from "react";
import supabaseClient from "../utils/supabaseClient";


const PageContent = dynamic(() => import("../components/PageContent"), {
  ssr: false,
});

interface defaultValues {
  previewAum: string,
  performanceData: any,
  chainList: any,
  tokenList: any
}

export const VaultData = createContext<defaultValues | undefined>(undefined);

const Page = ({ previewAum, performanceData, chainList, tokenList }: defaultValues ) => {
  const title = "REFI Pro";
  const description = "$REFI is DeFi, reimagined.";

  const value: any = {
    previewAum,
    performanceData,
    chainList,
    tokenList
  };
  
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        twitter={{
          handle: "@reimaginedfi",
          site: "@reimaginedfi",
          cardType: "summary_large_image",
        }}
        openGraph={{
          title,
          description,
          url: "https://pro.reimagined.fi/",
          images: [
            {
              url: "https://pro.reimagined.fi/og.png",
              width: 1200,
              height: 628,
              alt: "Refi",
            },
          ],
        }}
      />
      <VaultData.Provider value={value}>
        <PageContent />
      </VaultData.Provider>
    </>
  );
};

export const getStaticProps = async () => {
  const { data: performanceData } = await supabaseClient
  .from("rp_data")
  .select("*")
  .order("created_at", { ascending: true });

  if (process.env.NODE_ENV === "production") {

  const totalBalance = await fetch(
    "https://pro-openapi.debank.com/v1/user/total_balance?id=0x4457Df4a5bcCF796662b6374D5947c881Cc83AC7",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AccessKey: process.env.NEXT_PUBLIC_DEBANK_API!,
      },
    }
  );

  const totalTokens = await fetch(
    'https://pro-openapi.debank.com/v1/user/all_token_list?id=0x4457Df4a5bcCF796662b6374D5947c881Cc83AC7',
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
        AccessKey: process.env.NEXT_PUBLIC_DEBANK_API!,
      },
    }
  );

  const { total_usd_value, chain_list } = await totalBalance.json();
  const { price } = await usdc.json();
  const tokenList = await totalTokens.json();

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
      performanceData: performanceData,
      chainList: chain_list,
      tokenList: tokenList
    },
    revalidate: 14400
  };

} else {
  const data = {
    total_usd_value: BigNumber.from(performanceData![0].amount_after.replace(".", "").replace(",", "")),
    usdPerUsdc: 1,
    debank: BigNumber.from(Math.ceil((0 / 1) * 1e6)),
    adjustments:  BigNumber.from(0),
    total_usdc_value: BigNumber.from(performanceData![0].amount_after.replace(".", "").replace(",", "")),
    adjustmentsNotes: "MLP Position",
  };

  return {
    props: {
      previewAum: JSON.stringify({ data }),
      performanceData: performanceData,
      // chainList: chain_list,
      // tokenList: tokenList
    },
    revalidate: 14400
  };
}
};
export default Page;
