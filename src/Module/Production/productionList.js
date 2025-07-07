import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import ReusableTable from '../SalesOrder/ReusableTable'
import { productionApi } from '../../api/production';
import { useNavigate } from 'react-router-dom';
import HorizontalProgressBar from './HorizontalProgressBar'
import CompactPagination from '../../components/New/CompactPagination';
import { useSearch } from '../../components/New/SearchContext';


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
  const { filteredSearchData, searchQuery, } = useSearch()



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
        search: searchQuery,
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
        <button
          title="View Layers"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(90deg, #e0e7ff 60%, #c7d2fe 100%)',
            color: '#3730a3',
            border: '1px solid #a5b4fc',
            borderRadius: '20px',
            padding: '2px 12px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1em',
            boxShadow: '0 2px 6px rgba(55, 48, 163, 0.08)',
            transition: 'box-shadow 0.2s, transform 0.2s',
            outline: 'none',
          }}
          onMouseOver={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(55, 48, 163, 0.18)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(55, 48, 163, 0.08)';
            e.currentTarget.style.transform = 'none';
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleViewLayersClick(row);
          }}
        >
          {/* Layers Icon */}
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L18 7.5L10 12L2 7.5L10 3Z" fill="#6366f1"/><path d="M18 12.5L10 17L2 12.5" stroke="#6366f1" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          {row.layer_details?.length || 0}
        </button>
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
          <button
            title="View Work Orders"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(90deg, #fef9c3 60%, #fde68a 100%)',
              color: '#b45309',
              border: '1px solid #fde68a',
              borderRadius: '20px',
              padding: '2px 12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1em',
              boxShadow: '0 2px 6px rgba(180, 83, 9, 0.08)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              outline: 'none',
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(180, 83, 9, 0.18)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(180, 83, 9, 0.08)';
              e.currentTarget.style.transform = 'none';
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleViewWorkordersClick(row, uniqueWorkorders);
            }}
          >
            {/* Work Orders Icon */}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="14" height="2.5" rx="1" fill="#f59e42"/><rect x="3" y="9" width="14" height="2.5" rx="1" fill="#f59e42"/><rect x="3" y="13" width="14" height="2.5" rx="1" fill="#f59e42"/></svg>
            {uniqueWorkorders.length}
          </button>
        );
      },
    },


    {
      key: 'allocated_qty',
      header: 'Allocated/Qty',
      field: 'allocated_qty',
      cellClass: '',
      type: 'custom',
      render: (row) => {
        const allocated = row.allocated_qty || 0;
        const total = row.group_Qty || 0;
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(90deg, #f3f4f6 60%, #d1d5db 100%)',
              color: '#3730a3',
              border: '1px solid #a5b4fc',
              borderRadius: '20px',
              padding: '2px 0',
              fontWeight: 700,
              fontSize: '1em',
              boxShadow: '0 2px 6px rgba(55, 48, 163, 0.08)',
              width: '90px',
              minWidth: '90px',
              maxWidth: '90px',
              textAlign: 'center',
              letterSpacing: 0.2,
              transition: 'box-shadow 0.2s, transform 0.2s',
              userSelect: 'none',
            }}
          >
            <span style={{color: '#3730a3', width: 24, display: 'inline-block', textAlign: 'right'}}>{allocated}</span>
            <span style={{color: '#a5b4fc', margin: '0 4px', fontWeight: 600}}>/</span>
            <span style={{color: '#6366f1', width: 24, display: 'inline-block', textAlign: 'left'}}>{total}</span>
          </span>
        );
      },
    },
    {
      key: 'progress',
      header: 'Allocated %',
      field: 'progress',
      cellClass: '',
      type: 'custom',
      render: (row) => {
        const allocated = Number(row.allocated_qty) || 0;
        const total = Number(row.group_Qty) || 0;
        const percent = total > 0 ? Math.round((allocated / total) * 100) : 0;
        return <HorizontalProgressBar value={percent} height={20} />;
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
        // Map enum to user-friendly label and color
        let label = '';
        let colorClass = '';
        switch (row.group_status) {
          case 'pending':
            label = 'Pending';
            colorClass = 'bg-yellow-100 text-yellow-800';
            break;
          case 'allocation_completed':
            label = 'Allocation Completed';
            colorClass = 'bg-blue-100 text-blue-800';
            break;
          case 'production_completed':
            label = 'Production Completed';
            colorClass = 'bg-green-100 text-green-800';
            break;
          case 'cancelled':
            label = 'Cancelled';
            colorClass = 'bg-red-100 text-red-800';
            break;
          default:
            label = row.group_status ? row.group_status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Unknown';
            colorClass = 'bg-gray-100 text-gray-800';
        }
        return (
          <span
            className={`px-3 py-1 rounded-full -ml-8 font-semibold text-xs ${colorClass}`}
            style={{ minWidth: '120px', display: 'inline-block', textAlign: 'center' }}
          >
            {label}
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
        row.group_status === 'pending' ? (
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
  }, [pagination?.page, limit,searchQuery]);

  // useEffect(() => {
  //   setPagination((prev) => ({
  //     ...prev,
  //     page: 1,
  //   }))
  // }, [searchQuery])

  return (
    <div className='flex flex-col'>
    
      <ContentHeader
        heading={"Raw Material Allocation"}
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
          background: 'rgba(30,34,44,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.25s',
        }}
          onClick={closeLayersModal}
        >
          <div style={{
            background: '#fafbfc',
            borderRadius: 20,
            minWidth: 340,
            maxWidth: 440,
            boxShadow: '0 4px 24px 0 rgba(30,34,44,0.13), 0 1.5px 6px 0 rgba(30,34,44,0.07)',
            padding: 0,
            position: 'relative',
            fontFamily: 'inherit',
            transform: 'scale(1)',
            animation: 'modalScaleIn 0.22s',
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding: '22px 28px 0 28px'}}>
              <div style={{fontSize: 22, fontWeight: 700, color: '#23272f', letterSpacing: 0.2}}>Layers</div>
              <button onClick={closeLayersModal} style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                borderRadius: '50%',
                transition: 'background 0.18s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }} title="Close"
                onMouseOver={e => e.currentTarget.style.background = '#f0f1f3'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
              >
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M6 6L14 14M14 6L6 14" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{height:1, background:'#ececec', margin:'18px 0 0 0'}} />
            <div style={{padding: '0 28px 24px 28px'}}>
              <div style={{ maxHeight: 340, overflowY: 'auto', marginTop: 18 }}>
                {(selectedRow.layer_details || []).map((layer, idx) => (
                  <div key={idx} style={{
                    background:'#fff',
                    borderRadius: 14,
                    boxShadow: '0 1.5px 6px 0 rgba(30,34,44,0.04)',
                    border: '1px solid #f2f2f2',
                    marginBottom: 18,
                    padding: '16px 18px',
                    transition: 'box-shadow 0.18s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                    onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(30,34,44,0.10)'}
                    onMouseOut={e => e.currentTarget.style.boxShadow = '0 1.5px 6px 0 rgba(30,34,44,0.04)'}
                  >
                    <div style={{display:'flex', flexWrap:'wrap', gap:'12px 24px', fontSize:14}}>
                      <div style={{color:'#7a7f87', fontWeight:500}}>Work Order: <span style={{color:'#23272f', fontWeight:600}}>{layer.work_generate_id}</span></div>
                      <div style={{color:'#7a7f87', fontWeight:500}}>Layer: <span style={{color:'#23272f', fontWeight:600}}>{layer.layer_detail?.layer}</span></div>
                      <div style={{color:'#7a7f87', fontWeight:500}}>GSM: <span style={{color:'#23272f', fontWeight:600}}>{layer.layer_detail?.gsm}</span></div>
                      <div style={{color:'#7a7f87', fontWeight:500}}>BF: <span style={{color:'#23272f', fontWeight:600}}>{layer.layer_detail?.bf}</span></div>
                      <div style={{color:'#7a7f87', fontWeight:500}}>Material: <span style={{color:'#23272f', fontWeight:600}}>{layer.layer_detail?.material}</span></div>
                      <div style={{color:'#7a7f87', fontWeight:500}}>Color: <span style={{color:'#23272f', fontWeight:600}}>{layer.layer_detail?.color}</span></div>
                      <div style={{color:'#7a7f87', fontWeight:500}}>Weight: <span style={{color:'#23272f', fontWeight:600}}>{
                        typeof layer.layer_detail?.weight === 'number' ? String(layer.layer_detail.weight).split('.')[0] + (String(layer.layer_detail.weight).includes('.') ? '.' + String(layer.layer_detail.weight).split('.')[1].slice(0,3) : '') : layer.layer_detail?.weight
                      }</span></div>
                      <div style={{color:'#7a7f87', fontWeight:500}}>Bursting Strength: <span style={{color:'#23272f', fontWeight:600}}>{
                        typeof layer.layer_detail?.bursting_strength === 'number' ? String(layer.layer_detail.bursting_strength).split('.')[0] + (String(layer.layer_detail.bursting_strength).includes('.') ? '.' + String(layer.layer_detail.bursting_strength).split('.')[1].slice(0,3) : '') : layer.layer_detail?.bursting_strength
                      }</span></div>
                      <div style={{color:'#7a7f87', fontWeight:500}}>Status: <span style={{color:'#23272f', fontWeight:600}}>{layer.layer_detail?.layer_status}</span></div>
                      {layer.layer_detail?.flute_type && <div style={{color:'#7a7f87', fontWeight:500}}>Flute Type: <span style={{color:'#23272f', fontWeight:600}}>{layer.layer_detail.flute_type}</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          background: 'rgba(30,34,44,0.10)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.25s',
        }}
          onClick={closeWorkordersModal}
        >
          <div style={{
            background: '#fafbfc',
            borderRadius: 20,
            minWidth: 260,
            maxWidth: 360,
            boxShadow: '0 4px 24px 0 rgba(30,34,44,0.13), 0 1.5px 6px 0 rgba(30,34,44,0.07)',
            padding: 0,
            position: 'relative',
            fontFamily: 'inherit',
            transform: 'scale(1)',
            animation: 'modalScaleIn 0.22s',
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding: '22px 28px 0 28px'}}>
              <div style={{fontSize: 22, fontWeight: 700, color: '#23272f', letterSpacing: 0.2}}>Work Orders</div>
              <button onClick={closeWorkordersModal} style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                borderRadius: '50%',
                transition: 'background 0.18s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }} title="Close"
                onMouseOver={e => e.currentTarget.style.background = '#f0f1f3'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
              >
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M6 6L14 14M14 6L6 14" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div style={{height:1, background:'#ececec', margin:'18px 0 0 0'}} />
            <div style={{padding: '0 28px 24px 28px'}}>
              <div style={{ maxHeight: 300, overflowY: 'auto', marginTop: 18 }}>
                {[
                  ...new Set(
                    (selectedRow.layer_details || []).map(layer => layer.work_generate_id)
                  ),
                ].map((workId, idx, arr) => (
                  <div key={idx} style={{
                    background:'#fff',
                    borderRadius: 14,
                    boxShadow: '0 1.5px 6px 0 rgba(30,34,44,0.04)',
                    border: '1px solid #f2f2f2',
                    marginBottom: 18,
                    padding: '16px 18px',
                    transition: 'box-shadow 0.18s',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                    onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(30,34,44,0.10)'}
                    onMouseOut={e => e.currentTarget.style.boxShadow = '0 1.5px 6px 0 rgba(30,34,44,0.04)'}
                  >
                    <div style={{color:'#7a7f87', fontWeight:500, fontSize:15}}>Work Order: <span style={{color:'#23272f', fontWeight:600}}>{workId}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default productionList

/* Add keyframes for fade/scale-in animation */
if (typeof window !== 'undefined' && !window.__modal_animation_injected) {
  const style = document.createElement('style');
  style.innerHTML = `@keyframes fadeIn {from{opacity:0;}to{opacity:1;}}
  @keyframes modalScaleIn {from{opacity:0;transform:scale(0.96);}to{opacity:1;transform:scale(1);}}`;
  document.head.appendChild(style);
  window.__modal_animation_injected = true;
}