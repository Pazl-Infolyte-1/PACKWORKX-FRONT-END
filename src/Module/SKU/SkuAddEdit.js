import React, { useEffect, useState } from 'react'
import ActionButton from '../../components/New/ActionButton';

function SkuAddEdit({
  handleChange,
  strictAdherence,
  handleStrictAdherenceToggle,
  handleAddSkuSubmit,
  editTag,
  addNewSkuData,
  setAddNewSkuData,
}) {
  const [topLayer, setTopLayer] = useState({ gsm: 180, bf: 18 })
  const [c1Layer, setC1Layer] = useState({ gsm: 120, bf: 18 })
  const [l1Layer, setL1Layer] = useState({ gsm: 180, bf: 18 })
  useEffect(() => {
    if (!editTag) {
      setAddNewSkuData({
        sku_name: '',
        company_id: 8,
        client_id: 2,
        client: '',
        ply: '',
        length: '',
        width: '',
        height: '',
        joints: '',
        ups: '',
        inner_outer_dimension: '',
        flap_width: '',
        flap_tolerance: '',
        length_trimming_tolerance: '',
        width_trimming_tolerance: '',
        strict_adherence: strictAdherence,
        customer_reference: '',
        reference_number: '',
        internal_id: '',
        board_size_cm2: '',
        deckle_size: '',
        minimum_order_level: '',
        sku_type: '',
        sku_values: [
          {
            material: '',
            color: '',
          },
        ],
      });
    }
  }, [editTag]);   
  
  return (
    <>
      <div className="p-6">
        <label className="block  text-2xl font-semibold ml-7">
          {editTag ? 'Update SKU Details' : 'Add SKU Details'}
        </label>
      </div>
      <div className="p-1">
        <label className="block  text-xl font-semibold ml-12">Default SKU Details</label>
      </div>
      <div className="p-4 space-y-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block" htmlFor="sku_name">
              SKU Name*
            </label>
            <input
              name="sku_name"
              id="sku_name"
              value={addNewSkuData.sku_name}
              placeholder="Enter SKU Name"
              className="p-2 border rounded w-full"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block" htmlFor="client">
              Client*
            </label>
            <select
              name="client"
              id="client"
              value={addNewSkuData.client}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="" hidden>
                Select Client
              </option>
              <option>Pazl.in</option>
            </select>
          </div>
          <div>
            <label className="block" htmlFor="ply">
              Number of Layers
            </label>
            <select
              name="ply"
              id="ply"
              value={addNewSkuData.ply}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="" hidden>
                Select Number of Layers
              </option>
              <option>1</option>
            </select>
          </div>
          <div>
            <label className="block" htmlFor="length">
              Length*
            </label>
            <input
              name="length"
              id="length"
              value={addNewSkuData.length}
              onChange={handleChange}
              placeholder="Enter Length"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="width">
              Width
            </label>
            <input
              name="width"
              id="width"
              value={addNewSkuData.width}
              onChange={handleChange}
              placeholder="Enter Width"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="height">
              Height
            </label>
            <input
              name="height"
              id="height"
              onChange={handleChange}
              value={addNewSkuData.height}
              placeholder="Enter Height"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="joints">
              Joints
            </label>
            <input
              name="joints"
              id="joints"
              onChange={handleChange}
              value={addNewSkuData.joints}
              placeholder="Enter Joints"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="ups">
              Ups
            </label>
            <input
              name="ups"
              id="ups"
              onChange={handleChange}
              value={addNewSkuData.ups}
              placeholder="Enter Ups"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block">Inner/Outer Dimension</label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="inner_outer_dimension"
                  id="inner"
                  value="Inner"
                  checked={addNewSkuData.inner_outer_dimension === 'Inner'}
                  onChange={handleChange}
                />{' '}
                Inner
              </label>
              <label>
                <input
                  type="radio"
                  name="inner_outer_dimension"
                  id="outer"
                  checked={addNewSkuData.inner_outer_dimension === 'Outer'}
                  onChange={handleChange}
                  value="Outer"
                />{' '}
                Outer
              </label>
            </div>
          </div>
          <div>
            <label className="block" htmlFor="flap_width">
              Flap Width
            </label>
            <input
              name="flap_width"
              id="flap_width"
              onChange={handleChange}
              value={addNewSkuData.flap_width}
              placeholder="Enter Flap Width"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="flap_tolerance">
              Flap Tolerance
            </label>
            <input
              name="flap_tolerance"
              id="flap_tolerance"
              onChange={handleChange}
              value={addNewSkuData.flap_tolerance}
              placeholder="Enter Flap Tolerance"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="length_trimming_tolerance">
              Length Trimming Tolerance
            </label>
            <select
              name="length_trimming_tolerance"
              id="length_trimming_tolerance"
              value={addNewSkuData.length_trimming_tolerance}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option>Select Length Trimming Tolerance</option>
              <option>0.2</option>
              <option>0.1</option>
            </select>
          </div>
          <div>
            <label className="block" htmlFor="width_trimming_tolerance">
              Width Trimming Tolerance
            </label>
            <select
              name="width_trimming_tolerance"
              id="width_trimming_tolerance"
              value={addNewSkuData.width_trimming_tolerance}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option>Select Width Trimming Tolerance</option>
              <option>0.2</option>
              <option>0.1</option>
            </select>
          </div>
          <div>
            <span>Strict Adherence for All Layers</span>
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
          <div>
            <label className="block" htmlFor="customer_reference">
              Customer Reference
            </label>
            <input
              name="customer_reference"
              id="customer_reference"
              value={addNewSkuData.customer_reference}
              onChange={handleChange}
              placeholder="Enter Customer Reference"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="reference_number">
              Reference #
            </label>
            <input
              name="reference_number"
              id="reference_number"
              value={addNewSkuData.reference_number}
              onChange={handleChange}
              placeholder="Enter Reference #"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="internal_id">
              Internal ID
            </label>
            <input
              name="internal_id"
              id="internal_id"
              value={addNewSkuData.internal_id}
              onChange={handleChange}
              placeholder="Enter Internal ID"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="board_size_cm2">
              Board Size (cm²)
            </label>
            <input
              name="board_size_cm2"
              id="board_size_cm2"
              onChange={handleChange}
              value={addNewSkuData.board_size_cm2}
              placeholder="Enter Board Size"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="deckle_size">
              Deckle Size
            </label>
            <input
              name="deckle_size"
              id="deckle_size"
              value={addNewSkuData.deckle_size}
              onChange={handleChange}
              placeholder="Enter Deckle Size"
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block" htmlFor="minimum_order_level">
              Minimum Order Level
            </label>
            <input
              type="number"
              name="minimum_order_level"
              id="minimum_order_level"
              value={addNewSkuData.minimum_order_level}
              onChange={handleChange}
              placeholder="Enter Minimum Order Level"
              className="p-2 border rounded w-full"
            />
          </div>
        </div>
      </div>
      <div className="p-6">
        <label className="block mb-2 text-lg font-semibold ml-7">SKU Type</label>
        <select
          name="sku_type"
          id="sku_type"
          value={addNewSkuData.sku_type}
          onChange={handleChange}
          className="w-80 p-2 border rounded mb-4 ml-7"
        >
          <option>corrugated sheet</option>
          <option>Box</option>
        </select>

        <div className="border rounded p-4 overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-gray-500 text-center">
                <th className="p-2">Layer</th>
                <th className="p-2">GSM</th>
                <th className="p-2">BF</th>
                <th className="p-2">Color</th>
                <th className="p-2">Flute Type</th>
                <th className="p-2">Flute Ratio</th>
                <th className="p-2">Weight (Kg)</th>
                <th className="p-2">Bursting Strength (Kg Per Cm2)</th>
              </tr>
            </thead>
            <tbody>
              {/* Top Layer */}
              <tr>
                <td className="p-2 font-semibold">Top Layer</td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-center"
                    value={topLayer.gsm}
                    onChange={(e) => setTopLayer({ ...topLayer, gsm: Number(e.target.value) })}
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-center"
                    value={topLayer.bf}
                    onChange={(e) => setTopLayer({ ...topLayer, bf: Number(e.target.value) })}
                  />
                </td>
                <td className="p-2 text-center">
                  <select className="p-1 border rounded">
                    <option value="goldenyellow">Golden Yellow</option>
                    <option value="natural">Natural</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </td>
                <td className="p-2 text-center"></td>
                <td className="p-2 text-center">1</td>
                <td className="p-2 text-center">0.102528</td>
                <td className="p-2 text-center">3.24</td>
              </tr>

              {/* C1 Layer */}
              <tr>
                <td className="p-2 font-semibold">C1</td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-center"
                    value={c1Layer.gsm}
                    onChange={(e) => setC1Layer({ ...c1Layer, gsm: Number(e.target.value) })}
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-center"
                    value={c1Layer.bf}
                    onChange={(e) => setC1Layer({ ...c1Layer, bf: Number(e.target.value) })}
                  />
                </td>
                <td className="p-2 text-center">
                  <select className="p-1 border rounded">
                    <option value="natural">Natural</option>

                    <option value="red">Red</option>
                    <option value="goldenyellow">Golden Yellow</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </td>
                <td className="p-2 text-center">
                  <select className="p-1 border rounded">
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </td>
                <td className="p-2 text-center">1.5</td>
                <td className="p-2 text-center">0.102528</td>
                <td className="p-2 text-center">1.08</td>
              </tr>

              {/* L1 Layer */}
              <tr>
                <td className="p-2 font-semibold">L1</td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-center"
                    value={l1Layer.gsm}
                    onChange={(e) => setL1Layer({ ...l1Layer, gsm: Number(e.target.value) })}
                  />
                </td>
                <td className="p-2 text-center">
                  <input
                    type="number"
                    className="w-16 p-1 border rounded text-center"
                    value={l1Layer.bf}
                    onChange={(e) => setL1Layer({ ...l1Layer, bf: Number(e.target.value) })}
                  />
                </td>
                <td className="p-2 text-center">
                  <select className="p-1 border rounded">
                    <option value="goldenyellow">Golden Yellow</option>
                    <option value="natural">Natural</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </td>
                <td className="p-2 text-center"></td>
                <td className="p-2 text-center">1</td>
                <td className="p-2 text-center">0.102528</td>
                <td className="p-2 text-center">3.24</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-4 mr-[4%]">
        <ActionButton label={'Add Version'} variant='add' className="bg-[#079b54] text-white px-4 py-2 rounded-md transition"/>
        <ActionButton label={'Save As Draft'} className="bg-[#079b54] text-white px-4 py-2 rounded-md transition">
          
        </ActionButton>
        <ActionButton
          onClick={handleAddSkuSubmit}
          label={editTag ? 'Update' : 'Submit'}
          variant='save'
          className="cursor-pointer w-[88px] h-[40px] px-2 border-0 box-border rounded-md bg-[#079b54] text-white text-[16px] font-['Poppins'] leading-[24px] outline-none"
        >
          
        </ActionButton>
      </div>
    </>
  )
}

export default SkuAddEdit
