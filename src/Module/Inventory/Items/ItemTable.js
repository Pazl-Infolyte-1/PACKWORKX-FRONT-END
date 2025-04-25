import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import ThreeDotMenu from '../../../components/ThreeDotMenu';
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
import React from 'react';
import Loading from '../../../components/New/Loading';

function ItemsTable({ data = [], setActionDrawerOpen, setVersionDrawerOpen, handleDelete, handleEdit, handleView, loading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="h-[80%]">
      <div className="overflow-x-auto h-[350px] border whitespace-nowrap mt-3">
        <CTable striped hover className="border border-gray-200">
          <CTableHead className="bg-gray-100 sticky top-0 z-10">
            <CTableRow>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">Item Code</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">Item Name</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">UOM</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-3 text-gray-600 font-medium">HSN Code</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-3 text-gray-600 font-medium">Category</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">Minimum Stack</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">Manufacturer</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-3 text-gray-600 font-medium">Standard Cost</CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          {loading ? (
            <tbody>
              <tr>
                <td colSpan="9" className="text-center py-5">
                  <Loading isLoading={loading} />
                </td>
              </tr>
            </tbody>
          ) : (
            <CTableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <CTableRow key={index} className="border-b">
                    <CTableDataCell className="py-3 px-4 text-gray-700">{row.item_code || ''}</CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">{row.item_name || ''}</CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">{row.uom || ''}</CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">{row.hsn_code || ''}</CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">{row.category || ''}</CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">{row.min_stock_level || ''}</CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">{row.manufacturer || ''}</CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">{row.standard_cost || ''}</CTableDataCell>
                    <CTableDataCell>
                      <ThreeDotMenu
                        value={[
                          {
                            label: 'View',
                            icon: cilHandPointRight,
                            onClick: () => handleView(row.item_id),
                          },
                          {
                            label: 'Edit',
                            icon: cilPencil,
                            onClick: () => handleEdit(row.item_id),
                          },
                          {
                            label: 'Delete',
                            icon: cilTrash,
                            onClick: () => handleDelete(row.item_id),
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
          )}
        </CTable>
      </div>
    </div>
  );
}

export default ItemsTable;
