import React, { useEffect, useState } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import apiMethods from '../../api/config'
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup'
import '../../components/New/CustomPopupModal/CustomPopup.css'
import ClientForm from './ClientForm'
import Drawer from '../../components/Drawer/Drawer'
import ClientSingleViewCard from './ClientSingleViewCard'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilBan, cilCheckCircle, cilHandPointRight, cilPencil, cilPowerStandby, cilTrash } from '@coreui/icons'
import CustomAlert from '../../components/New/CustomAlert'
import { useNavigate } from 'react-router-dom'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import PopUp from '../../components/New/PopUp'
import { TiFlowSwitch } from 'react-icons/ti'

function ClientTable({ clientdata, refreshClients, isMinimized,setSingleStatusUpdate }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [singleData, setSingleData] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({ open: false, id: null })
  const [selectedRows, setSelectedRows] = useState([])
  const [alerts, setAlerts] = useState([])
  const navigate = useNavigate()
  const handleClose = () => {
    setAlerts([])
  }

  const openViewCard = (data) => {
    //setisSingleViewPopup(true)
    console.log(JSON.stringify(data))
    setSingleData(data)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen({ open: false, id: null })
  }
  // Handle delete confirmation

  const deleteClient = async () => {
    if (!isDeleteModalOpen.id) return

    try {
      const response = await apiMethods.deleteClient(isDeleteModalOpen.id)
      if (!response?.status) {
        throw new Error(response?.message || 'Failed to delete client')
      }

      setAlerts([{ severity: 'success', message: response?.message }])
    } catch (error) {
      console.error('Error deleting client:', error)

      setAlerts([{ severity: 'error', message: error?.message || 'Something went wrong' }])
    } finally {
      setTimeout(() => {
        setAlerts([])
        refreshClients()
      }, 3000)

      closeDeleteModal()
      refreshClients()
    }
  }

  const handleEdit = (cell) => {
    setisSingleViewPopup(false)
    setSelectedClientId(cell)
    setDrawerOpen(true)
  }

  const handleRowSelect = (clientId) => {
    setSelectedRows((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId],
    )
  }

  const handleSelectAll = () => {
    if (selectedRows.length === clientdata.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(clientdata.map((client) => client.client_id))
    }
  }

const handleStatusChange = async (clientId, newStatus) => {
  try {
const response = await apiMethods.clientStatusSwitch(newStatus, clientId)
    console.log('✅ Status update response:', response)    // Optionally refetch or update local state here
    setSingleStatusUpdate(response.data.status)
  } catch (error) {
    console.error('Status update failed:', error)
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
                  {/* <CTableHeaderCell className="!w-3 !m-0">
                    <TiFlowSwitch className="rotate-90 text-blue-600" size={20} />
                  </CTableHeaderCell>
                  <CTableHeaderCell className="px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === clientdata.length}
                      onChange={handleSelectAll}
                      className="form-checkbox h-3 w-3 text-blue-600 rounded"
                    />
                  </CTableHeaderCell> */}
                  <CTableHeaderCell className="w-48 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Name<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-32 px-4 x-2 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                  Id<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-40 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                Reference Id<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-52 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                  Email<span className="text-gray-500 ml-1">⌕</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-36 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                  Phone<span className="text-gray-500 ml-1">⌕</span>
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
              {clientdata.length > 0 ? (
                clientdata.map((client) => (
                  <CTableRow
                    key={client.client_id}
                    onClick={() => navigate(`/clients/${client.client_id}`)}
                    className={`${
                      selectedRows.includes(client.client_id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                    } border-b cursor-pointer`}
                  >
                    {/* When minimized: Only render checkbox and display name */}
                    {isMinimized ? (
                      <>
                        <CTableDataCell className="px-4 py-3 flex items-center gap-2">
                          {/* <input
                            type="checkbox"
                            checked={selectedRows.includes(client.client_id)}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleRowSelect(client.client_id)
                            }}
                            className="form-checkbox h-4 w-4 text-blue-600 rounded mb-2"
                          /> */}
                          <div
                            onClick={(e) => {
                              openViewCard(client)
                            }}
                            className="cursor-pointer flex flex-col"
                          >
                            <span className="text-sm text-black font-semibold">
                              {client.display_name || 'N/A'}
                            </span>
                            <span className="text-xs text-gray-500">
                              ₹ {client.opening_balance}
                            </span>
                          </div>
                        </CTableDataCell>
                      </>
                    ) : (
                      <>
                        {/* <CTableDataCell>{''}</CTableDataCell>
                        <CTableDataCell className="px-4 py-3">
                          <div onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(client.client_id)}
                              onChange={(e) => {
                                e.stopPropagation()
                                handleRowSelect(client.client_id)
                              }}
                              className="form-checkbox h-3 w-3 text-blue-600 rounded"
                            />
                          </div>
                        </CTableDataCell> */}
                        <CTableDataCell
                          onClick={(e) => {
                            //e.stopPropagation();
                            openViewCard(client)
                          }}
                          className="px-4 py-3 text-sm !text-blue-600 font-semibold  whitespace-nowrap"
                        >
                          {client.display_name || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {client.client_ui_id || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {client.client_ref_id || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {client.email || 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                          {client.mobile || 'N/A'}
                        </CTableDataCell>
        <CTableDataCell className="px-4 py-3 text-sm">
          {/*<select
  value={client.status === 'active' || client.status === 'inactive' ? client.status : ''}
  onClick={(e) => e.stopPropagation()}
  onChange={(e) => handleStatusChange(client.client_id, e.target.value)}
  className={`border border-gray-300 rounded-2xl px-1 py-1 text-sm bold
    ${client.status === 'inactive' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`}
>
  <option value="" disabled hidden>Select Status</option>
  <option value="active">active</option>
  <option value="inactive">In active</option>
</select>*/}
  <span
    className={`inline-block text-center px-2 py-1 rounded-full text-xs font-semibold w-[70px] ${
      client.status === 'active'
        ? 'bg-green-100 text-green-800'
        : client.status === 'inactive'
        ? 'bg-red-100 text-red-800'
        : 'bg-gray-100 text-gray-800'
    }`}
  >
    {client.status}
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
                                    console.log('Edit', client)
                                    navigate('/clients/clientForm', { state: { client } })
                                  },
                                },
                                {
                                  label: 'Delete',
                                  icon: cilTrash,
                                  onClick: () => setIsDeleteModalOpen({
                                    open: true,
                                    id: client.client_id,
                                  }),
                                },
                            {
      label: client.status === 'active' ? 'Set Inactive' : 'Set Active',
      icon: client.status === 'active' ? cilBan : cilCheckCircle,
      onClick: () => handleStatusChange(
        client.client_id,
        client.status === 'active' ? 'inactive' : 'active'
      ),
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
                  <CTableDataCell colSpan={isMinimized ? 2 : 8} className="text-center text-sm !text-red-600  py-3">
                    No Data Found
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        <Drawer
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
        </Drawer>

        <PopUp
          visible={isSingleViewPopup}
          setVisible={setisSingleViewPopup}
          showCloseButton={true}
          width={'70vw'}
        >
          <ClientSingleViewCard
            clientData={singleData}
            handleEdit={handleEdit}
          />
        </PopUp>

        <ConfirmationModale
          isOpen={isDeleteModalOpen.open}
          onClose={closeDeleteModal}
          onConfirm={deleteClient}
          title="Delete Confirmation"
          message="Are you sure you want to delete this item?"
        />
      </div>
    </>
  )
}

export default ClientTable
