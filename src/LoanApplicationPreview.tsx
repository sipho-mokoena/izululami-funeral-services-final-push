import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Text,
  Title,
  Table,
  Button,
  Group,
  ScrollArea,
  Loader,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SupabaseClient } from "@supabase/supabase-js";

type LoanApplication = {
  id: number;
  fullname: string;
  email: string;
  phonenumber: string;
  address: string;
  loan_amount: number;
  status: null | "approved" | "denied";
};

const LoanApplicationView = ({
  loanApplication,
  onApprove,
  onDeny,
}: {
  loanApplication: LoanApplication;
  onApprove: any;
  onDeny: any;
}) => {
  return (
    <Container size="xs" mb="xl">
      <Paper p="md" withBorder>
        <Title order={3} mb="xl">
          Loan Application Preview
        </Title>
        <Group mb="lg">
          <Text size="lg">Full Name: {loanApplication.fullname}</Text>
          <Text size="lg">Email: {loanApplication.email}</Text>
          <Text size="lg">Phone: {loanApplication.phonenumber}</Text>
          <Text size="lg">Address: {loanApplication.address}</Text>
          <Text size="lg">Loan Amount: R{loanApplication.loan_amount}</Text>
        </Group>
        <Group>
          <Button
            color="green"
            onClick={() => onApprove(loanApplication.email)}
          >
            Approve
          </Button>
          <Button color="red" onClick={() => onDeny(loanApplication.email)}>
            Deny
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};

const LoanApplicationPreview = ({ supabase }: { supabase: SupabaseClient }) => {
  const [opened, { open, close }] = useDisclosure();
  const [loanApplications, setLoanApplications] = useState<
    LoanApplication[] | any[] | null
  >();
  const [selectedLoanApplication, setSelectedLoanApplication] = useState<any>();

  const handleOpenLoanApplication = (loanApplication: LoanApplication) => {
    setSelectedLoanApplication(loanApplication);
    open();
  };

  useEffect(() => {
    supabase
      .from("loanapplication")
      .select("*")
      .then(({ data }) => {
        console.log(data);
        setLoanApplications(data);
      });
  }, []);

  const handleApprove = async (email: string) => {
    await supabase
      .from("loanapplication")
      .update({ status: "approved" })
      .eq("email", email)
      .select()
      .then((value) => {
        console.log(value);
      });

    alert("Loan application approved!");
  };

  const handleDeny = async (email: string) => {
    await supabase
      .from("loanapplication")
      .update({ status: "denied" })
      .eq("email", email)
      .select()
      .then((value) => {
        console.log(value);
      });

    alert("Loan application denied.");
  };

  const rows = (_loanApplications: LoanApplication[]) =>
    _loanApplications.map((loanApplication) => (
      <Table.Tr key={loanApplication.id}>
        <Table.Td>{loanApplication.id}</Table.Td>
        <Table.Td>{loanApplication.fullname}</Table.Td>
        <Table.Td>{loanApplication.address}</Table.Td>
        <Table.Td>{loanApplication.email}</Table.Td>
        <Table.Td>{loanApplication.phonenumber}</Table.Td>
        <Table.Td>{loanApplication.loan_amount}</Table.Td>
        <Table.Td>{loanApplication.status}</Table.Td>
        <Table.Td>
          <Button
            variant="subtle"
            color="orange"
            onClick={() => handleOpenLoanApplication(loanApplication)}
          >
            View
          </Button>
        </Table.Td>
      </Table.Tr>
    ));

  return (
    <Container size="xl">
      {loanApplications ? (
        <ScrollArea h={400}>
          <Title mb="lg" c="orange">
            Loan Applications
          </Title>
          <Table.ScrollContainer minWidth={700}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>id</Table.Th>
                  <Table.Th>fullname</Table.Th>
                  <Table.Th>address</Table.Th>
                  <Table.Th>email</Table.Th>
                  <Table.Th>phonenumber</Table.Th>
                  <Table.Th>loan_amount</Table.Th>
                  <Table.Th>status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows(loanApplications)}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </ScrollArea>
      ) : (
        <Loader color="orange" />
      )}
      {selectedLoanApplication && (
        <Modal
          opened={opened}
          onClose={close}
          title={`Loan Application for ${selectedLoanApplication.fullname}`}
        >
          <LoanApplicationView
            onApprove={handleApprove}
            onDeny={handleDeny}
            loanApplication={selectedLoanApplication}
          />
        </Modal>
      )}
    </Container>
  );
};

export default LoanApplicationPreview;
