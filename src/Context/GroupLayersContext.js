import React, { createContext, useContext, useEffect, useState } from 'react';
import apiMethods from '../api/config';

const GroupLayersContext = createContext();

export const useGroupLayers = () => useContext(GroupLayersContext);

export const GroupLayersProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);

  const fetchWorkOrders = async () => {
    try {
      const response = await apiMethods.getWorkOrderInGroup();
      setWorkOrders(response?.data?.workOrders);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  useEffect(() => {
    console.log(workOrders, groups);
  }, [workOrders, groups]);

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
      const itemToAdd = order.isGroup
        ? { ...order.lg, workOrderId: order.order.id, order }
        : { ...order.lg, workOrderId: order.workOrderId,order };

      // Check if the item to add has layer_id 1
      const isAddingLayer1 = itemToAdd.layer_id === 1;
      
      // Check if the target group has any items
      const targetGroup = prevGroups[groupIndex];
      const hasItems = targetGroup.group_value.length > 0;
      
      // Check if target group has layer_id 1 or other layer_ids
      const targetHasLayer1 = hasItems && targetGroup.group_value.some(item => item.layer_id === 1);
      const targetHasOtherLayers = hasItems && targetGroup.group_value.some(item => item.layer_id !== 1);

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
      const isDuplicate = prevGroups[groupIndex].group_value.some(
        (item) => item.layer_id === itemToAdd.layer_id && item.workOrderId === itemToAdd.workOrderId
      );

      if (isDuplicate) {
        return prevGroups;
      }

      return prevGroups.map((group, index) =>
        index === groupIndex
          ? { ...group, group_value: [...group.group_value, itemToAdd] }
          : group
      );
    });

    // Remove the layer from workOrders after successfully adding to group
    if(!Rejected)
      {setWorkOrders((prevWorkOrders) => {
      const layerToRemove = order.isGroup
        ? { layer_id: order.lg.layer_id, workOrderId: order.order.id }
        : { layer_id: order.lg.layer_id, workOrderId: order.workOrderId };

      return prevWorkOrders.map((workOrder) => {
        // Check if this is the work order that contains the layer to remove
        if (workOrder.id === layerToRemove.workOrderId) {
          // Filter out the specific layer
          const updatedSkuValues = workOrder.work_order_sku_values.filter(
            (layer) => layer.layer_id !== layerToRemove.layer_id
          );

          // If no layers remain, you might want to remove the entire work order
          // or keep it with empty array - adjust based on your requirements
          return {
            ...workOrder,
            work_order_sku_values: updatedSkuValues
          };
        }
        return workOrder;
      }).filter(workOrder => workOrder.work_order_sku_values.length > 0); // Optional: remove work orders with no layers
    });
  }
  };

  // Optional: Function to remove layer from group and add back to work order
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
          // Check if layer already exists (shouldn't happen, but safety check)
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
        return workOrder;
      });
    });
  };

  const value = {
    workOrders,
    groups,
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