import { CCard, CCardBody, CCollapse } from "@coreui/react"
import ProgressBar from '../ProgressBar'
import { FaAngleDown, FaAngleUp, FaEye } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useDrag } from "react-dnd"
import ThreeDotMenu from "../../../components/ThreeDotMenu"
import { cilClipboard, cilCut, cilTrash, cilBriefcase } from "@coreui/icons"

const ItemType = 'WORK_ORDER'

function LayerDragble({ lg, workOrderId, order }) {
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
      <div
        ref={drag}
        className="bg-white border border-gray-200 rounded-lg p-1 px-2 mb-2 flex justify-between items-center cursor-grab"
        onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
        onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
      >
        <div>
          <div className="font-bold mb-1">
            {lg.layer}
          </div>
          <div className="text-sm text-gray-500">
            {lg?.gsm} GSM, BF {lg?.bf}{lg?.flute_type ? `, ${lg.flute_type} FLUTE` : ''}, {lg?.weight?.toFixed(2)} KG
            {lg?.color && `, ${lg?.color}`}
          </div>
        </div>
        {/* <div style={{ fontSize: '14px', color: '#374151' }}>
          1 WO
        </div> */}
      </div>
    )
}
  
function PairedLayersDragble({ layers, workOrderId, order }) {
    const [, drag] = useDrag(() => ({
      type: ItemType,
      item: () => {
        const dragItem = {
          layers,
          workOrderId,
          order,
          isGroup: true
        };
        console.log('Dragging Paired Layers:', dragItem);
        return dragItem;
      }
    }))
    
    return (
      <div 
        ref={drag}
        className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-lg p-1 px-2 mb-2 cursor-grab"
        onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
        onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
      >
  
        {layers.map((lg, idx) => (
          <div key={`paired-layer-${lg.layer_id}`} className={idx < layers.length - 1 ? 'mb-2' : ''}>
            <div className="font-semibold text-sm mb-0.5">
              {lg.layer}
            </div>
            <div className="text-xs text-gray-500">
              {lg?.gsm} GSM, BF {lg?.bf}{lg?.flute_type ? `, ${lg?.flute_type} FLUTE` : ''}, {lg?.weight?.toFixed(2)} KG
              {lg?.color && `, ${lg?.color}`}
            </div>
          </div>
        ))}

      </div>
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
        
        const sortedLayers = [...layers].sort((a, b) => a.layer_id - b.layer_id);
        const single = [];
        const pairs = [];
        
        const layer1 = sortedLayers.find(layer => layer.layer_id === 1);
        if (layer1) {
          single.push(layer1);
        }
        
        const remainingLayers = sortedLayers.filter(layer => layer.layer_id !== 1);
        const layerMap = new Map();
        remainingLayers.forEach(layer => {
          layerMap.set(layer.layer_id, layer);
        });
        
        for (let i = 2; i <= Math.max(...remainingLayers.map(l => l.layer_id)); i += 2) {
          const firstLayer = layerMap.get(i);
          const secondLayer = layerMap.get(i + 1);
          
          if (firstLayer && secondLayer) {
            pairs.push([firstLayer, secondLayer]);
          } else if (firstLayer) {
            single.push(firstLayer);
          } else if (secondLayer) {
            single.push(secondLayer);
          }
        }
        
        return { single, pairs };
    };
  
    return (
      <div
        className="bg-white border cursor-pointer border-gray-200 rounded-lg p-1 px-2 mb-1 flex justify-between items-center"
        onClick={toggleCollapse}

      >
        <div className="flex-1">
          <div
            className={`flex justify-between items-center ${visibleIndex === index ? 'mb-2' : ''}`}
          >
            <div>
              <div
                className="font-bold mb-1 text-sm  flex items-center gap-2"
              >
                {order.work_generate_id}
                {visibleIndex === index ? <FaAngleUp size={12} /> : <FaAngleDown size={12} />}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                {order?.work_order_sku_values?.length || 0} layers available
              </div>
            </div>
            {/* Compact row for progress, division, and menu */}
            <div className="flex items-center gap-2 min-w-0">
              {/* Progress bar and division in a row */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-10 h-2 min-w-0 flex items-center">
                  <ProgressBar value={0 / order.qty} height={8} />
                </div>
                {/* <div className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">
                  0/{order.qty}
                </div> */}
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
                  // {
                  //   label: 'Remove from Plan',
                  //   icon: cilTrash,
                  //   onClick: () => {
                  //     removeWOFromPlan(order.id)
                  //   },
                  // },
                ]}
              />
            </div>
          </div>

          {/* Expanded layers view */}
          {visibleIndex === index && (
            <div className="border-t border-gray-200 pt-1">
              {(() => {
                const { single, pairs } = organizeLayers(order?.work_order_sku_values);
                
                return (
                  <>
                    {/* Render single layers */}
                    {single.map((lg) => (
                      <LayerDragble 
                        key={`single-${order.id}-${lg.layer_id}`}
                        lg={lg} 
                        workOrderId={order.id} 
                        order={order} 
                      />
                    ))}
                    
                    {/* Render paired layers */}
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

              {/* Eye icon for modal */}
              <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    setModalWorkOrder(order)
                    // setVisible(true) // Uncomment when you want to show modal
                  }}
                  className="bg-none border-none cursor-pointer p-2 rounded text-gray-500 flex items-center gap-1 text-xs hover:text-indigo-500"
                  onMouseEnter={(e) => e.target.style.color = '#667eea'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}
                >
                  <FaEye size={14} />
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
}