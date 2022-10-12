import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import axios from "axios";
import { BigNumber } from "ethers";

const PageContent = dynamic(() => import("../components/PageContent"), {
  ssr: false,
});

const Page = ({ previewAum }: { previewAum: any }) => {
  const title = "REFI Pro";
  const description = "$REFI is DeFi, reimagined.";

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

      <PageContent previewAum={previewAum} />
    </>
  );
};

export const getStaticProps = async () => {
  const totalBalance = await fetch(
    "https://pro-openapi.debank.com/v1/user/total_balance?id=0x4457Df4a5bcCF796662b6374D5947c881Cc83AC7",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // AccessKey: "c13d8b424d6ad424066da28410f1752f7622dcb6",
        AccessKey: "afe2f8ec56c7354a5f99e87dea4a4e3f03abd661",
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
        AccessKey: "afe2f8ec56c7354a5f99e87dea4a4e3f03abd661",
      },
    }
  );

  const { total_usd_value } = await totalBalance.json();
  const { price } = await usdc.json();

  const debank = BigNumber.from(Math.ceil((total_usd_value / price) * 1e6));

  // EDIT THIS for adjustments (not from debank)
  const adjustments = BigNumber.from(0);
  const adjustmentsNotes = "MLP Position";

  // cache server-side every 4 hours
  const cacheInSeconds = 4 * 60 * 60; // 4 hours

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
      previewAum: JSON.stringify({ data  }),
    },
  };
};
export default Page;
