
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const PackagesDetails = ({ handleEdit, handleClose, packageData }) => {
  const [selectedPackage, setSelectedPackage] = useState(packageData || null);
  const [isOpenDetails, setIsOpenDetails] = useState(true);
  const [isOpenLimits, setIsOpenLimits] = useState(true);
  const [isModulesOpen, setIsModulesOpen] = useState(true);

  useEffect(() => {
    setSelectedPackage(packageData || null);
  }, [packageData]);

  if (!selectedPackage) {
    return (
      <div className="w-full p-4 rounded border bg-white">
        <p className="text-sm text-gray-500">No package selected.</p>
      </div>
    );
  }

  const statusClass =
    selectedPackage.status === 'active' ? 'bg-green-500' : 'bg-red-500';

  // Always show rupee symbol
  const currencySymbol = '₹';

  return (
    <div className="w-full p-4 rounded border bg-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {selectedPackage.name || 'Untitled Package'}
          </h3>
          <p
            className={`text-white text-sm font-medium px-2 rounded ${statusClass}`}
          >
            {selectedPackage.status}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit && handleEdit(selectedPackage)}
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

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Details & Limits */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
          <AccordionSection
            title="Details"
            isOpen={isOpenDetails}
            toggle={() => setIsOpenDetails(!isOpenDetails)}
            content={[
              // ✅ Removed ID & Currency ID
              ['Name', selectedPackage.name || '-'],
              ['Description', selectedPackage.description || '-'],
              [
                'Monthly Price',
                selectedPackage.monthly_price
                  ? `${currencySymbol}${selectedPackage.monthly_price}`
                  : '-',
              ],
              [
                'Annual Price',
                selectedPackage.annual_price
                  ? `${currencySymbol}${selectedPackage.annual_price}`
                  : '-',
              ],
              // ['Billing Cycle', selectedPackage.billing_cycle || '-'],
              ['Sort Order', selectedPackage.sort || '-'],
            ]}
          />

          <AccordionSection
            title="Limits"
            isOpen={isOpenLimits}
            toggle={() => setIsOpenLimits(!isOpenLimits)}
            content={[
              ['Max Employees', selectedPackage.max_employees || '-'],
              [
                'Max Storage Size',
                selectedPackage.max_storage_size
                  ? `${selectedPackage.max_storage_size} ${
                      selectedPackage.storage_unit || ''
                    }`
                  : '-',
              ],
              // ['Max File Size', selectedPackage.max_file_size || '-'],
            ]}
          />
        </div>

        {/* RIGHT: Modules Section */}
        <div className="border rounded p-4 bg-gray-50 h-fit">
          <div
            className="flex justify-between items-center cursor-pointer border-b pb-1 mb-2"
            onClick={() => setIsModulesOpen(!isModulesOpen)}
          >
            <h4 className="text-sm font-semibold text-gray-700">
              Modules in Package
            </h4>
            {isModulesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {isModulesOpen ? (
            Array.isArray(selectedPackage.module_in_package) &&
            selectedPackage.module_in_package.length > 0 ? (
              <div className="h-60 overflow-y-auto border rounded bg-white p-2">
                <ul className="space-y-1">
                  {selectedPackage.module_in_package.map((mod, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-800 border-b last:border-b-0 py-1"
                    >
                      {mod}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No modules found.</p>
            )
          ) : (
            <p className="text-xs text-gray-600">
              Total modules: {selectedPackage.module_in_package?.length || 0}
            </p>
          )}
        </div>
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
          <div className="flex justify-between" key={label}>
            <span className="text-gray-600">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default PackagesDetails;

