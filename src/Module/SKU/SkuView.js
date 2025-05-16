import { useState, useEffect, useRef } from 'react'
import { ChevronUp, ChevronDown, Mail, MoreHorizontal } from 'lucide-react'

const SkuView = ({ setIsMinimized, selectedSku, handleSkuEdit }) => {
  const [activeTab, setActiveTab] = useState('Overview')
  const [addressExpanded, setAddressExpanded] = useState(true)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const [contentHeight, setContentHeight] = useState('580px')
  const containerRef = useRef(null)

  // Tabs available in the interface
  const tabs = ['Overview']

  useEffect(() => {
    const updateHeight = () => {
      if (!containerRef.current) return

      const windowHeight = window.innerHeight
      const containerTop = containerRef.current.getBoundingClientRect().top
      const headerHeight = 92
      const footerBuffer = 20

      const availableHeight = windowHeight - containerTop - headerHeight - footerBuffer
      setContentHeight(`${Math.max(300, availableHeight)}px`) // Set minimum height of 300px
    }
    updateHeight()

    // Update height on window resize
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <div
      className="flex flex-col border border-gray-200 w-full shadow-sm bg-white"
      ref={containerRef}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-2 px-3">
        <h1 className="text-xl font-medium">{selectedSku.client}</h1>

        <div className="flex gap-2">
          <button
            onClick={() => handleSkuEdit(selectedSku.id)}
            className="px-2 py-1 border rounded text-sm"
          >
            Edit
          </button>
          <button className="px-4 py-1 bg-blue-500 text-white rounded text-sm">
            New Transaction ▾
          </button>
          <button className="px-4 py-1 border rounded text-sm">More ▾</button>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-2 py-1 border rounded text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b gap-3 border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`p-1 text-sm font-semibold ${activeTab === tab ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <div className="flex-grow"></div>
        <button className="px-4">
          <Mail size={16} />
        </button>
      </div>

      {/* Content area with dynamic height */}
      <div className="flex overflow-y-auto" style={{ height: contentHeight }}>
        {/* Left Column */}
        <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
          <div className="pb-4 border-b border-gray-200">
            <h2 className="font-normal text-gray-700 mb-4 text-sm border-b border-gray-200">
              {selectedSku.client}
            </h2>

            <div className="flex items-start">
              <div className="bg-gray-200 w-11 h-10 rounded-md mr-3 flex items-center justify-center text-gray-500">
                <Mail size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold my-0">{selectedSku.sku_name}</p>
                <p className="text-sm my-0">{selectedSku.sku_ui_id}</p>

                <div className="flex text-blue-500 text-xs mt-2 gap-2">
                  <a href="#" className="hover:underline">
                    Invite to Portal
                  </a>
                  <span>|</span>
                  <a href="#" className="hover:underline">
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* MEASUREMENTS */}
          <div className="py-1 border-b border-gray-200">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setAddressExpanded(!addressExpanded)}
            >
              <h3 className="font-medium text-sm text-gray-800">MEASUREMENTS</h3>
              {addressExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {addressExpanded && (
              <div className="text-sm">
                <div className="mb-4">
                  <div className="text-gray-600 m-0">
                    <p className="m-1">
                      Length Trimming{' '}
                      <span className="font-semibold">
                        {' '}
                        - {selectedSku.length_trimming_tolerance || 'N/A'}
                      </span>
                    </p>
                    <p className="m-1">
                      Width Trimming{' '}
                      <span className="font-semibold">
                        {' '}
                        - {selectedSku.width_trimming_tolerance || 'N/A'}
                      </span>
                    </p>
                    <p className="m-1">
                      Board Size Length
                      <span className="font-semibold">
                        {' '}
                        - {selectedSku.length_board_size_cm2 || 'N/A'}
                      </span>
                    </p>
                    <p className="m-1">
                      Board Size Width{' '}
                      <span className="font-semibold">
                        {' '}
                        - {selectedSku.width_board_size_cm2 || 'N/A'}
                      </span>
                    </p>
                    <p className="m-1">
                      Board Size(cm²){' '}
                      <span className="font-semibold">
                        {' '}
                        - {selectedSku.board_size_cm2 || 'N/A'}
                      </span>
                    </p>
                    <p className="m-1">
                      Deckle Size{' '}
                      <span className="font-semibold"> - {selectedSku.deckle_size || 'N/A'}</span>
                    </p>
                    <p className="m-1">
                      Flap width{' '}
                      <span className="font-semibold"> - {selectedSku.flap_width || 'N/A'}</span>
                    </p>
                    <p className="m-1">
                      Flap Tolerance{' '}
                      <span className="font-semibold">
                        {' '}
                        - {selectedSku.flap_tolerance || 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OTHER DETAILS */}
          <div className="py-1">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setDetailsExpanded(!detailsExpanded)}
            >
              <h3 className="font-medium text-sm text-gray-800">OTHER DETAILS</h3>
              {detailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {detailsExpanded && (
              <div className="text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Minimum Order</span>
                  <span className="font-medium">{selectedSku.minimum_order_level || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">GST %</span>
                  <span className="font-medium">{selectedSku.gst_percentage || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Ply</span>
                  <span className="flex items-center">
                    <span className="font-medium">{selectedSku.ply || 'N/A'}</span>
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">SKU Type</span>
                  <span className="font-medium">{selectedSku.sku_type || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/3 px-2 py-1 overflow-y-auto">
          <div className="flex bg-gray-50 p-2 justify-between items-center rounded">
            <div className="flex items-start mb-2">
              <div className="mr-2 text-blue-500">
                <Mail size={16} />
              </div>
              <div>
                <h3 className="font-medium text-sm m-0">WHAT'S NEXT?</h3>
                <p className="text-sm -ml-6 ">
                  Create an <span className="text-blue-500">invoice</span> or a{' '}
                  <span className="text-blue-500">quote</span> and send it to your customer.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="bg-blue-500 text-white h-7 w-24 rounded text-xs">
                New Invoice
              </button>
              <button className="bg-white border border-gray-300 h-7 w-24 rounded text-xs">
                New Quote
              </button>
              <button className="h-7 px-3">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium">SKU Values</h3>

            <div className="border rounded overflow-hidden m-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 text-xs">Layer</th>
                    <th className="text-right p-2 text-xs">GSM</th>
                    <th className="text-right p-2 text-xs">BF</th>
                    <th className="text-right p-2 text-xs">Material</th>
                    <th className="text-right p-2 text-xs">Color</th>
                    <th className="text-right p-2 text-xs">Flute Type</th>
                    <th className="text-right p-2 text-xs">Weight</th>
                    <th className="text-right p-2 text-xs">Bursting Strength</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSku.sku_values &&
                    selectedSku.sku_values.map((item, index) => (
                      <tr className="border-t" key={index}>
                        <td className="p-3 text-xs">{item.layer || '-'}</td>
                        <td className="text-right p-3 text-xs">{item.gsm || '-'}</td>
                        <td className="text-right p-3 text-xs">{item.bf || '-'}</td>
                        <td className="text-right p-3 text-xs">{item.material || '-'}</td>
                        <td className="text-right p-3 text-xs">{item.color || '-'}</td>
                        <td className="text-right p-3 text-xs">{item.flute_type || '-'}</td>
                        <td className="text-right p-3 text-xs">{item.weight || '-'}</td>
                        <td className="text-right p-3 text-xs">{item.bursting_strength || '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkuView
