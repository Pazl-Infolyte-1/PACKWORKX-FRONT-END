import CIcon from '@coreui/icons-react'
import prof from '../../assets/images/profile-icon.png'
import { cilPhone, cilSettings } from '@coreui/icons'
import { useState } from 'react'
import moment from 'moment'
import { ChevronDown, ChevronUp } from 'lucide-react'

const OverviewComponent = ({ tableData }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isOpenDetails, setIsOpenDetails] = useState(true)
  const [isOpenContact, setIsOpenContact] = useState(true)
  const [isOpenRecord, setIsOpenRecord] = useState(true)

  return (
    <div className="flex w-full gap-4">
      {/* Left section - 35% */}
      <div className="w-[35%] rounded p-2">
        <p>{tableData?.company_name}</p>
        <div className="border-b border-gray-300 mt-2"></div> {/* Thinner horizontal line */}
        <div className="relative mt-2 flex items-center">
          {/* Image on the left */}
          <img src={prof} alt="Profile Icon" className="w-10 h-10 rounded-full mb-4" />

          {/* Right content */}
          <div className="ml-3">
            {/*<p className="font-semibold text-sm m-0">Mr. Siva Shakthi Ram</p>*/}
            <p className="font-semibold text-sm m-0">
              {tableData?.salutation}
              {tableData?.first_name}
              {tableData?.last_name}
            </p>
            <p className="text-sm m-0">{tableData?.email}</p>
            <p className="text-sm m-0 flex items-center gap-1">
              <CIcon icon={cilPhone} className="w-3 h-3 text-gray-600 rotate-90" />
              {tableData?.work_phone}
            </p>
          </div>
        </div>
        <div className="pt-3">
          {/* Accordion Header */}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
          >
            <h2 className="font-normal text-[13px] text-gray-800">ADDRESS</h2>

            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Accordion Content */}
          {isOpen && (
            <div>
              <div className="py-1 text-sm text-gray-700 relative">
                <div>
                  <p className="font-semibold m-0">Billing Address</p>
                  <div className="relative">
                    <p className="m-0 inline">{tableData?.addresses[0]?.attention}</p>
                  </div>
                  <p className="m-0">{tableData?.addresses[0]?.street1}</p>
                  <p className="m-0">{tableData?.addresses[0]?.street2}</p>
                  <p className="m-0">{tableData?.addresses[0]?.city}</p>
                  <p className="m-0">
                    {tableData?.addresses[0]?.state}-{tableData?.addresses[0]?.pincode}
                  </p>
                  <p className="m-0">{tableData?.addresses[0]?.country}</p>
                  <p className="m-0">Phone:{tableData?.addresses[0]?.phone}</p>
                  <p className="m-0">Fax:{tableData?.addresses[0]?.faxNumber}</p>
                </div>
              </div>

              <div className="py-1 text-sm text-gray-700 relative">
                <div>
                  <p className="font-semibold m-0">Shipping Address</p>
                  <div className="relative">
                    <p className="m-0 inline">{tableData?.addresses[1]?.attention}</p>
                  </div>
                  <p className="m-0">{tableData?.addresses[1]?.street1}</p>
                  <p className="m-0">{tableData?.addresses[1]?.street2}</p>
                  <p className="m-0">{tableData?.addresses[1]?.city}</p>
                  <p className="m-0">
                    {tableData?.addresses[1]?.state}-{tableData?.addresses[1]?.pincode}
                  </p>
                  <p className="m-0">{tableData?.addresses[1]?.country}</p>
                  <p className="m-0">Phone:{tableData?.addresses[1]?.phone}</p>
                  <p className="m-0">Fax:{tableData?.addresses[1]?.faxNumber}</p>
                </div>
              </div>
              <div className="py-1 text-sm text-gray-700 relative">
                <p className="text-xs m-0 text-[#3e8efd]">Add Additional Address</p>
              </div>
            </div>
          )}
        </div>
        {/*other details*/}
        <div className="pt-3">
          {/* Accordion Header */}
          <div
            onClick={() => setIsOpenDetails(!isOpenDetails)}
            className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
          >
            <h2 className="font-normal text-[13px] text-gray-800">OTHER DETAILS</h2>
{isOpenDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Accordion Content */}
          {isOpenDetails && (
            <div>
              <table className="text-sm whitespace-nowrap table-fixed w-full">
                <tbody>
                  <tr>
                    <td className="py-2 pr-4 text-gray-400 font-semibold w-1/2">Customer Type</td>
                    <td className="py-2 ml-3 font-medium">{tableData?.customer_type}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-400 font-semibold pr-4 ">Default Currency</td>
                    <td className="py-2 font-medium">{tableData?.currency}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-400 font-semiboldpr-4">PAN</td>
                    <td className="py-2 font-medium">{tableData?.PAN}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-400 font-semibold pr-4">Portal Language</td>
                    <td className="py-2 font-medium">{tableData?.portal_language}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/*contact persons*/}
        <div className="pt-3">
          {/* Accordion Header */}
          <div
            onClick={() => setIsOpenContact(!isOpenContact)}
            className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
          >
            <h2 className="font-normal text-[13px] text-gray-800">CONTACT PERSONS</h2>

            {/* Arrow Icon */}
            <span className={`text-[#438efc] text-xs ml-[140px]`}></span>
            {isOpenContact ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Accordion Content */}
          {isOpenContact && (
            <div className="text-center text-gray-500 p-4">
              <p className="text-sm">No contact Persons Found</p>
            </div>
          )}
        </div>
        {/*record info*/}
        <div className="pt-3">  
          {/* Accordion Header */}
          <div
            onClick={() => setIsOpenRecord(!isOpenRecord)}
            className="cursor-pointer py-1 flex justify-between items-center border-b border-gray-200"
          >
            <h2 className="font-normal text-[13px] text-gray-800">RECORD INFO</h2>
            {isOpenRecord ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Accordion Content */}
          {isOpenRecord && (
            <div>
              <table className="text-sm whitespace-nowrap table-fixed w-full">
                <tbody>
                  <tr>
                    <td className="py-2 pr-4 text-gray-400 font-semibold w-1/2">Customer Id</td>
                    <td className="py-2 ml-3 font-medium">{tableData?.client_ui_id}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-400 font-semibold pr-4 ">Created On</td>
                    <td className="py-2 font-medium">
                      {moment(tableData?.created_at).format('DD/MM/YYYY')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-400 font-semiboldpr-4">Created By</td>
                    <td className="py-2 font-medium">{tableData?.created_by}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Vertical divider */}
      <div className="w-[1px] bg-gray-300 self-stretch min-h-[700px]"></div>

      {/* Right section - 65% */}
      <div className="w-[65%] p-4 rounded">
        <div className="leading-tight">
          <p className="text-gray-500 text-sm m-0">Payment Due Period</p>
          <p className="text-sm m-0">{tableData?.payment_terms}</p>
        </div>

        <div className="mt-4">
          <p className="text-[17px] font-semibold text-gray-800 mb-2">Receivables</p>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Currency
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Outstanding Receivables
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Unused Credits
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 text-sm text-gray-800">{tableData?.currency}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">0</td>
                  <td className="px-4 py-2 text-sm text-gray-800">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewComponent
