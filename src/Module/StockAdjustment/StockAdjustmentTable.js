import React, { useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import { cilPencil, cilTrash } from '@coreui/icons';
import ThreeDotMenu from '../../components/ThreeDotMenu';
import { useNavigate } from 'react-router-dom';

const StockAdjustmentTable = ({
  adjustments = [],
  isMinimized = false,
  openViewCard,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState({ open: false, id: null });
  const navigate = useNavigate();

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === adjustments.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(adjustments.map((a) => a.id));
    }
  };

  return (
    <div className="overflow-y-auto custom-scrollbar">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg h-[calc(82vh-74px)]">
        <CTable hover className="w-full">
          {!isMinimized && (
            <CTableHead className="!bg-gray-300 sticky top-0 z-10">
              <CTableRow>
                <CTableHeaderCell className="w-48 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Product
                </CTableHeaderCell>
                <CTableHeaderCell className="w-32 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Type
                </CTableHeaderCell>
                <CTableHeaderCell className="w-24 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Quantity
                </CTableHeaderCell>
                <CTableHeaderCell className="w-40 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </CTableHeaderCell>
                <CTableHeaderCell className="w-48 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Remarks
                </CTableHeaderCell>
                <CTableHeaderCell className="w-24 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
          )}

          <CTableBody>
            {adjustments.length > 0 ? (
              adjustments.map((adj) => (
                <CTableRow
                  key={adj.id}
                  onClick={() => navigate(`/stock-adjustments/${adj.id}`)}
                  className={`${
                    selectedRows.includes(adj.id)
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  } border-b cursor-pointer`}
                >
                  {isMinimized ? (
                    <CTableDataCell className="px-4 py-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(adj.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleRowSelect(adj.id);
                        }}
                        className="form-checkbox h-4 w-4 text-blue-600 rounded mb-2"
                      />
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewCard(adj);
                        }}
                        className="cursor-pointer flex flex-col"
                      >
                        <span className="text-sm text-black font-semibold">
                          {adj.product_name || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Qty: {adj.quantity}
                        </span>
                      </div>
                    </CTableDataCell>
                  ) : (
                    <>
                      <CTableDataCell
                        onClick={(e) => {
                          e.stopPropagation();
                          openViewCard(adj);
                        }}
                        className="px-4 py-3 text-sm text-blue-600 font-semibold"
                      >
                        {adj.product_name || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell className="px-4 py-3 text-sm text-gray-900">
                        {adj.type || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell className="px-4 py-3 text-sm text-gray-500">
                        {adj.quantity}
                      </CTableDataCell>
                      <CTableDataCell className="px-4 py-3 text-sm text-gray-500">
                        {adj.date}
                      </CTableDataCell>
                      <CTableDataCell className="px-4 py-3 text-sm text-gray-500">
                        {adj.remarks || 'N/A'}
                      </CTableDataCell>
                      <CTableDataCell className="px-4 py-3">
                        <div onClick={(e) => e.stopPropagation()}>
                          <ThreeDotMenu
                            value={[
                              {
                                label: 'Edit',
                                icon: cilPencil,
                                onClick: () =>
                                  navigate('/stock-adjustments/form', {
                                    state: { adjustment: adj },
                                  }),
                              },
                              {
                                label: 'Delete',
                                icon: cilTrash,
                                onClick: () =>
                                  setIsDeleteModalOpen({ open: true, id: adj.id }),
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
                  colSpan={isMinimized ? 2 : 6}
                  className="text-center text-sm !text-red-600 py-3"
                >
                  No Stock Adjustments Found
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    </div>
  );
};

export default StockAdjustmentTable;
