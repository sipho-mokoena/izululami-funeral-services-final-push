"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var faker_1 = require("@faker-js/faker");
var fs = require("fs");
// Define the AccountingEntry data generation function
var generateFakeData = function (numEntries) {
    var data = [];
    for (var i = 0; i < numEntries; i++) {
        var entry = {
            id: i + 1,
            payers_name: faker_1.faker.person.fullName(),
            amount: faker_1.faker.finance.amount(),
            date: faker_1.faker.date.past().toLocaleDateString(),
            email: faker_1.faker.internet.email(),
            type: Math.random() > 0.5 ? "Debit" : "Credit",
        };
        data.push(entry);
    }
    return data;
};
// Define the Rewards data generation function
var generateFakeRewards = function (numRewards) {
    var rewards = [];
    for (var i = 0; i < numRewards; i++) {
        var reward = {
            title: faker_1.faker.lorem.words(),
            description: faker_1.faker.lorem.sentence(),
            pointsRequired: faker_1.faker.number.int({ min: 0, max: 100 }),
        };
        rewards.push(reward);
    }
    return rewards;
};
// Generate and export fake data
var fakeData = {
    accountingEntries: generateFakeData(10),
    rewards: generateFakeRewards(5), // Generate 5 fake rewards
};
var serializedData = JSON.stringify(fakeData);
fs.writeFile('Data.json', serializedData, 'utf8', function () { });
