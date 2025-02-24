import React, { useState, useEffect, use } from 'react'
import Form from '../../common/Form'
import Table from '../../common/Table'
import { CButton } from '@coreui/react'
import FilterComponent from '../../common/FilterComponent'

const Employee = () => {
  const employee_data = [
    {
      headers: ['Employee ID', 'Name', 'Role', 'Department', 'Work Schedule'],
      values: [
        [1, 'John Doe', 'Manager', 'Sales', '9:00 AM - 5:00 PM'],
        [2, 'Jane Smith', 'Developer', 'Engineering', '9:00 AM - 5:00 PM'],
        [3, 'Emily Johnson', 'Designer', 'Marketing', '9:00 AM - 5:00 PM'],
        [4, 'Michael Brown', 'Developer', 'Engineering', '9:00 AM - 5:00 PM'],
      ],
    },
  ]
  const [visible, setVisible] = useState(false)

  const [formFields, setFormFields] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://mocki.io/v1/dc180e68-cf82-4089-bf16-506a8662285c')

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        setFormFields(data)
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Employee</h3>
        <div className="ms-auto">
          <CButton color="primary" onClick={() => setVisible(!visible)}>
            Add Employee
          </CButton>
        </div>
      </div>
      <FilterComponent />
      <Form visible={visible} setVisible={setVisible} formFields={formFields} />
      <Table data={employee_data} />
    </>
  )
}

export default Employee
