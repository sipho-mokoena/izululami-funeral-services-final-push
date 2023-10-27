import React from "react";
import { Card, Divider, Text, Title, Badge } from "@mantine/core";
import { faker } from "@faker-js/faker";

const generateFakeRewards = (numRewards: number) => {
  const rewards = [];

  for (let i = 0; i < numRewards; i++) {
    const reward = {
      title: faker.lorem.words(),
      description: faker.lorem.sentence(),
      pointsRequired: faker.number.int({ min: 0, max: 100 }),
    };

    rewards.push(reward);
  }

  return rewards;
};

// Usage: Generate 5 fake rewards
const fakeRewardsData = generateFakeRewards(5);

const Reward = ({ title, description, pointsRequired }: any) => (
  <Card shadow="xs" style={{ marginBottom: "20px" }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ flex: 1 }}>
        <Text size="xl">{title}</Text>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </div>
      <div>
        <Badge color="teal" size="sm">
          {pointsRequired} Points
        </Badge>
      </div>
    </div>
  </Card>
);

const Rewards = ({ points }: { points: number }) => (
  <div>
    <div>
      <Title size="lg">Eligible Rewards</Title>
      {fakeRewardsData.map((reward: any, index: number) => {
        if (parseInt(reward.pointsRequired) < points)
          return (
            <Reward
              key={index}
              title={reward.title}
              description={reward.description}
              pointsRequired={reward.pointsRequired}
            />
          );
      })}
    </div>
    <Divider my="sm" variant="dashed" />
    <Title size="lg">Other Rewards</Title>
    {fakeRewardsData.map((reward: any, index: number) => (
      <Reward
        key={index}
        title={reward.title}
        description={reward.description}
        pointsRequired={reward.pointsRequired}
      />
    ))}
  </div>
);

const Points = ({ points }: { points: number }) => (
  <div>
    <Text size="xl">Your Points:</Text>
    <Badge color="orange" size="lg" style={{ marginTop: "10px" }}>
      {points} Points
    </Badge>
  </div>
);

const RewardsView = () => (
  <div>
    <Points points={30} />
    <Rewards points={30}/>
  </div>
);

export default RewardsView;
