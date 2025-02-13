import React, { useState, useEffect } from 'react'
import Form from '../../common/Form'
import Table from '../../common/Table'
import { CButton } from '@coreui/react'
import FilterComponent from '../../common/FilterComponent'

function Index() {
  const [visible, setVisible] = useState(false)
  const [formFields, setFormFields] = useState([])

  const salesData = [
    {
      headers: [
        'Order ID',
        'Customer Name',
        'Product',
        'Quantity',
        'Price',
        'Total',
        'Status',
        'Order Date',
      ],
      values: [
        [101, 'Alice Johnson', 'Laptop', 2, 800, 1600, 'Shipped', '2025-02-01'],
        [102, 'Bob Smith', 'Smartphone', 1, 600, 600, 'Pending', '2025-02-03'],
        [103, 'Charlie Lee', 'Tablet', 3, 400, 1200, 'Delivered', '2025-01-28'],
        [104, 'Dana White', 'Headphones', 5, 100, 500, 'Shipped', '2025-02-05'],
        [105, 'Eva Green', 'Monitor', 2, 300, 600, 'Cancelled', '2025-02-02'],
      ],
    },
  ]

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
        <h3>Sales Orders</h3>

        <div className="ms-auto">
          <CButton color="primary" onClick={() => setVisible(!visible)}>
            Add Sales Order
          </CButton>
        </div>
      </div>
      <FilterComponent />
      <Form visible={visible} setVisible={setVisible} formFields={formFields} />
      <Table data={salesData} />
    </>
  )
}

export default Index
