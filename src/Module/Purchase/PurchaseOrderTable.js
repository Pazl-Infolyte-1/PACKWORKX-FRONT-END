import React, { useState, useEffect } from 'react'
import {
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
} from '@coreui/react'
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import apiMethods from '../../api/config'
import PurchaseOrderDetails from './PurchaseOrderDetails'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'

function PurchaseOrderTable({ data=[], handleDelete, handleEdit, handleView, handlePurchaseDetails, loading, setRefresh }) {
  const [showPopUp, setShowPopUp] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [poData, setPoData] = useState([])
  const [grnValidationMap, setGrnValidationMap] = useState({}) // ✅ for per-row validation
const [expandedRowId, setExpandedRowId] = useState(null);
const [itemData, setItemData] = useState([]); // State to hold item data

const openItemDetails = (id) => {
  setExpandedRowId((prevId) => (prevId === id ? null : id));
};
// getItemData
const getItemData = async () => {
  try {
    const response = await apiMethods.getItemList();
    const productData = response || [];
    console.log('Fetched Item Data:', productData);
    setItemData(productData);
    
  }
  catch (error) {
    console.error('Error fetching Purchase Order data:', error);
  }
}
useEffect(() => {
  getItemData();
}, []);



const handleGrnCheck = async () => {
  try {
    const response = await apiMethods.getGrn();
    const grnData = response?.data?.data || [];

    const poReturn = await apiMethods.getPurchaseReturn();
    const poReturnData = [
      ...(poReturn?.data?.approved || []),
      ...(poReturn?.data?.disapproved || []),
    ];

    const map = {};

    data.forEach((row) => {
      const hasGrn = grnData.some(grn => grn.po_id === row.id);
      const matchingPor = poReturnData.find(por => por.po_id === row.id);

      let status = 'Created';

      if (matchingPor) {
        status = Number(row.total_amount) === Number(matchingPor.total_amount)
          ? 'Returned'
          : 'Amendment';
      } else if (hasGrn) {
        status = 'Received';
      }

      map[row.id] = status;
    });

    setGrnValidationMap(map);
  } catch (error) {
    console.error('Error fetching GRN or Purchase Return data:', error);
  }
};





  useEffect(() => {
    if (data?.length > 0) {
      handleGrnCheck()
    }
  }, [data])

  const handlePoDelete = async () => {
    if (!deleteId) {
      setAlerts([{ severity: 'warning', message: 'No Purchase Order selected to delete.' }])
      return
    }

    try {
      await apiMethods.deletePurchaseOrder(deleteId)
      setPoData(prev => prev.filter(po => po.id !== deleteId))
      setAlerts([{ severity: 'success', message: 'Purchase Order deleted successfully!' }])
      setTimeout(() => { window.location.reload() }, 100)
    } catch (error) {
      setAlerts([{ severity: 'error', message: 'Failed to delete Purchase Order.' }])
    } finally {
      setDeleteModal(false)
    }
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setDeleteModal(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      // hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    })
  }

  const handleCloseAlert = () => {
    setAlerts([])
  }



const handleStatusChange = async (id, newStatus) => {

  const currentPo = data.find(po => po.id === id); // get full PO data
  const payload = {
    decision: newStatus,
    items: currentPo.items || [] // send existing items back
  };

  try {
    const response = await apiMethods.updatePurchaseOrder(id, payload);
    setAlerts([{ severity: 'success', message: response.data.message }]);
          setRefresh((prev) => !prev);

  } catch (error) {
    console.error('Error:', error);
    setAlerts([{ severity: 'error', message: error?.response?.data?.message || 'Failed to update status' }]);
  }
};


  return (
    <div className="h-[400px] overflow-x-auto border whitespace-nowrap mt-2">
      <CustomAlert alerts={alerts} handleClose={handleCloseAlert} />
      <CTable striped hover className="w-full m-0">
        <CTableHead className="bg-gray-100 sticky top-0 z-10">
          <CTableRow className="text-center">
            {['Purchase Order ID', 'Supplier Name', 'Supplier Contact', 'PO Date', 'Valid Till', 'Status', 'Decision', 'Payment Terms', 'Action'].map(header => (
              <CTableHeaderCell key={header} className="py-3 px-4 text-gray-600 font-medium">{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <CTableRow key={row.id} className="border-b text-center">
                <CTableDataCell
                  onClick={() => setShowPopUp(row.id)}
                  className="py-3 px-4 !text-blue-600 font-semibold cursor-pointer underline text-start"
                >
                  {row.purchase_generate_id}
                </CTableDataCell>
                {/* <CTableDataCell className="py-3 px-4 text-gray-700 cursor-pointer text-blue-600" onClick={() => openItemDetails(row.id)}> ℹ️ </CTableDataCell> */}
                <CTableDataCell className="py-3 px-4 text-gray-700">{row.supplier_name}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">{row.supplier_contact}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700 text-start">{formatDate(row.po_date)}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">{formatDate(row.valid_till)}</CTableDataCell>
               
               
                <CTableDataCell className="py-3 px-4 text-gray-700">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold 
                      ${grnValidationMap[row.id] === 'Created' ? 'bg-blue-100 text-blue-800' : ''}
                      ${grnValidationMap[row.id] === 'Received' ? 'bg-green-100 text-green-800' : ''}
                      ${grnValidationMap[row.id] === 'Returned' ? 'bg-red-100 text-red-800' : ''}`}
                  >
                  
                    {grnValidationMap[row.id] || 'Created'}
                  </span>
                
                </CTableDataCell>
                
                <CTableDataCell className="py-3 px-4 text-gray-700 align-middle">
                  <select
                    value={row.decision}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-full text-sm font-medium outline-none border 
                      ${
                        row.decision === 'approve'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : row.decision === 'disapprove'
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      }`}
                  >
                    <option className="text-gray-700 bg-white" value="approve">
                      Approved
                    </option>
                    <option className="text-gray-700 bg-white" value="disapprove">
                      Rejected
                    </option>
                  </select>
                </CTableDataCell>

                {/* <CTableDataCell className="py-3 px-4 text-gray-700">{row.decision}</CTableDataCell> */}
                <CTableDataCell className="py-3 px-4 text-gray-700">{row.payment_terms}</CTableDataCell>
                <CTableDataCell className="py-3 px-4 text-gray-700">
                  <ThreeDotMenu
                        value={[
                          { label: 'View', icon: cilHandPointRight, onClick: () => setShowPopUp(row.id) },
                          
                          ...(grnValidationMap[row.id] === 'Created' ? [
                            { label: 'Edit', icon: cilPencil, onClick: () => handleEdit(row.id) },
                            { label: 'Delete', icon: cilTrash, onClick: () => openDeleteModal(row.id) },
                          ] : []),

                          ...(grnValidationMap[row.id] === 'Received' ? [
                            { label: 'Purchase Return', icon: cilPencil, onClick: () => handlePurchaseDetails(row.id) },
                          ] : []),
                        ]}
                      />
                </CTableDataCell>

                {/* Popups */}
                {showPopUp === row.id && (
                  <PurchaseOrderDetails
                    showPopUp={showPopUp}
                    cell={row}
                    editTag={false}
                    setShowPopUp={setShowPopUp}
                    handleEdit={handleEdit}
                  />
                )}



{/* expandedRow */}
                {/* {expandedRowId === row.id && (
                <CTableRow className="bg-gray-50">
                  <CTableDataCell colSpan={10} className="py-3 px-4 text-left">
                    <div className="text-sm text-gray-800">
                      <strong>Item Details:</strong>
                      <ul className="list-disc list-inside mt-2">
                        {row.supplier_name?.length > 0 ? (
                          row.items.map((item, index) => (
                            <li key={index}>
                              {item.supplier_name} - Qty: {item.supplier_name} - Price: {item.supplier_name}
                            </li>
                          ))
                        ) : (
                          <li>No items available</li>
                        )}
                      </ul>
                    </div>
                  </CTableDataCell>
                </CTableRow>
                )} */}
{/* expandedRow */}




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

      {/* Delete Modal (placed once outside loop) */}
      <ConfirmationModale
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handlePoDelete}
        title="Delete Confirmation"
        message="Are you sure you want to delete this PO?"
      />
    </div>
  )
}

export default PurchaseOrderTable
