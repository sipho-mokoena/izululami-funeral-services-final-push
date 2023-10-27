import { faker } from "@faker-js/faker";
import * as fs from "fs";

// Define the AccountingEntry data generation function
const generateFakeData = (numEntries) => {
  let data: any = [];
  for (let i = 0; i < numEntries; i++) {
    const entry: any = {
      id: i + 1,
      payers_name: faker.person.fullName(),
      amount: faker.finance.amount(),
      date: faker.date.past().toLocaleDateString(),
      email: faker.internet.email(),
      type: Math.random() > 0.5 ? "Debit" : "Credit",
    };
    data.push(entry);
  }
  return data;
};

// Define the Rewards data generation function
const generateFakeRewards = (numRewards) => {
  const rewards: any = [];

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

// Generate and export fake data
const fakeData = {
  accountingEntries: generateFakeData(10), // Generate 10 fake accounting entries
  rewards: generateFakeRewards(5), // Generate 5 fake rewards
};

const serializedData = JSON.stringify(fakeData);
fs.writeFile('Data.json', serializedData, 'utf8', () => {});