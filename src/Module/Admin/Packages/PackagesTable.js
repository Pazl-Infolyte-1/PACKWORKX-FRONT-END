import React, { useState } from 'react';
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import ThreeDotMenu from '../../../components/ThreeDotMenu';
import DeleteModal from '../../../components/New/DeleteModal';
import ReusableTable from '../../SalesOrder/ReusableTable';
import { companyApi } from '../../../api/company';

const PackagesTable = ({
  packagedata = [],
  handleEditPackage,
  handleViewPackage,
  setRefresh,
  isMinimized,
}) => {
  const [selectedPackageDeleteId, setSelectedPackageDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = (id) => {
    setSelectedPackageDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedPackageDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const deletePackage = async () => {
    if (!selectedPackageDeleteId) return;
    try {
      await companyApi.DeletePacakges(selectedPackageDeleteId);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error(error);
    } finally {
      closeDeleteModal();
    }
  };

  const handleViewClick = (pkg) => {
    handleViewPackage(pkg);
  };

  const fullColumns = [
    {
      key: 'name',
      header: 'Name',
      field: 'package.name',
      type: 'custom',
      render: (row) => (
        <span
          className="text-primary underline cursor-pointer text-left block"
          onClick={() => handleViewClick(row.package)}
          title="View Package Details"
        >
          {row.package.name}
        </span>
      ),
    },
    {
      key: 'features_count',
      header: 'Features count',
      field: 'package.module_in_package',
      type: 'custom',
      render: (row) => {
        const modules = row.package.module_in_package;
        const count = Array.isArray(modules) ? modules.length : 0;
        return (
          <span
            className="text-left block cursor-pointer"
            onClick={() => handleViewClick(row.package)}
            title="View Package Details"
          >
            {count}
          </span>
        );
      },
    },
    {
      key: 'monthly_price',
      header: 'Monthly Price',
      field: 'package.monthly_price',
    },
    {
      key: 'annual_price',
      header: 'Annual Price',
      field: 'package.annual_price',
    },
    {
      key: 'status',
      header: 'Status',
      field: 'package.status',
      type: 'custom',
      render: (row) => (
        <div className="text-left">
          <span
            className={`px-2.5 py-1 rounded-full text-sm font-medium ${
              row.package.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.package.status || 'Unknown'}
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
              onClick: () => handleViewClick(row.package),
            },
            {
              label: 'Edit',
              icon: cilPencil,
              onClick: () => handleEditPackage(row.package),
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => openDeleteModal(row.package.id),
            },
          ]}
        />
      ),
    },
  ];

  const minimizedColumns = [
    {
      key: 'name',
      header: 'Name',
      field: 'package.name',
      type: 'custom',
      render: (row) => (
        <span
          className="text-primary underline cursor-pointer text-left block"
          onClick={() => handleViewClick(row.package)}
          title="View Package Details"
        >
          {row.package.name}
        </span>
      ),
    },
  ];

  return (
    <>
      <ReusableTable
        columns={isMinimized ? minimizedColumns : fullColumns}
        data={packagedata}
        handleRowClick={(row) => handleViewClick(row.package)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deletePackage}
        title="Delete Confirmation"
        message="Are you sure you want to delete this package?"
      />
    </>
  );
};

export default PackagesTable;
