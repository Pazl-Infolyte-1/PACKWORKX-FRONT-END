// actions.js
export const logout = () => {
  return {
    type: 'LOGOUT',
  }
}

// actions.js
export const setCompositeArray = (payload) => ({
  type: 'SET_COMPOSITE_ARRAY',
  payload,
})

export const setRscDeckleSize = (payload) => ({
  type: 'SET_RSC_DECKLE_SIZE',
  payload, // should be an object like { length, height, ups }
})

export const setSkuPartValue = (payload) => ({
  type: 'SET_SKU_PART_VALUE',
  payload, // Array of { sku_id, sku_name, ratio }
})

// actions.js
export const setProductArray = (payload) => ({
  type: 'SET_PRODUCT_ARRAY',
  payload, // Array of selected product IDs
})

export const setStockAdjustmentPOArray = (payload) => ({
  type: 'SET_STOCK_ADJUSTMENT_PO_ARRAY',
  payload, // Array of selected stock adjustment PO IDs
})

export const setStockAdjustmentGRNArray = (payload) => ({
  type: 'SET_STOCK_ADJUSTMENT_GRN_ARRAY',
  payload, // Array of selected stock adjustment GRN IDs
})

export const setAllNotifications = (payload) => ({
  type: 'All_NOTIFICATION',
  payload,
})

export const setNotification = (payload) => ({
  type: 'SET_NOTIFICATION',
  payload,
})

export const clearNotification = (id) => ({
  type: 'CLEAR_NOTIFICATION',
  payload: id,
})

export const clearAllNotifications = () => ({
  type: 'CLEAR_ALL_NOTIFICATIONS',
  payload: [],
})
