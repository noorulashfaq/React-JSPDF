import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import download from "./download.jfif";

const PDFTable = () => {
  const [industries, setIndustries] = useState([]);

  // Fetch data from json-server
  useEffect(() => {
    fetch("http://localhost:5000/industries")
      .then((response) => response.json())
      .then((data) => setIndustries(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const generatePDF = () => {
    //     // Document of 210mm wide and 297mm high
    // new jsPDF('p', 'mm', [297, 210]);
    // // Document of 297mm wide and 210mm high
    // new jsPDF('l', 'mm', [297, 210]);
    // // Document of 5 inch width and 3 inch high
    // new jsPDF('l', 'in', [3, 5]);
    const doc = new jsPDF();

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);

    doc.text("REPORT 2024", 80, 15);
    doc.setFontSize(10);

    doc.text("Industry Report", 105, 30, { align: "center" });

    // Table headers
    let yPosition = 50; // Vertical position
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    // Define column positions
    const col1X = 20; // Industry column
    const col2X = 80; // CEO column
    const col3X = 140; // Info column

    doc.text("Industry", col1X, yPosition);
    doc.text("CEO", col2X, yPosition);
    doc.text("Info", col3X, yPosition);

    // Draw header line
    doc.line(15, yPosition + 10, 190, yPosition + 10); // Top border for the table

    // Table rows
    yPosition += 10; // Move to the next row
    doc.setFont("helvetica", "normal");

    industries.forEach((industry) => {
      // Add row data
      doc.text(industry.name, col1X, yPosition + 10);
      doc.text(industry.ceo, col2X, yPosition + 10);
      doc.text(industry.info, col3X, yPosition + 10, { maxWidth: 50 });

      yPosition += 10; // Move to the next row

      // Add a new page if necessary
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 30;

        // Add table headers again on new page
        doc.setFont("helvetica", "bold");
        doc.text("Industry", col1X, yPosition + 10);
        doc.text("CEO", col2X, yPosition + 10);
        doc.text("Info", col3X, yPosition + 10);
        doc.line(15, yPosition + 10 + 2, 190, yPosition + 10 + 2); // Header line
        yPosition += 20;
      }
    });

    // Draw table borders
    const bottomY = yPosition - 2; // Bottom border position
    doc.line(15, 35, 15, bottomY + 10); // Left border
    doc.line(190, 35, 190, bottomY + 10); // Right border
    doc.line(15, 35, 190, 35); // Top border
    doc.line(15, bottomY + 10, 190, bottomY + 10); // Bottom border

    // Add vertical column lines
    doc.line(70, 35, 70, bottomY + 10); // First column line
    doc.line(130, 35, 130, bottomY + 10); // Second column line

    // Add an image to the PDF
    doc.addImage(download, "PNG", 10, 120, 50, 20);

    // Open the PDF in a new tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Generate PDF</h1>
      {industries.length === 0 ? (
        <p>Loading data...</p>
      ) : (
        <button onClick={generatePDF} style={{ padding: "10px 20px" }}>
          Generate PDF
        </button>
      )}
    </div>
  );
};

export default PDFTable;
