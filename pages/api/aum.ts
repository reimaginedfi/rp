import { BigNumber } from "ethers";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const totalBalance = await fetch(
    "https://pro-openapi.debank.com/v1/user/total_balance?id=0x4457Df4a5bcCF796662b6374D5947c881Cc83AC7",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AccessKey: "c13d8b424d6ad424066da28410f1752f7622dcb6",
      },
    }
  );

  const usdc = await fetch(
    "https://pro-openapi.debank.com/v1/token?chain_id=eth&id=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AccessKey: "c13d8b424d6ad424066da28410f1752f7622dcb6",
      },
    }
  );

  const { total_usd_value } = await totalBalance.json();
  const { price } = await usdc.json();

  const debank = BigNumber.from(Math.ceil((total_usd_value / price) * 1e6));
  // EDIT THIS for adjustments (not from debank)
  const adjustments = BigNumber.from(199_270.2 * 1e6);
  const adjustmentsNotes = "MLP Position";

  res.setHeader("Cache-Control", "s-maxage=14400"); // cache server-side every 4 hours
  res.status(200).json({
    total_usd_value,
    usdPerUsdc: price,
    debank,
    adjustments,
    total_usdc_value: debank.add(adjustments),
    adjustmentsNotes,
  });
};

export default handler;
