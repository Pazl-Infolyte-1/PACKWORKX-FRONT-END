import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import DiePopupTable from './DiePopupTable'
import PopUp from '../../components/New/PopUp'
import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import PlyToggle from '../../components/New/PlyToggle'

function DieCutBox({
  editTag,
  dropdownRef,
  addNewSkuData,
  isOpen,
  handleChange,
  clientDiasble,
  client,
  setIsOpen,
  handleSelect,
  skuType,
  setAddNewSkuData,
  updateSkuValues,
  isopenval
}) {
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [selectedDiePopup, setSelectedDiePopup] = useState(null)

  const handleBrowseClick = () => {
    setisSingleViewPopup(true)
  }
  
  useEffect(() => {
    if (selectedDiePopup?.name) {
      setAddNewSkuData((prev) => ({
        ...prev,
        select_dies: selectedDiePopup.name,
      }))
    }
  }, [selectedDiePopup])
  console.log("is open",isopenval)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isopenval) {
        const message = "Don't refresh or else your data will be lost!";
        event.preventDefault(); // For most browsers
        event.returnValue = message; // For Chrome
        return message; // For Firefox
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isopenval]);
  return (
    <div className="rounded-lg">
      {/* Top header fields */}
      <div className="grid grid-cols-3 gap-6 p-6 border border-gray-200 rounded-lg">
        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">SKU Type</label>
          <div className="relative w-full" ref={dropdownRef}>
            <div
              className="p-2 h-10 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center bg-white hover:border-blue-500 transition-colors"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="text-gray-800">{addNewSkuData?.sku_type || 'Select Type'}</span>
              <BsChevronDown className={`transition-transform text-gray-600 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
              <ul
                className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md z-20 shadow-lg"
              >
                {skuType.map((option) => (
                  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-50">
                    <li
                      className={`p-2 cursor-pointer w-full ${editTag ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'}`}
                      onClick={!editTag ? () => handleSelect(option) : undefined}
                    >
                      {option.sku_type}
                    </li>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2">SKU Name</label>
            <input
              id="sku_name"
              name="sku_name"
              value={addNewSkuData.sku_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Client Name</label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            value={addNewSkuData.client || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>
              Select
            </option>
            {client?.map((item, index) => (
              <option key={index} value={item.display_name}>
                {item.display_name}
              </option>
            ))}
                                        <option value="add_client">➕ Add Client</option>

          </select>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-3 gap-6 p-6 mt-6 border border-gray-200 rounded-lg">
        {/*<div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Ply</label>
          <select
            name="ply"
            id="ply"
            value={addNewSkuData.ply}
            onChange={(e) => {
              const selectedPly = Number(e.target.value)
              updateSkuValues(selectedPly)
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>
              Select Number of Layers
            </option>
            <option value={2}>2 Ply</option>
            <option value={3}>3 Ply</option>
            <option value={5}>5 Ply</option>
            <option value={7}>7 Ply</option>
            <option value={9}>9 Ply</option>
          </select>
        </div>*/}
          <PlyToggle
  value={addNewSkuData.ply}
  onChange={(selectedPly) => updateSkuValues(selectedPly)}
/>

        <div>
          <Input
            skuName="UPS"
            id="ups"
            name="ups"
            value={addNewSkuData.ups}
            onChange={handleChange}
            //placeholder="UPS"
          />
        </div>

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Select Dies</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="select_dies"
              id="select_dies"
              value={addNewSkuData.select_dies || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              //placeholder="Enter Die Name"
            />
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-500 transition-colors"
              onClick={handleBrowseClick}
            >
              Browse
            </button>
          </div>
        </div>

        <div>
          <Input
            skuName="Customer Reference"
            id="customer_reference"
            name="customer_reference"
            value={addNewSkuData.customer_reference}
            onChange={handleChange}
            //placeholder="Customer Reference"
          />
        </div>

        <div>
          <Input
            skuName="Reference #"
            id="reference_number"
            name="reference_number"
            value={addNewSkuData.reference_number}
            onChange={handleChange}
            //placeholder="Reference Number"
          />
        </div>

        <div>
          <Input
            skuName="Internal ID"
            id="internal_id"
            name="internal_id"
            value={addNewSkuData.internal_id}
            onChange={handleChange}
            //placeholder="Internal ID"
          />
        </div>

        <div>
          <Input
            skuName="Board Size (cm²)"
            id="board_size_cm2"
            name="board_size_cm2"
            value={addNewSkuData.board_size_cm2}
            onChange={handleChange}
            //placeholder="Board Size"
          />
        </div>

        <div>
          <Input
            skuName="Deckle Size"
            id="deckle_size"
            name="deckle_size"
            value={addNewSkuData.deckle_size}
            onChange={handleChange}
            //placeholder="Deckle Size"
          />
        </div>

        <div>
          <Input
            skuName="Minimum Order Level"
            id="minimum_order_level"
            name="minimum_order_level"
            type="number"
            value={addNewSkuData.minimum_order_level}
            onChange={handleChange}
            //placeholder="Minimum Order Level"
          />
        </div>
      </div>

      <PopUp
        header={'Select SKU'}
        visible={isSingleViewPopup}
        setVisible={setisSingleViewPopup}
        showCloseButton={true}
        width={'60vw'}
      >
        <DiePopupTable
          setSelectedDiePopup={setSelectedDiePopup}
          selectedDiePopup={selectedDiePopup}
          setisSingleViewPopup={setisSingleViewPopup}
        />
      </PopUp>
    </div>
  )
}

export default DieCutBox