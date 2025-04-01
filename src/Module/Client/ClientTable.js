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
import "../../components/New/CustomPopupModal/CustomPopup.css"
import ClientForm from './ClientForm';
import Drawer from '../../components/Drawer/Drawer';
import ClientSingleViewCard from './ClientSingleViewCard';
import ThreeDotMenu from '../../components/ThreeDotMenu';
import { cilHandPointRight, cilPencil, cilTrash } from '@coreui/icons';
import CustomAlert from '../../components/New/CustomAlert'
import { useNavigate } from 'react-router-dom'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import PopUp from '../../components/New/PopUp'


function ClientTable({ clientdata,refreshClients }) {
  //const [fakeClientData, setFakeClientData] = useState(jsonval)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null) // Store selected client
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false);
  const [singleData, setSingleData] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClientDeleteId, setSelectedClientDeleteId] = useState(null);  
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate()


  const handleClose = () => {
    setAlerts([]);
  };
  const openModal = (client) => {
    setSelectedClient(client) 
    //setModalOpen(true)
    setIsPopoverOpen(true)
  }
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null); // Track open popover per row

  const togglePopover = (index) => {
    setOpenPopoverIndex(openPopoverIndex === index ? null : index); // Toggle popover
  };

  useEffect(() => {
    console.log("Drawer open state changed:", isDrawerOpen);
  }, [isDrawerOpen]);
  
const handlePageChange=()=>{
  return null
}

const handleCloseSingleViewPopup = () => {
  setisSingleViewPopup(false);
  //setSelectedClientId(null); // Reset client ID
};

const openViewCard =(data)=>{
  setisSingleViewPopup(true)
  console.log(JSON.stringify(data))
  setSingleData(data)

}

const openDeleteModal = (clientId) => {
  console.log("del id",clientId)
  setSelectedClientDeleteId(clientId);
  setIsDeleteModalOpen(true);
};

const closeDeleteModal = () => {
  setIsDeleteModalOpen(false);
  setSelectedClientDeleteId(null);
};
// Handle delete confirmation

const deleteClient = async () => {
  if (!selectedClientDeleteId) return;

  try {
    console.log("Attempting to delete client:", selectedClientDeleteId);
    const clientId = selectedClientDeleteId.replace(/\D/g, ""); 

    const response = await apiMethods.deleteClient(clientId);

    if (!response?.status) {
      // If API responds with { "status": false }, treat it as an error
      throw new Error(response?.message || "Failed to delete client");
    }

    console.log("Client deleted successfully:", response);

    setAlerts([{ severity: "success", message: response?.message }]);
  } catch (error) {
    console.error("Error deleting client:", error);
    
    setAlerts([
      { severity: "error", message: error?.message || "Something went wrong" }
    ]);
  } finally {
    setTimeout(() => {
      setAlerts([]);
      refreshClients();
    }, 3000);

    closeDeleteModal();
  }
};

const handleEdit = (cell) => {
  setisSingleViewPopup(false)
  setSelectedClientId(cell)
  setDrawerOpen(true)
  setOpenPopoverIndex(null)
}

  return (
    <>
          <CustomAlert alerts={alerts} handleClose={handleClose} />

      <div className="max-h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
        <div className='h-[450px]'>
        <CTable striped hover className=" w-full  m-0">
          <CTableHead className="bg-gray-100 sticky top-0 z-10">
            <CTableRow  style={{ height: "32px" }}>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" ,minWidth:"120px"}}   onClick={() => openViewCard(cell)} className="py-3 px-4 text-gray-600 font-medium">
              Id
              </CTableHeaderCell>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" ,minWidth:"190px"}}   onClick={() => openViewCard(cell)} className="py-3 px-4 text-gray-600 font-medium">
              Reference Id
              </CTableHeaderCell>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" ,minWidth:"120px"}}   onClick={() => openViewCard(cell)} className="py-3 px-4 text-gray-600 font-medium">
                Entity
              </CTableHeaderCell>
              <CTableHeaderCell style={{ whiteSpace: "nowrap",minWidth:"200px" }} className="py-3 px-4 text-gray-600 font-medium">
              Name
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
                Pan
              </CTableHeaderCell>
           
              <CTableHeaderCell
                style={{ whiteSpace: 'nowrap' }}
                className="py-3 px-4 text-gray-600 font-medium"
              >
                GST Number
              </CTableHeaderCell>

              <CTableHeaderCell style={{ whiteSpace: "nowrap" ,minWidth:"250px"}} className="py-3 px-4 text-gray-600 font-medium">
             Created Date
              </CTableHeaderCell>
              <CTableHeaderCell
                style={{ whiteSpace: 'nowrap' }}
                className="py-3 px-4 text-gray-600 font-medium"
              >
                Status
              </CTableHeaderCell>
              <CTableHeaderCell
                style={{ whiteSpace: 'nowrap' }}
                className="py-3 px-4 text-gray-600 font-medium"
              >
                Action
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody >
            {clientdata.length > 0 ? (
              clientdata.map((cell, index) => (
                <CTableRow style={{ minHeight: "100px" }} key={index} className="border-b">
                  <CTableDataCell onClick={()=>openViewCard(cell)} className="py-3 px-4 !text-blue-600 font-semibold text-decoration-underline cursor-pointer w-[150px]">
                    {cell.client_id}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700  w-[550px]">
                    {cell.client_ref_id}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700  w-[150px]">
                    {cell.entity_type}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700  w-[150px]">
                    {cell.display_name}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.email}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.mobile}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.PAN}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.gst_number}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700 w-[1000px]">
                    {/*{apiMethods.formatDate(cell.created_at)}*/}
                    {new Date(cell.created_at).toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {/*{cell.status}*/}
                    <span
                  className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                    cell.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {cell.status}
                </span>
                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'Add Sku',
                          icon: cilHandPointRight,
                          onClick: () => {
                            navigate('/SKU', {
                              state: {
                                initialRender: true,
                                clientdata: clientdata,
                                client_id: cell.client_id,
                                skipInitialFetch: true
                              },
                            })
                          },
                        },
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
        </div>

      
  
        {/* <div className="flex justify-end items-center gap-4 mt-3">
          <CommonPagination count={2} page={1} onChange={handlePageChange} />
        </div> */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth={'1280px'} title={`Edit ${selectedClientId?.entity_type}`}>
        <ClientForm refreshClientsEdit={refreshClients} closeDrawer={() => setDrawerOpen(false)} editData={selectedClientId} />
      </Drawer>

        <PopUp
          visible={isSingleViewPopup}
          setVisible={setisSingleViewPopup} 
          showCloseButton={true}
          width={'70vw'}
        >
          <ClientSingleViewCard clientData={singleData} handleEdit={handleEdit}/>
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
