/* eslint-disable @next/next/no-img-element */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  ListItem,
  UnorderedList,
  OrderedList,
  Button,
  Flex,
  Grid,
  VStack,
  Heading,
  Text,
  Link,
  useColorMode,
  Image,
  useMediaQuery,
} from "@chakra-ui/react";
import { NextSeo } from "next-seo";

import React from "react";

export default function FAQ() {
  const { colorMode } = useColorMode();
  const [isGreaterThan380px] = useMediaQuery("(min-width: 380px)");

  const AnswerText = ({ children }: any) => (
    <Text
      fontWeight="400"
      fontStyle="normal"
      fontSize="1rem"
      lineHeight="1.5rem"
      color={colorMode === "dark" ? "#A0A0A0" : "#6F6F6F"}
      mt="1rem"
    >
      {children}
    </Text>
  );

  const QuestionText = ({ children }: any) => (
    <Flex marginY="1rem" w="full" justify="space-between">
      <Heading
        textAlign="left"
        variant="medium"
        fontSize="1.25rem"
        fontWeight="600"
        lineHeight="1rem"
      >
        Q: {children}
      </Heading>
      <AccordionIcon />
    </Flex>
  );

  return (
    <Grid
      gridTemplateColumns="1fr"
      gap="1rem"
      as="section"
      alignContent="center"
      justifyContent="center"
      w={{ base: "90%", md: "70%" }}
      alignSelf="center"
      justifySelf={"center"}
    >
      <Accordion allowMultiple allowToggle>
        {FrequentlyAskedQuestions.map((faq, index) => (
          <AccordionItem key={index}>
            <AccordionButton _focus={{ borderSize: "0px", border: "none" }}>
              <QuestionText>{faq.question}</QuestionText>
            </AccordionButton>
            <AccordionPanel mt={-4}>
              {/* <Box color={colorMode === 'dark' ? "#A0A0A0" : "#6F6F6F"}></Box> */}
              <AnswerText>{faq.answer}</AnswerText>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <Text justifySelf="center" textAlign="center" w="85%">
        {isGreaterThan380px
          ? "If you have questions you can join ReFi Telegram or Discord channels to ask them, our team will answer. Otherwise, read our docs."
          : "Join our ReFi Telegram or Discord channels to ask your question. Find an answer in our docs."}
      </Text>

      <Flex flexDir={{ base: "column", md: "row" }}>
        <Link
          href="https://t.me/reimaginedfi"
          isExternal
          margin="auto"
          _hover={{ textDecoration: "none" }}
          mb={{ base: "1rem", md: "none" }}
        >
          <Button variant={"primary"} minW={{ base: "80vw", md: "100%" }}>
            Join ReFi Telegram
          </Button>
        </Link>

        <Link
          href="www.discord.gg/reimaginedfi"
          isExternal
          margin="auto"
          mb={{ base: "1rem", md: "none" }}
          _hover={{ textDecoration: "none" }}
        >
          <Button variant={"primary"} minW={{ base: "80vw", md: "100%" }}>
            Join ReFi Discord
          </Button>
        </Link>

        <Link
          href="https://refi.gitbook.io/refi-pro/"
          isExternal
          margin="auto"
          _hover={{ textDecoration: "none" }}
          mb={{ base: "1rem", md: "none" }}
        >
          <Button variant={"primary"} minW={{ base: "80vw", md: "100%" }}>
            Check Docs
          </Button>
        </Link>
      </Flex>
    </Grid>
  );
}

export const FrequentlyAskedQuestions = [
  {
    question: "What is the minimum deposit for REFI Pro?",
    answer: (
      <Text>
        {" "}
        Minimum buy-in of <b>US$25,000+</b> for a start. Note that we can also
        customize the buy-in amount on a case-by-case basis.
      </Text>
    ),
  },
  {
    question:
      "Will the total value of the ReFi Pro vault be considered as AuM?",
    answer: (
      <Text>
        Yes, the total value of the ReFi Pro vaults will be considered as AUM
        for daily reporting, but not for distributions purposes.
      </Text>
    ),
  },
  {
    question:
      "What protections are planned for ReFi token investors if institutions purchase all the ReFi tokens?",
    answer: (
      <Text>
        There will be no requirements for institutions to purchase ReFi tokens
        if they wish to deposit capital into ReFi Pro.
      </Text>
    ),
  },
  {
    question: "Who will audit REFI Pro?",
    answer: 
"We've already had numerous internal and external developers audit ReFi Pro's smart contract, and the feedback has been great. We will also engage several auditors for 1 month to audit the smart contract."
    
  },
  {
    question: "Will ReFi Pro be secured by FireBlocks??",
    answer: (
      <Text>
        Yes. FireBlocks is one of the key foundations for ReFi Pro to operate.{" "}
      </Text>
    ),
  },
  {
    question:
      "When will the vault tokenomics be released (maximum AUM, maximum token supply)?",
    answer: (
      <Text>
        Max <b>AuM</b> will be at the investment {"manager's"} discretion. There is
        no maximum token supply.
      </Text>
    ),
  },
  {
    question:
      "      Will the ReFi Pro vaults have different strategies than the ReFi Core Portfolio  ?",
    answer: (
      <VStack spacing="0.875rem">
        <Text>
          The strategy for ReFi Pro capital will differ slightly from the ReFi
          Core Portfolio as the investment managers will focus primarily on{" "}
          <b>low-to-medium risk strategies </b>for ReFi Pro. There will be lower
          risk tolerance on ReFi Pro, so {"we're"} aiming for annualised returns of
          35-40%.
        <br/>
          On the other hand, the investment managers will continue to target
          strategies across the low-to-high risk spectrum for the ReFi Core
          Portfolio.
        </Text>
      </VStack>
    ),
  },
  {
    question: "What is the fee structure for ReFi Pro?",
    answer: (
      <Text>ReFi Pro charges 2% management fee and 20% performance fee.</Text>
    ),
  },
  {
    question: "  How do $ReFi token holders benefit from ReFi Pro?",
    answer: (
      <VStack spacing="0.875rem">
        <Text>
          $ReFi token holders benefit from the fees received from ReFi Pro.
          Those fees will feed through to the ReFi Core Portfolio, which leads
          to higher portfolio value {"==>"} more distributions for $ReFi token
          holders {"==>"} higher ReFi token price.
        </Text>
        <Text>
          Note that ReFi Pro investors do not receive distributions, whereas
          $ReFi token holders continue to receive distributions.
        </Text>
      </VStack>
    ),
  },

  {
    question: "  How is ReFi Pro different from the $REFI token?",
    answer: (
      <VStack spacing="0.875rem" justify="left">
        <Text>
          Kindly refer to the table below listing the differences between ReFi
          Pro and the $REFI token.
        </Text>
        <Image src="https://1885829223-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FhUz1nvwAwfHC0ixjTng1%2Fuploads%2Fd9m5gE6AQ0d5DopfuVtV%2F1.PNG?alt=media&token=78ff0340-ac11-4984-a2eb-579cbd128a53" />
      </VStack>
    ),
  },
  {
    question: "What experience does the investment team have?",
    answer: (
      <VStack spacing="0.875rem">
        <Text>
          <Link color="brand" href="https://twitter.com/hufhaus9" isExternal>
            Huf
          </Link>{" "}
          graduated with first class honours from a top 3 university in the UK
          in 2009. He then had a very successful 11 years in investment banking.
          He traded equity derivatives for his firm, including options and
          futures on the S&P 500 and VIX Index. Also directly advised CIO&apos;s
          at some of the largest asset managers and family offices in the world
          in the last few years of his career. 2.5 years ago Huf went into DeFi
          and now works full-time for ReFi.
        </Text>
        <Text>
          <Link color="brand" href="https://twitter.com/_iammarkc" isExternal>
            Marc
          </Link>{" "}
          went to one of the best engineering schools in France with a focus on
          applied mathematics in finance, and got other two math degrees after
          that in France and Switzerland. He has worked for a tier 1 bank for
          many years in trading, with a very strong PnL track record.
        </Text>
        <Text>
          <Link color="brand" href="https://twitter.com/juanbugeth" isExternal>
            Juanbug
          </Link>{" "}
          is a student at Wharton Business School and specialises in fundamental
          investment analysis. He leverages his past traditional finance
          experience and helps ReFi with modeling, writing research reports, and
          discussing trade and investment opportunities.
        </Text>
      </VStack>
    ),
  },
];
