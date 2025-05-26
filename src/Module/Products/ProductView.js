import { useState, useEffect, useRef } from 'react'
import { ChevronUp, ChevronDown, Mail, MoreHorizontal } from 'lucide-react'

const ProductView = ({ setIsMinimized, selectedItem }) => {
  const [activeTab, setActiveTab] = useState('Overview')
  const [addressExpanded, setAddressExpanded] = useState(true)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const [contentHeight, setContentHeight] = useState('580px')
  const containerRef = useRef(null)

  // Tabs available in the interface
  const tabs = ['Overview', 'Transactions', 'History']

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
        <h1 className="text-xl font-medium">{selectedItem.item_name}</h1>

        <div className="flex gap-2">
          <button
            onClick={() => handleSkuEdit(selectedItem.id)}
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

      <div className="flex overflow-y-auto" style={{ height: contentHeight }}>
        <div className="border-r border-gray-200 p-4 overflow-y-auto w-full">
         
         
         
         
         
          {/* <div className="pb-4 border-b border-gray-200">
          </div> */}
          <div className="py-1 border-b border-gray-200">
            {addressExpanded && (
              <div className="text-sm">
                <div className="mb-4">
                  <div className="text-gray-600 m-0">
                    <p className="m-1 py-1">
                      Item Type{' '}
                      <span className=" px-5 font-semibold">
                        {' '}
                         {(selectedItem.item_type || 'N/A').toUpperCase()}
                      </span>
                    </p>
                    <p className="m-1 py-1">
                      Created Source{' '}
                      <span className=" px-5 font-semibold">
                        {' '}
                         {selectedItem.width_trimming_tolerance || 'N/A'}
                      </span>
                    </p>
                    
                    
                    <b><p className="m-1 py-3">Purchase Information</p></b>
                    <p className="m-1 py-1">
                      Cost Price
                      <span className=" px-5 font-semibold">
                        {' '}
                        {selectedItem.standard_cost || 'N/A'}
                      </span>
                    </p>
                    <p className="m-1 py-1">
                      Purchase Account{' '}
                      <span className=" px-5 font-semibold">
                        {' '}
                         {selectedItem.width_board_size_cm2 || 'N/A'}
                      </span>
                    </p>

                    <b><p className="m-1 py-3">Sales Information</p></b>
                    <p className="m-1 py-1">
                      Selling Price{' '}
                      <span className="px-5 font-semibold">
                        {' '}
                        {selectedItem.board_size_cm2 || 'N/A'}
                      </span>
                    </p>
                    <p className="m-1 py-1">
                      Sales Account{' '}
                      <span className=" px-5 font-semibold">  {selectedItem.deckle_size || 'N/A'}</span>
                    </p>


                    <b><p className="m-1 py-3">Manufacturer Information</p></b>
                    <p className="m-1 py-1">
                      Manufacturer{' '}
                      <span className="px-5 font-semibold">  {selectedItem.manufacturer || 'N/A'}</span>
                    </p>
                    {/* <p className="m-1 py-1">
                      Flap Tolerance{' '}
                      <span className="font-semibold">
                        {' '}
                        - {selectedItem.flap_tolerance || 'N/A'}
                      </span>
                    </p> */}
                  </div>
                </div>
              </div>
            )}
          </div>







        </div>
      </div>
    </div>
  )
}

export default ProductView
