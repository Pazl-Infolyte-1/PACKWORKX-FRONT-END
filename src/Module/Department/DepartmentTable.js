import React from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash } from '@coreui/icons';
import Loading from '../../components/New/Loading';

function DepartmentTable({ departments, loading, onEdit, onDelete }) {
  if (!departments) departments = [];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="h-[500px] overflow-y-auto border border-gray-200 custom-scrollbar">
        <CTable striped hover className="w-full">
          <CTableHead className="bg-gray-100 sticky top-0 z-10">
            <CTableRow>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                ID
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Department Name
              </CTableHeaderCell>
              {/* <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Parent Department
              </CTableHeaderCell> */}
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
                Created Date
              </CTableHeaderCell>
              <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium text-center">
                Actions
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <Loading isLoading={loading} />
                </td>
              </tr>
            ) : departments.length > 0 ? (
              departments.map((department) => (
                <CTableRow key={department.id} className="border-b">
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {department.id}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {department.department_name}
                  </CTableDataCell>
                  {/* <CTableDataCell className="py-3 px-4 text-gray-700">
                    {department.parent_id ? `ID: ${department.parent_id}` : 'None'}
                  </CTableDataCell> */}
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {formatDate(department.created_at)}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    <div className="flex items-center justify-center space-x-3">
                      <button 
                        onClick={() => onEdit(department.id)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <CIcon icon={cilPencil} size="sm" />
                      </button>
                      <button 
                        onClick={() => onDelete(department.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <CIcon icon={cilTrash} size="sm" />
                      </button>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={5} className="text-center py-3">
                  No departments available
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    </div>
  );
}

export default DepartmentTable;