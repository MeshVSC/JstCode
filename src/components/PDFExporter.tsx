'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PDFExporterProps {
  previewRef: React.RefObject<HTMLDivElement | null>;
  filename: string;
}

export default function PDFExporter({ previewRef, filename }: PDFExporterProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      
      const pdfFilename = filename.replace(/\.(tsx|ts|jsx|js)$/, '.pdf');
      pdf.save(pdfFilename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={isExporting || !previewRef.current}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
    >
      {isExporting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          Exporting...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Export PDF
        </>
      )}
    </button>
  );
}