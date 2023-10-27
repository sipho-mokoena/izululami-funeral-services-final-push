import { useEffect, useState } from "react";
import "@mantine/core/styles.css";
import { da, faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";
import { Link, Route, RouteProps, RouterProps, Routes } from "react-router-dom";
import { Paper, Loader } from "@mantine/core";

import LoanApplicationPreview from "./LoanApplicationPreview";
import LoanApplicationTimeline from "./LoanApplicationTimeline";
import LoanApplication from "./LoanApplication";
import AccountingJournalTable from "./AccountingJournalTable";
import AccountingSummary from "./AccountingSummary";
import Rewards from "./Rewards";
import SignInForm from "./signInForm";

import Layout from "./_Layout";

const supabase = createClient(
  "https://vmwzmajqhmtuvfjkczdb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtd3ptYWpxaG10dXZmamtjemRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzNjk0NTIsImV4cCI6MjAxMzk0NTQ1Mn0.LgUdiFzERf7u2kyFcDePy_FktXxbu-VVf_vALU-itxY"
);

export interface AccountingEntry {
  id: number;
  payer: string;
  amount: number;
  date: string;
  email: string;
  type: string;
}

const generateFakeAccountingEntry = (idx: number): AccountingEntry => {
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
      id: idx,
      payer: "COMPANY",
      amount: faker.number.int({ min: 100, max: 1000 }),
      date: randomDate.toLocaleDateString(),
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
      id: idx,
      payer: faker.person.fullName(),
      amount: faker.number.int({ min: 100, max: 500 }),
      date: randomDate.toLocaleDateString(),
      email: faker.internet.email(),
      type: Math.random() > 0.5 ? "Debit" : "Credit",
    };
  }
};

const generateFakeData = (numEntries: number): AccountingEntry[] => {
  const data = [];
  for (let i = 0; i < numEntries; i++) {
    const entry: AccountingEntry = generateFakeAccountingEntry(i);
    data.push(entry);
  }
  return data;
};

export default function App(props: any) {
  return (
    <div>
      <Layout>
        <Routes>
          <Route path="/SignIn" Component={AccountingPage} />
          {/* /Admin */}
          <Route path="/Admin/Accounting" Component={AccountingPage} />
          <Route
            path="/Admin/LoanApplicationReview"
            Component={LoanApplicationReviewPage}
          />

          {/* /Customer */}
          <Route
            path="/Customer/LoanApplication"
            Component={LoanApplicationPage}
          />
          <Route
            path="/Customer/LoanApplicationTimeline"
            Component={LoanApplicationTimelinePage}
          />
          <Route path="/Customer/Rewards" Component={RewardsPage} />
        </Routes>
      </Layout>
    </div>
  );
}

const AccountingPage = () => {
  let [accountingEntries, setAccountingEntries] = useState<any>();

  useEffect(() => {
    supabase
      .from("accountingentry")
      .select("*")
      .then(({ data, error }) => {
        setAccountingEntries(data);
      });
  }, []);

  return (
    <div>
      {accountingEntries ? (
        <div>
          <Paper shadow="xs" withBorder p="xl">
            <AccountingSummary accountingEntries={accountingEntries} />
          </Paper>
          <Paper shadow="xs" withBorder p="xl">
            <AccountingJournalTable
              supabase={supabase}
              accountingEntries={accountingEntries}
            />
          </Paper>
        </div>
      ) : (
        <Loader color="orange" />
      )}
    </div>
  );
};

const LoanApplicationPage = () => (
  <div>
    <LoanApplication supabase={supabase} />
  </div>
);

const LoanApplicationTimelinePage = () => (
  <div>
    <LoanApplicationTimeline supabase={supabase} />
  </div>
);

const LoanApplicationReviewPage = () => (
  <div>
    <LoanApplicationPreview supabase={supabase} />
  </div>
);

const RewardsPage = () => (
  <div>
    <Rewards />
  </div>
);
