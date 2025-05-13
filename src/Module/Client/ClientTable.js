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

function ClientTable({ clientdata, refreshClients }) {
  //const [fakeClientData, setFakeClientData] = useState(jsonval)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null) // Store selected client
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
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
  const openModal = (client) => {
    setSelectedClient(client)
    //setModalOpen(true)
    setIsPopoverOpen(true)
  }
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null) // Track open popover per row

  const togglePopover = (index) => {
    setOpenPopoverIndex(openPopoverIndex === index ? null : index) // Toggle popover
  }

  useEffect(() => {
    console.log('Drawer open state changed:', isDrawerOpen)
  }, [isDrawerOpen])

  const handlePageChange = () => {
    return null
  }

  const handleCloseSingleViewPopup = () => {
    setisSingleViewPopup(false)
    //setSelectedClientId(null); // Reset client ID
  }

  const openViewCard = (data) => {
    setisSingleViewPopup(true)
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
    setOpenPopoverIndex(null)
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
        {/* <div className="">
          <CTable striped hover className=" w-full  m-0">
            <CTableHead className="bg-gray-100 sticky top-0 z-10">
              <CTableRow style={{ height: '32px' }}>
                <CTableHeaderCell
                  style={{ whiteSpace: 'nowrap', minWidth: '120px' }}
                  onClick={() => openViewCard(cell)}
                  className="py-3 px-4 text-gray-600 font-medium"
                >
                  Id
                </CTableHeaderCell>
                <CTableHeaderCell
                  style={{ whiteSpace: 'nowrap', minWidth: '190px' }}
                  onClick={() => openViewCard(cell)}
                  className="py-3 px-4 text-gray-600 font-medium"
                >
                  Reference Id
                </CTableHeaderCell>
                <CTableHeaderCell
                  style={{ whiteSpace: 'nowrap' }}
                  className="py-3 px-4 text-gray-600 font-medium"
                >
                  Email
                </CTableHeaderCell>
                <CTableHeaderCell
                  style={{ whiteSpace: 'nowrap' }}
                  className="py-3 px-4 text-gray-600 font-medium"
                >
                  Mobile Number
                </CTableHeaderCell>
                <CTableHeaderCell
                  style={{ whiteSpace: 'nowrap' }}
                  className="py-3 px-4 text-gray-600 font-medium"
                >
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {clientdata.length > 0 ? (
                clientdata.map((cell, index) => (
                  <CTableRow style={{ minHeight: '100px' }} key={index} className="border-b">
                    <CTableDataCell
                      onClick={() => openViewCard(cell)}
                      className="py-3 px-4 !text-blue-600 font-semibold text-decoration-underline cursor-pointer w-[150px]"
                    >
                      {cell.client_ui_id}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {cell.client_ref_id}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {cell.email}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      {cell.mobile}
                    </CTableDataCell>
                    <CTableDataCell className="py-3 px-4 text-gray-700">
                      <ThreeDotMenu
                        value={[
                          {
                            label: 'Edit',
                            icon: cilPencil,
                            onClick: () => {
                              handleEdit(cell)
                            },
                          },
                          {
                            label: 'Delete',
                            icon: cilTrash,
                            onClick: () => {
                              openDeleteModal(cell?.client_id)
                            },
                          },
                        ]}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={10} className="text-center py-3">
                    No data available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div> */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
          <CTable hover className="w-full">
            <CTableHead className="!bg-gray-300 sticky top-0 z-10">
              <CTableRow>
                <CTableHeaderCell className='!w-3 !m-0 '>
                  <TiFlowSwitch className=" rotate-90 text-blue-600" size={20} />
                </CTableHeaderCell>
                <CTableHeaderCell className="px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === clientdata.length}
                    onChange={handleSelectAll}
                    className="form-checkbox h-3 w-3 text-blue-600 rounded"
                  />
                </CTableHeaderCell>
                <CTableHeaderCell className="px-2 text-xs !font-bold !text-gray-500 uppercase tracking-wider ">
                  Name
                </CTableHeaderCell>
                <CTableHeaderCell className="px-2 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                  Id
                </CTableHeaderCell>
                <CTableHeaderCell className="px-2 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                  Reference Id
                </CTableHeaderCell>

                <CTableHeaderCell className="px-2 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                  Email
                </CTableHeaderCell>
                <CTableHeaderCell className="px-2 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                  Phone
                </CTableHeaderCell>

                <CTableHeaderCell className="px-2 text-xs !font-bold !text-gray-500 uppercase tracking-wider">
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {clientdata.map((client, index) => (
                <CTableRow
                  key={client.client_id}
                  className={`
                ${selectedRows.includes(client.client_id) ? 'bg-blue-50' : 'hover:bg-gray-50'}
                border-b
              `}
                >
                  <CTableDataCell>{''}</CTableDataCell>
                  <CTableDataCell className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(client.client_id)}
                      onChange={() => handleRowSelect(client.client_id)}
                      className="form-checkbox h-3 w-3 text-blue-600 rounded"
                    />
                  </CTableDataCell>
                  <CTableDataCell
                    onClick={() => openViewCard(cell)}
                    className="px-4 py-3 text-sm !text-blue-600 font-semibold "
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
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          onClick: () => {
                            // Implement edit logic
                            console.log('Edit', client)
                          },
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: () => {
                            // Implement delete logic
                            console.log('Delete', client)
                          },
                        },
                      ]}
                    />
                  </CTableDataCell>
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
