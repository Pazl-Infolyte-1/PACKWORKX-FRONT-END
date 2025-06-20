import CIcon from '@coreui/icons-react'
import prof from '../../assets/images/profile-icon.png'
import { cilPhone, cilSettings } from '@coreui/icons'
import { useState } from 'react'
import moment from 'moment'
import { ChevronDown, ChevronUp } from 'lucide-react'

const StockOverview = ({ tableData }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isOpenDetails, setIsOpenDetails] = useState(true)
  const [isOpenContact, setIsOpenContact] = useState(true)
  const [isOpenRecord, setIsOpenRecord] = useState(true)

  return (
    <div className="flex w-full gap-4">
      {/* Left section - 35% */}
      <div className="w-[35%] rounded p-2">
        {/*<p>{tableData?.company_name}</p>*/}
        {/*<div className="border-b border-gray-300 mt-2"></div> */}
        <div className="relative mt-2 flex items-center">
          {/* Image on the left */}
          {/*<img src={prof} alt="Profile Icon" className="w-10 h-10 rounded-full mb-4" />*/}

          {/* Right content */}
          <div className="ml-3">
            <p className="font-semibold text-sm m-0">
              {tableData?.stock_adjustment_generate_id}
              {/*{tableData?.first_name}
			  {tableData?.last_name}*/}
            </p>
            {/*<p className="text-sm m-0">{tableData?.email}</p>
			<p className="text-sm m-0 flex items-center gap-1">
			  <CIcon icon={cilPhone} className="w-3 h-3 text-gray-600 rotate-90" />
			  {tableData?.work_phone}
			</p>*/}
          </div>
        </div>
        <div className="pt-3">
          {/* Accordion Header */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
          >
            <h2 className="font-normal text-[13px] text-gray-800">STOCK INFO</h2>

            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Accordion Content */}
          {isOpen && (
            <div className="py-1 text-sm text-gray-700 relative">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Adjustment Date</span>
                  <span className="font-medium">{tableData?.adjustment_date || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Mode of Adjustment</span>
                  <span className="font-medium">{tableData?.mode_of_adjustment || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Reference Number</span>
                  <span className="font-medium">{tableData?.reference_number || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Reason</span>
                  <span className="font-medium">{tableData?.remarks || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Description</span>
                  <span className="font-medium">{tableData?.description || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Created By</span>
                  <span className="font-medium">{tableData?.created_by_user.name || '-'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Updated By</span>
                  <span className="font-medium">{tableData?.updated_by_user.name || '-'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vertical divider */}
      <div className="w-[1px] bg-gray-300 self-stretch min-h-[700px]"></div>

      {/* Right section - 65% */}
      <div className="w-[65%] p-4 rounded">
        <div className="leading-tight">
          {/*<p className="text-gray-500 text-sm m-0">Payment Due Period</p>
		  <p className="text-sm m-0">{tableData?.payment_terms}</p>*/}
        </div>

        {tableData?.StockAdjustmentItems?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Stock Adjustment Items</h3>

            <div className="border border-gray-400 rounded-md overflow-hidden shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 text-center">
                  <tr>
                    <th className="px-4 py-2 border border-gray-300">Previous Quantity</th>
                    <th className="px-4 py-2 border border-gray-300">Type</th>
                    <th className="px-4 py-2 border border-gray-300">Adjustment Quantity</th>
                    <th className="px-4 py-2 border border-gray-300">Stock Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.StockAdjustmentItems.map((item) => (
                    <tr key={item.id} className="text-center">
                      <td className="px-4 py-2 border border-gray-300">{item.previous_quantity}</td>
                      <td className="px-4 py-2 border border-gray-300 capitalize">{item.type}</td>
                      <td className="px-4 py-2 border border-gray-300">
                        {item.adjustment_quantity}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">{item.difference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StockOverview
