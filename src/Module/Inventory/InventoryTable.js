import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import React, { useState } from 'react';
import PopUp from '../../../src/components/New/PopUp';
import ViewInventory from './ViewInventory';
import { cilPencil, cilTrash } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import ThreeDotMenu from '../../components/ThreeDotMenu';

const InventoryTable = ({ inventoryData }) => {
  const [viewItem, setViewItem] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({ open: false, id: null })


  const totalInventoryValue = inventoryData?.reduce((acc, item) => {
  const quantity = item.total_quantity || 0;
  const cost = item.item?.standard_cost || 0;
  return acc + (quantity * cost);
}, 0);

console.log("Total Inventory Value:", totalInventoryValue);

  return (<>
<div className="w-full overflow-x-auto overflow-y-auto max-h-[410px] border rounded-md shadow-sm mt-1 mb-3">
      <CTable className="min-w-[1000px] table-fixed border-separate border-spacing-0">
        <CTableHead className="!bg-gray-100">
        <CTableRow>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
          Product Name
            </CTableHeaderCell>
                       <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
              Category
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
              Sub Category
            </CTableHeaderCell>
              <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
              Location
            </CTableHeaderCell>
                   <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
         Min Stockn Level
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
           Available Quantity
            </CTableHeaderCell>
               <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
        Standard Cost
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
       Total Value
            </CTableHeaderCell>
                <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
       Status
            </CTableHeaderCell>
               <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap text-sm">
       Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

             <CTableBody>
          {inventoryData && inventoryData.length > 0 ? (
            inventoryData.map((item, index) => (
        <CTableRow
  key={index}
  className="text-sm text-center cursor-pointer hover:bg-gray-100"
  onClick={() => {
    console.log('Selected item_id:', item.id); // Log item_id
    setSelectedItem(item); // Save item to view
    setViewItem(true); // Show popup
  }}
>

                <CTableDataCell className="whitespace-nowrap">{item?.item?.item_name || '--'}</CTableDataCell>
                 <CTableDataCell className="whitespace-nowrap">{item.category || '--'}</CTableDataCell>
                <CTableDataCell className="whitespace-nowrap">{item.sub_category || '--'}</CTableDataCell>
                                <CTableDataCell className="whitespace-nowrap">{item.location || '--'}</CTableDataCell>
                        <CTableDataCell className="whitespace-nowrap">{item.item.min_stock_level || '--'}</CTableDataCell>
                                                <CTableDataCell className="whitespace-nowrap">{item.total_quantity || '--'}</CTableDataCell>
                <CTableDataCell className="whitespace-nowrap">{item.item.standard_cost || '--'}</CTableDataCell>
                                <CTableDataCell className="whitespace-nowrap">{item.total_quantity*item.item.standard_cost || '--'}</CTableDataCell> 
<CTableDataCell className="whitespace-nowrap text-center">
  <span
    style={{
      backgroundColor: item.status === 'inactive' ? '#DBEAFE' : item.status === 'active' ? '#D1FAE5' : '',
      color: item.status === 'inactive' ? '#1E40AF' : item.status === 'active' ? '#065F46' : '',
      borderRadius: '4px',
      padding: '2px 6px',
      fontSize: '0.75rem', // equivalent to text-xs
      display: 'inline-block',
    }}
  >
    {item.status || '--'}
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
                                    console.log('Edit', item)
                                    navigate('/inventoryhandling/inventory_form', { state: { item ,fromInventory: true,isInventoryEditing:true}})
                                  },
                                },
                                {
                                  label: 'Delete',
                                  icon: cilTrash,
                                  onClick: () => setIsDeleteModalOpen({
                                    open: true,
                                    id: item.item_id,
                                  }),
                                },
                              ]}
                            />
                          </div>
                        </CTableDataCell>

  
              </CTableRow>
            ))
          ) : (
              <CTableRow>
              <CTableDataCell colSpan={10} className="text-center text-gray-500 py-4">
                No inventory data available.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>

      </CTable>
    </div>

          <PopUp
      visible={viewItem}
      showCloseButton={true}
      setVisible={() => setViewItem(false)}
      height={'95vh'}
      width={'70vw'}
    >

  <ViewInventory item={selectedItem} />
    </PopUp>
  </>
  
  );
};

export default InventoryTable;
