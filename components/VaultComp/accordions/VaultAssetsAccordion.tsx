import { useContext } from "react";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Flex,
  Grid,
  Heading,
  SkeletonText,
  Text,
  useColorMode,
  Image,
  useDisclosure,
} from "@chakra-ui/react";

import { VaultData } from "../../../pages";

import { commify } from "ethers/lib/utils";
import { truncate } from "../../utils/stringsAndNumbers";

import { ExternalLinkIcon, QuestionIcon } from "@chakra-ui/icons";

export default function VaultAssetsAccordion() {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const value = useContext(VaultData);

  const chainValues = value!.chainList.filter(
    (chain: any) => chain.usd_value !== 0
  );

  const tokenValues = value!.tokenList.filter(
    (token: any) => token.price !== 0
  );

  return (
    <>
      <Accordion borderRadius="1rem" pt="1rem" allowToggle border="none">
        <AccordionItem border="none">
          <AccordionButton
            borderRadius="1rem"
            justifyItems="space-between"
            justifyContent="space-between"
          >
            <Heading variant="medium">Vault Allocations</Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel w="full" display={"grid"}>
            <Grid templateColumns="repeat(2, 1fr)">
              <Text
                variant="large"
                color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
                textAlign={"center"}
              >
                Chain
              </Text>
              <Text
                variant="large"
                color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
                textAlign={"center"}
              >
                Value
              </Text>
            </Grid>

            {chainValues.length > 1 ? (
              chainValues
                .sort((a: any, b: any) => a.usd_value - b.usd_value)
                .map((data: any) => {
                  return (
                    <Grid
                      key={data.community_id}
                      templateColumns="repeat(2, 1fr)"
                      alignContent="center"
                      justifyContent={"center"}
                      py="0.5rem"
                    >
                      <Flex alignItems="center" justifyContent="center">
                        <Image
                          src={data.logo_url}
                          alt={data.name}
                          w="2rem"
                          h="2rem"
                          mr="1rem"
                        />
                        <Text
                          textAlign={"left"}
                          variant="large"
                          color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                        >
                          {data.name}
                        </Text>
                      </Flex>
                      <Flex direction="row" gap="0.25rem" alignItems="center">
                        <Heading
                          fontWeight="400"
                          variant="medium"
                          textAlign={"center"}
                          w="full"
                        >
                          ${truncate(commify(data.usd_value), 2)}
                        </Heading>
                      </Flex>
                    </Grid>
                  );
                })
                .reverse()
            ) : (
              <SkeletonText />
            )}
            <Text
              mt="1rem"
              fontSize="1rem"
              _hover={{ cursor: "pointer" }}
              onClick={onOpen}
              textAlign="center"
            >
              View Full Assets <ExternalLinkIcon w={3} h={3} />
            </Text>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader >
            <Heading variant="large" textAlign="center">
            Full Assets
            </Heading>
            </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <Grid templateColumns="repeat(3, 1fr)">
                <Text
                  variant="large"
                  color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
                  textAlign={"center"}
                >
                  Asset (Chain)
                </Text>
                <Text
                  variant="large"
                  color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
                  textAlign={"center"}
                >
                  Amount
                </Text>
                <Text
                  variant="large"
                  color={colorMode === "dark" ? "#7E7E7E" : "#858585"}
                  textAlign={"center"}
                >
                  Value
                </Text>
              </Grid>
              {tokenValues.length > 1 &&
                tokenValues
                  .sort(
                    (a: any, b: any) => b.price * b.amount - a.price * a.amount
                  )
                  .map((data: any) => {
                    const usd_value = data.price * data.amount;
                    return (
                      <Grid
                        key={data.community_id}
                        templateColumns="repeat(3, 1fr)"
                        alignContent="center"
                        justifyContent={"center"}
                        py="0.5rem"
                      >
                        <Flex alignItems="center" justifyContent="start">
                        {data.logo_url !== null ? (
                          <Image
                            src={data.logo_url}
                            alt={data.name}
                            w="2rem"
                            h="2rem"
                            mr="1rem"
                          />) : (
                            <><QuestionIcon h={8} w={8} mr="1rem"/>
                            </>)}
                          <Text
                            textAlign={"left"}
                            variant="medium"
                            color={colorMode === "dark" ? "#EDEDED" : "#171717"}
                          >
                            {data.name} ({data.chain.toUpperCase()})
                          </Text>
                        </Flex>
                        <Flex alignItems="center">
                        <Heading
                          fontWeight="400"
                          variant="small"
                          textAlign={"center"}
                          w="full"
                        >
                          {truncate(commify(data.amount), 2)} {data.symbol}
                        </Heading>
                        </Flex>
                        <Flex direction="row" gap="0.25rem" alignItems="center">
                          <Heading
                            fontWeight="400"
                            variant="small"
                            textAlign={"center"}
                            w="full"
                          >
                            ${truncate(commify(usd_value), 2)}
                          </Heading>
                        </Flex>
                      </Grid>
                    );
                  })}{" "}
            </>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
