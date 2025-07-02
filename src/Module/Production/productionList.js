import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import ReusableTable from '../SalesOrder/ReusableTable'
import { productionApi } from '../../api/production';
import { useNavigate } from 'react-router-dom';
import HorizontalProgressBar from './HorizontalProgressBar'
import CompactPagination from '../../components/New/CompactPagination';


function productionList() {
  const [tableData, setTableData] = useState([])
  const [showLayersModal, setShowLayersModal] = useState(false)
  const [showWorkordersModal, setShowWorkordersModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [selectedWorkorders, setSelectedWorkorders] = useState([])
  const [selectedIds, setSelectedIds] = useState([]);
  const [count, setCount] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [limit, setLimit] = useState(50)



  const navigate = useNavigate()



  useEffect(()=>{
    console.log(tableData)
  },[tableData])


  const fetchGroups = async () => {
    try {
      const repsonse1 = await productionApi.refreshForNewForm()
      const response = await productionApi.getProductionGroupTable({
        page: pagination?.page,
        limit: limit,
      })
      setTableData(response?.data?.data)
      setCount(response.data.pagination.totalRecords)
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination.totalPages
      }))
    }
    catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleViewLayersClick = (row) => {
    setSelectedRow(row);
    setShowLayersModal(true);
  };

  const handleViewWorkordersClick = (row, uniqueWorkorders) => {
    setSelectedRow(row);
    setSelectedWorkorders(uniqueWorkorders);
    setShowWorkordersModal(true);
  };

  const closeLayersModal = () => setShowLayersModal(false);
  const closeWorkordersModal = () => setShowWorkordersModal(false);

  const columns = [
    { key: 'id', header: 'id', field: 'production_group_generate_id', cellClass: '' },
    { key: 'group_name', header: 'Group Name', field: 'group_name', cellClass: '' },
    {
      key: 'layers',
      header: 'Layers',
      field: 'layer_details',
      cellClass: '',
      type: 'custom',
      render: (row) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            handleViewLayersClick(row);
          }}
        >
          {row.layer_details?.length || 0}
        </span>
      ),
    },
    {
      key: 'workorders',
      header: 'Work Orders',
      field: 'layer_details',
      cellClass: '',
      type: 'custom',
      render: (row) => {
        // Get unique workorder_ids
        const uniqueWorkorders = [
          ...new Set((row.layer_details || []).map((l) => l.work_order_id)),
        ];
        return (
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              handleViewWorkordersClick(row, uniqueWorkorders);
            }}
          >
            {uniqueWorkorders.length}
          </span>
        );
      },
    },


    {
      key: 'allocated_qty',
      header: 'Allocated/Qty',
      field: 'allocated_qty',
      cellClass: '',
      type: 'custom',
      render: (row) => `${row.allocated_Qty || 0}/${row.group_Qty || 0}`,
    },
    {
      key: 'progress',
      header: 'Allocated %',
      field: 'progress',
      cellClass: '',
      type: 'custom',
      render: (row) => {
        const allocated = Number(row.allocated_Qty) || 0;
        const total = Number(row.group_Qty) || 0;
        const percent = total > 0 ? Math.round((allocated / total) * 100) : 0;
        return <HorizontalProgressBar value={percent} />;
      },
    },
    // {
    //   key: 'stage',
    //   header: 'Stage',
    //   field: 'stage',
    //   cellClass: '',
    //   type: 'custom',
    //   render: (row) => (
    //     <span
    //       style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         navigate(`/production/form/AllocateRM?id=${row.id}`, {
    //           state: { lockedSteps: true }
    //         });
    //       }}
    //     >
    //       RM-Allocation
    //     </span>
    //   ),
    // },
    {
      key: 'status',
      header: 'Status',
      field: 'group_status',
      type: 'custom',
      render: (row) => {
        let colorClass = '';
        switch (row.group_status) {
          case 'Completed':
            colorClass = 'bg-green-100 text-green-800';
            break;
          case 'Pending':
            colorClass = 'bg-yellow-100 text-yellow-800';
            break;
          case 'Rejected':
            colorClass = 'bg-red-100 text-red-800';
            break;
          case 'In Progress':
            colorClass = 'bg-blue-100 text-blue-800';
            break;
          default:
            colorClass = 'bg-gray-100 text-gray-800';
        }
        return (
          <span
            className={`px-3 py-1 rounded-full font-semibold text-xs ${colorClass}`}
            style={{ minWidth: '80px', display: 'inline-block', textAlign: 'center' }}
          >
            {row.group_status}
          </span>
        );
      },
    },
    {
      key: 'select',
      header: '',
      field: 'select',
      type: 'custom',
      render: (row) =>
        row.group_status === 'Pending' ? (
          <input
            type="checkbox"
            checked={!!row.select}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setTableData((prevData) =>
                prevData.map((r) =>
                  r.id === row.id ? { ...r, select: isChecked } : r
                )
              );
              setSelectedIds((prev) => {
                if (isChecked) {
                  return [...prev, row.id];
                } else {
                  return prev.filter((id) => id !== row.id);
                }
              });
            }}
            className="form-checkbox h-4 w-4 text-blue-600 cursor-pointer transition-all"
          />
        ) : null,
    }
    
  ]


  useEffect(() => {
    fetchGroups();
  }, [pagination?.page, limit]);

  return (
    <div className='flex flex-col'>
    
      <ContentHeader
        heading={"Production"}
        onAddClick={async () => {
          await productionApi.refreshForNewForm()
          navigate('/production/form')
        }}
        isNewButton={selectedIds.length > 0}
        newButtonLabel="Proceed >"
        addNewButtonClick={async()=>{
          await productionApi.refreshForNewForm()
          navigate('/production/form/AllocateRM',{
            state:{
              selectedIds:selectedIds,
              lockedSteps:true
            }
          })
        }}
      />
<ReusableTable
  columns={columns}
  data={tableData}
  onCheckboxChange={(row, field, isChecked) => {
    setTableData(prevData =>
      prevData.map(r =>
        r.id === row.id ? { ...r, [field]: isChecked } : r
      )
    );
    setSelectedIds((prev) => {
      if (isChecked) {
        return [...prev, row.id];
      } else {
        return prev.filter((id) => id !== row.id);
      }
    });
  }}
/>
<div className="flex justify-end items-center gap-4  mt-4 ml-4 mr-4">
              <p className='w-50 text-sm'>Total Count : <span className='font-semibold'>{count}</span></p>
            <CompactPagination
              count={pagination?.totalPages}
              page={pagination?.page}
              onPageChange={(event, value) =>
                setPagination((prev) => ({
                  ...prev,
                  page: value,
                }))
              }
              onEntriesChange={(newLimit) => {
                setLimit(newLimit)
                // Reset to first page when changing limit
                setPagination((prev) => ({
                  ...prev,
                  page: 1,
                }))
              }}
              entriesPerPage={limit}
            />
          </div>


      {/* Layers Modal */}
      {showLayersModal && selectedRow && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
          onClick={closeLayersModal}
        >
          <div style={{ background: 'white', padding: 32, borderRadius: 8, minWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h2>Layers</h2>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {(selectedRow.layer_details || []).map((layer, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid #eee', marginBottom: 8, paddingBottom: 8 }}>
                  <div><b>Work Order:</b> {layer.work_generate_id}</div>
                  <div><b>Layer:</b> {layer.layer_detail?.layer}</div>
                  <div><b>GSM:</b> {layer.layer_detail?.gsm}</div>
                  <div><b>BF:</b> {layer.layer_detail?.bf}</div>
                  <div><b>Material:</b> {layer.layer_detail?.material}</div>
                  <div><b>Color:</b> {layer.layer_detail?.color}</div>
                  <div><b>Weight:</b> {layer.layer_detail?.weight}</div>
                  <div><b>Bursting Strength:</b> {layer.layer_detail?.bursting_strength}</div>
                  <div><b>Status:</b> {layer.layer_detail?.layer_status}</div>
                  {layer.layer_detail?.flute_type && <div><b>Flute Type:</b> {layer.layer_detail.flute_type}</div>}
                </div>
              ))}
            </div>
            <button onClick={closeLayersModal} style={{ marginTop: 16 }}>Close</button>
          </div>
        </div>
      )}

      {/* Workorders Modal */}
      {showWorkordersModal && selectedRow && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
          onClick={closeWorkordersModal}
        >
          <div style={{ background: 'white', padding: 32, borderRadius: 8, minWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h2>Work Orders</h2>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {[
                ...new Set(
                  (selectedRow.layer_details || []).map(layer => layer.work_generate_id)
                ),
              ].map((workId, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid #eee', marginBottom: 12, paddingBottom: 8 }}>
                  <div><b>Work Order:</b> {workId}</div>
                </div>
              ))}
            </div>
            <button onClick={closeWorkordersModal} style={{ marginTop: 16 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default productionList