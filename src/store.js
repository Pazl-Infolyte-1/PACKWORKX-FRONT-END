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
  },
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
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
        },
      }

    default:
      return state
  }
}

const store = createStore(changeState)
export default store
