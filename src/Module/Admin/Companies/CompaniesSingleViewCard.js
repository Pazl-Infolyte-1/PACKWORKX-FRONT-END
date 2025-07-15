import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { companyApi } from '../../../api/company';
import CustomAlert from '../../../components/New/CustomAlert';

// Editable Modal Form Component
const PaymentLinkModal = ({ show, setAlerts,onClose, billId, initialAmount, initialEmail }) => {
  const [form, setForm] = useState({
    amount: initialAmount || '',
    emailOrMobileNumber: initialEmail || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
    }
  }, [show]);

  useEffect(() => {
    setForm({
      amount: initialAmount || '',
      emailOrMobileNumber: initialEmail || '',
    });
  }, [initialAmount, initialEmail, show]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await companyApi.createBillingPaymentLink({
        bill_id: billId,
        emailOrMobileNumber: form.emailOrMobileNumber,
        amount: form.amount,
      });
      
      // Check if response is successful
      if (response && response.data && response.data.success) {
        setAlerts([{ severity: "success", message: "Payment Link Sent Successfully" }]).
        // Success - close modal
        handleClose();
      } else {
        // Not successful - show error and don't close
        setAlerts([{ severity: "error", message: "Unable To Sent Payment link" }]).

        console.error('Payment link creation failed:', response);
        alert('Failed to create payment link. Please try again.');
      }
    } catch (error) {
      // Handle error - show error and don't close
      setAlerts([{ severity: "error", message: "unable to send paymentLink" }]).
      console.error('Payment link creation error:', error);
      alert('Error creating payment link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-md bg-white/10">

      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 mt-[6%] transition-all duration-200 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Send Payment Link</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email or Mobile Number</label>
            <input
              type="text"
              name="emailOrMobileNumber"
              value={form.emailOrMobileNumber}
              onChange={handleChange}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
              disabled={isSubmitting}
            >Cancel</button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Payment Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ExpiryFormModal = ({ show, onClose,setAlerts, initialData, onBillingCreated }) => {
  const [form, setForm] = useState(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
    }
  }, [show]);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, show]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await companyApi.createCompanyBilling(form);
      
      // Check if response is successful
      if (res && res.data && res.data.success && res.data.data) {
        // Success - pass bill id, amount, and email to parent
        if (onBillingCreated) {
          onBillingCreated({
            billId: res.data.data.id,
            amount: res.data.data.amount,
            email: res.data.data.contact_email,
          });
        }
      setAlerts([{ severity: "success", message: "Bill Created Successfully" }])

      } else {
        // Not successful - show error and don't close
      setAlerts([{ severity: "error", message: "unable to create bill" }]).

        console.error('Billing creation failed:', res);
        // setError('Failed to create billing. Please try again.');
      }
    } catch (err) {
      // Handle error - show error and don't close
      setAlerts([{ severity: "error", message: "unable to create bill" }]).
      console.error('Billing creation error:', err);
      // setError('Error creating billing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center backdrop-blur-md bg-white/10">
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 mt-[6%] transition-all duration-200 ease-out ${
          isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Package Expiry Action</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}
    
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              name="company_name"
              value={form.company_name || ''}
              onChange={handleChange}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Package Name</label>
            <input
              type="text"
              name="package_name"
              value={form.package_name || ''}
              onChange={handleChange}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount || ''}
              onChange={handleChange}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={form.contact_email || ''}
              onChange={handleChange}
              className="w-full h-8 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
            >Cancel</button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



const Section = ({ title, content }) => (
  <div className="mb-6">
    <h4 className="text-md font-semibold mb-2 border-b pb-1">{title}</h4>
    <div className="space-y-1">
      {content.map(([label, value], idx) => (
        <div key={idx} className="flex justify-between text-sm border-b pb-1">
          <span className="text-gray-500">{label}:</span>
          <span className="text-gray-800">{value}</span>
        </div>
      ))}
    </div>
  </div>
);

