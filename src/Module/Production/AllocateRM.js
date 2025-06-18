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
    <CCard className="mt-2" ref={drag} key={sfg.id} style={{ border: 'none' }}>
      <CCardBody style={{ padding: '14px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <span
            onClick={() => toggleCollapse(sfg.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              fontSize: '0.85rem',
              fontWeight: '500',
            }}
          >
            Reel {sfg.id} {openSFG === sfg.id ? <FaAngleUp size={12} /> : <FaAngleDown size={12} />}
          </span>
          <span
            style={{
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
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
            <CCol md="2" className="text-nowrap">
              <span>GSM: {sfg?.item?.default_custom_fields?.gsm}</span>
            </CCol>
            <CCol md="2" className="text-nowrap">
              <span>BF: {sfg?.item?.default_custom_fields?.bf}</span>
            </CCol>
            <CCol md="2" className="text-nowrap">
              <span>Deckle: {sfg?.item?.default_custom_fields?.deckle_size}</span>
            </CCol>
            <CCol md="3" className="text-nowrap">
              <span>Available: {sfg?.quantity_available} KG</span>
            </CCol>
            <CCol md="3" className="text-nowrap">
              <span>Blocked: {sfg?.quantity_blocked} KG</span>
            </CCol>
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
      className="mb-2"
      style={{
        marginTop: '6px',
        backgroundColor: '#f5f4f7',
        borderRadius: '8px',
        padding: '4px',
        border: 'none'
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

  const addQuantity = (groupIndex, item) => {
    console.log('Group Index:', groupIndex)
    console.log('Item:', item)
    setVisibleAllocate(true)
  }


  const handleDeAllocateClick = async (inventory_id, total_qty, grpId) => {
    try {
      setIsDeallocating(true);
      setDeallocationError(null);

      const payload = {
        deallocations: [
          {
            production_group_id: grpId,
            inventory_id: inventory_id,
            quantity_to_deallocate: total_qty,
          }
        ]
      }

      const response = await productionApi.deAllocateInventoryFromGroup({...payload});
      

      // Refresh data after successful deallocation
      await getData();
      
    } catch (error) {
      console.error('Deallocation error:', error.response.data.message);
      setAlertsApp([{severity:"error",message:error.response.data.message}])
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

  return (
    <CCard
      ref={drop}
      key={groupIndex}
      className="mb-2"
      style={{
        backgroundColor: isOver ? '#e0e0e0' : '#f5f4f7',
        borderRadius: '8px',
        border: isOver ? '2px dashed #8167e5' : 'none',
        transition: 'all 0.3s ease',
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
          <span
            onClick={() => toggleGroupCollapse(groupIndex)}
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
            {group.allocated_Qty}
            /
            {group.group_Qty}

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
              {group?.layer_details?.map((i, itemIndex) => (
                <GroupDropZone
                  key={itemIndex}
                  i={i}
                  itemIndex={itemIndex}
                  visibleItemIndex={visibleItemIndex}
                  setVisibleItemIndex={setVisibleItemIndex}
                />
              ))}
            </div>

            {/* Right Column - History List */}
            <div className="custom-scrollbar" style={{ 
              flex: 1,
              backgroundColor: '#f5f4f7',
              marginTop: '5px',
              borderLeft: '1px solid #e5e7eb',
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
                {group.allocation_history?.allocation_by_inventory?.map((allocation, index) => (
                  <div key={index} style={{
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
                      onClick={() => !isDeallocating && handleDeAllocateClick(allocation.inventory_id, allocation.total_allocated_qty, group.id)}
                    />
                  </div>
                ))}
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
  const {groupOrders,refreshData, sfgData ,handleFilterChange,selectedFilters,alerts,setAlertsApp,handleClose} = useRawMaterialContext()







  useEffect(() => {
    refreshData()
    }, [])

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

  return (
    <CRow className="mt-4">
        <CustomAlert
        alerts={alerts}
        handleClose={handleClose}
        />
      {/* Groups Column */}
      <CCol xs={6}>
        <div
          className="text-black bold w-full bg-[#c7c7f1] text-md p-2 font-[Roboto]"
        >
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center">
              <CCardText className=" ">Grouped Work Orders</CCardText>
            </div>
          </CCardBody>
        </div>
        <div className="mt-3 custom-srollbar" style={{ height: 'calc(95vh - 200px)', overflowY: 'auto' }}>
          {groupOrders?.length === 0 ? (
            <CCard
              className="mb-2"
              style={{
                backgroundColor: '#f5f4f7',
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
          className="mb-2"
          style={{
            backgroundColor: '#f5f4f7',
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
    </CRow>
  )
}

export default AllocateRM
