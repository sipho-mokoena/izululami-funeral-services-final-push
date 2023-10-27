import React, { useState, useEffect } from "react";
import { Container, Paper, TextInput, Title, Button } from "@mantine/core";
import { faker } from "@faker-js/faker";
import { SupabaseClient } from "@supabase/supabase-js";

const LoanApplication = ({ supabase }: { supabase: SupabaseClient }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    address: "",
    loan_amount: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Here, you can process the loan application data, e.g., send it to a server.

    // For demonstration purposes, we'll just display the data in the console.
    const { data, error } = await supabase
      .from("loanapplication")
      .insert([
        {
          fullname: formData.fullname,
          email: formData.email,
          phonenumber: formData.phonenumber,
          address: formData.address,
          loan_amount: parseInt(formData.loan_amount),
        },
      ])
      .select();

      if(error) alert("You already have a loan application in review.")

    console.log(formData);
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  };

  return (
    <Container w="full" h="full" p="xl">
      <Paper shadow="xs" p="xl">
        <Title order={3} mb="xl">
          Loan Application Form
        </Title>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            required
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <TextInput
            label="Phone Number"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleInputChange}
            required
          />
          <TextInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
          <TextInput
            label="Loan Amount"
            name="loan_amount"
            type="number"
            value={formData.loan_amount}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" variant="filled" color="orange" mt="lg">
            Submit Application
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoanApplication;
