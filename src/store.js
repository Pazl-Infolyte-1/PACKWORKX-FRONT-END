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
  boardCalculations:{
    deckle_size: '',
    deckleError: '',
  }
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
        };
      
        case 'SET_CLIENT_ID':
          return {
            ...state,
            clientId: {
              ...state.clientId,
              clientIdVal: payload,
            },
          };

          case 'SET_DECKLE_SIZE':
  return {
    ...state,
    boardCalculations: {
      ...state.boardCalculations,
      deckle_size: payload.deckle_size,
      deckleError: payload.deckleError || '',
    },
  };

    default:
      return state
  }
}

const store = createStore(changeState)
export default store