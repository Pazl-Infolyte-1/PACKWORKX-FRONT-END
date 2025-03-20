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
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { HiOutlineEye } from "react-icons/hi"; // View Icon
import { HiOutlinePencilAlt } from "react-icons/hi"; 
import apiMethods from '../../api/config'
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup'
import "../../components/New/CustomPopupModal/CustomPopup.css"
import ClientForm from './ClientForm';
import Drawer from '../../components/Drawer/Drawer';
import CustomPopover from '../../components/New/CustomPopover';
import { HiOutlineTrash } from "react-icons/hi";
import CommonPagination from '../../components/New/Pagination';
import ClientSingleViewCard from './ClientSingleViewCard';

function ClientTable({ clientdata,refreshClients }) {
  //const [fakeClientData, setFakeClientData] = useState(jsonval)
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null) // Store selected client
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false);
  const [singleData, setSingleData] = useState(null)

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

const deleteClient = async (clientId) => {
  try {
    const response = await apiMethods.deleteClient(clientId);
    console.log("Client deleted successfully:", response);
    refreshClients()
    // Optionally, refresh the client list or show a success message
  } catch (error) {
    console.error("Error deleting client:", error);
  }
};

  return (
    <>
      <div className="max-h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
        <CTable striped hover className=" w-full m-0">
          <CTableHead className="bg-gray-100 sticky top-0 ">
            <CTableRow  style={{ height: "32px" }}>
              <CTableHeaderCell    onClick={() => handleOpenSingleViewPopup(cell.client_id)}  style={{ whiteSpace: "nowrap" }} className="py-3 px-4 text-gray-600 font-medium">
              Id
              </CTableHeaderCell>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" }} className="py-3 px-4 text-gray-600 font-medium">
              Name
              </CTableHeaderCell>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" }} className="py-3 px-4 text-gray-600 font-medium">
              Email
              </CTableHeaderCell>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" }} className="py-3 px-4 text-gray-600 font-medium">
              Mobile Number
              </CTableHeaderCell>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" }} className="py-3 px-4 text-gray-600 font-medium">
              Pan
              </CTableHeaderCell>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" }} className="py-3 px-4 text-gray-600 font-medium">
             Created Date
              </CTableHeaderCell>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" }} className="py-3 px-4 text-gray-600 font-medium">
              Portal Language
              </CTableHeaderCell>
             
              <CTableHeaderCell style={{ whiteSpace: "nowrap" }} className="py-3 px-4 text-gray-600 font-medium">
                Action 
              </CTableHeaderCell>

            </CTableRow>
          </CTableHead>

          <CTableBody>
            {clientdata.length > 0 ? (
              clientdata.map((cell, index) => (
                <CTableRow key={index} className="border-b">
<CTableDataCell onClick={()=>openViewCard(cell)} className="py-3 px-4 text-primary text-decoration-underline cursor-pointer">
  {cell.client_id}
</CTableDataCell>

                  <CTableDataCell className="py-3 px-4 text-gray-700">
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
                    {/*{apiMethods.formatDate(cell.created_at)}*/}
                    {new Date(cell.created_at).toLocaleString()}

                  </CTableDataCell>
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    {cell.portal_language}
                  </CTableDataCell>
                 
                  <CTableDataCell className="py-3 px-4 text-gray-700">
                    <CButton onClick={() => togglePopover(index)}>
                      <HiOutlineDotsVertical  />
                     
                    </CButton>
                    {openPopoverIndex === index && (
                  <CustomPopover isOpen={true} setIsOpen={() => setOpenPopoverIndex(null)} width="w-[100px]" height="h-[65px]"
                  >
                    {/*<p className="text-gray-800"><strong>Edit:</strong>  {cell.display_name}</p>*/}
                    <div className="flex items-center space-x-4">
  {/*<HiOutlineEye className="w-6 h-6 text-blue-500 cursor-pointer" />*/}
  <HiOutlinePencilAlt  
    onClick={() => {
      setSelectedClientId(cell);
      setDrawerOpen(true);
      setOpenPopoverIndex(null);
    }} 
    className="w-6 h-6 text-green-500 cursor-pointer" 
  />
  
  <HiOutlineTrash className="w-6 h-6 text-red-500 cursor-pointer"   onClick={() => deleteClient(cell.client_id)} 
 />
</div>


                    {/*<button onClick={() => setOpenPopoverIndex(null)} className="text-red-500 text-sm">
                      Closexsds
                    </button>*/}
                  </CustomPopover>
                )}
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
      
  
        {/*<div className="flex justify-end items-center gap-4 mt-3">
          <CommonPagination count={2} page={1} onChange={handlePageChange} />
        </div>*/}
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth={'1280px'}>
        <ClientForm refreshClientsEdit={refreshClients} closeDrawer={() => setDrawerOpen(false)} editData={selectedClientId} />
      </Drawer>

      <CustomPopup isOpen={isSingleViewPopup} onClose={handleCloseSingleViewPopup} width={"w-[900px]"} height={"480px"}>
        <ClientSingleViewCard clientData={singleData} />
      </CustomPopup>
      </div>
    </>
  )
}

export default ClientTable
