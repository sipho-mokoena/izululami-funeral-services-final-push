import React from "react";
import { AccountingEntry } from "./App";

const Invoice = ({ data }: { data: AccountingEntry }) => {
  return (
    <div style={styles.invoice}>
      <div style={styles.header}>
        <h1>Invoice</h1>
      </div>
      <div style={styles.body}>
        <div style={styles.customerInfo}>
          <h3>Customer Information</h3>
          <p>Email: {data.email}</p>
        </div>
        <div style={styles.invoiceDetails}>
          <h3>Invoice Details</h3>
          <p>ID: {data.id}</p>
          <p>Payer's Name: {data.payer}</p>
          <p>Amount: R{data.amount}</p>
          <p>Date: {data.date}</p>
          <p>Type: {data.type}</p>
        </div>
      </div>
      <div style={styles.footer}>
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};

const styles = {
  invoice: {
    border: '1px solid #000',
    padding: '20px',
    width: '300px',
    margin: 'auto',
  },
  header: {
    borderBottom: '1px solid #000',
    marginBottom: '10px',
  },
  body: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  customerInfo: {
    flex: 1,
  },
  invoiceDetails: {
    flex: 1,
  },
  footer: {
    borderTop: '1px solid #000',
    marginTop: '10px',
    textAlign: 'center' as 'center', 
  },
};

export default Invoice;
