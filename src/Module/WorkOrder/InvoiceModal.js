import React, { useEffect } from 'react'
import { invoiceApi } from '../../api/Invoice';

function InvoiceModal({ isOpen, invoice, setIsOpen,invoiceID }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!invoice&&invoiceID) return;

    // const element = document.getElementById('invoice-content');
    // const opt = {
    //     margin:       0.5,
    //     filename:     `Invoice_${invoice?.invoice_number || 'download'}.pdf`,
    //     image:        { type: 'jpeg', quality: 0.98 },
    //     html2canvas:  { scale: 2 },
    //     jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    // };
    // html2pdf().set(opt).from(element).save();
        try {
          const response = await invoiceApi.downloadInvoice(invoiceID)
          console.log(response)
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `INV-00${invoiceID}.pdf`
          link.click()
          URL.revokeObjectURL(url)
        } catch (error) {
          console.error('Error downloading PDF:', error)
        }
      

};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
          >
            Download
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {invoice ? (
          <div dangerouslySetInnerHTML={{ __html: invoice }} />
        ) : (
          <div className="text-center text-gray-500">No invoice data available.</div>
        )}
      </div>
    </div>
  );
}

export default InvoiceModal