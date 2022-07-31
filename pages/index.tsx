import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";

const PageContent = dynamic(() => import("../components/PageContent"), {
  ssr: false,
});

const Page = () => {
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

      <PageContent />
    </>
  );
};
export default Page;
