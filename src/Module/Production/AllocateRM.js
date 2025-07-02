import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardText,
  CButton,
  CCollapse,
  CFormSelect,
  CFormInput,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { FaAngleDown, FaAngleUp, FaEye, FaLock } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import { cilOptions, cilBriefcase, cilCut, cilClipboard, cilTrash } from '@coreui/icons'
import { useDrag, useDrop } from 'react-dnd'
import './styles.css'
import ProgressBar from './ProgressBar'
import Dropdown from 'react-bootstrap/Dropdown'
import AllcoateRMModal from './AllcoateRMModal'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { useRawMaterialContext } from '../../Context/AlocateRawMeterialContext'
import { productionApi } from '../../api/production'
import GroupData from './RawmeterialComponents/GroupData'
import { ConstructionOutlined } from '@mui/icons-material'
import CustomAlert from '../../components/New/CustomAlert'
import { useNextHandler } from '../../Context/ProductionNextHandlerContext'
import { useParams, useLocation } from 'react-router-dom'

const ItemType = 'RawMeterial'

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <span
    ref={ref}
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}
    style={{ cursor: 'pointer' }}
  >
    <CIcon
      icon={cilOptions}
      className="me-2 hover-pointer"
      style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
    />
  </span>
))

function SFGDragableCard({ sfg, openSFG, setOpenSFG }) {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: () => {
      console.log('Dragging item:', { sfg });
      return { sfg };
    }
  }), [sfg])

  const toggleCollapse = (id) => {
    setOpenSFG((prevId) => (prevId === id ? null : id)) // Toggle behavior
  }
  return (
    <CCard className="mt-2 !bg-indigo-50 !border-2 !border-dashed !border-indigo-200 " ref={drag} key={sfg.id} >
      <CCardBody style={{ padding: '14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #f0f0f0',
            borderRadius: '6px 6px 0 0',
            minHeight: '40px',
          }}
        >
          {/* Left: Inventory ID and collapse toggle */}
          <span
            onClick={() => toggleCollapse(sfg.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#3730a3',
              minWidth: 0,
            }}
          >
            {sfg.inventory_generate_id}
            {openSFG === sfg.id ? <FaAngleUp size={13} /> : <FaAngleDown size={13} />}
          </span>

          {/* Center: Inline fields */}
          <div
          className='pl-4'
           style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: '#374151',
            flex: 1,
            justifyContent: 'start',
            minWidth: 0,
          }}>
            <span><b>GSM:</b> {sfg?.item_info?.default_custom_fields?.gsm}</span>
            <span><b>BF:</b> {sfg?.item_info?.default_custom_fields?.bf}</span>
            <span><b>Deckle:</b> {sfg?.item_info?.default_custom_fields?.size}</span>
            <span><b>Available:</b> {sfg?.quantity_available < 0 ? 0 : sfg?.quantity_available} KG</span>
            <span><b>Blocked:</b> {sfg?.quantity_blocked} KG</span>
          </div>

          {/* Right: ThreeDotMenu */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minWidth: '40px',
            }}
          >
            <ThreeDotMenu
              value={[
                {
                  label: 'View Work Order',
                  icon: cilBriefcase,
                  onClick: () => {
                    console.log('View Work Order')
                  },
                },
                {
                  label: 'View Sales Order',
                  icon: cilClipboard,
                  onClick: () => {
                    console.log('View Sales Order')
                  },
                },
                {
                  label: 'Remove from Plan',
                  icon: cilTrash,
                  onClick: () => {
                    console.log('Remove from Plan')
                  },
                },
                // {
                //   label: 'Split Work Order',
                //   icon: cilCut,
                //   onClick: () => {
                //     setVisibleSplit(true)
                //   },
                // },
              ]}
            />
          </span>
        </div>

        <CCollapse className="custom-collapse" visible={openSFG === sfg.id}>
          <CRow className="align-items-center text-xs mt-2 mb-1">
            {/* These fields are now in the header, so you can remove or repurpose this row if needed */}
          </CRow>
          <hr style={{ margin: '4px 0' }} />
          <CRow className="mt-2">
            <CCol xs={12}>
              {sfg?.work_orders?.map((wo, index) => (
                <CCard
                  key={index}
                  style={{
                    height: '40px',
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    marginTop: '6px',
                    padding: '2px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    overflow: 'hidden',
                    border: 'none'
                  }}
                >
                  <div className="d-flex justify-content-between w-100 px-2">
                    <div className="text-center" style={{ width: '50%' }}>
                      <span className="font-semibold text-xs">Work Order</span>
                      <div className="text-xs">{wo.wo_id}</div>
                    </div>
                    <div className="text-center" style={{ width: '50%' }}>
                      <span className="font-semibold text-xs">Quantity (KG)</span>
                      <div className="text-xs">{wo.quantity}</div>
                    </div>
                  </div>
                </CCard>
              ))}
            </CCol>
          </CRow>
        </CCollapse>
      </CCardBody>
    </CCard>
  )
}

