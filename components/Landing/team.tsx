import { Flex, Text, Grid, Image, useColorMode } from "@chakra-ui/react";

export default function Team() {
    const { colorMode } = useColorMode();

    const teamData = [
        {
          name: "Mathdroid",
          role: "Lead Dev",
          twitter: "https://twitter.com/mathdroid",
          ens: "mathdroid.eth",
          desc: "Mathdroid is 155 Capital's founder, creative genius & lead developer.",
        },
        {
          name: "Huf",
          role: "Lead Farmer",
          twitter: "https://twitter.com/hufhaus9",
          ens: "hufhaus.eth",
          desc: "Huf is 155 Capital co-founder, in charge of the investment team and capital management.",
        },
        {
          name: "Marc",
          role: "Associate Farmer",
          twitter: "https://twitter.com/_iammarkc",
          desc: "Marc is a lead trader and analyst in the 155 Capital investment team.",
        },
        {
          name: "Nev",
          role: "Growth and Community Lead",
          twitter: "https://twitter.com/pray4profit",
          desc: "Nev is in charge of growth, community and digital marketing at 155 Capital.",
        },
        {
          name: "Sparx",
          role: "Smart Contract Engineer",
          twitter: "https://twitter.com/operationcodes",
          desc: "Sparx is 155 Capital's smart contract engineer and back-end developer.",
        },
        {
          name: "Nazeeh",
          role: "Front-End Engineer",
          ens: "nazeeh.eth",
          twitter: "https://twitter.com/nazeeh21",          
          desc: "Nazeeh serves as front-end engineer building the 155 Capital website.",
         },
        {
          name: "4gnle",
          role: "Front-End Lead",
          twitter: "https://twitter.com/4gnle",
          desc: "4gnle is 155 Capital's front-end lead developer, maintaining code and building new UIs.",
        },
      ];

    return (
        <Flex direction="column" py="2rem">
            <Flex py="2rem" direction="column">
                <Flex alignItems="center" py="2rem">
                <Image px="1rem" src={colorMode === "dark" ? "/icons/team-dark.svg" : "/icons/team-light.svg"} h="1.5rem" />
                <Text variant="normal">Team</Text>
                </Flex>
                <Grid
                    templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    pl="3rem" pr="5rem"
                >
                    {teamData.map((team, index) => ( 
                        <Flex direction="column" py="2rem" key={index}>
                            <Text py="1rem" variant="large">{team.name}</Text>
                            <Text variant="normal">{team.desc}</Text>
                        </Flex>
                    ))}
                </Grid>

            </Flex>
        </Flex>
    )
}