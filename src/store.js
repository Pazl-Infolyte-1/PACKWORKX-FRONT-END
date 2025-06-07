import { legacy_createStore as createStore } from 'redux'

// Load auth state from localStorage if it exists
const loadAuthState = () => {
  try {
    const authState = localStorage.getItem('authState')
    if (authState === null) return undefined
    return JSON.parse(authState)
  } catch (err) {
    return undefined
  }
}

const initialState = {
  sidebarShow: true,
  theme: 'light',
  auth: loadAuthState() || {
    isAuthenticated: false,
    user: null,
    token: null,
    selectedRouteIds: [],
  },
  routeprocess: {
    selectedRouteIds: [],
  },
  clientId: {
    clientIdVal: null,
  },
  boardCalculations: {
    deckle_size: '',
    deckleError: '',
  },
  diecutCalculations: {
    lengthBoard: null,
    widthBoard: null,
    ups: null,
    deckle_size: null,
    deckleError: '',
  },
  skuBuilder: {
    part_value: [],
    part_count: 0,
  },
  productArray: [],
  stockAdjustmentPOArray: [],
  stockAdjustmentGRNArray: [],
}

const changeState = (state = initialState, { type, payload, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }

    case 'LOGIN_SUCCESS':
      const newAuthState = {
        isAuthenticated: true,
        user: payload.user,
        token: payload.token,
      }
      // Save to localStorage
      localStorage.setItem('authState', JSON.stringify(newAuthState))
      return {
        ...state,
        auth: newAuthState,
      }

    case 'LOGOUT':
      // Clear from localStorage
      localStorage.removeItem('authState')
      localStorage.removeItem('token')

      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
        },
      }

    case 'SET_SELECTED_ROUTE_IDS':
      return {
        ...state,
        routeprocess: {
          ...state.routeprocess,
          selectedRouteIds: payload,
        },
      }

    case 'SET_CLIENT_ID':
      return {
        ...state,
        clientId: {
          ...state.clientId,
          clientIdVal: payload,
        },
      }

    case 'SET_DECKLE_SIZE':
      return {
        ...state,
        boardCalculations: {
          ...state.boardCalculations,
          deckle_size: payload.deckle_size,
          deckleError: payload.deckleError || '',
        },
      }
    case 'SET_DIECUT_DECKLE_SIZE':
      const { lengthBoard, widthBoard, ups, deckle_size } = payload
      const isValid = !isNaN(widthBoard) && !isNaN(ups)
      const calculatedMin = widthBoard * ups

      const errorMessage = !isValid
        ? 'Invalid input for deckle size calculation'
        : deckle_size < calculatedMin
          ? `Deckle size must be greater than or equal to ${calculatedMin}`
          : ''

      return {
        ...state,
        diecutCalculations: {
          ...state.diecutCalculations,
          lengthBoard,
          widthBoard,
          ups,
          deckle_size,
          calculatedMin,
          deckleError: errorMessage,
        },
      }
    case 'RESET_DIECUT_CALCULATIONS':
      return {
        ...state,
        diecutCalculations: {
          ...initialState.diecutCalculations,
        },
      }

    // in changeState reducer
    case 'SET_COMPOSITE_ARRAY':
      return {
        ...state,
        compositeArray: payload,
      }
    case 'SET_RSC_DECKLE_SIZE': {
      const { length, height, ups } = payload

      // If all three are null or undefined, reset deckleSize to null (or 0 if you prefer)
      if (length == null && height == null && ups == null) {
        return {
          ...state,
          deckleSize: null, // reset value
        }
      }

      // Calculate only if all three are valid numbers
      if (
        typeof length === 'number' &&
        typeof height === 'number' &&
        typeof ups === 'number' &&
        !isNaN(length) &&
        !isNaN(height) &&
        !isNaN(ups)
      ) {
        const deckleSize = (length + height) * ups + 20
        return {
          ...state,
          deckleSize,
        }
      }

      // For any other cases, do not change state
      return state
    }

    case 'SET_SKU_PART_VALUE':
      return {
        ...state,
        skuBuilder: {
          ...state.skuBuilder,
          part_value: payload,
          part_count: payload.length,
        },
      }
    case 'SET_PRODUCT_ARRAY':
      return {
        ...state,
        auth: {
          ...state.auth,
          productArray: payload,
        },
      }

    case 'SET_STOCK_ADJUSTMENT_PO_ARRAY':
      return {
        ...state,
        auth: {
          ...state.auth,
          stockAdjustmentPOArray: payload,
        },
      }

    case 'SET_STOCK_ADJUSTMENT_GRN_ARRAY':
      return {
        ...state,
        auth: {
          ...state.auth,
          stockAdjustmentGRNArray: payload,
        },
      }

    default:
      return state
  }
}

const store = createStore(changeState)
export default store