function GroupDropZone({
  i,
  itemIndex,
  visibleItemIndex,
  setVisibleItemIndex,
  setVisibleSplit,
}) {
  const toggleItemCollapse = (index) => {
    setVisibleItemIndex(visibleItemIndex === index ? null : index)
  }

  return (
    <CCard
      key={itemIndex}
      className="mb-2 bg-white border "
      style={{
        marginTop: '6px',
        borderRadius: '8px',
        padding: '4px',
      }}
    >
      <CCardBody style={{ padding: '8px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            flex: 1,
            minWidth: 0 // This ensures text truncation works
          }}>
            <span
              onClick={() => toggleItemCollapse(itemIndex)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: '500',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1
              }}
            >
              {`${i?.work_generate_id}`},
              {`${i?.layer_detail?.layer}`} 
              {visibleItemIndex === itemIndex ? <FaAngleUp size={12} /> : <FaAngleDown size={12} />}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#e8e6f3',
              color: '#8167e5',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
            }}>
              {i?.layer_detail?.weight?.toString().substring(0, 5)} KG
            </span>

            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => console.log('View Work Order')}>
                  <CIcon
                    icon={cilBriefcase}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.2rem', fontWeight: 'bold' }}
                  />
                  View Work Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('View Sales Order')}>
                  <CIcon
                    icon={cilClipboard}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.2rem', fontWeight: 'bold' }}
                  />
                  View Sales Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Remove from Plan')}>
                  <CIcon
                    icon={cilTrash}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.2rem', fontWeight: 'bold' }}
                  />
                  Remove from Plan
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setVisibleSplit(true)}>
                  <CIcon
                    icon={cilCut}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.2rem', fontWeight: 'bold' }}
                  />
                  Split Work Order
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <CCollapse className="custom-collapse" visible={visibleItemIndex === itemIndex}>
          <div
            style={{
              marginTop: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '6px',
              fontSize: '0.85rem',
            }}
          >
            <span>GSM - {i?.layer_detail?.gsm}</span>
            <span>BF - {i?.layer_detail?.bf}</span>

            <span>{i?.layer_detail?.color}</span>
          </div>
        </CCollapse>
      </CCardBody>
    </CCard>
  )
}

