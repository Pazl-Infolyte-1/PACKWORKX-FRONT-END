import React, { useState, useEffect, use } from 'react'
import Forms from '../../common/Forms'
import Table from '../../common/Table'
import { CButton } from '@coreui/react'
import FilterComponent from '../../common/FilterComponent'
import apiMethods from '../../../api/config'
import routes from '../../../routes'
import { useLocation } from 'react-router-dom'
import { GiConsoleController } from 'react-icons/gi'

const Index = () => {
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  const [formFields, setFormFields] = useState([])
  const [pathKey, setPathKey] = useState('')

  useEffect(() => {
    console.log('USe effect running ')
    console.log('Location', location.pathname)
    console.log('Routes', routes)
    const currentRoute = routes.find((route) => route.path === location.pathname)
    console.log('Current Route', currentRoute)
    if (currentRoute) {
      const { key } = currentRoute
      setPathKey(key)
    }

    const fetchData = async () => {
      try {
        console.log('Path Key:', pathKey)
        if (!pathKey) return

        console.log('Api Running')

        const response = await apiMethods.getFormFields(pathKey)
        console.log('API Response:', response)
        setFormFields(response.data)
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchData()
  }, [location.pathname, pathKey])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Clients</h3>
        <div className="ms-auto">
          <CButton color="primary" onClick={() => setVisible(!visible)}>
            Add Clients
          </CButton>
        </div>
      </div>
      <FilterComponent />
      <Forms visible={visible} setVisible={setVisible} formFields={formFields} />
    </div>
  )
}

export default Index
