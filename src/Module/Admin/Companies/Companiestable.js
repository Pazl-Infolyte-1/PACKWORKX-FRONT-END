import React, { useState } from 'react';
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import ThreeDotMenu from '../../../components/ThreeDotMenu';
import DeleteModal from '../../../components/New/DeleteModal';
import ReusableTable from '../../SalesOrder/ReusableTable';
import { companyApi } from '../../../api/company';

const CompaniesTable = ({
  companiesData = [],
  packages = [],
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

  const fullColumns = [
    {
      key: 'company_name',
      header: 'Company Name',
      field: 'company_name',
    },
    {
      key: 'package',
      header: 'Package',
      field: 'package',
      type: 'custom',
      render: (row) => {
        const matchedPackage = packages.find(
          (pkg) =>
            pkg.package?.id === row.package_id || pkg.id === row.package_id
        );

        const packageName = matchedPackage
          ? matchedPackage.package?.name || matchedPackage.name
          : '-';

        const displayValue =
          packageName !== '-' && row.package_type
            ? `${packageName} / ${row.package_type}`
            : packageName !== '-'
            ? packageName
            : row.package_type || '-';

        return (
          <div className="text-left w-full">
            <div className="inline-block px-2 py-1 bg-gray-100 rounded">
              {displayValue}
            </div>
          </div>
        );
      },
    },
    {
      key: 'created_at',
      header: 'Created Date',
      field: 'created_at',
      type: 'date',
    },
    {
      key: 'last_login',
      header: 'Last Activity',
      field: 'last_login',
    },
    {
      key: 'package_end_date',
      header: 'Expiry Date',
      field: 'package_end_date',
      type: 'custom',
      render: (row) => (
        <span>
          {row.package_end_date
            ? new Date(row.package_end_date).toLocaleDateString()
            : '-'}
        </span>
      ),
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
        <div onClick={(e) => e.stopPropagation()}>
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
        </div>
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
        handleRowClick={handleViewClick}
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
