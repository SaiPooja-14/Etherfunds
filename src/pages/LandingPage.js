import React from 'react';
import FeatureBox from '../components/FeatureBox';
import {
    Heading,
    useBreakpointValue,
    useColorModeValue,
    Button,
    Container,
    SimpleGrid,
    Divider,
    Icon,
    SkeletonCircle,
    HStack,
} from "@chakra-ui/react";
import FundraiserCard from '../components/FundraiserCard';
import { FcDonate, FcManager, FcFlashOn } from "react-icons/fc";
import { Link } from 'react-router-dom';
import useGetAllCampaigns from '../hooks/queries/useGetAllCampaigns';
import styles from '../styles/Home.module.css'

const LandingPage = () => {

    const {isLoading, data} = useGetAllCampaigns();
    const funds = data || []; // Provide default empty array if data is undefined
    
    console.log("funds: ", funds);
    
    return <div>
        <main className={styles.main}>
            <Container py={{ base: "4", md: "12" }} maxW={"7xl"} align={"left"}>
                {" "}
                <Heading
                    textAlign={useBreakpointValue({ base: "left" })}
                    fontFamily={"heading"}
                    color={useColorModeValue("gray.800", "white")}
                    as="h1"
                    py={4}
                >
                    A modern way of Fundraising using<br /> Ethereum Blockchain ✨{" "}
                </Heading>

                {/* Navlink will come here */}
                <Link to="/fundraiser/new/">
                    <Button
                        display={{ sm: "inline-flex" }}
                        fontSize={"md"}
                        fontWeight={600}
                        color={"white"}
                        bg={"teal.400"}
                        _hover={{
                            bg: "teal.300",
                        }}
                    >
                        Create Fundraiser
                    </Button>
                </Link>
            </Container>

            <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
                <HStack spacing={2}>
                    <SkeletonCircle size="4" />
                    <Heading as="h2" size="lg">
                        Open Fundraisers
                    </Heading>
                </HStack>

                <Divider marginTop="4" />
                {isLoading ? (
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
                        <SkeletonCircle size="20" />
                        <SkeletonCircle size="20" />
                        <SkeletonCircle size="20" />
                    </SimpleGrid>
                ) : funds.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
                        {funds.map((fund) => {
                            return (
                                <div key={fund.id}>
                                    <FundraiserCard
                                        name={fund.name}
                                        description={fund.description}
                                        creatorId={fund.manager}
                                        imageURL={"/images/default-campaign-image.jpg"}
                                        id={fund.id}
                                        target={fund.goal.toString()}
                                        balance={fund.balance.toString()}
                                        ethPrice="NA"
                                    />
                                </div>
                            );
                        })}
                    </SimpleGrid>
                ) : (
                    <Container py={8}>
                        <Heading as="h3" size="md" textAlign="center" color="gray.500">
                            No fundraisers available yet. Create one to get started!
                        </Heading>
                    </Container>
                )}
            </Container>

            <Container py={{ base: "4", md: "12" }} maxW={"7xl"} id="howitworks">
                <HStack spacing={2}>
                    <SkeletonCircle size="4" />
                    <Heading as="h2" size="lg">
                        Features
                    </Heading>
                </HStack>
                <Divider marginTop="4" />
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
                    <FeatureBox
                        icon={<Icon as={FcDonate} w={10} h={10} />}
                        title={"Immutable transactions"}
                        text={
                            "Due to blockchain's nature, transactions are immutable making tampering with them impossible"
                        }
                    />
                    <FeatureBox
                        icon={<Icon as={FcFlashOn} w={10} h={10} />}
                        title={"On time donations"}
                        text={
                            "Donations reach the deprived person on time, victims should get aid fast enough in case of emergencies like floods and earthquakes.."
                        }
                    />
                    <FeatureBox
                        icon={<Icon as={FcManager} w={10} h={10} />}
                        title={"Eliminate middlemen"}
                        text={
                            "Peer-to-peer will help eliminating distribution of money among middle men."
                        }
                    />
                </SimpleGrid>
            </Container>
        </main>
    </div>;
};

export default LandingPage;