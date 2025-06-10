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
} from '@coreui/icons'
import './styles.css'
import ProgressBar from './ProgressBar'
import PopUp from '../../components/New/PopUp'
import ThreeDotMenu from '../../components/ThreeDotMenu'
import { useSearch } from '../../components/New/SearchContext'
import apiMethods from '../../api/config'

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

function LayerDragble({ lg, workOrderId }) {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: () => {
      const dragItem = {
        lg,
        workOrderId,
      };
      console.log('Dragging Layer:', dragItem);
      return dragItem;
    }
  }))
  
  return (
    <CCard
      ref={drag}
      className="p-2.5 mt-2.5 rounded-lg flex bg-transparent"
    >
      <div className='flex justify-between'>
        <div className='flex flex-col items-start'>
          <div className="font-medium">{lg.layer}</div>
          <div className="flex gap-3 mt-3 text-sm">
            <span>{lg?.color}</span>
            <span>{lg?.gsm} GSM</span>
            <span>{lg?.bf} BF</span>
            <span>{lg?.flute_type}</span>
            <span>{lg?.weight?.toFixed(2)} KG</span>
            <span>{lg?.material} Material</span>
          </div>
        </div>
        <div className='flex justify-end items-center'>
          {/* Progress bar if needed */}
        </div>
      </div>
    </CCard>
  )
}

function PairedLayersDragble({ layers, workOrderId }) {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: () => {
      const dragItem = {
        layers, // Array of both layers
        workOrderId,
        isPair: true, // Flag to identify this as a pair
      };
      console.log('Dragging Paired Layers:', dragItem);
      return dragItem;
    }
  }))
  
  return (
    <CCard 
      ref={drag}
      className="p-2.5 mt-2.5 bg-transparent  rounded-lg border-2 border-dashed border-gray-300"
    >
      <div className="flex flex-col gap-2">
        {layers.map((lg) => (
          <div key={lg.id} className="flex justify-between  p-2 rounded">
            <div className='flex flex-col items-start'>
              <div className="font-medium">{lg.layer}</div>
              <div className="flex gap-3 mt-2 text-sm">
                <span>{lg?.color}</span>
                <span>{lg?.gsm} GSM</span>
                <span>{lg?.bf} BF</span>
                <span>{lg?.flute_type}</span>
                <span>{lg?.weight?.toFixed(2)} KG</span>
                <span>{lg?.material} Material</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="text-xs text-gray-500 mt-1 text-center">
        Paired Layers (drag together)
      </div> */}
    </CCard>
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


function WorkOrderCard({
  order,
  index,
  visibleIndex,
  setVisibleIndex,
  removeWOFromPlan,
  setModalWorkOrder,
  modalWorkOrder,
  setVisible,
  setVisibleSplit,
}) {
  const [, drag] = useDrag(() => ({
    type: ItemType,
    item: () => {
      const dragItem = {
        order,
        index,
        isGroup: true,
        layers: order.work_order_sku_values,
      };
      console.log('Dragging Work Order:', dragItem);
      return dragItem;
    }
  }))

  const toggleCollapse = () => {
    setVisibleIndex(visibleIndex === index ? null : index)
  }

  const organizeLayers = (layers,id) => {
    if (!layers || layers.length === 0) return { single: [], pairs: [] };
    
    // Sort layers by ID to ensure correct pairing
    const sortedLayers = [...layers].sort((a, b) => a.id - b.id);
    
    const single = [];
    const pairs = [];
    
    // ID 1 is always single (if it exists)
    if (sortedLayers.length > 0 && sortedLayers[0].id === 1) {
      single.push(sortedLayers[0]);
    }
    
    // Group remaining layers in pairs: (2,3), (4,5), (6,7), etc.
    const remainingLayers = sortedLayers.filter(layer => layer.id !== 1);
    
    for (let i = 0; i < remainingLayers.length; i += 2) {
      if (i + 1 < remainingLayers.length) {
        // We have a pair
        pairs.push([remainingLayers[i], remainingLayers[i + 1]]);
      } else {
        // Odd number, last one becomes single
        single.push(remainingLayers[i]);
      }
    }

    console.log(layers)
    console.log(single,id)
    
    return { single, pairs };
  };


  return (
    <CCard
      className="mb-2"
      ref={drag}
      style={{
        backgroundColor: '#f5f4f7',
        borderRadius: '10px',
      }}
    >
      <CCardBody>
        <div className="cursor-pointer flex flex-col">
          <div className="flex justify-between items-center">
            <div className=' flex flex-1 justify-between items-start'>
              <span
                onClick={toggleCollapse}
                className="flex items-center gap-1.5 whitespace-nowrap font-bold"
              >
                {order.work_generate_id} {visibleIndex === index ? <FaAngleUp /> : <FaAngleDown />}
              </span>


              <div className="flex items-start gap-3">
                {/* Progress bar moved to the right side */}

                <h6 className='text-primary'>0/{order.qty}</h6>
                <div className="w-12">
                  <ProgressBar
                    value={0 / order.qty}
                  />
                </div>

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
                        removeWOFromPlan(order.id)
                      },
                    },
                    {
                      label: 'Split Work Order',
                      icon: cilCut,
                      onClick: () => {
                        setVisibleSplit(true)
                      },
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>



        {/* <CCollapse className="custom-collapse" visible={visibleIndex === index}>
          <hr />
          {order?.work_order_sku_values?.map((lg) => (
            <LayerDragble key={lg.id} lg={lg} workOrderId={order.id} />
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '10px',
              marginBottom: '10px',
              marginRight: '10px',
            }}
          >
            <FaEye
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setModalWorkOrder(order)
                setVisible(true)
              }}
            />
          </div>
        </CCollapse> */}

<CCollapse className="custom-collapse" visible={visibleIndex === index}>
  <hr />
  
  {/* Render Top Layer separately */}
          {/* {order?.work_order_sku_values
            ?.filter((lg) => lg.layer?.toLowerCase() === 'top layer')
            .map((lg) => (
              <LayerDragble key={lg.id} lg={lg} workOrderId={order.id} />
            ))} */}

          {/* Group remaining layers */}
          {(() => {
            const { single, pairs } = organizeLayers(order?.work_order_sku_values,order.work_generate_id);
            
            return (
              <>
                {/* Render single layers */}
                {single.map((lg) => (
                  <LayerDragble key={lg.id} lg={lg} workOrderId={order.id} />
                ))}
                
                {/* Render paired layers */}
                {pairs.map((pair, pairIndex) => (
                  <PairedLayersDragble 
                    key={`pair-${pairIndex}`} 
                    layers={pair} 
                    workOrderId={order.id} 
                  />
                ))}
              </>
            );
          })()}

  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '10px',
      marginBottom: '10px',
      marginRight: '10px',
    }}
  >
    <FaEye
      style={{ cursor: 'pointer' }}
      onClick={() => {
        setModalWorkOrder(order)
        setVisible(true)
      }}
    />
  </div>
</CCollapse>

      </CCardBody>
    </CCard>
  )
}

