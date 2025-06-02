// actions.js
export const logout = () => {
	return {
	  type: 'LOGOUT',
	};
  };

  // actions.js
export const setCompositeArray = (payload) => ({
	type: 'SET_COMPOSITE_ARRAY',
	payload,
  });
  
  export const setRscDeckleSize = (payload) => ({
  type: 'SET_RSC_DECKLE_SIZE',
  payload, // should be an object like { length, height, ups }
});

export const setSkuPartValue = (payload) => ({
  type: 'SET_SKU_PART_VALUE',
  payload, // Array of { sku_id, sku_name, ratio }
});

// actions.js
export const setProductArray = (payload) => ({
  type: 'SET_PRODUCT_ARRAY',
  payload, // Array of selected product IDs
});
