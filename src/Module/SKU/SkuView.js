import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Edit, Phone, Mail, ExternalLink, Plus, MoreHorizontal, Send } from 'lucide-react';

const SkuView = ({setIsMinimized, selectedSku}) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [addressExpanded, setAddressExpanded] = useState(true);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  // Tabs available in the interface
  const tabs = ['Overview', 'Comments', 'Transactions', 'Mails', 'Statement'];

  return (
    <div className="flex flex-col border border-gray-200  shadow-sm bg-white">
      {/* Header */}
      <div className="flex justify-between items-center p-2 px-3">
        <h1 className="text-xl font-medium">PAZL INFOLYTE PRIVATE LIMITED</h1>
        
        <div className="flex gap-2">
          <button className="px-2 py-1 border rounded text-sm">Edit</button>
          <button className="px-2 py-1 border rounded text-sm"><ExternalLink size={14} /></button>
          <button className="px-4 py-1 bg-blue-500 text-white rounded text-sm">New Transaction ▾</button>
          <button className="px-4 py-1 border rounded text-sm">More ▾</button>
          <button onClick={() => setIsMinimized(false)} className="px-2 py-1 border rounded text-sm">✕</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button 
            key={tab}
            className={`px-6 py-3 ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <div className="flex-grow"></div>
        <button className="px-4"><Mail size={16} /></button>
      </div>

      <div className="flex">
        {/* Left Column */}
        <div className="w-1/3 border-r border-gray-200 p-4">
          <div className="pb-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-700 mb-4">PAZL INFOLYTE PRIVATE LIMITED</h2>
            
            <div className="flex items-start mb-4">
              <div className="bg-gray-200 w-12 h-12 rounded-full mr-3 flex items-center justify-center text-gray-500">
                <Mail size={20} />
              </div>
              
              <div>
                <p className="font-medium">Mr. John conse</p>
                <p className="text-blue-500 text-sm">john@gmail.com</p>
                <div className="flex items-center text-gray-700 text-sm mt-1">
                  <Phone size={14} className="mr-1" />
                  <span>9876543210</span>
                </div>
                <div className="flex text-blue-500 text-sm mt-2 gap-2">
                  <a href="#" className="hover:underline">Invite to Portal</a>
                  <span>|</span>
                  <a href="#" className="hover:underline">Send Email</a>
                </div>
              </div>

              <button className="ml-auto">
                <Edit size={16} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="py-4 border-b border-gray-200">
            <div 
              className="flex justify-between items-center cursor-pointer mb-3"
              onClick={() => setAddressExpanded(!addressExpanded)}
            >
              <h3 className="font-medium text-gray-800">ADDRESS</h3>
              {addressExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {addressExpanded && (
              <div className="text-sm">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium text-gray-700">Billing Address</p>
                    <button>
                      <Edit size={14} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="text-gray-600">
                    <p>Pazl</p>
                    <p>Non eum vel proident</p>
                    <p>Esse voluptas repre</p>
                    <p>Velit unde eligendi</p>
                    <p>Tamil Nadu Similique duis elige</p>
                    <p>India</p>
                    <p>Phone: 987654</p>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-gray-700 mb-1">Shipping Address</p>
                  <p className="text-gray-600">No Shipping Address - <span className="text-blue-500">New Address</span></p>
                  <p className="text-blue-500 mt-2 cursor-pointer">Add additional address</p>
                </div>
              </div>
            )}
          </div>

          {/* OTHER DETAILS */}
          <div className="py-4">
            <div 
              className="flex justify-between items-center cursor-pointer mb-3"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
            >
              <h3 className="font-medium text-gray-800">OTHER DETAILS</h3>
              {detailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            
            {detailsExpanded && (
              <div className="text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Customer Type</span>
                  <span className="font-medium">Business</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Default Currency</span>
                  <span className="font-medium">INR</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Portal Status</span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                    <span className="text-red-500">Disabled</span>
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Portal Language</span>
                  <span className="font-medium">English</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/3 p-4">
          <div className="bg-gray-50 p-4 mb-4 rounded">
            <div className="flex items-start mb-2">
              <div className="mr-2 text-blue-500">
                <Mail size={16} />
              </div>
              <div>
                <h3 className="font-medium">WHAT'S NEXT?</h3>
                <p className="text-sm">
                  Create an <span className="text-blue-500">invoice</span> or a <span className="text-blue-500">quote</span> and send it to your customer.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">New Invoice</button>
              <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm">New Quote</button>
              <button className="px-1"><MoreHorizontal size={16} /></button>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2">
              <p className="text-sm text-gray-600">Payment due period</p>
              <p>Due on Receipt</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Receivables</h3>
            
            <div className="border rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">CURRENCY</th>
                    <th className="text-right p-3">OUTSTANDING RECEIVABLES</th>
                    <th className="text-right p-3">UNUSED CREDITS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">
                      <span className="font-medium">INR</span> Indian Rupee
                    </td>
                    <td className="text-right p-3">₹0.00</td>
                    <td className="text-right p-3">₹0.00</td>
                  </tr>
                  <tr className="bg-gray-50 border-t">
                    <td colSpan="3" className="p-3">
                      <span className="text-blue-500">Enter Opening Balance</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Income</h3>
              <div className="flex gap-2 text-sm">
                <span className="text-gray-500">Last 6 Months ▾</span>
                <span className="text-gray-500">Accrual ▾</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">This chart is displayed in the organization's base currency.</p>
            
            <div className="h-48 mb-4 flex items-end">
              <div className="w-full flex justify-between items-end">
                <div className="flex flex-col justify-between h-40 text-xs text-gray-500">
                  <span>5 K</span>
                  <span>4 K</span>
                  <span>3 K</span>
                  <span>2 K</span>
                  <span>1 K</span>
                  <span>0</span>
                </div>
                <div className="flex-grow flex justify-between h-40 items-end">
                  {/* Placeholder for chart bars */}
                  {['Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025'].map(month => (
                    <div key={month} className="flex flex-col items-center">
                      <div className="w-8 h-2 bg-gray-200 rounded-t"></div>
                      <span className="text-xs text-gray-500 mt-2">{month.split(' ')[0]}<br/>{month.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="py-4 border-t border-gray-200">
              <p>Total Income ( Last 6 Months ) - ₹0.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkuView;