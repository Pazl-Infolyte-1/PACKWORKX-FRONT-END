




import React, { useState } from 'react';
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import ThreeDotMenu from '../../../components/ThreeDotMenu';
import DeleteModal from '../../../components/New/DeleteModal';
import ReusableTable from '../../SalesOrder/ReusableTable';
import { companyApi } from '../../../api/company';

const CompaniesTable = ({
  companiesData = [],
  handleEditCompany,
  handleViewCompany,
  setRefresh,
  isMinimized,
}) => {
  const [selectedCompanyDeleteId, setSelectedCompanyDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = (companyId) => {
    setSelectedCompanyDeleteId(companyId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedCompanyDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const deleteCompany = async () => {
    if (!selectedCompanyDeleteId) return;

    try {
      await companyApi.deleteCompany(selectedCompanyDeleteId);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error);
    } finally {
      closeDeleteModal();
    }
  };

  const handleViewClick = (company) => {
    handleViewCompany(company);
  };

  // ✅ Full columns with Expiry Date added
  const fullColumns = [
    {
      key: 'company_name',
      header: 'Company Name',
      field: 'company_name',
    },
    { key: 'package_type', header: 'Package', field: 'package_type' },
    { key: 'created_at', header: 'Created Date', field: 'created_at', type: 'date' },
    { key: 'last_login', header: 'Last Activity', field: 'last_login' },
    {
      key: 'expiry_date',
      header: 'Expiry Date',
      field: 'expiry_date',
      type: 'date',
    },
    {
      key: 'status',
      header: 'Status',
      field: 'status',
      type: 'custom',
      render: (row) => (
        <div className="text-left">
          <span
            className={`px-2.5 py-1 rounded-full text-sm font-medium ${
              row.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.status || 'Unknown'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            {
              label: 'View',
              icon: cilHandPointRight,
              onClick: () => handleViewClick(row),
            },
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => handleEditCompany(row),
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => openDeleteModal(row.id),
            },
          ]}
        />
      ),
    },
  ];

  const minimizedColumns = [
    {
      key: 'company_name',
      header: 'Company Name',
      field: 'company_name',
    },
  ];

  return (
    <>
      <ReusableTable
        columns={isMinimized ? minimizedColumns : fullColumns}
        data={companiesData}
        // ✅ This makes the entire row clickable except actions
        handleRowClick={(row) => handleViewClick(row)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteCompany}
        title="Delete Confirmation"
        message="Are you sure you want to delete this company?"
      />
    </>
  );
};

export default CompaniesTable;