function GroupRawMeterialDropZone({ group, groupIndex, visibleGroupIndex, toggleGroupCollapse }) {
  const [visibleItemIndex, setVisibleItemIndex] = useState(null)
  const [visibleAllocate, setVisibleAllocate] = useState(false)
  const [droppedItem, setDroppedItem] = useState(null)
  const [groupDetailsModal, setGroupDetailsModal] = useState({visible:false, id:null, data:[]})
  const [isDeallocating, setIsDeallocating] = useState(false);
  const [deallocationError, setDeallocationError] = useState(null);
  const {getData,setAlertsApp} = useRawMaterialContext()

  // New state for deallocation modal
  const [showDeallocateModal, setShowDeallocateModal] = useState(false);
  const [deallocateInfo, setDeallocateInfo] = useState(null); // {inventory_id, total_allocated_qty, group_id}
  const [deallocateQty, setDeallocateQty] = useState('');
  const [deallocateInputError, setDeallocateInputError] = useState('');

  const addQuantity = (groupIndex, item) => {
    console.log('Group Index:', groupIndex)
    console.log('Item:', item)
    setVisibleAllocate(true)
  }

  // Modified: Accepts custom quantity
  const handleDeAllocateClick = async (inventory_id, qty, grpId) => {
    try {
      setIsDeallocating(true);
      setDeallocationError(null);

      const payload = {
        deallocations: [
          {
            production_group_id: grpId,
            inventory_id: inventory_id,
            quantity_to_deallocate: qty,
          }
        ]
      }

      const response = await productionApi.deAllocateInventoryFromGroup({...payload});
      // Refresh data after successful deallocation
      await getData();
      setShowDeallocateModal(false);
      setDeallocateQty('');
      setDeallocateInputError('');
    } catch (error) {
      console.error('Deallocation error:', error?.response?.data?.message || error.message);
      setAlertsApp([{severity:"error",message:error?.response?.data?.message || 'Deallocation failed'}])
    } finally {
      setIsDeallocating(false);
    }
  }

  const handleViewGroupClick = async (id) => {
    const response = await productionApi.getSingleGroupDetails(id)
    setGroupDetailsModal({visible:true, id:id, data:response?.data?.data})
  }

  const [{ isOver, canDrop, draggedItem }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => {
      setDroppedItem(item)
      setVisibleAllocate(true)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }))

  // Handler for lock icon click
  const handleLockClick = (allocation) => {
    setDeallocateInfo({
      inventory_id: allocation.inventory_id,
      total_allocated_qty: allocation.total_allocated_qty,
      group_id: group.id,
    });
    setDeallocateQty('');
    setDeallocateInputError('');
    setShowDeallocateModal(true);
  };

  // Handler for modal confirm
  const handleDeallocateConfirm = () => {
    const maxQty = Number(deallocateInfo?.total_allocated_qty);
    const qty = Number(deallocateQty);
    if (!qty || qty <= 0) {
      setDeallocateInputError('Enter a valid quantity');
      return;
    }
    if (qty > maxQty) {
      setDeallocateInputError(`Cannot deallocate more than allocated (${maxQty})`);
      return;
    }
    handleDeAllocateClick(deallocateInfo.inventory_id, qty, deallocateInfo.group_id);
  };

  return (
    <CCard
      ref={drop}
      key={groupIndex}
      className="mb-2 border"
      style={{
        borderRadius: '8px',
        border: isOver ? '2px dashed #8167e5' : 'none',
        transition: 'all 0.3s ease',
        padding: '4px',
      }}
    >
      <CCardBody style={{ padding: '8px' }}>
        <div
                    onClick={() => toggleGroupCollapse(groupIndex)}

          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}
          >
            {group.group_name}{' '}
            {visibleGroupIndex === groupIndex ? <FaAngleUp size={14} /> : <FaAngleDown size={14} />}
          </span>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
            }}
          >
            {group.allocated_Qty || 0}
            /
            {group.group_Qty || 0 } 

            <div style={{ marginLeft: '8px', width: '35px', height: '30px' }}>
              <ProgressBar
                value={Math.min(
                  Math.max(
                    (() => {
                      if (group.group_Qty < 1) return 0;
                      const percentage = (group.allocated_Qty / group.group_Qty) * 100;
                      return parseFloat(percentage.toFixed(1));
                    })(),
                    0,
                  ),
                  100,
                )}
              />
            </div>
          </span>
        </div>

        <CCollapse className="custom-collapse" visible={visibleGroupIndex === groupIndex}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Left Column - Layer Details */}
            <div className="custom-scrollbar" style={{ 
              flex: 1.3,
              maxHeight: '400px',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}>
              {group?.layer_details?.length === 0 || !group?.layer_details ? (
                <div style={{
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  padding: '20px'
                }}>
                  No layers available in this group
                </div>
              ) : (
                group?.layer_details?.map((i, itemIndex) => (
                  <GroupDropZone
                    key={itemIndex}
                    i={i}
                    itemIndex={itemIndex}
                    visibleItemIndex={visibleItemIndex}
                    setVisibleItemIndex={setVisibleItemIndex}
                  />
                ))
              )}
            </div>

            {/* Right Column - History List */}
            <div className="custom-scrollbar bg-white border-l" style={{ 
              flex: 1,
              marginTop: '5px',
              padding: '12px',
              maxHeight: '400px',
              overflowY: 'auto',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '12px',
                color: '#4b5563'
              }}>
                Allocation History
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {group.allocation_history?.allocation_by_inventory?.length > 0 ? (
                  group.allocation_history.allocation_by_inventory.map((allocation, index) => (
                    <div key={index} className='border' style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Inventory ID: {allocation.inventory_id}</span>
                        <span>Total Allocated: {allocation.total_allocated_qty}</span>
                      </div>
                      <FaLock 
                        size={14}
                        style={{ 
                          cursor: isDeallocating ? 'not-allowed' : 'pointer',
                          color: isDeallocating ? '#9ca3af' : '#8167e5',
                          opacity: isDeallocating ? 0.7 : 1
                        }}
                        onClick={() => !isDeallocating && handleLockClick(allocation)}
                      />
                    </div>
                  ))
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#b0b3b8',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    padding: '16px 0 8px 0',
                  }}>
                    <CIcon icon={cilClipboard} style={{ fontSize: '1.7rem', marginBottom: '4px', color: '#d1d5db' }} />
                    <span>No allocation history yet</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '6px',
              marginBottom: '4px',
              marginRight: '8px',
            }}
          >
            <FaEye
              size={14}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleViewGroupClick(group.id)
              }}
            />
          </div>
        </CCollapse>
      </CCardBody>
      {visibleAllocate && (
        <AllcoateRMModal
          visibleAllocate={visibleAllocate}
          setVisibleAllocate={() => {
            setVisibleAllocate(false)
          }}
          group={group}
          droppedItem={droppedItem}
        />
      )}
      
      {groupDetailsModal.visible && (
        <GroupData
        isVisible={groupDetailsModal.visible}
        setVisible={setGroupDetailsModal}
        groupID={groupDetailsModal.id}
        data={groupDetailsModal.data}
        onClose={() => setGroupDetailsModal(prev => ({ ...prev, visible: false , id:null}))}
        />
      )}
      {/* Deallocate Quantity Modal */}
      <CModal visible={showDeallocateModal} onClose={() => setShowDeallocateModal(false)}>
        <CModalHeader onClose={() => setShowDeallocateModal(false)}>
          Deallocate Quantity
        </CModalHeader>
        <CModalBody>
          <div style={{ marginBottom: 1 }}>
            <span>Allocated: <b>{deallocateInfo?.total_allocated_qty}</b></span>
          </div>
          <CFormInput
            type="number"
            min={1}
            max={deallocateInfo?.total_allocated_qty || 1}
            value={deallocateQty}
            onChange={e => {
              setDeallocateQty(e.target.value);
              setDeallocateInputError('');
            }}
            placeholder="Enter quantity to deallocate"
            disabled={isDeallocating}
          />
          {deallocateInputError && (
            <div style={{ color: 'red', fontSize: 12, marginTop: 4 }}>{deallocateInputError}</div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDeallocateModal(false)} disabled={isDeallocating}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleDeallocateConfirm} disabled={isDeallocating}>
            {isDeallocating ? 'Deallocating...' : 'Deallocate'}
          </CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
}

