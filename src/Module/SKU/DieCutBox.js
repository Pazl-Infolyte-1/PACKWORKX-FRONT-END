import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'


function DieCutBox({dropdownRef, addNewSkuData, isOpen, handleChange, clientDiasble, client, setIsOpen, handleSelect, skuType, setAddNewSkuData, updateSkuValues}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div className="">
          <label className="block text-[16px] font-medium">SKU Type</label>
          <div className="relative w-full" ref={dropdownRef}>
            <div
              className="p-2 my-2 h-10 border border-gray-300 rounded cursor-pointer flex justify-between items-center"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span>{addNewSkuData.sku_type || 'Select Type'}</span>
              <BsChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
              <ul
                className={`absolute left-0 right-0 mt-1 overflow-y-auto bg-white border border-gray-300 rounded z-10 h-40`}
              >
                {skuType.map((option) => (
                  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-100">
                    <li className="p-2 cursor-pointer w-full" onClick={() => handleSelect(option)}>
                      {option.sku_type}
                    </li>
                    {/* {editTag && (
                      <div className="flex items-center gap-2">
                        <CIcon icon={cilPencil} className="cursor-pointer" />
                        <CIcon
                          icon={cilTrash}
                          style={{ color: 'red' }}
                          className="cursor-pointer"
                          onClick={() => handleDeleteSkuType(option.id)}
                        />
                      </div>
                    )} */}
                  </div>
                ))}

                {/* Add more Procedure */}
                {/* <li
                  className="p-2 font-semibold text-blue-600 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect({ value: 'addMore', label: 'Add More Procedure' })}
                >
                  Add More Procedure
                </li> */}
              </ul>
            )}
          </div>
        </div>

        <Input
          skuName="SKU Name"
          id="sku_name"
          name="sku_name"
          value={addNewSkuData.sku_name}
          onChange={handleChange}
          placeholder="SKU Name"
        />

        <div>
          <label className="block text-[16px] font-medium mb-2">Ply</label>
          <select
            name="ply"
            id="ply"
            value={addNewSkuData.ply}
            onChange={(e) => {
              const selectedPly = Number(e.target.value)
              updateSkuValues(selectedPly)
            }}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
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
        </div>

        <div>
          <label className="block text-[16px] font-medium mb-2">Client Name</label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            value={addNewSkuData.client || ''}
            onChange={handleChange}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
          >
            <option value="" hidden>
              Select Client
            </option>
            {client?.map((item, index) => (
              <option key={index} value={item.client_id}>
                {item.display_name || item.client_id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <Input
            skuName="Joints"
            id="joints"
            name="joints"
            value={addNewSkuData.joints}
            onChange={handleChange}
            placeholder="joints"
          />

          <Input
            skuName="UPS"
            id="ups"
            name="ups"
            value={addNewSkuData.ups}
            onChange={handleChange}
            placeholder="ups"
          />
        </div>

        <div className="flex gap-3">
          <Input
            skuName="Flap Width"
            id="flap_width"
            name="flap_width"
            value={addNewSkuData.flap_width}
            onChange={handleChange}
            placeholder="flap width"
          />

          <Input
            skuName="Flap Tolerance"
            id="flap_tolerance"
            name="flap_tolerance"
            value={addNewSkuData.flap_tolerance}
            onChange={handleChange}
            placeholder="flap tolerance"
          />
        </div>

        <div>
          <label className="block text-[16px] font-medium mb-2">Length Trimming Tolerance</label>
          <select
            name="length_trimming_tolerance"
            id="length_trimming_tolerance"
            value={addNewSkuData.length_trimming_tolerance}
            onChange={handleChange}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
          >
            <option hidden>Select</option>
            <option>0.2</option>
            <option>0.1</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-[16px] font-medium mb-2">Width Trimming Tolerance</label>
          <select
            name="width_trimming_tolerance"
            id="width_trimming_tolerance"
            value={addNewSkuData.width_trimming_tolerance}
            onChange={handleChange}
            className="w-full p-2 shadow-md border-l-2 rounded-md"
          >
            <option>0.2</option>
            <option>0.1</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          skuName="Customer Reference"
          id="customer_reference"
          name="customer_reference"
          value={addNewSkuData.customer_reference}
          onChange={handleChange}
          placeholder="customer reference"
        />

        <Input
          skuName="Reference #"
          id="reference_number"
          name="reference_number"
          value={addNewSkuData.reference_number}
          onChange={handleChange}
          placeholder="reference number"
        />

        <Input
          skuName="Internal ID"
          id="internal_id"
          name="internal_id"
          value={addNewSkuData.internal_id}
          onChange={handleChange}
          placeholder="internal id"
        />

        <Input
          skuName="Board Size (cm²)"
          id="board_size_cm2"
          name="board_size_cm2"
          value={addNewSkuData.board_size_cm2}
          onChange={handleChange}
          placeholder="board size"
        />

        <Input
          skuName="Deckle Size"
          id="deckle_size"
          name="deckle_size"
          value={addNewSkuData.deckle_size}
          onChange={handleChange}
          placeholder="deckle size"
        />

        <Input
          skuName="Minimum Order Level"
          id="minimum_order_level"
          name="minimum_order_level"
          type="number"
          value={addNewSkuData.minimum_order_level}
          onChange={handleChange}
          placeholder="minimum order level"
        />
      </div>
    </>
  )
}

export default DieCutBox
