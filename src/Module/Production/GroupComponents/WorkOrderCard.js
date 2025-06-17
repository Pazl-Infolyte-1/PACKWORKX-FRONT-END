import { CCard, CCardBody, CCollapse } from "@coreui/react"
import ProgressBar from '../ProgressBar'
import { FaAngleDown, FaAngleUp, FaEye } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useDrag } from "react-dnd"
import ThreeDotMenu from "../../../components/ThreeDotMenu"
import { cilClipboard, cilCut, cilTrash, cilBriefcase } from "@coreui/icons"

const ItemType = 'WORK_ORDER'

function LayerDragble({ lg, workOrderId,order }) {
    const [, drag] = useDrag(() => ({
      type: ItemType,
      item: () => {
        const dragItem = {
          lg,
          workOrderId,
          order
        };
        console.log('Dragging Layer:', dragItem);
        return dragItem;
      }
    }))
    
    return (
      <CCard
        ref={drag}
        className="p-2 mt-1.5 rounded-lg flex bg-transparent"
      >
        <div className='flex justify-between'>
          <div className='flex flex-col items-start'>
            <div className="text-xs font-medium">{lg.layer}</div>
            <div className="flex gap-2 mt-2 text-[10px]">
              <span>{lg?.color}</span>
              <span>{lg?.gsm} GSM</span>
              <span>{lg?.bf} BF</span>
              {lg?.flute_type && <span>{lg.flute_type} FLUTE</span>}
              <span>{lg?.weight?.toFixed(2)} KG</span>
              {/* <span>{lg?.material} Material</span> */}
            </div>
          </div>
          <div className='flex justify-end items-center'>
            {/* Progress bar if needed */}
          </div>
        </div>
      </CCard>
    )
  }
  
  function PairedLayersDragble({ layers, workOrderId,order }) {

    const [, drag] = useDrag(() => ({
      type: ItemType,
      item: () => {
        const dragItem = {
          layers,
          workOrderId,
          order,
          isGroup: true // Flag to identify this as a pair
        };
        console.log('Dragging Paired Layers:', dragItem);
        return dragItem;
      }
    }))
    
    return (
      <CCard 
        ref={drag}
        className="mt-1.5 bg-transparent rounded-lg border-2 border-dashed border-gray-300"
      >
        <div className="flex flex-col gap-2">
          {layers.map((lg) => (
            <div key={`paired-layer-${lg.layer_id}`} className="flex justify-between p-1.5 rounded">
              <div className='flex flex-col items-start'>
                <div className="text-xs font-medium">{lg.layer}</div>
                <div className="flex gap-2 mt-1 text-[10px]">
                  <span>{lg?.color}</span>
                  <span>{lg?.gsm} GSM</span>
                  <span>{lg?.bf} BF</span>
                  {lg?.flute_type && <span>{lg.flute_type} FLUTE</span>}
                  <span>{lg?.weight?.toFixed(2)} KG</span>
                  {/* <span>{lg?.material} Material</span> */}
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

export default function WorkOrderCard({
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
  
    const navigate = useNavigate()
  
    const toggleCollapse = () => {
      setVisibleIndex(visibleIndex === index ? null : index)
    }
  
    const handleViewWorkOrder = (id) => {
      navigate(`/workorderlist/view/${id}`)
    }
  
    const handleViewSalesOrder = (id) => {
      navigate(`/salesorder/view/${id}`)
    }
    const organizeLayers = (layers) => {
        if (!layers || layers.length === 0) return { single: [], pairs: [] };
        
        // Sort layers by ID to ensure correct pairing
        const sortedLayers = [...layers].sort((a, b) => a.layer_id - b.layer_id);
        
        const single = [];
        const pairs = [];
        
        // ID 1 is always single (if it exists)
        const layer1 = sortedLayers.find(layer => layer.layer_id === 1);
        if (layer1) {
          single.push(layer1);
        }
        
        // Get remaining layers (excluding layer 1)
        const remainingLayers = sortedLayers.filter(layer => layer.layer_id !== 1);
        
        // Group layers based on their original pairing logic
        // Layers should be paired as: (2,3), (4,5), (6,7), etc.
        const layerMap = new Map();
        remainingLayers.forEach(layer => {
          layerMap.set(layer.layer_id, layer);
        });
        
        // Check for pairs starting from layer_id 2
        for (let i = 2; i <= Math.max(...remainingLayers.map(l => l.layer_id)); i += 2) {
          const firstLayer = layerMap.get(i);
          const secondLayer = layerMap.get(i + 1);
          
          if (firstLayer && secondLayer) {
            // Both layers exist, create a pair
            pairs.push([firstLayer, secondLayer]);
          } else if (firstLayer) {
            // Only first layer exists, add as single
            single.push(firstLayer);
          } else if (secondLayer) {
            // Only second layer exists, add as single
            single.push(secondLayer);
          }
        }
        
        console.log('Organized layers - single:', single, 'pairs:', pairs);
        
        return { single, pairs };
      };
  
  
    return (
      <CCard
        className="mb-2"
        style={{
          backgroundColor: '#f5f4f7',
          borderRadius: '5px',
        }}
      >
        <CCardBody className="p-2">
          <div className="cursor-pointer flex flex-col">
            <div className="flex justify-between items-center">
              <div className='flex flex-1 justify-between items-start'>
                <span
                  onClick={toggleCollapse}
                  className="flex items-center gap-1 whitespace-nowrap font-bold text-xs"
                >
                  {order.work_generate_id} {visibleIndex === index ? <FaAngleUp /> : <FaAngleDown />}
                </span>
  
  
                <div className="flex items-start gap-2 text-xs">
                  {/* Progress bar moved to the right side */}
  
                  <h6 className='text-primary'>0/{order.qty}</h6>
                  <div className="w-8">
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
                          handleViewWorkOrder(order.id)
                        },
                      },
                      {
                        label: 'View Sales Order',
                        icon: cilClipboard,
                        onClick: () => {
                          handleViewSalesOrder(order.sales_order_id)
                        },
                      },
                      {
                        label: 'Remove from Plan',
                        icon: cilTrash,
                        onClick: () => {
                          removeWOFromPlan(order.id)
                        },
                      },
                    //   {
                    //     label: 'Split Work Order',
                    //     icon: cilCut,
                    //     onClick: () => {
                    //       setVisibleSplit(true)
                    //     },
                    //   },
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
  const { single, pairs } = organizeLayers(order?.work_order_sku_values, order.work_generate_id);
  
  return (
    <>
      {/* Render single layers */}
      {single.map((lg) => (
        <LayerDragble 
          key={`single-${order.id}-${lg.layer_id}`} // More specific key
          lg={lg} 
          workOrderId={order.id} 
          order={order} 
        />
      ))}
      
      {pairs.map((pair) => {
        const pairKey = `pair-${order.id}-${pair.map(p => p.layer_id).sort().join('-')}`;
        
        return (
          <PairedLayersDragble 
            key={pairKey}
            order={order}
            layers={pair} 
            workOrderId={order.id} 
          />
        );
      })}
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
        //   setVisible(true)
        }}
      />
    </div>
  </CCollapse>
  
        </CCardBody>
      </CCard>
    )
  }