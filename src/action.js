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