function GroupOrderDropZone({
  groupOrder,
  groupIndex,
  addWorkOrderToGroup,
  groupVisibleIndex,
  setGroupVisibleIndex,
  removeWorkOrderFromGroup,
  removeWorkOrderFromPlan,
  setModalWorkOrder,
  setGroupOrders,
  modalWorkOrder,
  setVisible,
  setVisibleSplit,
}) {
  const [, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item) => {
      if (item.isGroup && item.layers && item.layers.length > 0) {
        item.layers.forEach((layer) => {
          addWorkOrderToGroup({ lg: layer, workOrderId: item.order.id }, groupIndex)
        })
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
    <CCol xs={6} ref={drop} className="mt-3">
      <CCard className="px-2 py-2" style={{ color: '#F3F2F5', borderRadius: '10px' }}>
        <CCard
          className="text-center mb-3 px-2 p"
          style={{
            cursor: 'pointer',
            height: '37px',
            padding: '0px 8px',
            border: '0',
            boxSizing: 'border-box',
            borderRadius: '4px',
            boxShadow: '0px 0px 10px rgba(3,3,3,0.1)',
            backgroundColor: '#8167e5',
            color: '#ffffff',
            fontSize: '18px',
            fontFamily: 'Roboto',
            fontWeight: '500',
            lineHeight: '23px',
            outline: 'none',
          }}
        >
          <CCardBody className="p-2 d-flex align-items-center justify-content-center">
            <CCardText className="text-white bold">{groupOrder.name}</CCardText>
          </CCardBody>
        </CCard>

        {groupOrder?.items?.map((item, itemIndex) => {
          console.log(item)
          const uniqueIndex = `${groupIndex}-${itemIndex}`
          return (
            <CCard
              key={uniqueIndex}
              className="mt-2"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                boxShadow: '0px 2px 10px rgba(3,3,3,0.1)',
              }}
            >
              <CCardBody>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <span
                    onClick={() => toggleCollapse(itemIndex)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.work_generate_id ? item.work_generate_id : `${item.layer_name}, ${item.id}`}

                    {groupVisibleIndex === uniqueIndex ? <FaAngleUp /> : <FaAngleDown />}
                  </span>

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
                    {item.qty ? `${item.qty} / ${item.qty}` : ''}
                  </span>

                  <Dropdown>
                    <Dropdown.Toggle as={CustomToggle} />
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => console.log('View Work Order', item)}>
                        <CIcon
                          icon={cilBriefcase}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        View Work Order
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => console.log('View Sales Order', item)}>
                        <CIcon
                          icon={cilClipboard}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        View Sales Order
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => removeWorkOrderFromGroup(item, groupIndex)}>
                        <CIcon
                          icon={cilTrash}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        Remove from Group
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => removeWorkOrderFromPlan(item, groupIndex)}>
                        <CIcon
                          icon={cilMinus}
                          className="me-2"
                          style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                        />
                        Remove from Plan
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

                <CCollapse className="custom-collapse" visible={groupVisibleIndex === uniqueIndex}>
                  <dl className="text-gray-700 grid grid-cols-1 gap-1 mt-4">
                    <dt className="sr-only">Sku Name</dt>
                    <dd>{item.sku_name}</dd>

                    <dt className="sr-only">Project</dt>
                    <dd>{item.layer || 'N/A'}</dd>

                    <dt className="sr-only"> Dimensions</dt>
                    <dd> Dimensions (mm) - {item.Dimensions || 'N/A'}</dd>

                    <dt className="sr-only">Planned Start</dt>
                    <dd> Planned Start - {formatDate(item.planned_start_date) || 'N/A'}</dd>

                    <dt className="sr-only">Planned End</dt>
                    <dd> Planned End  - {formatDate(item.planned_end_date) || 'N/A'}</dd>

                    <dt className="sr-only">Quantity</dt>
                    <dd>Qty - {item.qty}</dd>

                    <dt className="sr-only">Route</dt>
                    <dd>Route -  {item.Route || "N/A"}</dd>

                    <div className="flex items-center gap-2 text-sm">
                      <label htmlFor="finishedGoods" className="font-medium">
                        Finished Goods -
                      </label>

                      <input
                        id="finishedGoods"
                        type="number"
                        defaultValue={138}
                        className="w-16 px-1 py-0.5 text-sm border rounded"
                      />

                      <button className="p-1 bg-green-600 hover:bg-green-700 rounded text-white">
                        ✔
                      </button>
                    </div>


                    <dt className="sr-only">Qty To Manufacture</dt>
                    <dd>Qty To Manufacture: {item.qty_to_manufacture || "N/A"}</dd>
                  </dl>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '10px',
                      marginBottom: '10px',
                      marginRight: '10px',
                    }}
                  >
                    <FaEye
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setModalWorkOrder(item)
                        setVisible(true)
                      }}
                    />
                  </div>
                </CCollapse>
              </CCardBody>
            </CCard>
          )
        })}
      </CCard>
    </CCol>
  )
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
  const [workOrders,setWorkOrders] = useState([])
  const [groupOrders,setGroupOrders] = useState()
  const {searchQuery,setGlobalPlaceholder} = useSearch()
  const [error,setError] = useState()

  useEffect(() => {
    setGlobalPlaceholder('Search Work Order...')

    return () => {
      setGlobalPlaceholder('Search...');
    }
  }, []);


  const fetchWorkOrders = async () => {
    try {
      const params = {
        sku_name: searchQuery,
      }
      const response = await apiMethods.getWorkOrderInGroup(params);
      setWorkOrders(response?.data?.workOrders); // or response.data if using axios or similar
    } catch (error) {
      console.error('Error fetching work orders:', error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [searchQuery]);


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
      prevGroups.map((group, index) =>
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
      // Optional: set loading state here if needed
      // setLoading(true);
  
      const response = await apiMethods.removeWorkOrderFromCreationStageInProduction(id, params);

  
      if (response?.data?.success) {
        // Success - reload work orders
        fetchWorkOrders();
  
        // Optional: show success message
        console.log('Work Order removed successfully');
        // showToast('Work Order removed successfully', 'success');
      } else {
        // Handle API failure (but no exception)
        console.error('Failed to remove Work Order:', response?.message || 'Unknown error');
        // showToast(response?.message || 'Failed to remove Work Order', 'error');
      }
  
    } catch (error) {
      // Handle exception
      console.error('Error while removing Work Order:', error);
      // showToast('An error occurred while removing Work Order', 'error');
    } finally {
      // Optional: clear loading state here
      // setLoading(false);
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

  const addWorkOrderToGroup = (order, groupIndex) => {
    setGroupOrders((prevGroups) => {
      if (prevGroups[groupIndex]?.name === 'Auto Sync') {
        alert('Cannot manually add work orders to the Auto Sync group.')
        return prevGroups
      }
      const itemToAdd = order.order  //checking whethers its a full workorder
        ? { ...order.order, workOrderId: order.order.id }
        : { ...order.lg, workOrderId: order.workOrderId }

      const isDuplicate = prevGroups[groupIndex].items.some(
        (item) => item.id === itemToAdd.id && item.workOrderId === itemToAdd.workOrderId,
      )

      if (isDuplicate) {
        return prevGroups
      }

      if (order.order) { //filtering out dragges items
        setWorkOrders((prevOrders) => prevOrders.filter((item) => item.id !== order.order.id))
      } else if (order.lg) {
        setWorkOrders((prevOrders) =>
          prevOrders.map((wo) => {
            if (wo.id === order.workOrderId) {
              return {
                ...wo,
                layer_group: wo.layer_group.filter((layer) => layer.id !== order.lg.id),
              }
            }
            return wo
          }),
        )
      }

      return prevGroups.map((group, index) =>
        index === groupIndex ? { ...group, items: [...group.items, itemToAdd] } : group,
      )
    })
  }

  return (
    <>
      <CCol xs={5} className="mt-4">
        <CRow>
          <CCol xs={8}>
            <CCard
              className="text-black bold"
              style={{
                cursor: 'pointer',
                height: '46px',
                padding: '0px 8px',
                border: '0',
                boxSizing: 'border-box',
                borderRadius: '4px',
                boxShadow: '0px 0px 10px rgba(3,3,3,0.1)',
                backgroundColor: '#c7c7f1',
                color: '#000000',
                fontSize: '22px',
                fontFamily: 'Roboto',
                fontWeight: '500',
                lineHeight: '31px',
                outline: 'none',
              }}
            >
              <CCardBody>
                <div className="flex h-full items-center justify-between">
                  <CCardText className=" text-bold ">Work Orders</CCardText>
                  {/* <CIcon
                    icon={cilReload}
                    onClick={handleAutoSync}
                    className="me-2 hover-pointer"
                    style={{ fontSize: '1.4rem', fontWeight: 'bold', verticalAlign: 'middle' }}
                  /> */}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol xs={8}>
            {workOrders
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
              ))}
          </CCol>
        </CRow>
      </CCol>

      <CCol xs={7} className="mt-1">
        <CRow className="mt-2 px-3 py-3">
          {groupOrders?.length > 0 &&
            groupOrders?.map((groupOrder, groupIndex) => (
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
        </CRow>
      </CCol>

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
                  <div style={{ width: '45px', height: '40px' }}>
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
                        className="absolute right-0"
                        style={{
                          marginRight: '20px',
                          marginTop: '-90px',
                          height: '110px',
                          width: '150px',
                        }}
                      />
                    </CRow>

                    <CRow className="mt-5">
                      <div>ETD (Estimated Delivery Date) : 12/12/2025</div>
                      <div className="flex items-center gap-1">
                        <span>Linked to Sales</span>
                        <CIcon
                          icon={cilLink}
                          className="me-1 cursor-pointer"
                          style={{ fontSize: '1.4rem', fontWeight: 'bold' }}
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
                            <div style={{ width: '45px', height: '40px' }}>
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

        {/* <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter> */}
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
              style={{ width: '80px', height: '35px', marginLeft: '150px' }}
            />
          </div>
          <div className="mb-3 d-flex align-items-center gap-2">
            <label className="form-label mb-0 ">Allocate To</label>
            <CFormSelect
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ width: '150px', marginLeft: '150px' }}
            >
              <option value="">Select type</option>
              <option value="Outsource">Outsource</option>
              <option value="Purchase Order">Purchase Order</option>
            </CFormSelect>
            <CFormInput value="50" disabled style={{ width: '80px', height: '35px' }} />
          </div>
          <h5 className="text-[#023f81]">Allocated Finished Goods:</h5>
          <div className="d-flex gap-2 mb-3">
            <CFormSelect style={{ width: '220px', height: '35px', color: '#023f81' }}>
              <option value="WO-50015">WO - 50015</option>
            </CFormSelect>
            <CFormInput style={{ width: '80px', height: '35px' }} value="50" disabled />
            <CButton
              style={{
                width: '80px',
                height: '35px',
                backgroundColor: '#8761e5',
                color: '#ffffff',
              }}
              color="success"
            >
              {' '}
              Add
            </CButton>
          </div>
          {/* <CListGroup style={{ maxWidth: "300px" }}>
        <CListGroupItem className="d-flex justify-content-between">
            <span>WO - 50015</span>
            <span>Qty. 50</span>
        </CListGroupItem>
    </CListGroup> */}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton style={{ backgroundColor: '#023f81', color: '#ffffff' }} color="primary">
            Submit
          </CButton>
        </CModalFooter>
      </PopUp>
    </>
  )
}

export default Group
