import React, { useEffect, useState } from 'react'
import ContentHeader from '../../components/New/ContentHeader'
import ReusableTable from '../SalesOrder/ReusableTable'
import { productionApi } from '../../api/production';
import { useNavigate } from 'react-router-dom';
import HorizontalProgressBar from './HorizontalProgressBar'


function productionList() {
    const [tableData,setTableData] = useState([])
    const [showLayersModal, setShowLayersModal] = useState(false)
    const [showWorkordersModal, setShowWorkordersModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [selectedWorkorders, setSelectedWorkorders] = useState([])
    const navigate = useNavigate()


    const fetchGroups = async () => {
        try {
          const response = await productionApi.getProductionGroupTable()
          setTableData(response?.data?.data)
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
        { key: 'id', header: 'Number', field: 'id', cellClass: '' },
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
        {
            key: 'stage',
            header: 'Stage',
            field: 'stage',
            cellClass: '',
            type: 'custom',
            render: (row) => (
              <span
                style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/production/form/AllocateRM?id=${row.id}`);
                }}
              >
                RM-Allocation
              </span>
            ),
          },
      ]


      useEffect(() => {
        fetchGroups();
      }, []);

  return (
    <>
      <ContentHeader
            heading={"Production"}
            onAddClick={async() => {
              await productionApi.refreshForNewForm()
              navigate('/production/form')
            }}

          />
          <ReusableTable
          columns={columns}
          data={tableData}

          />

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
    </>
  )
}

export default productionList