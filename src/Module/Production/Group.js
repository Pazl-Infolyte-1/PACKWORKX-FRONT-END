import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardText,
  CNav,
  CNavItem,
  CNavLink,
  CButton,
  CCollapse,
  CModal,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTableHead,
  CTableBody,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { useDrag, useDrop } from 'react-dnd'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaAngleDown, FaAngleUp, FaEllipsisV, FaRedoAlt, FaEye } from 'react-icons/fa'
import CIcon from '@coreui/icons-react'
import {
  cilBriefcase,
  cilMinus,
  cilClipboard,
  cilCut,
  cilOptions,
  cilReload,
  cilTrash,
  cilQrCode,
  cilLink,
  cilPencil,
} from '@coreui/icons'
import './styles.css'
import ProgressBar from './ProgressBar'
import PopUp from '../../components/New/PopUp'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { useSearch } from '../../components/New/SearchContext'
import { useGroupLayers } from '../../Context/GroupLayersContext'
import { useNextHandler } from '../../Context/ProductionNextHandlerContext'
import { useNavigate } from 'react-router-dom'
import { productionApi } from '../../api/production'
import WorkOrderCard from './GroupComponents/WorkOrderCard'
import CustomAlert from '../../components/New/CustomAlert'
import AddGroupButton from './AddGroupButton'
import { add } from 'lodash'

const ItemType = 'WORK_ORDER'

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

