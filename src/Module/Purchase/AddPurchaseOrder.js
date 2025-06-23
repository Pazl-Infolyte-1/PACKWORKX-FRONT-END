import React, { useEffect, useState } from 'react'
import OrderForm from './OrderForm'
import { clientApi } from '../../api/client'
import Loader from '../../components/New/Loader'
import CustomAlert from '../../components/New/CustomAlert'
import { purchaseOrderApi } from '../../api/purchaseOrder'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const AddPurchaseOrder = () => {
  const [loading, setLoading] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [clientData, setClientData] = useState([])
  const [itemsData, setItemsData] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const {id} = useParams()
  const navigate = useNavigate()
    const [useDebitBalance, setUseDebitBalance] = useState(false);
          const [balanceAmount, setBalanceAmount] = useState(0)
  const [debitBalanceAmount, setDebitBalanceAmount] = useState(0)
    const [debitUsedAmount, setDebitUsedAmount] = useState(0)


  
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
  
  const location = useLocation()
  const PoID = location.state?.po_id
  console.log('PoID:', PoID);
  
  
  useEffect(() =>{
    if(id){
      setIsEdit(true)
    }else{
      setIsEdit(false)
    }
  },[id])
  
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const fullData = await clientApi.getClients()
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
    if (isEdit && id) {
      fetchPoDetails()
    }
  }, [isEdit, id])

  const fetchPoDetails = async () => {
    setLoading(true)
    try {
      const response = await purchaseOrderApi.getPurchaseOrderById(id)
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
    console.log("return clicked")
    console.log("debit bal",useDebitBalance)
        console.log("bal amount",balanceAmount)
        console.log("////////debit bal",debitBalanceAmount)
console.log("////////debit usedd",debitUsedAmount)
    setLoading(true)

    try {
         const payload = {
  ...formData.orderData,
  items: formData.itemsData.map((item) => {
    const { status, created_at, updated_at, ...cleanItem } = item;

    return {
      ...cleanItem,
      price: parseFloat(item.unit_price || item.price || 0),
      quantity: parseInt(item.quantity || 0),
      total: parseFloat(item.total_amount || item.total || 0),
    };
  }),
  //these are the extra keys
  use_this: useDebitBalance,
  debit_balance_amount:debitBalanceAmount,
  debit_used_amount:debitUsedAmount
};
payload.total_amount = Math.max(0, parseFloat(payload.total_amount || 0));
      console.log("payload",payload)

      let response
      if (isEdit) {
        response = await purchaseOrderApi.updatePurchaseOrder(id, payload)
        setAlerts([
          { severity: 'success', message: response?.data?.message || 'Successfully updated' },
        ])
        setTimeout(() => {
          navigate('/purchaseorder')
        }, 1000)
      } else {
        response = await purchaseOrderApi.createPurchaseOrder(payload)
        setAlerts([
          { severity: 'success', message: response?.data?.message || 'Successfully created' },
        ])
        setTimeout(() => {
           navigate('/purchaseorder')
        }, 1000)
      }
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
    <div className="relative">
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
          onSubmit={handleFormSubmit}
          isEdit={isEdit}
          isSubmitting={loading}
          clientData={clientData}
          id={id}
          setUseDebitBalance={setUseDebitBalance}
          useDebitBalance={useDebitBalance}
          setBalanceAmount={setBalanceAmount}
          balanceAmount={balanceAmount}
          debitBalanceAmount={debitBalanceAmount}
          setDebitBalanceAmount={setDebitBalanceAmount}
          debitUsedAmount={debitUsedAmount}
          setDebitUsedAmount={setDebitUsedAmount}
        />
      )}
    </div>
  )
}

export default AddPurchaseOrder