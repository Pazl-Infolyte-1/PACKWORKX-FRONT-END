import { useEffect, useState } from 'react'
import { Clock, FileText, Info, Receipt } from 'lucide-react'
import { inventoryApi } from '../../api/inventory'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BillingsDetails,
  CreditNotesDetails,
  DebitNotesDetails,
  GrnDetails,
  ProductDetails,
  PurchaseOrderDetails,
  PurchaseReturnsDetails,
  StockAdjustmentDetails,
} from './ActiveMenuTabs'

const ViewInventory = ({ setIsMinimised }) => {
  const [itemDetails, setItemDetails] = useState(null)
  const [grnBillDetails, setGrnBillDetails] = useState({}) // Store GRN bill details by po_id
  const [loadingGrnBills, setLoadingGrnBills] = useState(false)
  const menus = [
    'Products',
    'Purchase Order',
    'Billings',
    'GRN',
    'Purchase Returns',
    'Stock Adjustment',
    // 'Debit Notes',
    // 'Credit Notes',
  ]
  const { state } = useLocation()

  const { item } = state || {}
  const [activeMenu, setActiveMenu] = useState('Products')
  const navigate = useNavigate()

  useEffect(() => {
    if (state?.item?.item_id) {
      setIsMinimised(true)
    } else {
      setIsMinimised(false)
    }
  }, [state?.item?.item_id])

  useEffect(() => {
    const fetchSingleItem = async () => {
      if (!state?.item?.item_id) return

      try {
        const response = await inventoryApi.singleInventoryView(state?.item?.item_id)
        setItemDetails(response?.data)
      } catch (error) {
        console.error('Error fetching single inventory view:', error)
      }
    }

    fetchSingleItem()
  }, [state?.item?.item_id])

  // Fetch GRN bill details when GRN data is available
  useEffect(() => {
    const fetchGrnBillDetails = async () => {
      if (!itemDetails?.grns || itemDetails.grns.length === 0) return

      setLoadingGrnBills(true)
      const billDetailsMap = {}

      try {
        // Get unique po_ids from GRNs
        const uniquePoIds = [...new Set(itemDetails.grns.map((grn) => grn.grn.po_id))]

        // Fetch bill details for each unique po_id
        const promises = uniquePoIds.map(async (po_id) => {
          try {
            const response = await inventoryApi.getGrnBillID(po_id)
            billDetailsMap[po_id] = response?.data || null
          } catch (error) {
            console.error(`Error fetching GRN bill for po_id ${po_id}:`, error)
            billDetailsMap[po_id] = null
          }
        })

        await Promise.all(promises)

        setGrnBillDetails(billDetailsMap)
      } catch (error) {
        console.error('Error fetching GRN bill details:', error)
      } finally {
        setLoadingGrnBills(false)
      }
    }

    fetchGrnBillDetails()
  }, [itemDetails?.grns])

  const handleClose = () => {
    setIsMinimised(false)
    navigate('/inventoryhandling')
  }

  const handleEdit = () => {
    navigate('/inventoryhandling/inventory_form', {
      state: {
        item,
        fromInventory: true,
        isInventoryEditing: true,
        isEdit: true,
      },
    })
  }

  // Function to render GRN bill information
  const renderGrnBillInfo = (po_id) => {
    const billData = grnBillDetails[po_id]

    if (loadingGrnBills) {
      return (
        <div className="bg-blue-50 rounded-lg p-2 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="text-sm text-blue-600">Loading bill details...</span>
          </div>
        </div>
      )
    }

    if (!billData || !billData.data || billData.data.length === 0) {
      return (
        <div className="bg-gray-50 rounded-lg p-2 mb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">No bill details available</span>
          </div>
        </div>
      )
    }

    // Get the first bill data from the array
    const firstBill = billData.data[0]

    return (
      <div
        onClick={() => navigate(`/billingmain/${firstBill.id}`)}
        className="bg-green-50 rounded-lg cursor-pointer p-2 mb-3 border-l-4 border-green-400"
      >
        <div className="text-sm text-green-700 font-medium mb-2">Bill Information:</div>
        <div className="space-y-1">
          {firstBill && firstBill.bill_generate_id && (
            <div className="flex items-center gap-2 text-sm">
              <Receipt className="w-3 h-3 text-green-600" />
              <span className="text-gray-600">Bill No:</span>
              <span className="font-medium text-blue-500 hover:underline">
                {firstBill.bill_generate_id}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderActiveComponent = () => {
    const componentProps = {
      itemDetails,
      item,
      navigate,
    }

    switch (activeMenu) {
      case 'Products':
        return <ProductDetails {...componentProps} handleEdit={handleEdit} />
      case 'Purchase Order':
        return <PurchaseOrderDetails {...componentProps} />
      case 'Billings':
        return <BillingsDetails {...componentProps} />
      case 'GRN':
        return <GrnDetails {...componentProps} renderGrnBillInfo={renderGrnBillInfo} />
      case 'Purchase Returns':
        return <PurchaseReturnsDetails {...componentProps} />
      case 'Stock Adjustment':
        return <StockAdjustmentDetails {...componentProps} />
      case 'Debit Notes':
        return <DebitNotesDetails {...componentProps} />
      case 'Credit Notes':
        return <CreditNotesDetails {...componentProps} />
      default:
        return (
          <div>
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="border-l h-[600px] flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 bg-white border-b shadow-sm sticky top-0 z-10">
        {/* Header buttons */}
        <div className="flex justify-end items-center p-2 space-x-2">
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Nav menu */}
        <nav className="flex space-x-8 px-4 pb-2 overflow-x-auto">
          {menus.map((menu) => (
            <button
              key={menu}
              onClick={() => setActiveMenu(menu)}
              className={`pb-2 font-semibold transition-colors whitespace-nowrap ${
                activeMenu === menu
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              {menu}
            </button>
          ))}
        </nav>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">{renderActiveComponent()}</div>
    </div>
  )
}

export default ViewInventory
