import React, { useState } from 'react';
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';

import ThreeDotMenu from '../../../components/ThreeDotMenu';
import apiMethods from '../../../api/config';
import Loading from '../../../components/New/Loading';

function ItemsTable({
  data = [],
  setActionDrawerOpen,
  setVersionDrawerOpen,
  handleDelete,
  handleEdit,
  handleView,
  loading,
  setRefresh
}) {
  const [alerts, setAlerts] = useState([]);

  const handleStatusChange = async (id, newStatus) => {
    console.log('Updating status for ID:', id, 'to', newStatus);

    try {
      const payload = { status: newStatus }; // change `decision` to `status` if updating item status
      const response = await apiMethods.updateItem(id, payload);
      console.log('Response:', response);
      setRefresh((prev) => !prev);

      setAlerts([
        {
          severity: 'success',
          message: response.data.message || 'Status updated successfully',
        },
      ]);
      // Ideally refetch data here
    } catch (error) {
      console.error('Failed to update status:', error);
      setAlerts([
        {
          severity: 'error',
          message:
            error?.response?.data?.message || 'Failed to update status',
        },
      ]);
    }
  };

  return (
    <div className="h-[420px] overflow-x-auto border whitespace-nowrap mt-2">
      <CTable striped hover className="border border-gray-200">
        <CTableHead className="bg-gray-100 sticky top-0 z-10">
          <CTableRow>
            <CTableHeaderCell>Product ID</CTableHeaderCell>
            <CTableHeaderCell>Reference ID</CTableHeaderCell>
            <CTableHeaderCell>Product Name</CTableHeaderCell>
            <CTableHeaderCell>UOM</CTableHeaderCell>
            <CTableHeaderCell>Category</CTableHeaderCell>
            <CTableHeaderCell>Minimum Stack</CTableHeaderCell>
            <CTableHeaderCell>Manufacturer</CTableHeaderCell>
            <CTableHeaderCell>Status</CTableHeaderCell>
            <CTableHeaderCell>Standard Cost</CTableHeaderCell>
            <CTableHeaderCell>Action</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="9" className="text-center py-5">
                <Loading isLoading={loading} />
              </CTableDataCell>
            </CTableRow>
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <CTableRow key={index}>
                <CTableDataCell
                  className="text-blue-600 font-semibold underline cursor-pointer"
                  onClick={() => handleView(row.id)}
                >
                  {row.item_generate_id || ''}
                </CTableDataCell>

                <CTableDataCell>{row.item_code || ''}</CTableDataCell>
                <CTableDataCell>{row.item_name || ''}</CTableDataCell>
                <CTableDataCell>{row.uom || ''}</CTableDataCell>
                <CTableDataCell>{row.category || ''}</CTableDataCell>
                <CTableDataCell>{row.min_stock_level || ''}</CTableDataCell>
                <CTableDataCell>{row.manufacturer || ''}</CTableDataCell>
                <CTableDataCell>
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-full text-sm font-medium outline-none border
                      ${
                        row.status === 'active'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : row.status === 'inactive'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </CTableDataCell>
                <CTableDataCell>{row.standard_cost || ''}</CTableDataCell>
                <CTableDataCell>
                  <ThreeDotMenu
                    value={[
                      {
                        label: 'View',
                        icon: cilHandPointRight,
                        onClick: () => handleView(row.id),
                      },
                      {
                        label: 'Edit',
                        icon: cilPencil,
                        onClick: () => handleEdit(row.id),
                      },
                      {
                        label: 'Delete',
                        icon: cilTrash,
                        onClick: () => handleDelete(row.id),
                      },
                    ]}
                  />
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={9} className="text-center py-3">
                No data available
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  );
}

export default ItemsTable;
