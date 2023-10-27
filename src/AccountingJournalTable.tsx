import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  TextInput,
  Paper,
  Select,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SupabaseClient } from "@supabase/supabase-js";
import PrintableInvoice from "./PrintableInvoice";

import { AccountingEntry } from "./App";

const AccountingJournalTable = ({
  accountingEntries,
  supabase,
}: {
  accountingEntries: AccountingEntry[];
  supabase: SupabaseClient;
}) => {
  const [opened, { open, close }] = useDisclosure();
  const [selectedEntry, setSelectedEntry] = useState<AccountingEntry | null>(
    null
  );

  // State to manage the input fields for adding a new transaction
  const [newEntry, setNewEntry] = useState<AccountingEntry>({
    id: 0, // You can set an appropriate default value
    payer: "",
    amount: 0,
    date: "",
    email: "",
    type: "Debit", // Set a default type or leave it empty
  });

  // State to toggle the visibility of the add transaction form
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  const handleOpenInvoice = (entry: AccountingEntry) => {
    setSelectedEntry(entry);
    open();
  };

  // Function to handle the submission of a new transaction
  const handleAddTransaction = async () => {
    // You can add validation and error handling here
    accountingEntries.push(newEntry);

    const { data, error } = await supabase
      .from("accountingentry")
      .insert([
        {
          payer: newEntry.payer,
          amount: newEntry.amount,
          date: newEntry.date,
          email: newEntry.email,
          type: newEntry.type,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error received: ", error);
    }

    setNewEntry({
      id: accountingEntries.length + 1,
      payer: "",
      amount: 0,
      date: "",
      email: "",
      type: "Debit",
    });
    setIsAddingTransaction(false);
  };

  const rows = accountingEntries.map((entry) => (
    <Table.Tr key={entry.id}>
      <Table.Td>{entry.id}</Table.Td>
      <Table.Td>{entry.payer}</Table.Td>
      <Table.Td>R{entry.amount}</Table.Td>
      <Table.Td>{entry.date}</Table.Td>
      <Table.Td>{entry.email}</Table.Td>
      <Table.Td>{entry.type}</Table.Td>
      <Table.Td>
        <Button
          variant="subtle"
          color="orange"
          onClick={() => handleOpenInvoice(entry)}
        >
          View Invoice
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      {isAddingTransaction ? (
        <Paper p="md">
          {/* Form to input transaction details */}
          <TextInput
            label="Payer's Name"
            value={newEntry.payer}
            onChange={(e) =>
              setNewEntry({ ...newEntry, payer: e.target.value })
            }
          />
          <TextInput
            label="Amount"
            value={newEntry.amount}
            onChange={(e) =>
              setNewEntry({ ...newEntry, amount: parseInt(e.target.value) })
            }
          />
          <div>
            <label>Date</label>
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) =>
                setNewEntry({ ...newEntry, date: e.target.value })
              }
            />
          </div>
          <TextInput
            label="Email"
            value={newEntry.email}
            onChange={(e) =>
              setNewEntry({ ...newEntry, email: e.target.value })
            }
          />
          <Select
            label="Type"
            placeholder="Select transaction type"
            data={["Debit", "Credit"]}
            onChange={(value: any) => setNewEntry({ ...newEntry, type: value })}
          />
          <Button
            variant="primary"
            onClick={handleAddTransaction}
            style={{ marginTop: "10px" }}
          >
            Add Transaction
          </Button>
        </Paper>
      ) : (
        <Button
          variant="primary"
          style={{ marginTop: "10px" }}
          onClick={() => setIsAddingTransaction(true)}
          mb={20}
        >
          Add Transaction
        </Button>
      )}
      <ScrollArea h={400}>
        <Table.ScrollContainer minWidth={700}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Payer's Name</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ScrollArea>
      {selectedEntry && (
        <Modal
          opened={opened}
          onClose={close}
          title={`Invoice for ${selectedEntry.email}`}
        >
          <PrintableInvoice data={selectedEntry} />
        </Modal>
      )}
    </div>
  );
};

export default AccountingJournalTable;
