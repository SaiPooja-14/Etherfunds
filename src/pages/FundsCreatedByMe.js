import React from "react";
import {
  Heading,
  Container,
  SimpleGrid,
  Divider,
  SkeletonCircle,
  HStack,
  Text,
} from "@chakra-ui/react";
import FundraiserCard from "../components/FundraiserCard";
import styles from "../styles/Home.module.css";
import useGetMyFunds from "../hooks/queries/useGetMyFunds";

const FundsCreatedByMe = () => {
  // ✅ renamed destructured data safely
  const { isLoading, data: funds } = useGetMyFunds();

  // ✅ optional: log data shape for debugging
  console.log("Funds fetched:", funds);

  // ✅ handle three states: loading, empty, and data loaded
  const renderContent = () => {
    if (isLoading) {
      return <Text mt={6}>Loading your fundraisers...</Text>;
    }

    // if funds is undefined or empty array
    if (!funds || funds.length === 0) {
      return <Text mt={6}>You haven’t created any fundraisers yet.</Text>;
    }

    // ✅ safely map funds
    return (
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} py={8}>
        {(funds ?? []).map((fund) => (
          <div key={fund.id ?? Math.random()}>
            <FundraiserCard
              name={fund.name ?? "Untitled Fund"}
              description={fund.description ?? "No description available."}
              creatorId={fund.manager ?? "Unknown"}
              imageURL={"/images/default-campaign-image.jpg"}
              id={fund.id?.toString() ?? "1"}
              target={fund.goal?.toString() ?? "0"}
              balance={fund.balance?.toString() ?? "0"}
              ethPrice="NA"
            />
          </div>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <div>
      <main className={styles.main}>
        <Container py={{ base: "4", md: "12" }} maxW={"7xl"}>
          <HStack spacing={2}>
            <SkeletonCircle size="4" />
            <Heading as="h2" size="lg">
              Fundraisers Created by You
            </Heading>
          </HStack>

          <Divider marginTop="4" />

          {renderContent()}
        </Container>
      </main>
    </div>
  );
};

export default FundsCreatedByMe;
