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
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons'
import CustomAlert from '../../components/New/CustomAlert'
import { useNavigate } from 'react-router-dom'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import PopUp from '../../components/New/PopUp'
import { TiFlowSwitch } from 'react-icons/ti'

function ClientTable({
  clientdata,
  refreshClients,
  setIsMinimized,
  isMinimized,
  setSelectedRowData,
}) {
  //const [fakeClientData, setFakeClientData] = useState(jsonval)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null) // Store selected client
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [singleData, setSingleData] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedClientDeleteId, setSelectedClientDeleteId] = useState(null)
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

  const openDeleteModal = (clientId) => {
    console.log('del id', clientId)
    setSelectedClientDeleteId(clientId)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedClientDeleteId(null)
  }
  // Handle delete confirmation

  const deleteClient = async () => {
    if (!selectedClientDeleteId) return

    try {
      console.log('Attempting to delete client:', selectedClientDeleteId)
      //const clientId = selectedClientDeleteId.replace(/\D/g, "");

      const response = await apiMethods.deleteClient(selectedClientDeleteId)

      if (!response?.status) {
        // If API responds with { "status": false }, treat it as an error
        throw new Error(response?.message || 'Failed to delete client')
      }

      console.log('Client deleted successfully:', response)

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

  return (
    <>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className=" overflow-y-auto custom-scrollbar ">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg h-[530px]">
          <CTable hover className="w-full">
            {/* Render table headers only if not minimized */}
            {!isMinimized && (
              <CTableHead className="!bg-gray-300 sticky top-0 z-10">
                <CTableRow>
                  <CTableHeaderCell className="!w-3 !m-0">
                    <TiFlowSwitch className="rotate-90 text-blue-600" size={20} />
                  </CTableHeaderCell>
                  <CTableHeaderCell className="px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === clientdata.length}
                      onChange={handleSelectAll}
                      className="form-checkbox h-3 w-3 text-blue-600 rounded"
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-48 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Name
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-32 px-4 x-2 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Id
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-40 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Reference Id
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-52 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Email
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-36 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Phone
                  </CTableHeaderCell>
                  <CTableHeaderCell className="w-24 px-4 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
            )}

            <CTableBody>
              {clientdata.map((client) => (
                <CTableRow
                  key={client.client_id}
                  onClick={() => {
                    setIsMinimized(true)
                    setSelectedRowData(client)
                  }}
                  className={`${
                    selectedRows.includes(client.client_id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                  } border-b cursor-pointer`}
                >
                  {/* When minimized: Only render checkbox and display name */}
                  {isMinimized ? (
                    <>
                      <CTableDataCell className="px-4 py-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(client.client_id)}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleRowSelect(client.client_id)
                          }}
                          className="form-checkbox h-4 w-4 text-blue-600 rounded mb-2"
                        />
                        <div
                          onClick={(e) => {
                            openViewCard(client)
                          }}
                          className="cursor-pointer flex flex-col"
                        >
                          <span className="text-sm text-black font-semibold">
                            {client.display_name || 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500">₹ {client.opening_balance}</span>
                        </div>
                      </CTableDataCell>
                    </>
                  ) : (
                    <>
                      <CTableDataCell>{''}</CTableDataCell>
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
                      </CTableDataCell>
                      <CTableDataCell
                        onClick={(e) => {
                          //e.stopPropagation();
                          openViewCard(client)
                        }}
                        className="px-4 py-3 text-sm !text-blue-600 font-semibold"
                      >
                        {client.display_name || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell className="px-4 py-3 text-sm text-gray-900">
                        {client.client_ui_id || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell className="px-4 py-3 text-sm text-gray-500">
                        {client.client_ref_id || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell className="px-4 py-3 text-sm text-gray-500">
                        {client.email || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell className="px-4 py-3 text-sm text-gray-500">
                        {client.mobile || 'N/A'}
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
                                onClick: () => console.log('Delete', client),
                              },
                            ]}
                          />
                        </div>
                      </CTableDataCell>
                    </>
                  )}
                </CTableRow>
              ))}
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
            openDeleteModal={openDeleteModal}
          />
        </PopUp>

        <ConfirmationModale
          isOpen={isDeleteModalOpen}
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