const CompaniesSingleViewCard = ({ handleEdit, handleClose, companyData, packages }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [packageName, setPackageName] = useState('-');
  const [packageAmount, setPackageAmount] = useState('');
  const [alerts,setAlerts] = useState([])


  const handleCloseAlert = ()=>{
    setAlerts([])
}
  

  // Popup state
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState({ billId: '', amount: '', email: '' });

  const handleExpiryButtonClick = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);
  const handlePaymentModalClose = () => setShowPaymentModal(false);

  // When billing is created, open payment modal
  const handleBillingCreated = ({ billId, amount, email }) => {
    setShowModal(false);
    setPaymentModalData({ billId, amount, email });
    setShowPaymentModal(true);
  };

  // Prepare autofill data
  const autofillData = selectedCompany ? {
    company_id: selectedCompany.id || '',
    company_name: selectedCompany.company_name || '',
    package_name: packageName || '',
    amount: packageAmount || '',
    contact_email: selectedCompany.company_email || '',
  } : {};

  useEffect(() => {
    if (companyData) {
      setSelectedCompany(companyData);

      // ✅ Package name logic
      if (companyData.package && companyData.package.name) {
        setPackageName(companyData.package.name);
      } else if (packages && packages.length > 0 && companyData.package_id) {
        const matchedPackage = packages.find(
          (pkg) =>
            pkg.package?.id === companyData.package_id || pkg.id === companyData.package_id
        );
        setPackageName(
          matchedPackage
            ? matchedPackage.package?.name || matchedPackage.name
            : '-'
        );
      } else {
        setPackageName('-');
      }
    } else {
      setSelectedCompany(null);
      setPackageName('-');
    }
  }, [companyData, packages]);

  // Fetch package amount when selectedCompany changes
  useEffect(() => {
    const fetchPackageAmount = async () => {
      if (selectedCompany && selectedCompany.package_id) {
        try {
          const res = await companyApi.getPackages();
          // Find the matching package by ID
          const allPackages = res?.data?.data || [];
          const matched = allPackages.find(
            (pkgObj) => pkgObj.package?.id === selectedCompany.package_id
          );
          let amount = '';
          if (matched && matched.package) {
            if (
              (selectedCompany.package_type || '').toLowerCase() === 'annual'
            ) {
              amount = matched.package.annual_price;
            } else {
              amount = matched.package.monthly_price;
            }
          }
          setPackageAmount(amount || '');
        } catch (e) {
          setPackageAmount('');
        }
      } else {
        setPackageAmount('');
      }
    };
    fetchPackageAmount();
  }, [selectedCompany]);

  if (!selectedCompany) {
    return (
      <div className="w-full p-4 rounded border bg-white">
        <p className="text-sm text-gray-500">No company selected.</p>
      </div>
    );
  }

  // Calculate days left until package_end_date
  let daysLeft = null;
  if (selectedCompany.package_end_date) {
    const endDate = new Date(selectedCompany.package_end_date);
    // const today = new Date(); // Use real today
    const today = new Date('2026-07-03'); // For testing, fixed date (YYYY-MM-DD)
    // Zero out time for accurate day diff
    endDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffTime = endDate - today;
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const statusClass =
    selectedCompany.status === 'active' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="w-full p-6 relative rounded border bg-white overflow-hidden">
                  <CustomAlert
              alerts={alerts}
              handleClose={handleCloseAlert}
            />
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-1">
            {selectedCompany.company_name}
          </h2>
          <p className="text-sm text-gray-600">{selectedCompany.company_email}</p>
          <p className="text-sm text-gray-600">{selectedCompany.company_phone}</p>
          <span
            className={`inline-block mt-2 px-2 py-1 text-xs text-white rounded ${statusClass}`}
          >
            {selectedCompany.status}
          </span>
                </div>
        <div className="flex items-center gap-2">
          {/* Show button if 5 days or less left and end date is in the future */}
          {daysLeft !== null && daysLeft <= 5 && daysLeft >= 0 && (
            <button
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors shadow-sm"
              title="Generate billing for package renewal"
              onClick={handleExpiryButtonClick}
            >
              Generate Bill
            </button>
          )}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Section
            title="Details"
            content={[
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

        <div>
          <Section
            title="Package Details"
            content={[
              ['Package Name', packageName],
              ['Type', selectedCompany.package_type || '-'],
              [
                'Start Date',
                selectedCompany.package_start_date
                  ? new Date(selectedCompany.package_start_date).toLocaleDateString()
                  : '-',
              ],
              [
                'End Date',
                selectedCompany.package_end_date
                  ? new Date(selectedCompany.package_end_date).toLocaleDateString()
                  : '-',
              ],
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

      {/* Expiry Modal Form */}
      <ExpiryFormModal show={showModal} onClose={handleModalClose} initialData={autofillData} setAlerts={setAlerts} onBillingCreated={handleBillingCreated} />
      {/* Payment Link Modal */}
      <PaymentLinkModal show={showPaymentModal} onClose={handlePaymentModalClose} billId={paymentModalData.billId} setAlerts={setAlerts} initialAmount={paymentModalData.amount} initialEmail={paymentModalData.email} />
    </div>
  );
};

export default CompaniesSingleViewCard;