function GroupOrderDropZone({
  groupOrder,
  groupIndex,
  addWorkOrderToGroup,
  groupVisibleIndex,
  setGroupVisibleIndex,
  removeWorkOrderFromPlan,
  setModalWorkOrder,
  setGroupOrders,
  modalWorkOrder,
  setVisible,
  setVisibleSplit,
}) {

  const navigate = useNavigate()
  const {removeWorkOrderFromGroup, updateGroup,alerts,setAlertsApp, deleteGroup} = useGroupLayers()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(groupOrder.group_name)

  const handleNameEdit = () => {
    setIsEditing(true)
  }

  const handleNameSave = () => {
    updateGroup(groupOrder.id, { group_name: editedName })
    setIsEditing(false)
  }

  const handleNameChange = (e) => {
    setEditedName(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditedName(groupOrder.group_name)
    }
  }

  const handleDeleteGroup = () => {
    if (groupOrder.group_value && groupOrder.group_value.length > 0) {
      if (window.confirm('This group contains Layers. Do you want to move all layers back to their work orders and delete the group?')) {
        deleteGroup(groupOrder.id);
      }
    } else {
        deleteGroup(groupOrder.id);
      
    }
  }

  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => {
      if (item.isGroup && item.layers && item.layers.length > 0) {
        // For paired layers, add as a single group item
        addWorkOrderToGroup({ 
          layers: item.layers, 
          workOrderId: item.workOrderId, 
          order: item.order,
          isGroup: true 
        }, groupIndex)
      } else {
        addWorkOrderToGroup(item, groupIndex)
      }
    },
  }))

  const toggleCollapse = (itemIndex) => {
    const uniqueIndex = `${groupIndex}-${itemIndex}`
    setGroupVisibleIndex(groupVisibleIndex === uniqueIndex ? null : uniqueIndex)
  }

  return (
    <div
      ref={drop}
      style={{
        background: groupOrder?.group_value?.length > 0 ? '#f0f4ff' : 'white',
        border: groupOrder?.group_value?.length > 0 ? '2px solid #667eea' : '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '15px',
        minHeight: '120px',
        width: '100%'
      }}
    >
      {/* Group Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
        background: groupOrder?.group_value?.length > 0 ? '#667eea' : '#e2e8f0',
        color: groupOrder?.group_value?.length > 0 ? 'white' : '#374151',
        padding: '10px 15px',
        borderRadius: '6px',
        fontWeight: 600
      }}>
        {isEditing ? (
          <input
            value={editedName}
            onChange={handleNameChange}
            onKeyDown={handleKeyPress}
            onBlur={handleNameSave}
            autoFocus
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              fontSize: '16px',
              fontWeight: 600,
              flex: 1,
              outline: 'none'
            }}
          />
        ) : (
          <div style={{ flex: 1 }}>
            {groupOrder.group_name}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <CIcon
            icon={cilPencil}
            className="hover-pointer"
            style={{ 
              fontSize: '1rem',
              color: 'inherit',
              opacity: 0.8,
              cursor: 'pointer'
            }}
            onClick={handleNameEdit}
          />
          <CIcon
            icon={cilTrash}
            className="hover-pointer"
            style={{ 
              fontSize: '1rem',
              color: 'inherit',
              opacity: 0.8,
              cursor: 'pointer'
            }}
            onClick={handleDeleteGroup}
          />
        </div>
      </div>

      {/* Grouped Items */}
      {groupOrder?.group_value?.map((item, itemIndex) => {
        const uniqueIndex = `${groupIndex}-${itemIndex}`
        const isPairedGroup = item.isGroup && item.layers && item.layers.length > 1
        
        return (
          <div
            key={uniqueIndex}
            style={{
              background: '#e0e7ff',
              border: '1px solid #c7d2fe',
              borderRadius: '4px',
              padding: '8px 12px',
              marginBottom: '8px',
              fontSize: '14px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              cursor: 'pointer',
              width: '100%',
              minHeight: '10px',
            }}>
              {/* Layer Names Section */}
              <div
                onClick={() => toggleCollapse(itemIndex)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  flex: 1,
                  paddingRight: '20px',
                }}
              >
                { isPairedGroup 
                  ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {item.layers.map((layer, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontWeight: 500 }}>
                              {`${layer.layer}, ${item?.order?.work_generate_id}`}
                            </div>
                            
                            {/* Show data under each layer when expanded */}
                            {groupVisibleIndex === uniqueIndex && (
                              <div 
                                style={{
                                  padding: '5px',
                                  borderRadius: '4px',
                                  borderLeft: '3px solid #8167e5',
                                  fontSize: '10px',
                                  marginTop: '6px',
                                  marginBottom: '8px',
                                  background: 'rgba(255,255,255,0.5)'
                                }}
                              >
                                <div style={{ fontSize: '10px' }}>
                                  <div style={{ marginBottom: '2px' }}>
                                    <strong>Layer:</strong> {layer.layer || 'N/A'}
                                  </div>
                                  <div style={{ marginBottom: '2px' }}>
                                    <strong>Gsm:</strong> {layer.gsm || 'N/A'} mm
                                  </div>
                                  <div style={{ marginBottom: '2px' }}>
                                    <strong>Bf:</strong> {layer.bf || 'N/A'}
                                  </div>
                                  <div style={{ marginBottom: '2px' }}>
                                    <strong>material:</strong> {formatDate(layer.material) || 'N/A'}
                                  </div>
                                  <div style={{ marginBottom: '2px' }}>
                                    <strong>weight:</strong> {formatDate(layer.weight) || 'N/A'}
                                  </div>
                                  <div style={{ marginBottom: '2px' }}>
                                    <strong>bursting_strength:</strong> {layer.bursting_strength || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Divider line between layers */}
                            {idx < item.layers.length - 1 && (
                              <hr style={{ 
                                margin: '8px 0', 
                                border: 'none', 
                                borderTop: '1px solid #dee2e6',
                                width: '100%'
                              }} />
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  : (
                      <div>
                        <div style={{ fontWeight: 500 }}>
                          {`${item.layer}, ${item.order?.order?.work_generate_id}`}
                        </div>
                        {/* Show data under single layer when expanded */}
                        {groupVisibleIndex === uniqueIndex && (
                          <div 
                            style={{
                              padding: '5px',
                              borderRadius: '4px',
                              borderLeft: '3px solid #8167e5',
                              fontSize: '10px',
                              marginTop: '6px',
                              background: 'rgba(255,255,255,0.5)'
                            }}
                          >
                            <div style={{ fontSize: '10px' }}>
                              <div style={{ marginBottom: '2px' }}>
                                <strong>layer:</strong> {item.layer || 'N/A'}
                              </div>
                              <div style={{ marginBottom: '2px' }}>
                                <strong>Gsm:</strong> {item.gsm || 'N/A'}
                              </div>
                              <div style={{ marginBottom: '2px' }}>
                                <strong>Bf:</strong> {item.bf || 'N/A'} mm
                              </div>
                              <div style={{ marginBottom: '2px' }}>
                                <strong>material:</strong> {item.material || 'N/A'}
                              </div>
                              <div style={{ marginBottom: '2px' }}>
                                <strong>color:</strong>{item.color || 'N/A'}
                              </div>
                              <div style={{ marginBottom: '2px' }}>
                                <strong>weight:</strong> {item.weight || 'N/A'}
                              </div>
                              <div style={{ marginBottom: '2px' }}>
                                <strong>bursting_strength:</strong> {item.bursting_strength || 'N/A'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                }
              </div>

              {/* Right Side Controls */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                flexShrink: 0
              }}>
                {/* Quantity Display */}
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px',
                    lineHeight: '21px',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isPairedGroup 
                    ? item.layers[0].qty ? `${item.layers[0].qty} / ${item.layers[0].qty}` : ''
                    : item.qty ? `${item.qty} / ${item.qty}` : ''
                  }
                </span>

                {/* Toggle Icon */}
                <div 
                  onClick={() => toggleCollapse(itemIndex)}
                  style={{ 
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {groupVisibleIndex === uniqueIndex ? <FaAngleUp /> : <FaAngleDown />}
                </div>

                {/* Dropdown Menu */}
                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() =>navigate(`/workorderlist/view/${item.workOrderId}`)}>
                      <CIcon
                        icon={cilBriefcase}
                        className="me-2"
                        style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                      />
                      View Work Order
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() =>navigate(`/salesorder/view/${item?.order?.order?.sales_order_id || item?.order?.sales_order_id}`)}>
                      <CIcon
                        icon={cilClipboard}
                        className="me-2"
                        style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                      />
                      View Sales Order
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => removeWorkOrderFromGroup(groupIndex,itemIndex)}>
                      <CIcon
                        icon={cilTrash}
                        className="me-2"
                        style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                      />
                      Remove from Group
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setVisibleSplit(true)}>
                      <CIcon
                        icon={cilCut}
                        className="me-2"
                        style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                      />
                      Split Work Order
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        )
      })}

      {/* Empty State */}
      {(!groupOrder?.group_value || groupOrder?.group_value?.length === 0) && (
        <div style={{
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px',
          fontStyle: 'italic',
          padding: '20px'
        }}>
          Drag layers here to group them
        </div>
      )}
    </div>
  )
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const Group = ({
  autoSyncOrders,
  setVisibleSplit,
}) => {
  const [visibleIndex, setVisibleIndex] = useState(null)
  const [groupVisibleIndex, setGroupVisibleIndex] = useState(null)
  const [modalWorkOrder, setModalWorkOrder] = useState(null)
  const [visible, setVisible] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [splitVisible, setSplitVisible] = useState(false)
  const navigate = useNavigate()
  const [groups1,setGroupOrders] = useState()
  const { groups,addWorkOrderToGroup,workOrders,setWorkOrders,refreshData,handleClose,alerts,setAlertsApp,addGroup,resetCompleteData } = useGroupLayers();
  const {registerNextHandler} = useNextHandler()

  const {searchQuery,setGlobalPlaceholder} = useSearch()
  const [error,setError] = useState()



  const fetchWorkOrders = async () => {
    try {
      const response = await productionApi.getWorkOrderInGroup();
      setWorkOrders(response?.data?.workOrders);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    }
  };

  useEffect(() => {
    if(groups.length==0){
      refreshData();  
      fetchWorkOrders();
    }
  }, []);

  const SubmitGroups = async () => {
    try {
      // Check for empty groups
      const emptyGroups = groups.filter(group => !group.group_value || group.group_value.length === 0)
      if (emptyGroups.length > 0) {
        setAlertsApp('warning','Please delete all empty groups before submitting.')
        return;
      }
      if (groups.length !== 0) {
        const payload = groups.map(group => {
          const groupItems = group?.group_value?.flatMap(item => {
            // Case 1: Grouped item with 'layers' (multiple layer objects)
            if (item?.layers && Array.isArray(item?.layers)) {
              return item?.layers?.map(layer => ({
                work_order_id: item?.workOrderId,
                layer_id: layer?.layer_id
              }));
            }
    
            // Case 2: Single layer object directly
            return {
              work_order_id: item?.workOrderId,
              layer_id: item?.layer_id
            };
          });
    
          const groupQty = group?.group_value?.reduce((total, item) => {
            if (item?.layers && Array.isArray(item.layers)) {
              return total + item?.layers?.reduce((subTotal, layer) => subTotal + (layer?.weight || 0), 0);
            }
            return total + (item?.weight || 0);
          }, 0);
    
          return {
            group_name: group?.group_name,
            group_value: groupItems,
            group_Qty: groupQty,
            temporary_status:1
          };
        });
    
        console.log('Payload to submit:', payload);
    
        const response = await productionApi.createGroupInProduction(payload);
        console.log(response);
      }
      
      navigate('/production/form/AllocateRM');

    } catch (err) {
      console.error('Error while submitting groups:', err);
    }
  };


  const removeWorkorderFromProduction = async () => {
    if (!workOrders || workOrders.length === 0) {
      return;
    }
    const workOrderIds = workOrders?.map(order => order.id);
    const body = {
      workOrderIds: workOrderIds,
      production: 'created',
      temporary_status: 0,
    };

    try {
      const response = await productionApi.removeWorkOrdersFromProduction(body);
      refreshData()
      resetCompleteData()
      
    } catch (error) {
      setAlertsApp && setAlertsApp({ type: 'danger', message: error?.response?.data?.message || error.message || 'An error occurred while removing work orders from production.' });
      console.error('Error while removing work orders from production:', error);
    }
  }

  useEffect(() => {
    registerNextHandler(removeWorkorderFromProduction);
  }, [removeWorkorderFromProduction]);

  useEffect(() => {
    setGlobalPlaceholder('Search Work Order...')

    return () => {
      setGlobalPlaceholder('Search...');
    }
  }, []);

  useEffect(() => {
    // addGroup();
  }, []);

  const removeWorkOrderFromGroup = (order, groupIndex) => {
    setGroupOrders((prevGroups) =>
      prevGroups.map((group, index) =>
        index === groupIndex
          ? { ...group, items: group.items.filter((item) => item.id !== order.id) }
          : group,
      ),
    )

    setWorkOrders((prevOrders) => {
      const updatedOrders = [...prevOrders,]
      updatedOrders.sort((a, b) => a.id - b.id)
      return updatedOrders
    })
  }

  const removeWorkOrderFromPlan = (order, groupIndex) => {
    setGroupOrders((prevGroups) =>
      prevGroups?.map((group, index) =>
        index === groupIndex
          ? { ...group, items: group.items.filter((item) => item.id !== order.id) }
          : group,
      ),
    )
  }

  const removeWOFromPlan = async (id) => {
    const params = {
      production: "created",
    };
  
    try {
      const response = await productionApi.removeWorkOrderFromCreationStageInProduction(id, params);

      if (response?.data?.success) {
        fetchWorkOrders();
        console.log('Work Order removed successfully');
      } else {
        console.error('Failed to remove Work Order:', response?.message || 'Unknown error');
      }
  
    } catch (error) {
      console.error('Error while removing Work Order:', error);
    }
  };
  
  const handleAutoSync = () => {
    setGroupOrders((prevGroups) => {
      const isAutoSyncPresent = prevGroups.some((group) => group.name === 'Auto Sync')

      if (isAutoSyncPresent) {
        alert('Auto Sync is already added.')
        return prevGroups
      }
      setWorkOrders(
        workOrders?.filter(
          (order) => !autoSyncOrders?.items?.some((a_order) => order.id === a_order.id),
        ),
      )

      return [autoSyncOrders, ...prevGroups]
    })
  }

  return (
    <div className="h-[calc(98vh-150px)]  overflow-hidden flex flex-col bg-gray-50 ">
      <div className="flex-1 flex flex-col h-full min-h-0">
        <div className="bg-white rounded-xl shadow-lg  overflow-hidden flex-1 flex flex-col h-full min-h-0">
          {/* Screen Header */}
          <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderBottom: '3px solid #5a67d8'
          }}
           className=" text-white px-7 py-2.5 border-b-[3px] border-indigo-600">
            <div className="text-base font-semibold mb-1">
              Step 2: Group Similar Layers
            </div>
            <div className="text-xs opacity-90">
              Drag similar layers into groups for efficient manufacturing
            </div>
          </div>
  
          {/* Screen Content */}
          <div className="p-2.5 flex-1 flex flex-col justify-between min-h-0 h-full">
            {/* Two Column Layout */}
            <div className="grid grid-cols-[1.10fr_2fr] gap-2.5 flex-1 min-h-0 h-full">
              {/* Available Layers Section */}
              <div className="bg-slate-50 rounded-lg p-1 h-full overflow-y-auto min-h-0">
                <div className="text-[15px] font-semibold mb-4 text-gray-700">
                  Available Layers
                </div>
                
                <CustomAlert
                  alerts={alerts}
                  handleClose={handleClose}
                />
                
                {workOrders?.length === 0 ? (
                  <div className="bg-gray-50 rounded-md p-5 text-center">
                    <div className="flex flex-col items-center">
                      <CIcon
                        icon={cilBriefcase}
                        className="text-3xl text-indigo-500 mb-2.5"
                      />
                      <span className="text-gray-500 font-medium">No Work Orders in Production</span>
                      <span className="text-gray-400 text-sm mt-1">
                        Add work orders to begin production planning
                      </span>
                    </div>
                  </div>
                ) : (
                  workOrders
                    ?.filter((order) => order.work_order_sku_values && order.work_order_sku_values.length > 0)
                    ?.map((order) => (
                      <WorkOrderCard
                        key={order.id}
                        order={order}
                        index={order.id}
                        visibleIndex={visibleIndex}
                        setVisibleIndex={setVisibleIndex}
                        removeWOFromPlan={removeWOFromPlan}
                        setModalWorkOrder={setModalWorkOrder}
                        modalWorkOrder={modalWorkOrder}
                        setVisible={setVisible}
                        setVisibleSplit={setVisibleSplit}
                      />
                    ))
                )}
              </div>
  
              {/* Manufacturing Groups Section */}
              <div className="bg-slate-50 rounded-lg p-2.5 h-full overflow-y-auto min-h-0">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[15px] font-semibold text-gray-700">
                    Manufacturing Groups
                  </div>
                  <AddGroupButton text="Group" onClick={handleAutoSync} />
                </div>
                {/* Grid layout for groups: 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  {groups?.length > 0 &&
                    groups?.map((groupOrder, groupIndex) => (
                      <GroupOrderDropZone
                        key={groupIndex}
                        groupOrder={groupOrder}
                        groupIndex={groupIndex}
                        addWorkOrderToGroup={addWorkOrderToGroup}
                        groupVisibleIndex={groupVisibleIndex}
                        setGroupVisibleIndex={setGroupVisibleIndex}
                        removeWorkOrderFromGroup={removeWorkOrderFromGroup}
                        removeWorkOrderFromPlan={removeWorkOrderFromPlan}
                        setModalWorkOrder={setModalWorkOrder}
                        setGroupOrders={setGroupOrders}
                        modalWorkOrder={modalWorkOrder}
                        setVisible={setVisible}
                        setVisibleSplit={setVisibleSplit}
                      />
                    ))}
                </div>
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="flex gap-2 justify-center items-end mt-3">
              {/* <button className="px-3 py-1 rounded-lg border-none font-semibold cursor-pointer transition-all duration-200 ease-in-out bg-gray-200 text-gray-700 hover:bg-gray-300">
                Back
              </button> */}
              <button
                onClick={SubmitGroups}
                disabled={groups.length == 0}
                className={`
                  px-4 py-2 rounded-md border-none font-semibold text-white text-sm
                  transition-all duration-200 ease-in-out
                  bg-indigo-500
                  hover:bg-indigo-600 hover:-translate-y-px
                  disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed
                  shadow-sm
                `}
              >
                allocate raw materials
              </button>
            </div>
          </div>
        </div>
  
        {/* All your existing modals stay exactly the same */}
        <CModal
          alignment="center"
          scrollable
          size="xl"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="VerticallyCenteredScrollableExample2"
        >
          <CModalBody className="d-block">
            <div className="mt-3">
              {modalWorkOrder && (
                <>
                  <span className="mt-5 fw-bold flex items-center gap-2">
                    {modalWorkOrder.order_id}{' '}
                    <div className="w-11 h-10">
                      <ProgressBar
                        value={Math.min(
                          Math.max(
                            parseFloat(
                              (
                                (modalWorkOrder.finished_goods / modalWorkOrder.quantity) *
                                100
                              ).toFixed(1),
                            ),
                            0,
                          ),
                          100,
                        )}
                      />
                    </div>
                    <span className="ml-20 fw-light">
                      Planned
                      <span className="font-medium text-green-700">
                        {' '}
                        {modalWorkOrder.finished_goods}{' '}
                      </span>
                      out of
                      <span className="font-medium text-blue-700">
                        {' '}
                        {modalWorkOrder.quantity}
                      </span>{' '}
                      Quantity.
                    </span>
                  </span>
  
                  <CRow className="mt-3">
                    <CCol xs={4} md={4} lg={4}>
                      <CRow>
                        <CCol xs={6} md={6}>
                          <div className="mt-3 text-bold">
                            SKU Name <br />
                            Print <br />
                            Route <br />
                            Planned Start
                          </div>
                        </CCol>
                        <CCol xs={6} md={6}>
                          <div className="mt-3">
                            {modalWorkOrder.sku_name} <br />
                            {modalWorkOrder.print} <br />
                            {modalWorkOrder.route} <br />
                            {modalWorkOrder.planned_start}
                          </div>
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol xs={4} md={4} lg={4}>
                      <CRow>
                        <CCol xs={6} md={6}>
                          <div className="mt-3 text-bold">
                            Layers <br />
                            Dimensions <br />
                            Qty <br />
                            Planned End
                          </div>
                        </CCol>
                        <CCol xs={6} md={6}>
                          <div className="mt-3">
                            {modalWorkOrder.layers} <br />
                            {modalWorkOrder.dimension} <br />
                            {modalWorkOrder.quantity} <br />
                            {modalWorkOrder.planned_end}
                          </div>
                        </CCol>
                      </CRow>
                    </CCol>
                    <CCol xs={4} md={4} lg={4} className="relative">
                      <CRow>
                        <CIcon
                          icon={cilQrCode}
                          className="absolute right-0 mr-5 -mt-[90px] h-[110px] w-[150px]"
                        />
                      </CRow>
  
                      <CRow className="mt-5">
                        <div>ETD (Estimated Delivery Date) : 12/12/2025</div>
                        <div className="flex items-center gap-1">
                          <span>Linked to Sales</span>
                          <CIcon
                            icon={cilLink}
                            className="me-1 cursor-pointer text-[1.4rem] font-bold"
                          />
                          <span>S0 - 001</span>
                        </div>
                        <div>Client MERK</div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <hr />
                  <CTable striped hover>
                    <CTableHead>
                      <CTableHeaderCell></CTableHeaderCell>
                      <CTableHeaderCell>GSM</CTableHeaderCell>
                      <CTableHeaderCell>Board Size</CTableHeaderCell>
                      <CTableHeaderCell>BF</CTableHeaderCell>
                      <CTableHeaderCell>Color</CTableHeaderCell>
                      <CTableHeaderCell>Print</CTableHeaderCell>
                      <CTableHeaderCell>Allocation Details</CTableHeaderCell>
                      <CTableHeaderCell>Flute Ratio</CTableHeaderCell>
                      <CTableHeaderCell>Allocated Material</CTableHeaderCell>
                    </CTableHead>
                    <CTableBody>
                      {modalWorkOrder.layer_group &&
                        modalWorkOrder.layer_group.map((lg) => (
                          <CTableRow key={lg.id}>
                            {' '}
                            <CTableDataCell>{lg.layer_name}</CTableDataCell>
                            <CTableDataCell>{lg.gsm}</CTableDataCell>
                            <CTableDataCell>{lg.dimensions}</CTableDataCell>
                            <CTableDataCell>{lg.bf}</CTableDataCell>
                            <CTableDataCell>{lg.colors}</CTableDataCell>
                            <CTableDataCell>{modalWorkOrder.print}</CTableDataCell>
                            <CTableDataCell>FG</CTableDataCell>
                            <CTableDataCell>NA</CTableDataCell>
                            <CTableDataCell>
                              <div className="w-11 h-10">
                                <ProgressBar value={80} />
                              </div>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                    </CTableBody>
                  </CTable>
                </>
              )}
            </div>
          </CModalBody>
        </CModal>
  
        <PopUp
          visible={splitVisible}
          setVisible={setSplitVisible}
          width="800px"
          height="500px"
          size="lg"
        >
          <CModalHeader>
            <CModalTitle className="text-[#030303]">Split Work Order</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="mb-3 text-[#023f81] text-[16px] flex float-right">
              <strong>WO - #50015</strong> | <strong>Qty - 150</strong> | <strong>FG - 100</strong>
            </div>
            <h5 className="mb-1 text-[#023f81]">Balance Qty from Work Order:</h5>
            <div className="mb-3 d-flex align-items-center gap-2">
              <label className="form-label mb-0 ">Balance Qty</label>
              <CFormInput
                value="50"
                disabled
                className="w-20 h-[35px] ml-[150px]"
              />
            </div>
            <div className="mb-3 d-flex align-items-center gap-2">
              <label className="form-label mb-0 ">Allocate To</label>
              <CFormSelect
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-[150px] ml-[150px]"
              >
                <option value="">Select type</option>
                <option value="Outsource">Outsource</option>
                <option value="Purchase Order">Purchase Order</option>
              </CFormSelect>
              <CFormInput value="50" disabled className="w-20 h-[35px]" />
            </div>
            <h5 className="text-[#023f81]">Allocated Finished Goods:</h5>
            <div className="d-flex gap-2 mb-3">
              <CFormSelect className="w-[220px] h-[35px] text-[#023f81]">
                <option value="WO-50015">WO - 50015</option>
              </CFormSelect>
              <CFormInput className="w-20 h-[35px]" value="50" disabled />
              <CButton
                className="w-20 h-[35px] bg-[#8761e5] text-white"
                color="success"
              >
                {' '}
                Add
              </CButton>
            </div>
          </CModalBody>
  
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton className="bg-[#023f81] text-white" color="primary">
              Submit
            </CButton>
          </CModalFooter>
        </PopUp>
      </div>
    </div>
  )
}

export default Group