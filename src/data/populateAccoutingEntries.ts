import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";

const supabase = createClient(
  "https://vmwzmajqhmtuvfjkczdb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtd3ptYWpxaG10dXZmamtjemRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzNjk0NTIsImV4cCI6MjAxMzk0NTQ1Mn0.LgUdiFzERf7u2kyFcDePy_FktXxbu-VVf_vALU-itxY"
);

interface AccountingEntry {
  payer: string;
  amount: number;
  date: Date;
  email: string;
  type: string;
}

function parseDate(dateString: string) {
  const dateParts = dateString.split("/");
  if (dateParts.length !== 3) {
    throw new Error("Invalid date format");
  }

  const day = parseInt(dateParts[1], 10);
  const month = parseInt(dateParts[0], 10) - 1;
  const year = parseInt(dateParts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error("Invalid date components");
  }

  return new Date(year, month, day);
}

const generateFakeAccountingEntry = (): AccountingEntry => {
  const today = new Date();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(today.getFullYear() - 2);

  // Generate a random date within the past 2 years
  const randomDate = new Date(
    twoYearsAgo.getTime() +
      Math.random() * (today.getTime() - twoYearsAgo.getTime())
  );

  // Keep track of the number of transactions for each month
  let monthlyTransactionCount: any = new Map<number, number>();

  // Calculate the year and month of the random date
  const year = randomDate.getFullYear();
  const month = randomDate.getMonth();

  // Initialize the transaction count for the month if it doesn't exist
  if (!monthlyTransactionCount.has(year * 100 + month)) {
    monthlyTransactionCount.set(year * 100 + month, 0);
  }

  const isSpecialScenario = Math.random() > 0.9; // 10% chance for a special scenario

  if (isSpecialScenario) {
    // Special scenarios: "self" payer, "finance@ifs.co" payer, "Debit" type
    return {
      payer: "COMPANY",
      amount: faker.number.int({ min: 100, max: 1000 }),
      date: parseDate(randomDate.toLocaleDateString()),
      email: "finance@ifs.co",
      type: "Debit",
    };
  } else {
    // Regular scenario: Other payers and random type (Debit or Credit)
    // Check if the monthly transaction limit is reached, and if so, reset the count
    if (monthlyTransactionCount.get(year * 100 + month) >= 15) {
      monthlyTransactionCount.set(year * 100 + month, 0);
    }

    // Increment the transaction count for the month
    monthlyTransactionCount.set(
      year * 100 + month,
      monthlyTransactionCount?.get(year * 100 + month) + 1
    );

    return {
      payer: faker.person.fullName(),
      amount: faker.number.int({ min: 100, max: 500 }),
      date: parseDate(randomDate.toLocaleDateString()),
      email: faker.internet.email(),
      type: Math.random() > 0.5 ? "Debit" : "Credit",
    };
  }
};

async function insertFakeData() {
  const numEntriesToInsert = 25; // Set the number of fake entries to insert

  const fakeData = Array.from({ length: numEntriesToInsert }, (v,k) => generateFakeAccountingEntry());

  console.log(fakeData)
  const { data, error } = await supabase
    .from('accountingentry')
    .upsert(fakeData);

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Data inserted successfully:', data);
  }
}

// Call the function to insert the data
insertFakeData();
