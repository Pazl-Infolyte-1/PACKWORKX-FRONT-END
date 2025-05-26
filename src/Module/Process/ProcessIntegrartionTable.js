import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'
import apiMethods from '../../api/config'
import ConfirmationModale from '../../components/New/ConfirmationModale'
import CustomAlert from '../../components/New/CustomAlert'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { cilFlipToBack, cilHandPointRight, cilPencil, cilPlus, cilTrash } from '@coreui/icons'
import ReusableTable from '../SalesOrder/ReusableTable'

function ProcessIntegrartionTable({
  processData,
  setProcessData,
  handleEditProcess,
  alerts,
  setAlerts,
  handleClose,
  processValues,
  setOpenProcessModal,
  setOpenFieldModal,
  setOpenValuesModal,
}) {
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const handleDelete = async () => {
    try {
      const response = await apiMethods.deleteProcess(deleteId)
      if (response.status === 200) {
        setConfirmModal(false)
        setProcessData((prev) => prev.filter((item) => item.id !== deleteId))
        setAlerts([{ severity: 'success', message: 'Process deleted successfully!' }])
      }
    } catch (error) {
      console.error(error)
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Failed to delete process',
        },
      ])
    } finally {
      setConfirmModal(false)
    }
  }

  const closeDeleteModal = () => {
    setConfirmModal(false)
  }

  const openDeleteModal = (id) => {
    setDeleteId(id)
    setConfirmModal(true)
  }

  const columns = [
    { key: 'process_generate_id', header: 'ID', field: 'process_generate_id' },
    {
      key: 'process_name',
      header: (
        <>
          Process Name <span className="text-gray-500">⌕</span>
        </>
      ),
      field: 'process_name',
    },
    {
      key: 'field_count',
      header: 'Parameters',
      field: 'field_count',
      type: 'number',
    },
    {
      key: 'created_at',
      header: 'Created at',
      field: 'created_at',
      type: 'date',
    },
    {
      key: 'updated_at',
      header: 'Updated at',
      field: 'updated_at',
      type: 'date',
    },
    {
      key: 'actions',
      header: 'action',
      field: 'actions',
      type: 'custom',
      render: (row) => (
        <ThreeDotMenu
          value={[
            // {
            //   label: 'View',
            //   icon: cilHandPointRight,
            //   onClick: () => {
            //     const matchingProcess = processValues.find(
            //       (process) => process.ProcessName.id === item.id,
            //     )
            //     const idToPass = matchingProcess ? matchingProcess.id : item.id

            //     setOpenProcessModal({ open: true, id: idToPass })
            //   },
            // },
            {
              label: 'Edit Process',
              icon: cilPencil,
              onClick: () => {
                handleEditProcess(row)
              },
            },
            {
              label: 'Delete',
              icon: cilTrash,
              onClick: () => {
                openDeleteModal(row.id)
              },
            },
            // {
            //   label: 'Field',
            //   icon: cilPlus,
            //   onClick: () => {
            //     setOpenFieldModal({ open: true, id: item.id })
            //   },
            // },
            // {
            //   label: 'Values',
            //   icon: cilFlipToBack,
            //   onClick: () => {
            //     setOpenValuesModal({ open: true, id: item.id })
            //   },
            // },
          ]}
        />
      ),
    },
  ]

  const rowClick = (row) => {
    setOpenFieldModal({ open: true, id: row.id })
  }
  return (
    <div className=''>
      <ReusableTable data={processData} columns={columns} handleRowClick={rowClick}/>
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <ConfirmationModale
        isOpen={confirmModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
    // <div className="h-[340px] overflow-y-auto border border-gray-200 custom-scrollbar rounded-lg p-2">
    //   <CTable striped hover className="w-full m-0 table-fixed">
    //     <CTableHead className="bg-gray-100 sticky -top-2 z-10">
    //       <CTableRow className="text-center">
    //         <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium text-start">
    //           Id
    //         </CTableHeaderCell>
    //         <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
    //           Process Name
    //         </CTableHeaderCell>
    //         <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
    //           Created Date
    //         </CTableHeaderCell>
    //         <CTableHeaderCell className="py-3 px-2 text-gray-600 font-medium">
    //           Action
    //         </CTableHeaderCell>
    //       </CTableRow>
    //     </CTableHead>
    //     <CTableBody>
    //       {processData && processData.length > 0 ? (
    //         processData.map((item) => (
    //           <CTableRow key={item.id} onClick={() => setOpenFieldModal({ open: true, id: item.id })} className="border-b text-center">
    //             <CTableDataCell
    //               onClick={() => {
    //                 // const matchingProcess =
    //                 //   processValues && processValues.find
    //                 //     ? processValues.find((process) => process.ProcessName.id === item.id)
    //                 //     : null

    //                 // const idToPass = matchingProcess ? matchingProcess.id : item.id
    //                 // console.log(idToPass);

    //                 setOpenFieldModal({ open: true, id: idToPass })
    //               }}
    //               className="py-3 px-2 !text-blue-600 font-semibold cursor-pointer underline text-start"
    //             >
    //               {item.process_generate_id}
    //             </CTableDataCell>
    //             <CTableDataCell className="py-3 px-2  font-semibold">
    //               {item.process_name}
    //             </CTableDataCell>
    //             <CTableDataCell className="py-3 px-2  font-semibold">
    //               {/*{apiMethods.formatDate(item.created_at)}*/}
    //               {new Date(item.created_at).toLocaleString()}
    //             </CTableDataCell>
    //             <CTableDataCell className="py-3 px-2 text-center">
    //                <div className="flex justify-center">
    //               <ThreeDotMenu
    //                 value={[
    //                   // {
    //                   //   label: 'View',
    //                   //   icon: cilHandPointRight,
    //                   //   onClick: () => {
    //                   //     const matchingProcess = processValues.find(
    //                   //       (process) => process.ProcessName.id === item.id,
    //                   //     )
    //                   //     const idToPass = matchingProcess ? matchingProcess.id : item.id

    //                   //     setOpenProcessModal({ open: true, id: idToPass })
    //                   //   },
    //                   // },
    //                   {
    //                     label: 'Edit Process',
    //                     icon: cilPencil,
    //                     onClick: () => {
    //                       handleEditProcess(item)
    //                     },
    //                   },
    //                   {
    //                     label: 'Delete',
    //                     icon: cilTrash,
    //                     onClick: () => {
    //                       openDeleteModal(item.id)
    //                     },
    //                   },
    //                   // {
    //                   //   label: 'Field',
    //                   //   icon: cilPlus,
    //                   //   onClick: () => {
    //                   //     setOpenFieldModal({ open: true, id: item.id })
    //                   //   },
    //                   // },
    //                   // {
    //                   //   label: 'Values',
    //                   //   icon: cilFlipToBack,
    //                   //   onClick: () => {
    //                   //     setOpenValuesModal({ open: true, id: item.id })
    //                   //   },
    //                   // },
    //                 ]}
    //               />
    //               </div>
    //             </CTableDataCell>
    //           </CTableRow>
    //         ))
    //       ) : (
    //         <CTableRow>
    //           <CTableDataCell colSpan={4} className="py-3 px-2 text-center !text-red-500 ">
    //             No Records Found
    //           </CTableDataCell>
    //         </CTableRow>
    //       )}
    //     </CTableBody>
    //   </CTable>

    // </div>
  )
}

export default ProcessIntegrartionTable
