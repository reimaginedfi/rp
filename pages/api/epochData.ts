import moment from "moment";
import { NextApiHandler } from "next";
import supabaseClient from "../../utils/supabaseClient";

const handler: NextApiHandler = async (req, res) => {
  const {
    epochData,
    percentageChange,
    amountChange,
    amountBefore,
    amountAfter,
  } = JSON.parse(req.body);

  (async () => {
    const { data, error } = await supabaseClient
      .from("rp_data")
      .select("*")
      .order("created_at", { ascending: true });

    if (data && !error) {

        const days = moment().diff(
          moment(data[data.length - 1].created_at),
          "days"
        );

        // console.log("hours: ", days);

        if (days >= 1) {
          console.log("inserting data");
          const { data, error } = await supabaseClient.from("rp_data").insert([
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
    if (error) {
      // console.log("supabaseError: ", error);
    }
  })();

  res.status(200).json({ data: "data" });
};

export default handler;
