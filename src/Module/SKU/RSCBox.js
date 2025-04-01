import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'

function RSCBox({
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
}) {
  const calculateBoardSize = (data) => {
    const length = parseFloat(data.length) || 0
    const width = parseFloat(data.width) || 0
    const height = parseFloat(data.height) || 0
    const lengthTrimmingTolerance = parseFloat(data.length_trimming_tolerance) || 0
    const flapWidth = parseFloat(data.flap_width) || 0
    const deckleSize = parseFloat(data.deckle_size) || 0

    const lengthBoardSize = length * width * 2 + lengthTrimmingTolerance + flapWidth
    const widthBoardSize = width * height + lengthTrimmingTolerance

    const totalBoardSize = lengthBoardSize * widthBoardSize

    const ups = widthBoardSize > 0 ? Math.floor(deckleSize / widthBoardSize) : 0

    return {
      length_board_size_cm2: lengthBoardSize.toFixed(2),
      width_board_size_cm2: widthBoardSize.toFixed(2),
      board_size_cm2: totalBoardSize.toFixed(2),
      ups: ups.toFixed(2),
    }
  }

  // Modified handleChange to include board size and UPS calculation
  const modifiedHandleChange = (e) => {
    const { name, value } = e.target
    const updatedSkuData = {
      ...addNewSkuData,
      [name]: value,
    }

    // Calculate board sizes if relevant fields change
    const boardSizeFields = [
      'length',
      'width',
      'height',
      'length_trimming_tolerance',
      'flap_width',
      'deckle_size',
    ]

    if (boardSizeFields.includes(name)) {
      const boardSizeUpdates = calculateBoardSize(updatedSkuData)

      // Update state with both the changed field and calculated board sizes and UPS
      setAddNewSkuData((prev) => ({
        ...prev,
        [name]: value,
        ...boardSizeUpdates,
      }))
    } else {
      // For other fields, just update normally
      setAddNewSkuData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    // Call original handleChange if it exists
    if (handleChange) {
      handleChange(e)
    }
  }

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
              <option key={index} value={item.display_name}>
                {item.display_name}
              </option>
            ))}
          </select>
        </div>

        <div className="">
          <p className="text-[16px] font-medium">Dimensions</p>
          <div className="h-10 shadow-md border-l-2 rounded-md -my-2 flex items-center">
            <input
              id="length"
              name="length"
              value={addNewSkuData.length}
              onChange={modifiedHandleChange}
              placeholder="Length"
              className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
            ></input>{' '}
            x
            <input
              id="width"
              name="width"
              value={addNewSkuData.width}
              onChange={modifiedHandleChange}
              placeholder="Width"
              className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
            ></input>{' '}
            x
            <input
              id="height"
              name="height"
              value={addNewSkuData.height}
              onChange={modifiedHandleChange}
              placeholder="Depth"
              className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
            ></input>
            <div className="w-1/4 flex justify-end relative">
              <select
                value={addNewSkuData.unit || 'cm'}
                onChange={(e) => {
                  setAddNewSkuData((prev) => ({
                    ...prev,
                    unit: e.target.value,
                  }))
                }}
                className="w-3/4 appearance-none bg-blue-500 text-white py-2 px-3 rounded-r-md focus:outline-none"
              >
                <option value="cm" className="bg-white text-black">
                  cm
                </option>
                <option value="in" className="bg-white text-black">
                  in
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-1 right-0 flex items-center px-2 text-black">
                <CIcon icon={cilChevronCircleDownAlt} size="small" className="text-white" />
              </div>
            </div>
          </div>
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
            skuName="Deckle Size"
            id="deckle_size"
            name="deckle_size"
            value={addNewSkuData.deckle_size}
            onChange={modifiedHandleChange}
            placeholder="deckle size"
          />
        </div>
        <div>
          <label className="block text-[16px] font-medium mb-2">Inner/Outer Dimension</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Inner"
                checked={addNewSkuData.inner_outer_dimension === 'Inner'}
                onChange={handleChange}
                className="mr-2"
              />
              Inner
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="inner_outer_dimension"
                value="Outer"
                checked={addNewSkuData.inner_outer_dimension === 'Outer'}
                onChange={handleChange}
                className="mr-2"
              />
              Outer
            </label>
          </div>
        </div>

        {/* <div className="flex gap-3"> */}
        <Input
          skuName="Flap Width"
          id="flap_width"
          name="flap_width"
          value={addNewSkuData.flap_width}
          onChange={modifiedHandleChange}
          placeholder="flap width"
        />

        {/* <Input
            skuName="Flap Tolerance"
            id="flap_tolerance"
            name="flap_tolerance"
            value={addNewSkuData.flap_tolerance}
            onChange={handleChange}
            placeholder="flap tolerance"
          /> */}
        {/* </div> */}
        <Input
          skuName="Trimming tolerance"
          id="length_trimming_tolerance"
          name="length_trimming_tolerance"
          value={addNewSkuData.length_trimming_tolerance}
          onChange={modifiedHandleChange}
          placeholder="trimming tolerance"
        />

        {/* <div>
          <label className="block text-[16px] font-medium mb-2">Trimming Tolerance</label>
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
        </div> */}

        {/* <div className="mb-4">
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
        </div> */}
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
         <div className="">
          <p className="text-[16px] font-medium">Board Size</p>
          <div className="h-10 shadow-md border-l-2 rounded-md -my-2 flex items-center">
            <input
              id="length_board_size_cm2"
              name="length_board_size_cm2"
              value={addNewSkuData.length_board_size_cm2}
              onChange={modifiedHandleChange}
              placeholder="Length"
              className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
            ></input>{' '}
            x
            <input
              id="width_board_size_cm2"
              name="width_board_size_cm2"
              value={addNewSkuData.width_board_size_cm2}
              onChange={modifiedHandleChange}
              placeholder="Width"
              className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
            ></input>{' '}
            =
            <input
              id="board_size_cm2"
              name="board_size_cm2"
              value={addNewSkuData.board_size_cm2}
              onChange={modifiedHandleChange}
              placeholder="Total "
              readOnly={true}
              className="w-1/4 p-1 text-center focus:outline-none focus:border-transparent"
            ></input>
            <div className="w-1/4 flex justify-end relative">
              <select
                value={addNewSkuData.unit || 'cm'}
                onChange={(e) => {
                  setAddNewSkuData((prev) => ({
                    ...prev,
                    unit: e.target.value,
                  }))
                }}
                className="w-3/4 appearance-none bg-blue-500 text-white py-2 px-3 rounded-r-md focus:outline-none"
              >
                <option value="cm" className="bg-white text-black">
                  cm
                </option>
                <option value="in" className="bg-white text-black">
                  in
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-1 right-0 flex items-center px-2 text-black">
                <CIcon icon={cilChevronCircleDownAlt} size="small" className="text-white" />
              </div>
            </div>
          </div>
        </div>
        <Input
          skuName="UPS"
          id="ups"
          name="ups"
          value={addNewSkuData.ups}
          readOnly={true}
          placeholder="ups"
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

export default RSCBox
