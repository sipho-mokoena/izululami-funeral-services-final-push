import {
  Text,
  SimpleGrid,
  Paper,
  Group,
} from "@mantine/core";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import { AccountingEntry } from "./App"; // Import your AccountingEntry type

const icons: any = {
  up: IconArrowUpRight,
  down: IconArrowDownRight,
};
// Calculate summary data from accountingEntries
export function AccountingSummary({
  accountingEntries,
}: {
  accountingEntries: AccountingEntry[];
}) {
  const summaryData = [
    {
      label: "Total Profits",
      stats: accountingEntries
        .filter((entry) => entry.type === "Debit")
        .reduce((acc, entry) => acc + entry.amount, 0)
        .toFixed(2),
      color: "teal",
      icon: "up",
    },
    {
      label: "Total Expenses",
      stats: accountingEntries
        .filter((entry) => entry.type === "Credit")
        .reduce((acc, entry) => acc + entry.amount, 0)
        .toFixed(2),
      color: "red",
      icon: "up",
    },
    // Add more summary data as needed
  ];

  const stats = summaryData.map((stat) => {
    const Icon: any = icons[stat.icon];
    return (
      <Paper withBorder radius="md" p="xs" key={stat.label} bg={stat.color}>
        <Group>
          <div>
            <Text c="white" size="xs" tt="uppercase" fw={700}>
              {stat.label}
            </Text>
            <Text c="white" fw={700} size="xl">
              {stat.stats}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>;
}

export default AccountingSummary;
