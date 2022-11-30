import { NextSeo } from "next-seo";

import Landing from "../components/Landing";
import Footer from "../components/Layout/footer";

const Index = () => {
  const title = "155 Capital";
  const description = "On-chain asset management.";

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
          url: "https://155.capital",
          images: [
            {
              url: "https://155.capital/og.png",
              width: 1200,
              height: 628,
              alt: "155 Capital",
            },
          ],
        }}
      />
      <Landing />
      <Footer/>
    </>
  );
};

export default Index;
