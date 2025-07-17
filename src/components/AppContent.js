import React, { Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import ErrorBoundary from './ErrorBoundary'

// routes config
import routes from '../routes'

const AppContent = () => {
    const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const handleBranchChange = () => {
      setReloadKey((prevKey) => prevKey + 1)
    }

    window.addEventListener('branchIdChanged', handleBranchChange)

    return () => {
      window.removeEventListener('branchIdChanged', handleBranchChange)
    }
  }, [])
  return (
    <ErrorBoundary>
      <CContainer className="bg-white" fluid key={reloadKey}>
        <Suspense fallback={<CSpinner color="primary" />}>
          <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                >
                  {/* Handle nested routes/children */}
                  {route.children && 
                    route.children.map((childRoute, childIdx) => (
                      <Route
                        key={`child-${childIdx}`}
                        path={childRoute.path}
                        element={<childRoute.element />}
                      />
                    ))
                  }
                </Route>
              )
            )
          })}
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </Suspense>
      </CContainer>
    </ErrorBoundary>
  )
}

export default React.memo(AppContent)
