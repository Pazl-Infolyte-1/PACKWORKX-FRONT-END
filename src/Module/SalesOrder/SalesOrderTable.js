import React, { useEffect, useState } from 'react'
import {
  cilHandPointRight,
  cilPencil,
  cilTrash,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import Loading from '../../components/New/Loading'
import ReusableTable from './ReusableTable'

function SalesOrderTable({
  data: initialData,
  setActionDrawerOpen,
  setVersionDrawerOpen,
  handleDelete,
  handleEdit,
  handleView,
  loading,
  handleStatusChange,
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const [data, setData] = useState([]);


  useEffect(() => {
    const updatedData = initialData.map((item) => ({
      ...item,
      isSelected: item.isSelected ?? false,
    }));
    setData(updatedData);
  }, [initialData]);

  const columns = [
    
    {
      key: 'select',
      field: 'isSelected',
      header: '', // empty header for checkbox column
      type: 'checkbox',
    },
      { key: 'sales_generate_id-', header: 'Sales ID', field: 'sales_generate_id' },  
      { key: 'client', header: 'Client', field: 'client' },
      { key: 'skuCount', header: 'No of SKU', type:"custom" ,render: (row) => row.SalesSkuDetails?.length || 0, },
      { key: 'estimated', header: 'Expected Delivery Date', type:"date", field: 'estimated'  },
      { key: 'created_at', header: 'Created Date', field: 'created_at',type:"date" },
      {
        key: 'sales_status',
        header: 'Sales Status',
        field: 'sales_status',
        type: 'dropdown',
        options: ['Pending', 'In-progress', 'Completed', 'Rejected'],
        getOptionClass: (val) => {
          switch (val) {
            case 'Pending':
              return 'bg-yellow-100 text-yellow-800 w-[120px]';
            case 'In-progress':
              return 'bg-blue-100 text-blue-800 w-[120px]';
            case 'Completed':
              return 'bg-green-100 text-green-800 w-[120px]';
            case 'Rejected':
              return 'bg-red-100 text-red-800 w-[120px]';
            default:
              return 'bg-gray-100 text-gray-800 w-[120px]';
          }
        },
        onChange: (row, newValue) => {
          handleStatusChange(row.id, newValue)
        }
      },
      {
        key: 'actions',
        header: 'action',
        field: 'actions',
        type: 'custom',
        render: (row) => (
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
                onClick: () => handleEdit(row.id, row.user_id),
              },
              {
                label: 'Delete',
                icon: cilTrash,
                onClick: () => handleDelete(row.id),
              },
            ]}
          />
        ),
      },   
  ]

  const handleCheckboxChange = (row, field, isChecked) => {
    const updatedData = data.map((item) =>
      item.id === row.id ? { ...item, [field]: isChecked } : item
    );
    setData(updatedData);
  };
  const handleSelectAllCheckboxes = (field, isChecked) => {
    const updatedData = data.map((item) => ({
      ...item,
      [field]: isChecked,
    }));
    setData(updatedData);
  };
  




  return (
    <>
    <ReusableTable
    columns={columns}
    data={data}
    onCheckboxChange={handleCheckboxChange}
    onSelectAllChange={handleSelectAllCheckboxes}
    />
    </>
  )
}

export default SalesOrderTable



{/* <div className="h-[80%]">
<div className="overflow-x-auto h-[380px] border whitespace-nowrap mt-3">
  <CTable striped hover className="border border-gray-200">
    <CTableHead className="bg-gray-100 sticky top-0 z-10">
      <CTableRow>
        <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
          Sales ID
        </CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
          Client <span className="text-gray-500">⌕</span>
        </CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
          No of SKU <span className="text-gray-500">⌕</span>
        </CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
          Expected Delivery Date
        </CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
          Created Date
        </CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
          Sales Status
        </CTableHeaderCell>
        <CTableHeaderCell className="py-3 px-4 text-gray-600 font-medium">
          Action
        </CTableHeaderCell>
      </CTableRow>
    </CTableHead>

    <CTableBody>
      {loading ? (
        <CTableRow>
          <CTableDataCell colSpan={8} className="text-center py-6">
            <Loading isLoading={loading} />
          </CTableDataCell>
        </CTableRow>
      ) : data?.length > 0 ? (
        data.map((row, index) => (
          <CTableRow key={index} className="border-b">
            <CTableDataCell
              onClick={() => handleView(row.id)}
              className="py-3 px-2 !text-[#8761e5] font-semibold cursor-pointer underline text-start"
              >
              {row.sales_generate_id}
            </CTableDataCell>

            <CTableDataCell className="py-3 px-4 text-gray-700">
              {row.client || '—'}
            </CTableDataCell>

            <CTableDataCell className="py-3 px-4 text-gray-700">
                {row.SalesSkuDetails?.length || 0}
            </CTableDataCell>

            <CTableDataCell className="py-3 px-4 text-gray-700">
              {formatDate(row.estimated)}
            </CTableDataCell>

            <CTableDataCell className="py-3 px-4 text-gray-700">
              {formatDate(row.created_at)}
            </CTableDataCell>

            <CTableDataCell className="py-3 px-4 text-gray-700">
              <select
                value={row.sales_status || ""}
                onChange={(e) => handleStatusChange(row.id, e.target.value)}
                className={`px-2.5 py-1 rounded-full text-sm font-medium outline-none border border-gray-300
                  ${row.sales_status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : row.sales_status === "In-progress"
                      ? "bg-blue-100 text-blue-800"
                      : row.sales_status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : row.sales_status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
              >
                <option className="text-gray-700 bg-white" value="Pending">Pending</option>
                <option className="text-gray-700 bg-white" value="In-progress">In-progress</option>
                <option className="text-gray-700 bg-white" value="Completed">Completed</option>
                <option className="text-gray-700 bg-white" value="Rejected">Rejected</option>
              </select>
            </CTableDataCell>

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
                    onClick: () => handleEdit(row.id, row.user_id),
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
          <CTableDataCell colSpan={8} className="text-center py-3">
            No data available
          </CTableDataCell>
        </CTableRow>
      )}
    </CTableBody>
  </CTable>
</div>
</div> */}