import React, { useContext, useEffect, useRef, useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { AuthContext } from '../../Context/AuthContext'
import apiMethods from '../../api/config'
import RSCBox from './RSCBox'
import CorrugatedSheet from './CorrugatedSheet'
import DieCutBox from './DieCutBox'
import { FaAngleDown, FaAngleUp, FaEllipsisV, FaRedoAlt, FaEye } from 'react-icons/fa'
import PopUp from '../../components/New/PopUp'
import FluteTypeView from './FluteTypeView'
import Composite from './Composite'

function SkuAddEdit({
  handleChange,
  strictAdherence,
  handleStrictAdherenceToggle,
  handleAddSkuSubmit,
  editTag,
  addNewSkuData,
  setAddNewSkuData,
  client,
  skuType,
  setSkuType,
  clientDiasble,
  refresh,
  locationvalue,
  onUnitChange,
  closedrawer
}) {

  const { user } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false);

  const createInitialSkuData = () => ({
    sku_name: null,
    client_id: user.id,
    ply: null,
    client: null,
    length: null,
    width: null,
    height: null,
    unit: null,
    joints: null,
    ups: null,
    inner_outer_dimension: null,
    flap_width: null,
    flap_tolerance: null,
    length_trimming_tolerance: null,
    width_trimming_tolerance: null,
    width_board_size_cm2: null,
    length_board_size_cm2: null,
    strict_adherence: strictAdherence,
    customer_reference: null,
    reference_number: null,
    internal_id: null,
    board_size_cm2: null,
    deckle_size: null,
    minimum_order_level: null,
    sku_type: 'RSC box',
    sku_values: [
      {
        layer: null,
        gsm: null,
        bf: null,
        material: null,
        color: null,
        flute_type: null,
        //flute_ratio: null,
      },
    ],
  })
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!editTag) {
      setAddNewSkuData(createInitialSkuData())
    }
  }, [editTag, refresh])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getSkuType()
        setSkuType(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])
  const handleSelect = (option) => {
    if (option.value === 'addMore') {
      // Handle add more procedure logic if needed
      setIsOpen(false)
      return
    }
    setIsOpen(false)

    const baseSkuData = {
      ...createInitialSkuData(), 
      client: addNewSkuData.client,
      sku_type: option.sku_type || option.value,
    }

    setAddNewSkuData(baseSkuData)
  }

  // const handleDeleteSkuType = async (id) => {
  //   try {
  //     await apiMethods.deleteSkuType(id)
  //     setSkuType((prevTypes) => prevTypes.filter((type) => type.id !== id))
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  const handleSkuValuesChange = (index, field, value) => {
    setAddNewSkuData((prevData) => {
      const updatedSkuValues = [...prevData.sku_values]
      updatedSkuValues[index] = { ...updatedSkuValues[index], [field]: value }
      return { ...prevData, sku_values: updatedSkuValues }
    })
  }

  const plyLayerConfigurations = {
    2: [
      { layer: 'Top Layer', type: 'Top Layer' },
      { layer: 'Corrugated Layer', type: 'Corrugated Layer' },
    ],
    3: [
      { layer: 'Top Layer', type: 'Top Layer' },
      { layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1' },
      { layer: 'Liner Layer 1', type: 'Liner Layer 1' },
    ],
    5: [
      { layer: 'Top Layer', type: 'Top Layer' },
      { layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1' },
      { layer: 'Liner Layer 1', type: 'Liner Layer 1' },
      { layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2' },
      { layer: 'Liner Layer 2', type: 'Liner Layer 2' },
    ],
    7: [
      { layer: 'Top Layer', type: 'Top Layer' },
      { layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1' },
      { layer: 'Liner Layer 1', type: 'Liner Layer 1' },
      { layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2' },
      { layer: 'Liner Layer 2', type: 'Liner Layer 2' },
      { layer: 'Corrugated Layer 3', type: 'Corrugated Layer 3' },
      { layer: 'Liner Layer 3', type: 'Liner Layer 3' },
    ],
    9: [
      { layer: 'Top Layer', type: 'Top Layer' },
      { layer: 'Corrugated Layer 1', type: 'Corrugated Layer 1' },
      { layer: 'Liner Layer 1', type: 'Liner Layer 1' },
      { layer: 'Corrugated Layer 2', type: 'Corrugated Layer 2' },
      { layer: 'Liner Layer 2', type: 'Liner Layer 2' },
      { layer: 'Corrugated Layer 3', type: 'Corrugated Layer 3' },
      { layer: 'Liner Layer 3', type: 'Liner Layer 3' },
      { layer: 'Corrugated Layer 4', type: 'Corrugated Layer 4' },
      { layer: 'Liner Layer 4', type: 'Liner Layer 4' },
    ],
  }

  const updateSkuValues = (plyCount) => {
    const layerConfig = plyLayerConfigurations[plyCount] || []

    const newSkuValues = layerConfig.map((layer) => ({
      layer: layer.layer,
      gsm: '',
      bf: '',
      material: '',
      color: '',
      flute_type: '',
      //flute_ratio: '',
    }))

    setAddNewSkuData((prevData) => ({
      ...prevData,
      ply: plyCount,
      sku_values: newSkuValues,
    }))
  }

  const skuComponents = {
    'RSC box': (
      <RSCBox
        dropdownRef={dropdownRef}
        addNewSkuData={addNewSkuData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleChange={handleChange}
        handleSelect={handleSelect}
        clientDiasble={clientDiasble}
        client={client}
        skuType={skuType}
        setAddNewSkuData={setAddNewSkuData}
        updateSkuValues={updateSkuValues}
        locationvalue={locationvalue}
        //onUnitChange={handleUnitChange}
      />
    ),
    //'Corrugated Sheet': (
    'Board': (
      <CorrugatedSheet
        dropdownRef={dropdownRef}
        addNewSkuData={addNewSkuData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleChange={handleChange}
        handleSelect={handleSelect}
        clientDiasble={clientDiasble}
        client={client}
        skuType={skuType}
        setAddNewSkuData={setAddNewSkuData}
        updateSkuValues={updateSkuValues}
      />
    ),
    'Die Cut box': (
      <DieCutBox
        dropdownRef={dropdownRef}
        addNewSkuData={addNewSkuData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleChange={handleChange}
        handleSelect={handleSelect}
        clientDiasble={clientDiasble}
        client={client}
        skuType={skuType}
        setAddNewSkuData={setAddNewSkuData}
        updateSkuValues={updateSkuValues}
      />
    ),
    'Composite\r\n': (
      <Composite
        dropdownRef={dropdownRef}
        addNewSkuData={addNewSkuData}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleChange={handleChange}
        handleSelect={handleSelect}
        clientDiasble={clientDiasble}
        client={client}
        skuType={skuType}
        setAddNewSkuData={setAddNewSkuData}
        updateSkuValues={updateSkuValues}
      />
    ),
  }
  const openViewCard =(data)=>{
    setisSingleViewPopup(true)
    console.log(JSON.stringify(data))
    setSingleDataId(data.id)
  
  }
  
  const handleCloseSingleViewPopup = () => {
    setisSingleViewPopup(false);
    //setSelectedClientId(null); // Reset client ID
  };
  
  return (
    <div className="p-6 bg-white rounded-lg">

      {/* conditional rendring according to sku_type */}
      {skuComponents[addNewSkuData.sku_type] || null}

      <div className="flex items-center my-3 space-x-2">
        <span className="text-[16px] font-medium">Strict Adherence for All Layers</span>
        <button
          className={`w-11 h-[23px] flex items-center border border-blue-600 rounded-full p-1 cursor-pointer 
              ${strictAdherence ? 'bg-blue-600' : 'bg-gray-300'}`}
          onClick={handleStrictAdherenceToggle}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out 
                ${strictAdherence ? 'translate-x-5' : '-translate-x-[2px]'}`}
          ></div>
        </button>
      </div>

      {addNewSkuData.ply && (
        <div className="mt-6">
          <div className="border rounded-lg overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="text-gray-500 text-center">
                  <th className="p-2">Layer</th>
                  <th className="p-2">GSM</th>
                  <th className="p-2">BF</th>
                  <th className="p-2">Color</th>
                  <th className="p-2">Flute Type</th>
                  {/*<th className="p-2">Flute Ratio</th>*/}
                  <th className="p-2">Material</th>
                  <th className="p-2">Weight (Kg)</th>
                  <th className="p-2">
                    Bursting Strength <br />{' '}
                    <span className="text-xs">
                      (Kg Per Cm<sup>2</sup>
                    </span>
                    )
                  </th>
                </tr>
              </thead>
              <tbody>
                {addNewSkuData?.sku_values?.map((item, index) => (
                  <tr key={index} className="flex-wrap">
                    <td className="p-2 text-center w-full sm:w-2/12 md:w-2/12 lg:w-2/12 ">
                      <input
                        type="text"
                        placeholder="Layers"
                        className="p-1 border rounded w-full"
                        value={item.layer}
                        onChange={(e) => handleSkuValuesChange(index, 'layer', e.target.value)}
                      />
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <input
                        type="text"
                        className="p-1 border rounded text-center w-full"
                        value={item.gsm || ''}
                        placeholder="gsm"
                        onChange={(e) => handleSkuValuesChange(index, 'gsm', e.target.value)}
                      />
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <input
                        type="number"
                        className="p-1 border rounded text-center w-full"
                        value={item.bf || ''}
                        placeholder="bf"
                        onChange={(e) => handleSkuValuesChange(index, 'bf', Number(e.target.value))}
                      />
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <input
                        type="text"
                        placeholder="Color"
                        className="p-1 border rounded w-full"
                        value={item.color}
                        onChange={(e) => handleSkuValuesChange(index, 'color', e.target.value)}
                      />
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12 relative">
  <div className="relative w-full flex items-center">
    <select
      className="p-1 border rounded w-full pr-8 appearance-none" // Removed dropdown arrow
      value={item.flute_type || 'Select'}
      onChange={(e) => handleSkuValuesChange(index, 'flute_type', e.target.value)}
    >
      <option hidden>Select</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="E">E</option>
      <option value="F,G,N">F,G,N</option>
    </select>
    {/* Eye icon positioned absolutely to the right */}
    <FaEye className="absolute right-2 text-gray-500 cursor-pointer" onClick={openViewCard} />
  </div>
</td>
{/*<td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <input
                        type="text"
                        className="p-1 border rounded text-center w-full"
                        value={item.flute_ratio || ''}
                        placeholder="flute ratio"
                        onChange={(e) =>
                          handleSkuValuesChange(index, 'flute_ratio', e.target.value)
                        }
                      />
                    </td>*/}

                    {/*<td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <input
                        type="text"
                        className="p-1 border rounded text-center w-full"
                        value={item.flute_ratio || ''}
                        placeholder="flute ratio"
                        onChange={(e) =>
                          handleSkuValuesChange(index, 'flute_ratio', e.target.value)
                        }
                      />
                    </td>*/}
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <input
                        type="text"
                        placeholder="Material"
                        className="p-1 border rounded w-full"
                        value={item.material}
                        onChange={(e) => handleSkuValuesChange(index, 'material', e.target.value)}
                      />
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <p>N/A</p>
                    </td>
                    <td className="p-2 text-center w-full sm:w-1/12 md:w-1/12 lg:w-1/12">
                      <p>N/A</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-6">
        {/*<ActionButton
          label="Add Version"
          variant="add"
          className="bg-[#079b54] text-white px-4 py-2 rounded-md"
        />*/}
        {/*<ActionButton
          label="Save As Draft"
          className="bg-[#079b54] text-white px-4 py-2 rounded-md"
        />*/}
           <button className="p-2 border border-gray-300 rounded w-24" onClick={()=>closedrawer(false)}>Cancel</button>
        <ActionButton
          onClick={handleAddSkuSubmit}
          label={editTag ? 'Update' : 'Submit'}
          variant="save"
          className="bg-[#079b54] text-white px-4 py-2 rounded-md"
        />
      </div>
      <PopUp
          visible={isSingleViewPopup}
          setVisible={handleCloseSingleViewPopup} 
          showCloseButton={true}
          width={'70vw'}
        >
        <FluteTypeView></FluteTypeView>
        </PopUp>
    </div>
  )
}

export default SkuAddEdit
