import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { SearchProvider } from './components/New/SearchContext'
import './index.css'

import App from './App'
import store from './store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <SearchProvider>
        <App />
      </SearchProvider>
    </DndProvider>
  </Provider>,
)
