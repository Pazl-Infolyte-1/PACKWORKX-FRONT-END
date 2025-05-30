import React, { useEffect, useState } from 'react'
import OrderForm from './OrderForm'
import apiMethods from '../../api/config'
import Loader from '../../components/New/Loader'
import CustomAlert from '../../components/New/CustomAlert'

const AddPurchaseOrder = ({ isEdit, selectedPoId, setDrawer, onSuccess, fetchData }) => {
  const [loading, setLoading] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [clientData, setClientData] = useState([])
  const [orderData, setOrderData] = useState({
    po_date: new Date().toISOString().split('T')[0],
    valid_till: '',
    supplier_id: '',
    supplier_name: '',
    supplier_contact: '',
    supplier_email: '',
    billing_address: '',
    shipping_address: '',
    payment_terms: '',
    freight_terms: '',
  })
  const [itemsData, setItemsData] = useState([])

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        // const initial = await apiMethods.getClients()
        // const count = initial?.length || 100

        const fullData = await apiMethods.getClients()
        const clientsArray = fullData.data

        if (Array.isArray(clientsArray)) {
          const vendorList = clientsArray.filter((client) => client.entity_type === 'Vendor')
          setClientData(vendorList)
        } else {
          console.error('Expected an array but received:', clientsArray)
        }
      } catch (error) {
        console.error('Error in useEffect:', error)
      }
    }

    fetchVendors()
  }, [])

  useEffect(() => {
    if (!isEdit) {
      setOrderData({
        po_date: new Date().toISOString().split('T')[0],
        valid_till: '',
        supplier_id: '',
        supplier_name: '',
        supplier_contact: '',
        supplier_email: '',
        billing_address: '',
        shipping_address: '',
        payment_terms: '',
        freight_terms: '',
      })
      setItemsData([{ item_id: '', quantity: 1 }]) // clear previous items
    }
  }, [isEdit])

  useEffect(() => {
    if (isEdit && selectedPoId) {
      fetchPoDetails()
    }
  }, [isEdit, selectedPoId])

  const fetchPoDetails = async () => {
    setLoading(true)
    try {
      const response = await apiMethods.getPurchaseOrderById(selectedPoId)
      console.log(response, 'singlepo')
      if (response.data) {
        const { items, ...orderDetails } = response.data
        setOrderData(orderDetails)
        setItemsData(items || [])
      }
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message: error.response?.data?.message || 'Failed to fetch PO details',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (formData) => {
    setLoading(true)
    try {
      const payload = {
        ...formData.orderData,
        items: formData.itemsData.map((item) => ({
          ...item,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          total: parseFloat(item.price) * parseInt(item.quantity),
        })),
      }
      console.log('Payload:', payload)

      let response
      if (isEdit) {
        response = await apiMethods.updatePurchaseOrder(selectedPoId, payload)
        setAlerts([
          { severity: 'success', message: response?.data?.message || 'Successfull updated' },
        ])
        setTimeout(() => {
          setDrawer(false)
        }, 1000)
        await fetchData()
      } else {
        response = await apiMethods.createPurchaseOrder(payload)
        setAlerts([
          { severity: 'success', message: response?.data?.message || 'Successfull updated' },
        ])
        setTimeout(() => {
          setDrawer(false)
        }, 1000)
        await fetchData()
      }

      // setAlerts([{
      //   severity: "success",
      //   message: response?.data?.message ||
      //     `Purchase Order ${isEdit ? 'updated' : 'created'} successfully`
      // }]);

      // // Close drawer after 2 seconds
      // setTimeout(() => {
      //   if (onSuccess) onSuccess();
      //   setTimeout(() => {
      //     setDrawer(false);
      //   }, 1000); // Close drawer 1 second after onSuccess callback
      // }, 3000);
    } catch (error) {
      console.error('API Error:', error)
      setAlerts([
        {
          severity: 'error',
          message:
            error.response?.data?.message ||
            `Failed to ${isEdit ? 'update' : 'create'} Purchase Order`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCloseAlert = (index) => {
    setAlerts(alerts.filter((_, i) => i !== index))
  }

  return (
    <div className="p-4 relative">
      {alerts.length > 0 && (
        <div className="mb-4">
          {alerts.map((alert, index) => (
            <CustomAlert key={index} alerts={[alert]} handleClose={() => handleCloseAlert(index)} />
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <OrderForm
          orderData={orderData}
          itemsData={itemsData}
          setDrawer={setDrawer}
          onSubmit={handleFormSubmit}
          isEdit={isEdit}
          isSubmitting={loading}
          clientData={clientData}
        />
      )}
    </div>
  )
}

export default AddPurchaseOrder
