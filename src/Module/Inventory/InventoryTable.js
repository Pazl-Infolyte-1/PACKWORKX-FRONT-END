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

const InventoryTable = ({ inventoryData }) => {
  const [viewItem, setViewItem] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="w-full overflow-auto max-h-[410px] border rounded-md shadow-sm mt-1 mb-3">
      <CTable className="min-w-[1000px] table-fixed border-separate border-spacing-0">
        <CTableHead className="!bg-gray-100">
        <CTableRow>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
          Name
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
           Total Quantity
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
              Location
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
             Description
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
              Category
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
              Sub Category
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
              Status
            </CTableHeaderCell>
            {/*<CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
              Batch No
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
              Location
            </CTableHeaderCell>
            <CTableHeaderCell className="sticky top-0 bg-gray-100 text-center z-10 border-b border-gray-300 whitespace-nowrap">
              Status
            </CTableHeaderCell>*/}
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
                <CTableDataCell className="whitespace-nowrap">{item.total_quantity || '--'}</CTableDataCell>
                <CTableDataCell className="whitespace-nowrap">{item.location || '--'}</CTableDataCell>
                         <CTableDataCell
  className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
  title={item.item.description} // Tooltip
>
  {item.item.description ? (
    item.item.description.length > 20
      ? item.item.description.slice(0, 20) + '...'
      : item.item.description
  ) : '--'}
</CTableDataCell>
                <CTableDataCell className="whitespace-nowrap">{item.category || '--'}</CTableDataCell>
                <CTableDataCell className="whitespace-nowrap">{item.sub_category || '--'}</CTableDataCell>
                <CTableDataCell className="whitespace-nowrap">{item.status || '--'}</CTableDataCell>


                {/*<CTableDataCell className="whitespace-nowrap">{item.batch_no || '--'}</CTableDataCell>
                <CTableDataCell className="whitespace-nowrap">{item.location || '--'}</CTableDataCell>
                <CTableDataCell className="whitespace-nowrap">{item.status || '--'}</CTableDataCell>*/}
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


        <PopUp
      visible={viewItem}
      showCloseButton={true}
      setVisible={() => setViewItem(false)}
      height={'95vh'}
      width={'70vw'}
    >

  <ViewInventory item={selectedItem} />
    </PopUp>
    </div>
  );
};

export default InventoryTable;
