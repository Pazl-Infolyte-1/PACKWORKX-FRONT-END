

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Section = ({ title, content }) => (
  <div className="mb-6">
    <h4 className="text-md font-semibold mb-2 border-b pb-1">{title}</h4>
    <div className="space-y-1">
      {content.map(([label, value], idx) => (
        <div
          key={idx}
          className="flex justify-between text-sm border-b pb-1"
        >
          <span className="text-gray-500">{label}:</span>
          <span className="text-gray-800">{value}</span>
        </div>
      ))}
    </div>
  </div>
);

const CompaniesSingleViewCard = ({ handleEdit, handleClose, companyData }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    if (companyData) {
      setSelectedCompany(companyData);
    }
  }, [companyData]);

  if (!selectedCompany) {
    return (
      <div className="w-full p-4 rounded border bg-white">
        <p className="text-sm text-gray-500">No company selected.</p>
      </div>
    );
  }

  const statusClass =
    selectedCompany.status === 'active'
      ? 'bg-green-500'
      : 'bg-red-500';

  return (
    <div className="w-full p-6 rounded border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">{selectedCompany.company_name}</h2>
          <p className="text-sm text-gray-600">{selectedCompany.company_email}</p>
          <p className="text-sm text-gray-600">{selectedCompany.company_phone}</p>
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs text-white rounded ${statusClass}`}
          >
            {selectedCompany.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit && handleEdit(selectedCompany)}
            className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={handleClose}
            className="p-1 text-gray-500 hover:text-gray-800"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side: Details + Location */}
        <div>
          <Section
            title="Details"
            content={[
              // ✅ Removed ID
              ['Name', selectedCompany.company_name],
              ['Email', selectedCompany.company_email || '-'],
              ['Phone', selectedCompany.company_phone || '-'],
              [
                'Website',
                selectedCompany.website ? (
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {selectedCompany.website}
                  </a>
                ) : (
                  '-'
                ),
              ],
            ]}
          />

          <Section
            title="Location"
            content={[
              ['Latitude', selectedCompany.latitude || '-'],
              ['Longitude', selectedCompany.longitude || '-'],
              ['Timezone', selectedCompany.timezone || '-'],
              ['Locale', selectedCompany.locale || '-'],
            ]}
          />
        </div>

        {/* Right side: Package Details + Meta */}
        <div>
          <Section
            title="Package Details"
            content={[
              ['Type', selectedCompany.package_type || '-'],
              // Uncomment if needed:
              // [
              //   'Start Date',
              //   selectedCompany.package_start_date
              //     ? new Date(selectedCompany.package_start_date).toLocaleDateString()
              //     : '-',
              // ],
              // [
              //   'End Date',
              //   selectedCompany.package_end_date
              //     ? new Date(selectedCompany.package_end_date).toLocaleDateString()
              //     : '-',
              // ],
              // [
              //   'Features',
              //   selectedCompany.package_features?.length
              //     ? selectedCompany.package_features.join(', ')
              //     : '-',
              // ],
            ]}
          />

          <Section
            title="Meta"
            content={[
              
              ['Date Format', selectedCompany.date_format || '-'],
              ['Time Format', selectedCompany.time_format || '-'],
              [
                'Created At',
                selectedCompany.created_at
                  ? new Date(selectedCompany.created_at).toLocaleString()
                  : '-',
              ],
              [
                'Updated At',
                selectedCompany.updated_at
                  ? new Date(selectedCompany.updated_at).toLocaleString()
                  : '-',
              ],
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default CompaniesSingleViewCard;






























































