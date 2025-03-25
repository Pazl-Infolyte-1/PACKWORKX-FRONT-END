// import { legacy_createStore as createStore } from 'redux'
// import { getToken } from './db/tokenService'

// // Load auth state from localStorage if it exists
// const loadAuthState = async() => {
//   try {
//     const authState = await getToken()
//     console.log(authState,'kjhsdkfhaskjdfhkjahdfkjh ')
//     if (authState === null) return undefined
//     return JSON.parse(authState)
//   } catch (err) {
//     return undefined
//   }
// }

// const initialState = {
//   sidebarShow: true,
//   theme: 'light',
//   auth: loadAuthState() || {
//     isAuthenticated: false,
//     user: null,
//     token: null,
//   },
// }

// const changeState = (state = initialState, { type, payload, ...rest }) => {
//   switch (type) {
//     case 'set':
//       return { ...state, ...rest }

//     case 'LOGIN_SUCCESS':
//       const newAuthState = {
//         isAuthenticated: true,
//         user: payload.user,
//         token: payload.token,
//       }
//       // Save to localStorage
//       localStorage.setItem('authState', JSON.stringify(newAuthState))
//       return {
//         ...state,
//         auth: newAuthState,
//       }

//     case 'LOGOUT':
//       // Clear from localStorage
//       localStorage.removeItem('authState')
//     localStorage.removeItem('token')

//       return {
//         ...state,
//         auth: {
//           isAuthenticated: false,
//           user: null,
//           token: null,
//         },
//       }

//     default:
//       return state
//   }
// }

// const store = createStore(changeState)
// export default store

// store.js
import { legacy_createStore as createStore } from 'redux';
import { loadAuthState, saveAuthState, clearAuthState } from './db/authService';
import { deleteDB } from 'idb';
import { deleteToken } from './db/tokenService';

// Load initial auth state from SQL.js
const initialAuthState = await loadAuthState();

const initialState = {
  sidebarShow: true,
  theme: 'light',
  auth: initialAuthState || {
    isAuthenticated: false,
    user: null,
    token: null,
  },
};

const changeState = (state = initialState, { type, payload, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };

    case 'LOGIN_SUCCESS':
      const newAuthState = {
        isAuthenticated: true,
        user: payload.user,
        token: payload.token,
      };
      saveAuthState(newAuthState); // Save to SQL.js
      return {
        ...state,
        auth: newAuthState,
      };

    case 'LOGOUT':
      clearAuthState(); // Clear from SQL.js
      deleteToken();
      return {
        ...state,
        auth: {
          isAuthenticated: false,
          user: null,
          token: null,
        },
      };

    default:
      return state;
  }
};

const store = createStore(changeState);
export default store;
