import { useState } from 'react'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilPencil, cilTrash } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { billingApi } from '../../api/billing'

const BillingTable = ({ billingdata, refreshBilling, isMinimized, setSingleStatusUpdate }) => {
  const [alerts, setAlerts] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({ open: false, id: null })
  const [selectedRows, setSelectedRows] = useState([])
  const navigate = useNavigate()
  const handleClose = () => {
    setAlerts([])
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen({ open: false, id: null })
  }

  const deleteBilling = async () => {
    try {
      await billingApi.deleteBill(isDeleteModalOpen.id)
      closeDeleteModal()
      setAlerts([{ severity: 'success', message: 'Bill deleted successfully' }])
      navigate('/billingmain')
      // Optionally refresh the list
      refreshBilling()
    } catch (error) {
      setAlerts([{ severity: 'error', message: error.response?.data?.message || 'Delete failed' }])
    }
  }

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className=" overflow-y-auto custom-scrollbar ">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg h-[calc(82vh-74px)]">
          <CTable hover className="w-full">
            {/* Render table headers only if not minimized */}
            {!isMinimized && (
              <CTableHead className="!bg-gray-300 sticky top-0 z-10">
                <CTableRow>
                  <CTableHeaderCell className="w-48 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Bill Id<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  {/* <CTableHeaderCell className="w-48 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    PO ID<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell> */}
                  <CTableHeaderCell className="w-40 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Supplier
                  </CTableHeaderCell>

                  <CTableHeaderCell className="w-32 px-4 x-2 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Reference Number
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-40 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Bill Date
                  </CTableHeaderCell>

                  <CTableHeaderCell className="w-52 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Remarks<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-36 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Status
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-24 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
            )}

            <CTableBody>
              {billingdata?.length > 0 ? (
                billingdata?.map((bill) => (
                  <CTableRow
                    key={bill?.id}
                    onClick={() => navigate(`/billingmain/${bill.id}`)}
                    className={`${
                      selectedRows.includes(bill?.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                    } border-b cursor-pointer`}
                  >
                    {/* When minimized: Only render checkbox and display name */}
                    {isMinimized ? (
                      <>
                        <CTableDataCell className="px-4 border-none py-3 flex items-center gap-2">
                          <div
                            onClick={(e) => {
                              //  openViewCard(client)
                            }}
                            className="cursor-pointer flex flex-col"
                          >
                            <span className="text-sm text-black font-semibold">
                              {bill?.bill_generate_id || 'N/A'}
                            </span>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {bill?.purchaseOrder?.purchase_generate_id || 'N/A'}
                        </CTableDataCell>
                      </>
                    ) : (
                      <>
                        <CTableDataCell
                          onClick={(e) => {
                            //openViewCard(client)
                          }}
                          className="px-4 py-3 text-sm !text-blue-600 font-semibold  whitespace-nowrap"
                        >
                          {bill?.bill_generate_id || 'N/A'}
                        </CTableDataCell>
                        {/* <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {bill?.purchase_order_id || 'N/A'}
                        </CTableDataCell> */}
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {bill?.purchaseOrder?.supplier_name || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {bill?.bill_reference_number || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {bill?.bill_date || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {bill?.remarks || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium 
                            ${
                              bill.status?.toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }
                          `}
                          >
                            {bill.status || 'N/A'}
                          </span>
                        </CTableDataCell>

                        <CTableDataCell className="px-4 py-3">
                          <div onClick={(e) => e.stopPropagation()}>
                            <ThreeDotMenu
                              value={[
                                {
                                  label: 'Edit',
                                  icon: cilPencil,
                                  onClick: () => {
                                    navigate('/billingmain/billingmainForm', { state: { bill } })
                                  },
                                },
                                {
                                  label: 'Delete',
                                  icon: cilTrash,
                                  onClick: () =>
                                    setIsDeleteModalOpen({
                                      open: true,
                                      id: bill.id,
                                    }),
                                },
                              ]}
                            />
                          </div>
                        </CTableDataCell>
                      </>
                    )}
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan={isMinimized ? 2 : 8}
                    className="text-center text-sm !text-red-600  py-3"
                  >
                    No Data Found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        {/*<Drawer
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          maxWidth={'1280px'}
          title={`Edit ${selectedClientId?.entity_type}`}
        >
          <ClientForm
            refreshClientsEdit={refreshClients}
            closeDrawer={() => setDrawerOpen(false)}
            editData={selectedClientId}
          />
        </Drawer>*/}

        {/*<PopUp
          visible={isSingleViewPopup}
          setVisible={setisSingleViewPopup}
          showCloseButton={true}
          width={'70vw'}
        >
          <ClientSingleViewCard
            clientData={singleData}
            handleEdit={handleEdit}
          />
        </PopUp>*/}

        <ConfirmationModale
          isOpen={isDeleteModalOpen.open}
          onClose={closeDeleteModal}
          onConfirm={deleteBilling}
          title="Delete Confirmation"
          message="Are you sure you want to delete this item?"
        />
      </div>
    </>
  )
}

export default BillingTable
