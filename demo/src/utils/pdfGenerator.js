import jsPDF from 'jspdf';

export const generateInitiativePDF = (initiative, formData, signatureDataUrl) => {
  const doc = new jsPDF();
  
  // Set up fonts and colors
  const primaryColor = [211, 47, 47]; // Swiss red #d32f2f
  const darkGray = [51, 51, 51];
  
  // Add header with Swiss cross
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('✚', 10, 15);
  doc.text('Schweizerische Eidgenossenschaft', 25, 13);
  doc.setFontSize(12);
  doc.text('Confédération suisse', 25, 18);
  
  // Reset color
  doc.setTextColor(...darkGray);
  doc.setFont('helvetica', 'normal');
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Eidgenössische Volksinitiative', 10, 35);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`«${initiative.title}»`, 10, 42);
  
  // Reference
  doc.setFontSize(10);
  doc.text(`Referenz: ${initiative.reference}`, 10, 50);
  
  // Initiative Text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Volltext der Initiative:', 10, 60);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const initiativeText = initiative.fullText;
  const splitText = doc.splitTextToSize(initiativeText, 190);
  doc.text(splitText, 10, 68);
  
  let yPosition = 68 + (splitText.length * 5);
  
  // Separator
  yPosition += 10;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(10, yPosition, 200, yPosition);
  
  // Signature Section
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Unterschrift des Bürgers / der Bürgerin:', 10, yPosition);
  
  // Form Data
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${formData.lastName.toUpperCase()}, ${formData.firstName}`, 10, yPosition);
  
  yPosition += 7;
  doc.text(`Geburtsdatum: ${formData.birthDate}`, 10, yPosition);
  
  yPosition += 7;
  doc.text(`Adresse: ${formData.address}, ${formData.postalCode} ${formData.city}`, 10, yPosition);
  
  yPosition += 7;
  doc.text(`Kanton: ${formData.canton || 'N/A'}`, 10, yPosition);
  
  yPosition += 7;
  doc.text(`Politische Gemeinde: ${formData.municipality || 'N/A'}`, 10, yPosition);
  
  // Signature Image
  yPosition += 15;
  doc.setFontSize(10);
  doc.text('Digitale Unterschrift:', 10, yPosition);
  
  if (signatureDataUrl) {
    try {
      // Add the signature image
      // Note: jsPDF needs proper image format
      const imgWidth = 60;
      const imgHeight = 30;
      doc.addImage(signatureDataUrl, 'PNG', 10, yPosition + 2, imgWidth, imgHeight);
      yPosition += imgHeight + 8;
    } catch (error) {
      console.error('Error adding signature to PDF:', error);
      doc.text('Unterschrift konnte nicht hinzugefügt werden', 10, yPosition + 2);
      yPosition += 12;
    }
  }
  
  // Date and timestamp
  yPosition += 10;
  const currentDate = new Date().toLocaleString('de-CH');
  doc.setFontSize(9);
  doc.text(`Unterschrieben am: ${currentDate}`, 10, yPosition);
  
  // Footer
  yPosition += 10;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(10, yPosition, 200, yPosition);
  
  yPosition += 8;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Bundeskanzlei BK - Digitale Unterschrift für Initiative #${initiative.id}`, 10, yPosition);
  doc.text(`Sammelfrist: bis ${initiative.collectionEnd}`, 10, yPosition + 5);
  
  return doc;
};

// Function to generate and download PDF
export const downloadInitiativePDF = (initiative, formData, signatureDataUrl) => {
  const doc = generateInitiativePDF(initiative, formData, signatureDataUrl);
  const fileName = `Initiative_${initiative.id}_${formData.lastName}.pdf`;
  doc.save(fileName);
};

// Function to generate PDF data URL for preview
export const generatePDFDataURL = (initiative, formData, signatureDataUrl) => {
  const doc = generateInitiativePDF(initiative, formData, signatureDataUrl);
  return doc.output('dataurlstring');
};

