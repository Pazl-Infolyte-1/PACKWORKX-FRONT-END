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
import { FaAngleDown, FaAngleUp, FaEye } from 'react-icons/fa'
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
    <CCard className="mt-3" ref={drag} key={sfg.id}>
      <CCardBody>
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
              gap: '6px', // Creates space between the text and icon
              whiteSpace: 'nowrap', // Prevents text from wrapping
            }}
          >
            Reel {sfg.id} {openSFG === sfg.id ? <FaAngleUp /> : <FaAngleDown />}
          </span>
          <span
            style={{
              fontSize: '16px',
              lineHeight: '21px',
              display: 'flex', // Ensures CIcon stays aligned properly
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
          <CRow className="align-items-center text-sm mt-3 mb-2">
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
              <span>Available Qty: {sfg.quantity_available} KG</span>
            </CCol>
            <CCol md="3" className="text-nowrap">
              <span>Blocked Qty: {sfg.blocked_qty} KG</span>
            </CCol>
          </CRow>
          <hr />
          <CRow className="mt-3">
            <CCol xs={12}>
              {sfg?.work_orders?.map((wo, index) => (
                <CCard
                  key={index}
                  style={{
                    height: '50px',
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.16)',
                    marginTop: '10px',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <div className="d-flex justify-content-between w-100 px-3">
                    <div className="text-center" style={{ width: '50%' }}>
                      <span className="font-semibold text-sm">Work Order</span>
                      <div className="text-xs">{wo.wo_id}</div>
                    </div>
                    <div className="text-center" style={{ width: '50%' }}>
                      <span className="font-semibold text-sm">Quantity (KG)</span>
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
        marginTop: '10px',
        backgroundColor: '#f5f4f7',
        borderRadius: '10px',
      }}
    >
      <CCardBody>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            width: '100%', // Ensures proper space allocation
          }}
        >
          {/* Keep order_id and icon in the same row */}
          <span
            onClick={() => toggleItemCollapse(itemIndex)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px', // Adds space between text and icon
              whiteSpace: 'nowrap', // Prevents text wrapping
            }}
          >
            {`${i?.layer_detail?.layer}`}
            {visibleItemIndex === itemIndex ? <FaAngleUp /> : <FaAngleDown />}
          </span>

          {/* Ensure finished_goods / quantity stay aligned */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
              lineHeight: '21px',
              whiteSpace: 'nowrap',
            }}
          >
            {i.quantity ? (
              <>
                {`${i.finished_goods} / ${i.quantity}`}
                <div
                  style={{ marginLeft: '10px', marginRight: '10px', width: '45px', height: '40px' }}
                >
                  <ProgressBar
                    value={Math.min(
                      Math.max(parseFloat(((i.finished_goods / i.quantity) * 100).toFixed(1)), 0),
                      100,
                    )}
                  />
                </div>
              </>
            ) : (
              <>
                {/* {`80 / 100`} */}
                <div
                  style={{ marginLeft: '10px', marginRight: '10px', width: '45px', height: '40px' }}
                >
                  {/* <ProgressBar value={80} /> */}
                </div>
              </>
            )}
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => console.log('View Work Order')}>
                  <CIcon
                    icon={cilBriefcase}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                  />
                  View Work Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('View Sales Order')}>
                  <CIcon
                    icon={cilClipboard}
                    className="me-2"
                    style={{ color: '#8167e5', fontSize: '1.4rem', fontWeight: 'bold' }}
                  />
                  View Sales Order
                </Dropdown.Item>
                <Dropdown.Item onClick={() => console.log('Remove from Plan')}>
                  <CIcon
                    icon={cilTrash}
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
          </span>
        </div>

        <CCollapse className="custom-collapse" visible={visibleItemIndex === itemIndex}>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            {i.sku_name ? (
              <>
                <span>{i.sku_name}</span>
                <span>{i.dimension}</span>
                <span>{i.layers} PLY</span>
                <span>{i.print}</span>
                <span>Quantity :{i.quantity}</span>
                <span>{i.route}</span>
              </>
            ) : (
              <>
                <span>GSM - {i?.layer_detail?.gsm}</span>
                <span>BF - {i?.layer_detail?.bf}</span>
                <span>{i.weight} kg</span>
                <span>{i?.layer_detail?.color}</span>
              </>
            )}
          </div>
          {i.layer_group
            ? i.layer_group.map((lg) => (
                <CCard
                  key={lg.layer_name} // Added a unique key
                  style={{
                    padding: '10px',
                    marginTop: '10px',
                    backgroundColor: '#f5f4f7',
                    borderRadius: '10px',
                  }}
                >
                  {lg.layer_name}
                  <br />
                  <div
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <span>Board Size (L x W) : {lg.dimensions}</span>
                    <span>{lg.color}</span>
                    <span>{lg.gsm} GSM</span>
                    <span>{lg.bf} BF</span>
                  </div>
                </CCard>
              ))
            : null}
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

  const addQuantity = (groupIndex, item) => {
    console.log('Group Index:', groupIndex)
    console.log('Item:', item)
    setVisibleAllocate(true)
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
      // canDrop: monitor.canDrop(),
      // draggedItem: monitor.getItem(), // 👈 Get the dragged item info
    }),
  }))

  return (
    <CCard
      ref={drop}
      key={groupIndex}
      className="mb-2"
      style={{
        backgroundColor: isOver ? '#e0e0e0' : '#f5f4f7',
        borderRadius: '10px',
        border: isOver ? '2px dashed #8167e5' : 'none',
        transition: 'all 0.3s ease',
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
            onClick={() => toggleGroupCollapse(groupIndex)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            {group.group_name}{' '}
            {visibleGroupIndex === groupIndex ? <FaAngleUp /> : <FaAngleDown />}
          </span>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {group.allocated_Qty}
            /
            {group.group_Qty}

            <div style={{ marginLeft: '10px', width: '45px', height: '40px' }}>
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
          {group?.layer_details?.map((i, itemIndex) => (
            <GroupDropZone
              key={itemIndex}
              i={i}
              itemIndex={itemIndex}
              visibleItemIndex={visibleItemIndex}
              setVisibleItemIndex={setVisibleItemIndex}
            />
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
  const [error, setError] = useState(null);
  const [openSFG, setOpenSFG] = useState(null)
  const {groupOrders,refreshData, sfgData ,handleFilterChange,selectedFilters} = useRawMaterialContext()
  useEffect(()=>{
    console.log(sfgData,'this is the data')
  },[sfgData])




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
    boxShadow: '0px 2px 8px rgba(0,0,0,0.16)',
    backgroundColor: '#ffffff',
    color: '#030303',
    fontSize: '14px',
    fontFamily: 'Roboto, sans-serif',
    lineHeight: '16px',
    outline: 'none',
  }

  const toggleGroupCollapse = (index) => {
    setVisibleGroupIndex(visibleGroupIndex === index ? null : index)
  }

  return (
    <>
      <CCol xs={5} className="mt-4">
        <CRow>
          <CCol xs={12}>
            <CCard
              className="text-black bold"
              style={{
                cursor: 'pointer',
                height: '56px',
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
                <div className="d-flex justify-content-between align-items-center">
                  <CCardText className="mx-auto text-bold">Grouped Work Orders</CCardText>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow className="mt-3 custom-srollbar" style={{ maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
          <CCol xs={12}>
            {groupOrders?.map((group, groupIndex) => (
              <GroupRawMeterialDropZone
                key={groupIndex}
                group={group}
                groupIndex={groupIndex}
                visibleGroupIndex={visibleGroupIndex}
                toggleGroupCollapse={toggleGroupCollapse}
              />
            ))}
          </CCol>
        </CRow>
      </CCol>

      <CCol xs={7} className="mt-1">
        <CRow className="mt-2 px-3 py-3">
          <CCard
            className="mb-2"
            style={{
              backgroundColor: '#f5f4f7',
              borderRadius: '10px',
            }}
          >
            <CCardBody>
              <div className="d-flex fw-bold justify-content-center align-items-center">
                Raw Material
              </div>
              <div
                style={{
                  height: '6px',
                  marginTop: '10px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                }}
              ></div>

              <CRow className="align-items-center mt-3">
                <CCol md="2">
                  <label>Raw Meterial</label>
                  <CFormSelect 
                    style={selectStyles}
                  >
                    <option value="Reel">Reel</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>GSM</label>
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
                  <label>BF</label>
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
                  <label>Color</label>
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
                  <label>Deckle</label>
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
              <CRow className="align-items-center mt-3">
                <CCol md="2">
                  <label>Die</label>
                  <CFormSelect style={selectStyles}>
                    <option>180</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Ink</label>
                  <CFormSelect style={selectStyles}>
                    <option>25</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Stero</label>
                  <CFormSelect style={selectStyles}>
                    <option>90</option>
                  </CFormSelect>
                </CCol>
                <CCol md="2">
                  <label>Glue</label>
                  <CFormSelect style={selectStyles}>
                    <option>25</option>
                  </CFormSelect>
                </CCol>
                <CCol md="4">
                  <label>Stiching Wires</label>
                  <CFormSelect className="w-50" style={selectStyles}>
                    <option>25</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <div
                style={{
                  height: '6px',
                  marginTop: '10px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                }}
              ></div>
              <div style={{ maxHeight: 'calc(96vh - 400px)', overflowY: 'auto' }}>
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
        </CRow>
      </CCol>

    </>
  )
}

export default AllocateRM
