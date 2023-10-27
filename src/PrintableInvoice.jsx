import React, { useRef } from 'react';
import { Button } from '@mantine/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Invoice from './Invoice';
import { AccountingEntry } from './AccountingJournalTable';

const PrintableInvoice = ({ data }: { data: AccountingEntry }) => {
  const invoiceRef = useRef(null);

  const handleExportToPDF = () => {
    const pdf = new jsPDF();

    // Capture the Invoice component as an image using html2canvas
    html2canvas(invoiceRef.current)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // PDF page width in mm
        const pageHeight = (canvas.height * imgWidth) / canvas.width;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Embed the image into the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('invoice.pdf');
      });
  };

  return (
    <div>
      <div ref={invoiceRef}>
        <Invoice data={data} />
      </div>
      <Button onClick={handleExportToPDF}>Export to PDF</Button>
    </div>
  );
};

export default PrintableInvoice;
