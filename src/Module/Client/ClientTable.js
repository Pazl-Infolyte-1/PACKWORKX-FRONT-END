import React, { useState } from 'react'
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


function ClientTable({ clientdata }) {
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null) // Store selected client
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const openModal = (client) => {
    setSelectedClient(client) 
    //setModalOpen(true)
    setIsPopoverOpen(true)
  }
  const [openPopoverIndex, setOpenPopoverIndex] = useState(null); // Track open popover per row

  const togglePopover = (index) => {
    setOpenPopoverIndex(openPopoverIndex === index ? null : index); // Toggle popover
  };



  return (
    <>
      <div className="max-h-[350px] overflow-y-auto border border-gray-200 custom-scrollbar">
        <CTable striped hover className=" w-full m-0">
          <CTableHead className="bg-gray-100 sticky top-0 ">
            <CTableRow  style={{ height: "32px" }}>
              <CTableHeaderCell style={{ whiteSpace: "nowrap" }} className="py-3 px-4 text-gray-600 font-medium">
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
                  <CTableDataCell className="py-3 px-4 text-gray-700">{cell.client_id}</CTableDataCell>
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
                  <CustomPopover isOpen={true} setIsOpen={() => setOpenPopoverIndex(null)} width="w-[150px]" height="h-[65px]"
                  >
                    {/*<p className="text-gray-800"><strong>Edit:</strong>  {cell.display_name}</p>*/}
                    <div className="flex items-center space-x-4">
  <HiOutlineEye className="w-6 h-6 text-blue-500 cursor-pointer" />
  <HiOutlinePencilAlt  
    onClick={() => {
      setSelectedClientId(cell);
      setDrawerOpen(true);
      setOpenPopoverIndex(null);
    }} 
    className="w-6 h-6 text-green-500 cursor-pointer" 
  />
  
  <HiOutlineTrash className="w-6 h-6 text-red-500 cursor-pointer" />
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
      

      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} maxWidth={'1280px'}>
        <ClientForm editData={selectedClientId} />
      </Drawer>
      </div>
    </>
  )
}

export default ClientTable
