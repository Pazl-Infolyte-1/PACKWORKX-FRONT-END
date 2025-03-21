import React, { useEffect, useState } from 'react'
import { FaBoxOpen, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import { MdTakeoutDining, MdOutlineSettingsInputComposite, MdCheckroom } from 'react-icons/md'
import Drawer from '../../components/Drawer/Drawer'
import apiMethods from '../../api/config'
import { useRef } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid'
import axios from 'axios'
import CommonPagination from '../../components/New/Pagination'
import SkuPopup from './SkuPopup'
import SkuTable from './SkuTable'

const tablevalues = {
  tableHeaders: [
    { id: '#', label: '#' },

    { id: 'GSM', label: 'GSM' },

    { id: 'BF', label: 'BF' },

    { id: 'Color', label: 'Color' },

    { id: 'FluteType', label: 'Flute Type' },

    { id: 'FluteRatio', label: 'Flute Ratio' },

    { id: 'WeightInKg', label: 'Weight In Kg' },

    { id: 'BurstingStrength', label: 'Bursting Strength (Kg Per Cm2)' },
  ],

  colorOptions: [
    { id: '1', label: 'Golden Yellow' },

    { id: '2', label: 'Natural' },

    { id: '3', label: 'White' },

    { id: '4', label: 'Brown' },
  ],

  tableBody: [
    {
      id: 'Top_Layer',

      label: 'Top Layer',

      GSM: { id: 'GSM', type: 'input', name: 'GSM', defaultValue: '180', required: true },

      BF: { id: 'BF', type: 'input', name: 'BF', defaultValue: '18', required: true },

      Color: {
        id: 'Color',

        type: 'select',

        label: 'Color',

        name: 'Color',

        defaultValue: '1',

        options: 'colorOptions',

        required: true,
      },

      FluteType: { id: 'FluteType', type: 'label', defaultValue: '-' },

      FluteRatio: { id: 'FluteRatio', type: 'label', defaultValue: '1' },

      WeightInKg: { id: 'WeightInKg', type: 'label', defaultValue: '0.102528' },

      BurstingStrength: { id: 'BurstingStrength', type: 'label', defaultValue: '3.24' },
    },

    {
      id: 'C1',

      label: 'C1',

      GSM: { id: 'GSM', type: 'input', name: 'GSM', defaultValue: '120', required: true },

      BF: { id: 'BF', type: 'input', name: 'BF', defaultValue: '18', required: true },

      Color: {
        id: 'Color',

        type: 'select',

        label: 'Color',

        name: 'Color',

        defaultValue: '2',

        options: 'colorOptions',

        required: true,
      },

      FluteType: {
        id: 'FluteType',
        type: 'input',
        name: 'FluteType',
        defaultValue: 'B',
        required: true,
      },

      FluteRatio: { id: 'FluteRatio', type: 'label', defaultValue: '1.5' },

      WeightInKg: { id: 'WeightInKg', type: 'label', defaultValue: '0.102528' },

      BurstingStrength: { id: 'BurstingStrength', type: 'label', defaultValue: '1.08' },
    },

    {
      id: 'L1',

      label: 'L1',

      GSM: { id: 'GSM', type: 'input', name: 'GSM', defaultValue: '180', required: true },

      BF: { id: 'BF', type: 'input', name: 'BF', defaultValue: '18', required: true },

      Color: {
        id: 'Color',

        type: 'select',

        label: 'Color',

        name: 'Color',

        defaultValue: '1',

        options: 'colorOptions',

        required: true,
      },

      FluteType: { id: 'FluteType', type: 'label', defaultValue: '-' },

      FluteRatio: { id: 'FluteRatio', type: 'label', defaultValue: '1' },

      WeightInKg: { id: 'WeightInKg', type: 'label', defaultValue: '0.102528' },

      BurstingStrength: { id: 'BurstingStrength', type: 'label', defaultValue: '3.24' },
    },
  ],
}

function SkuList() {
  const [skuType, setSkuType] = useState('')
  const [client, setClient] = useState('')
  const [searchSKU, setSearchSKU] = useState('')
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [dynamicFields, setDynamicFields] = useState('')
  const [data, setData] = useState(tablevalues)
  const [tabledata, setTableData] = useState([])
  const [visible, setVisible] = useState(false)
  const [skudata, setSkuData] = useState([])

  const formRefs = useRef({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await apiMethods.getDynamicFormFields(11)
        const response = await axios.get('https://mocki.io/v1/388d6512-3fdf-4fe9-8cf2-0588e51ceb38')
        console.log('dynamic:', response)
        setDynamicFields(response.data)
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/a229e5e3-10b1-4522-ba26-314bda2ff239')

        setTableData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://mocki.io/v1/1e559a47-9535-45b0-8cc2-bdaa2574e325')
        console.log(response.data)

        setSkuData(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const tableData = tabledata?.values && Array.isArray(tabledata.values) ? tabledata.values : []
  const headers = tableData?.headers && Array.isArray(tabledata.headers) ? tabledata.headers : []

  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 4

  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = tableData.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(tableData.length / rowsPerPage)
  const [minimumorderlevel, setMinimumorderlevel] = useState(0);

  const [strictAdherence, setStrictAdherence] = useState(true);


  
  const [topLayer, setTopLayer] = useState({ gsm: 180, bf: 18,  });
  const [c1Layer, setC1Layer] = useState({ gsm: 120, bf: 18,  });
  const [l1Layer, setL1Layer] = useState({ gsm: 180, bf: 18,  });


  




  const handleSubmit = () => {
    const formId = dynamicFields?.data?.formId
    const fields = []

    dynamicFields?.data?.sections.forEach((section) => {
      section?.inputs.forEach((inputField) => {
        const ref = formRefs.current[inputField.id]

        if (ref) {
          let value

          if (inputField.type === 'radio') {
            const selectedRadio = document.querySelector(`input[name="${inputField.name}"]:checked`)
            value = selectedRadio ? selectedRadio.value : ''
          } else if (inputField.type === 'select') {
            value = parseInt(ref.value, 10)
          } else if (inputField.type === 'file') {
            value = ref.files.length > 0 ? ref.files[0].name : '' // Get file name
          } else {
            value = ref.value
          }

          fields.push({
            field_id: inputField.fieldId,
            value,
          })
        }
      })
    })

    console.log(JSON.stringify({ form_id: formId, fields }))
  }
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between h-[50px] ">
        <h1 className="text-[32px] font-bold text-[#424242]">SKU</h1>
        <span className=" text-[18px] font-semibold text-[#424242] ">Total SKU Count: 475</span>
        <div className="flex gap-2 items-center justify-between">
          {['Add SKU', 'Bulk Upload', 'Export to Excel'].map((text, index) => (
            <button
              key={index}
              className="h-8 flex items-center font-bold bg-[#21338e] text-white px-2 rounded-lg shadow-md border-none cursor-pointer"
              onClick={() => {
                if (text === 'Add SKU') {
                  console.log('sku clickef')
                  setDrawerOpen(true)
                }
                if (text === 'Bulk Upload') {
                  console.log('Bulk Upload clicked')
                  setVisible(true)
                }
              }}
            >
              {text}
            </button>
          ))}
        </div>

    
      </div>

      {/* SKU Boxes */}
      <div className="flex justify-between items-center  gap-2 mt-2 ">
        {[
          {
            name: 'Corrugated Box',
            count: 10000,
            color: '#286eb1',
            bgColor: '#2e2d6d',
            icon: <FaBoxOpen className="text-white text-2xl" />,
          },
          {
            name: 'Die Cut Box',
            count: 200,
            color: '#ffeeaa',
            bgColor: '#ffcc00',
            icon: <MdTakeoutDining className="text-white text-2xl" />,
          },
          {
            name: 'Composite Item',
            count: 75,
            color: '#aad3ff',
            bgColor: '#007aff',
            icon: <MdOutlineSettingsInputComposite className="text-white text-2xl" />,
          },
          {
            name: 'Custom Item',
            count: 50,
            color: '#c3f2cb',
            bgColor: '#4cd964',
            icon: <MdCheckroom className="text-white text-2xl" />,
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`w-[280px] h-[100px] flex items-center justify-between  font-bold rounded-lg shadow-md text-white border p-2`}
            style={{ backgroundColor: item.color }}
          >
            <div className=" ">
              <h2 className="text-2xl md:text-xl sm:text-lg xs:text-base font-bold text-white ">
                {item.name}
              </h2>
              <h2 className="text-center text-xl md:text-lg sm:text-base xs:text-sm text-white">
                {item.count}
              </h2>
            </div>
            <div
              className="h-[45px] w-[45px] flex items-center justify-center rounded-lg  "
              style={{ backgroundColor: item.bgColor }}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex  items-center justify-between  mt-3">
        <input
          type="text"
          placeholder="Search SKU"
          value={searchSKU}
          onChange={(e) => setSearchSKU(e.target.value)}
          className="w-[350px] h-9 p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
        />

        <div className="flex gap-2">
          <select
            value={skuType}
            onChange={(e) => setSkuType(e.target.value)}
            className="w-[160px] h-9 p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
          >
            <option value="" disabled>
              SKU Type
            </option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
            <option value="type3">Type 3</option>
          </select>

          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="w-[160px] h-9 p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
          >
            <option value="" disabled>
              Client
            </option>
            <option value="client1">Client 1</option>
            <option value="client2">Client 2</option>
            <option value="client3">Client 3</option>
          </select>
        </div>
      </div>

      <div className="h-[350px]  mb-3">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap  mt-3 ">
          <SkuTable skudata={skudata} />
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-4 mt-4 ">
        <CommonPagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </div>
      <div>
        <SkuPopup visible={visible} setVisible={setVisible} />
      </div>
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
      <div className="p-6">
      <label className="block  text-2xl font-semibold ml-7">Add SKU Details</label>
      </div>
      <div className="p-1">
      <label className="block  text-xl font-semibold ml-12">Default SKU Details</label>
      </div>
      <div className="p-4 space-y-4 max-w-6xl mx-auto">
  <div className="grid grid-cols-3 gap-4">
    <div>
      <label className="block">SKU Name*</label>
      <input placeholder="Enter SKU Name" className="p-2 border rounded w-full" />
    </div>
    <div>
  <label className="block">Client*</label>
  <select className="p-2 border rounded w-full">
    <option value=""  hidden>
      Select Client
    </option>
    <option>Pazl.in</option>
  </select>
</div>
<div>
  <label className="block">Number of Layers</label>
  <select className="p-2 border rounded w-full">
    <option value=""  hidden>
      Select Number of Layers
    </option>
    <option>1</option>
  </select>
</div>

    <div>
      <label className="block">Length*</label>
      <input placeholder="Enter Length" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Width</label>
      <input placeholder="Enter Width" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Height</label>
      <input placeholder="Enter Height" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Joints</label>
      <input placeholder="Enter Joints" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Ups</label>
      <input placeholder="Enter Ups" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Inner/Outer Dimension</label>
      <div className="flex space-x-4">
        <label><input type="radio" checked readOnly /> Inner</label>
        <label><input type="radio" readOnly /> Outer</label>
      </div>
    </div>
    <div>
      <label className="block">Flap Width</label>
      <input placeholder="Enter Flap Width" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Flap Tolerance</label>
      <input placeholder="Enter Flap Tolerance" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Length Trimming Tolerance</label>
      <select className="p-2 border rounded w-full">
        <option>Select Length Trimming Tolerance</option>
        <option>Option 2</option>
      </select>
    </div>
    <div>
      <label className="block">Width Trimming Tolerance</label>
      <select className="p-2 border rounded w-full">
        <option>Select Width Trimming Tolerance</option>
        <option>Option 2</option>
      </select>
    </div>
    <div>
      <span>Strict Adherence for All Layers</span>
      <div 
        className={`w-11 h-6 flex items-center bg-white border border-blue-600 rounded-full p-1 cursor-pointer ${strictAdherence ? 'bg-white' : 'bg-white'}`}
        onClick={() => setStrictAdherence(!strictAdherence)}
      >
        <div 
          className={`w-5 h-5 bg-blue-600 rounded-full shadow-md transform duration-300 ease-in-out ${strictAdherence ? 'translate-x-5' : ''}`}
        ></div>
      </div>
    </div>
    <div>
      <label className="block">Customer Reference</label>
      <input placeholder="Enter Customer Reference" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Reference #</label>
      <input placeholder="Enter Reference #" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Internal ID</label>
      <input placeholder="Enter Internal ID" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Board Size (cm²)</label>
      <input placeholder="Enter Board Size" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Deckle Size</label>
      <input placeholder="Enter Deckle Size" className="p-2 border rounded w-full" />
    </div>
    <div>
      <label className="block">Minimum Order Level</label>
      <input 
        type="number" 
        placeholder="Enter Minimum Order Level"
        value={minimumorderlevel} 
        onChange={(e) => setMinimumorderlevel(Number(e.target.value))} 
        className="p-2 border rounded w-full" 
      />
    </div>
  </div>
</div>
<div className="p-6">
      <label className="block mb-2 text-lg font-semibold ml-7">SKU Type</label>
      <select className="w-80 p-2 border rounded mb-4 ml-7">
        <option>corrugated sheet</option>
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
            <tr >
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
              <td className="p-2 text-center">

              </td>
              <td className="p-2 text-center">1</td>
              <td className="p-2 text-center">0.102528</td>
              <td className="p-2 text-center">3.24</td>
            </tr>

            {/* C1 Layer */}
            <tr >
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
            <tr >
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
              <td className="p-2 text-center">
               
              </td>
              <td className="p-2 text-center">1</td>
              <td className="p-2 text-center">0.102528</td>
              <td className="p-2 text-center">3.24</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="flex justify-end gap-4 mt-4 mr-[4%]">
<button className="bg-[#079b54] text-white px-4 py-2 rounded-md transition">

                Add Version
</button>
<button className="bg-[#079b54] text-white px-4 py-2 rounded-md transition">

                Save As Draft
</button>
<button

                onClick={handleSubmit}

                className="cursor-pointer w-[88px] h-[40px] px-2 border-0 box-border rounded-md bg-[#079b54] text-white text-[16px] font-['Poppins'] leading-[24px] outline-none"
>

                Submit
</button>
</div>

 

        </Drawer>
    </div>
  )
}

export default SkuList
