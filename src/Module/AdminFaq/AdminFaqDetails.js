import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const AdminFAQDetails = ({ handleEdit, handleClose, faqData }) => {
  const [selectedFAQ, setSelectedFAQ] = useState(faqData || null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  useEffect(() => {
    setSelectedFAQ(faqData || null);
  }, [faqData]);

  if (!selectedFAQ) {
    return (
      <div className="w-full p-4 rounded border bg-white">
        <p className="text-sm text-gray-500">No FAQ selected.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedFAQ.question || 'Untitled FAQ'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit && handleEdit(selectedFAQ)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-gray-500 hover:text-gray-800 transition"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
          Overview
        </button>
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        <AccordionSection
          title="FAQ Info"
          isOpen={isDetailsOpen}
          toggle={() => setIsDetailsOpen(!isDetailsOpen)}
          content={[
            ['Question', selectedFAQ.question || '-'],
            ['Answer', selectedFAQ.answer || '-'],
            ['Category', selectedFAQ.category || '-'],
            [
              'Created At',
              selectedFAQ.created_at
                ? new Date(selectedFAQ.created_at).toLocaleDateString()
                : '-',
            ],
          ]}
        />
      </div>
    </div>
  );
};

const AccordionSection = ({ title, isOpen, toggle, content }) => (
  <div className="pb-3">
    <div
      onClick={toggle}
      className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
    >
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </div>
    {isOpen && (
      <div className="py-2 text-sm text-gray-800 space-y-2">
        {content.map(([label, value]) => (
          <div className="flex justify-between items-start" key={label}>
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-right max-w-[70%]">
              {typeof value === 'string' && value.length > 80
                ? (
                    <div className="text-left whitespace-pre-wrap">
                      {value}
                    </div>
                  )
                : value}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default AdminFAQDetails;
