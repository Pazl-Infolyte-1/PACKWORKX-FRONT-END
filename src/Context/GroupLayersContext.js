import React, { createContext, useContext, useEffect, useState } from 'react';

const GroupLayersContext = createContext();

export const useGroupLayers = () => useContext(GroupLayersContext);

export const GroupLayersProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);

  const addGroup = () => {
    setGroups((prev) => [
      ...prev,
      {
        id: Date.now(),
        group_name: `Group ${prev.length + 1}`,
        group_value: [],
      },
    ]);
  };

  const updateGroup = (groupId, newData) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? { ...group, ...newData }
          : group
      )
    );
  };

  const addWorkOrderToGroup = (order, groupIndex) => {
    let Rejected = false
    setGroups((prevGroups) => {
      let itemToAdd;
      
      console.log('Adding to group:', order); // Debug log
      
      // Handle paired layers (isGroup = true)
      if (order.isGroup && order.layers) {
        itemToAdd = {
          layers: order.layers,
          workOrderId: order.workOrderId,
          order: order.order,
          isGroup: true
        };
        
        console.log('Paired layers item to add:', itemToAdd); // Debug log
        
        // For paired layers, check layer_id constraints
        // Check if any of the layers being added has layer_id 1
        const hasLayer1 = order.layers.some(layer => layer.layer_id === 1);
        const hasOtherLayers = order.layers.some(layer => layer.layer_id !== 1);
        
        // Check if the target group has any items
        const targetGroup = prevGroups[groupIndex];
        const hasItems = targetGroup.group_value.length > 0;
        
        if (hasItems) {
          // Check if target group has layer_id 1 or other layer_ids
          const targetHasLayer1 = targetGroup.group_value.some(item => 
            item.isGroup 
              ? item.layers.some(layer => layer.layer_id === 1)
              : item.layer_id === 1
          );
          const targetHasOtherLayers = targetGroup.group_value.some(item => 
            item.isGroup
              ? item.layers.some(layer => layer.layer_id !== 1)
              : item.layer_id !== 1
          );

          // Rule 1: Can't add layer1 to a group that has other layers
          if (hasLayer1 && targetHasOtherLayers) {
            alert("Unable to move: Layer 1 cannot be added to a group with other layers");
            Rejected = true
            return prevGroups;
          }
          
          // Rule 2: Can't add other layers to a group that has layer1
          if (hasOtherLayers && targetHasLayer1) {
            alert("Unable to move: Only Layer 1 can be added to this group");
            Rejected = true
            return prevGroups;
          }
        }

        // Check for duplicates - for paired layers, check if any layer already exists
        const isDuplicate = prevGroups[groupIndex].group_value.some((item) => {
          if (item.isGroup) {
            return item.workOrderId === itemToAdd.workOrderId && 
                   item.layers.some(existingLayer => 
                     order.layers.some(newLayer => 
                       existingLayer.layer_id === newLayer.layer_id
                     )
                   );
          } else {
            return order.layers.some(layer => 
              item.layer_id === layer.layer_id && item.workOrderId === itemToAdd.workOrderId
            );
          }
        });

        if (isDuplicate) {
          return prevGroups;
        }
      } else {
        // Handle single layer
        itemToAdd = order.isGroup
          ? { ...order.lg, workOrderId: order.order.id, order }
          : { ...order.lg, workOrderId: order.workOrderId, order };

        // Check if the item to add has layer_id 1
        const isAddingLayer1 = itemToAdd.layer_id === 1;
        
        // Check if the target group has any items
        const targetGroup = prevGroups[groupIndex];
        const hasItems = targetGroup.group_value.length > 0;
        
        // Check if target group has layer_id 1 or other layer_ids
        const targetHasLayer1 = hasItems && targetGroup.group_value.some(item => 
          item.isGroup 
            ? item.layers.some(layer => layer.layer_id === 1)
            : item.layer_id === 1
        );
        const targetHasOtherLayers = hasItems && targetGroup.group_value.some(item => 
          item.isGroup
            ? item.layers.some(layer => layer.layer_id !== 1)
            : item.layer_id !== 1
        );

        // Rule 1: Can't add layer1 to a group that has other layers
        if (isAddingLayer1 && targetHasOtherLayers) {
          alert("Unable to move: Layer 1 cannot be added to a group with other layers");
          Rejected = true
          return prevGroups;
        }
        
        // Rule 2: Can't add other layers to a group that has layer1
        if (!isAddingLayer1 && targetHasLayer1) {
          alert("Unable to move: Only Layer 1 can be added to this group");
          Rejected = true
          return prevGroups;
        }

        // Check for duplicates
        const isDuplicate = prevGroups[groupIndex].group_value.some((item) => {
          if (item.isGroup) {
            return item.layers.some(layer => 
              layer.layer_id === itemToAdd.layer_id && item.workOrderId === itemToAdd.workOrderId
            );
          } else {
            return item.layer_id === itemToAdd.layer_id && item.workOrderId === itemToAdd.workOrderId;
          }
        });

        if (isDuplicate) {
          return prevGroups;
        }
      }

      return prevGroups.map((group, index) =>
        index === groupIndex
          ? { ...group, group_value: [...group.group_value, itemToAdd] }
          : group
      );
    });

    // Remove the layer(s) from workOrders after successfully adding to group
    if (!Rejected) {
      setWorkOrders((prevWorkOrders) => {
        return prevWorkOrders.map((workOrder) => {
          if (order.isGroup && order.layers) {
            // Handle paired layers removal
            if (workOrder.id === order.workOrderId) {
              const layerIdsToRemove = order.layers.map(layer => layer.layer_id);
              const updatedSkuValues = workOrder.work_order_sku_values.filter(
                (layer) => !layerIdsToRemove.includes(layer.layer_id)
              );

              return {
                ...workOrder,
                work_order_sku_values: updatedSkuValues
              };
            }
          } else {
            // Handle single layer removal
            const layerToRemove = order.isGroup
              ? { layer_id: order.lg.layer_id, workOrderId: order.order.id }
              : { layer_id: order.lg.layer_id, workOrderId: order.workOrderId };

            if (workOrder.id === layerToRemove.workOrderId) {
              const updatedSkuValues = workOrder.work_order_sku_values.filter(
                (layer) => layer.layer_id !== layerToRemove.layer_id
              );

              return {
                ...workOrder,
                work_order_sku_values: updatedSkuValues
              };
            }
          }
          return workOrder;
        });
      });
    }
  };

  // Modified function to remove layer(s) from group and add back to work order
  const removeWorkOrderFromGroup = (groupIndex, itemIndex) => {
    const itemToRemove = groups[groupIndex].group_value[itemIndex];
    
    // Remove from group
    setGroups((prevGroups) =>
      prevGroups.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              group_value: group.group_value.filter((_, i) => i !== itemIndex)
            }
          : group
      )
    );

    // Add back to work orders
    setWorkOrders((prevWorkOrders) => {
      return prevWorkOrders.map((workOrder) => {
        if (workOrder.id === itemToRemove.workOrderId) {
          if (itemToRemove.isGroup && itemToRemove.layers) {
            // Handle paired layers - add both layers back
            const layersToAdd = [];
            
            itemToRemove.layers.forEach(layer => {
              const layerExists = workOrder.work_order_sku_values.some(
                (existingLayer) => existingLayer.layer_id === layer.layer_id
              );
              
              if (!layerExists) {
                layersToAdd.push({
                  layer_id: layer.layer_id,
                  layer: layer.layer,
                  gsm: layer.gsm,
                  bf: layer.bf,
                  material: layer.material,
                  color: layer.color,
                  weight: layer.weight,
                  bursting_strength: layer.bursting_strength,
                  layer_status: "ungrouped",
                  flute_type: layer.flute_type
                });
              }
            });
            
            if (layersToAdd.length > 0) {
              return {
                ...workOrder,
                work_order_sku_values: [
                  ...workOrder.work_order_sku_values,
                  ...layersToAdd
                ]
              };
            }
          } else {
            // Handle single layer
            const layerExists = workOrder.work_order_sku_values.some(
              (layer) => layer.layer_id === itemToRemove.layer_id
            );
            
            if (!layerExists) {
              return {
                ...workOrder,
                work_order_sku_values: [
                  ...workOrder.work_order_sku_values,
                  {
                    layer_id: itemToRemove.layer_id,
                    layer: itemToRemove.layer,
                    gsm: itemToRemove.gsm,
                    bf: itemToRemove.bf,
                    material: itemToRemove.material,
                    color: itemToRemove.color,
                    weight: itemToRemove.weight,
                    bursting_strength: itemToRemove.bursting_strength,
                    layer_status: "ungrouped",
                    flute_type: itemToRemove.flute_type
                  }
                ]
              };
            }
          }
        }
        return workOrder;
      });
    });
  };

  const value = {
    workOrders,
    groups,
    setWorkOrders,
    addGroup,
    updateGroup,
    addWorkOrderToGroup,
    removeWorkOrderFromGroup
  };

  return (
    <GroupLayersContext.Provider value={value}>
      {children}
    </GroupLayersContext.Provider>
  );
};