const AllocateRM = ({}) => {
  // const [advanced, setAdvanced] = useState(false)
  // const [visibleSplit, setVisibleSplit] = useState(false)
  
  const [visibleGroupIndex, setVisibleGroupIndex] = useState(null)
  const [deckleOptions, setDeckleOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [gsmOptions, setGsmOptions] = useState([]);
  const [bfOptions, setBfOptions] = useState([]);
  const [openSFG, setOpenSFG] = useState(null)
  const {groupOrders,refreshData, sfgData ,handleFilterChange,selectedFilters,alerts,setAlertsApp,handleClose,setRouteId,routeId,fetchWorkOrders} = useRawMaterialContext()
  const {registerNextHandler} = useNextHandler()
  const location = useLocation();
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [deckleRes, colorRes, gsmRes, bfRes] = await Promise.allSettled([
          productionApi.getDeckleOptions(),
          productionApi.getColorOptions(),
          productionApi.getGsmOptions(),
          productionApi.getBfOptions(),
        ]);

        setDeckleOptions(deckleRes?.value?.data?.data);
        setColorOptions(colorRes?.value?.data?.data);
        setGsmOptions(gsmRes?.value?.data?.data);
        setBfOptions(bfRes?.value?.data?.data);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };

    fetchOptions();
  }, []);

  const selectStyles = {
    height: '21px',
    padding: '0px 8px',
    border: '0',
    boxSizing: 'border-box',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    color: '#030303',
    fontSize: '12px',
    fontFamily: 'Roboto, sans-serif',
    lineHeight: '16px',
    outline: 'none',
  }

  const toggleGroupCollapse = (index) => {
    setVisibleGroupIndex(visibleGroupIndex === index ? null : index)
  }


  const RemoveGroupsFromIndex = async () => {
    if (!groupOrders || groupOrders.length === 0) {
      return;
    }

    const groupOrderObjects = {
      groupIds: groupOrders?.map(order => order.id)
    };

    // Gather all allocations for all groups
    const deallocations = [];
    groupOrders.forEach(group => {
      if (group.allocation_history && group.allocation_history.allocation_by_inventory) {
        group.allocation_history.allocation_by_inventory.forEach(allocation => {
          if (allocation.total_allocated_qty > 0) {
            deallocations.push({
              production_group_id: group.id,
              inventory_id: allocation.inventory_id,
              quantity_to_deallocate: allocation.total_allocated_qty,
            });
          }
        });
      }
    });

    try {
      // Deallocate all allocations first
      if (deallocations.length > 0) {
        await productionApi.deAllocateInventoryFromGroup({ deallocations });
      }
      // Then remove the groups
      const response = await productionApi.removeGroupsFromRawMeterialAllocations(groupOrderObjects);
      await refreshData()
      await fetchWorkOrders()
    } catch (error) {
      // setAlertsApp && setAlertsApp({ type: 'danger', message: error?.response?.data?.message || error.message || 'An error occurred while removing work orders from production.' });
      console.error('Error while removing work orders from production:', error);
    }
  }

  useEffect(() => {
    registerNextHandler(RemoveGroupsFromIndex);
  }, [RemoveGroupsFromIndex]);

  useEffect(() => {
    // Alert selectedIds if present in navigation state
    if (location.state && Array.isArray(location.state.selectedIds) && location.state.selectedIds.length > 0) {
      setRouteId(location.state.selectedIds || null);
    }
  }, [location.state]);

  useEffect(()=>{
    refreshData()
    // fetchWorkOrders()
  },[routeId])



  return (
    <div className="flex flex-col">
        <CustomAlert
        alerts={alerts}
        handleClose={handleClose}
        />
        
                  {/* Screen Header */}
                  <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderBottom: '3px solid #5a67d8'
          }}
           className=" rounded-t-lg text-white !px-8 py-2.5 border-b-[3px] border-indigo-600">
            <div className="text-base font-semibold mb-1">
              Step 3: Allocate Raw Material
            </div>
            <div className="text-xs opacity-90">
              Assign available raw materials to production groups to ensure efficient and accurate manufacturing.
            </div>
          </div>
      {/* Groups Column */}
      <div
      className='flex gap-2'
      >
        
      <CCol xs={6}>
        <div className="bg-slate-50 p-3 custom-srollbar" style={{ height: 'calc(95vh - 200px)', overflowY: 'auto' }}>
          <div className="text-[15px] font-semibold mb-4 text-gray-700">
            Available Groups
          </div>
          {groupOrders?.length === 0 ? (
            <CCard
              className="mb-2 "
              style={{
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                margin: '20px'
              }}
            >
              <CCardBody>
                <div className="flex flex-col items-center justify-center">
                  <CIcon
                    icon={cilBriefcase}
                    style={{ fontSize: '2rem', color: '#8167e5', marginBottom: '10px' }}
                  />
                  <span className="text-gray-600 font-medium">No Groups Available</span>
                  <span className="text-gray-500 text-sm mt-1">Create groups to begin allocation</span>
                </div>
              </CCardBody>
            </CCard>
          ) : (
            groupOrders?.map((group, groupIndex) => (
              <GroupRawMeterialDropZone
                key={groupIndex}
                group={group}
                groupIndex={groupIndex}
                visibleGroupIndex={visibleGroupIndex}
                toggleGroupCollapse={toggleGroupCollapse}
              />
            ))
          )}
        </div>
      </CCol>

      {/* Raw Material Column */}
      <CCol xs={6}>
        <CCard
          className="mb-2 !bg-slate-50"
          style={{
            borderRadius: '10px',
            height: 'calc(95vh - 200px)',
            display: 'flex',
            flexDirection: 'column',
            border: 'none'
          }}
        >
          <CCardBody style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="d-flex fw-bold justify-content-center align-items-center" style={{ fontSize: '14px' }}>
              Raw Material
            </div>
            <div
              style={{
                height: '4px',
                marginTop: '8px',
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
              }}
            ></div>

            <CRow className="align-items-center mt-3">
              <CCol md="2">
                <label style={{ fontSize: '12px' }}>Raw Meterial</label>
                <CFormSelect 
                  style={selectStyles}
                >
                  <option value="Reel">Reel</option>
                </CFormSelect>
              </CCol>
              <CCol md="2">
                <label style={{ fontSize: '12px' }}>GSM</label>
                <CFormSelect 
                  style={selectStyles}
                  value={selectedFilters?.gsm}
                  onChange={(e) => handleFilterChange('gsm', e.target.value)}
                >
                  <option value="">GSM</option>
                  {gsmOptions?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md="2">
                <label style={{ fontSize: '12px' }}>BF</label>
                <CFormSelect 
                  style={selectStyles}
                  value={selectedFilters?.bf}
                  onChange={(e) => handleFilterChange('bf', e.target.value)}
                >
                  <option value="">BF</option>
                  {bfOptions?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md="2">
                <label style={{ fontSize: '12px' }}>Color</label>
                <CFormSelect 
                  style={selectStyles}
                  value={selectedFilters?.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                >
                  <option value="">Color</option>
                  {colorOptions?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md="2">
                <label style={{ fontSize: '12px' }}>Deckle</label>
                <CFormSelect 
                  style={selectStyles}
                  value={selectedFilters?.deckle}
                  onChange={(e) => handleFilterChange('deckle', e.target.value)}
                >
                  <option value="">Deckle</option>
                  {deckleOptions?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="align-items-center mt-2">
              <CCol md="2">
                <label style={{ fontSize: '12px' }}>Die</label>
                <CFormSelect style={selectStyles}>
                  <option>180</option>
                </CFormSelect>
              </CCol>
              <CCol md="2">
                <label style={{ fontSize: '12px' }}>Ink</label>
                <CFormSelect style={selectStyles}>
                  <option>25</option>
                </CFormSelect>
              </CCol>
              <CCol md="2">
                <label style={{ fontSize: '12px' }}>Stero</label>
                <CFormSelect style={selectStyles}>
                  <option>90</option>
                </CFormSelect>
              </CCol>
              <CCol md="2">
                <label style={{ fontSize: '12px' }}>Glue</label>
                <CFormSelect style={selectStyles}>
                  <option>25</option>
                </CFormSelect>
              </CCol>
              <CCol md="4">
                <label style={{ fontSize: '12px' }}>Stiching Wires</label>
                <CFormSelect className="w-50" style={selectStyles}>
                  <option>25</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <div
              style={{
                height: '4px',
                marginTop: '8px',
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
              }}
            ></div>
            <div style={{ flex: 1, overflowY: 'auto', marginTop: '8px' }} className="custom-scrollbar">
              {sfgData?.map((sfg, index) => (
                <SFGDragableCard
                  sfg={sfg}
                  key={index}
                  openSFG={openSFG}
                  setOpenSFG={setOpenSFG}
                />
              ))}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      </div>
    </div>
  )
}

export default AllocateRM
