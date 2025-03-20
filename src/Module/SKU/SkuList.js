import React, { useEffect, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import { MdTakeoutDining, MdOutlineSettingsInputComposite, MdCheckroom } from 'react-icons/md'
import Drawer from '../../components/Drawer/Drawer'
import apiMethods from '../../api/config'
import axios from 'axios'
import CommonPagination from '../../components/New/Pagination'
import SkuPopup from './SkuPopup'
import SkuTable from './SkuTable'
import { useNavigate } from 'react-router-dom'
import SkuAddEdit from './SkuAddEdit'
import ActionButton from '../../components/New/ActionButton'

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
  const [strictAdherence, setStrictAdherence] = useState(false)
  const [editTag, setEditTag] = useState(false)
  const navigate = useNavigate()
  const [addNewSkuData, setAddNewSkuData] = useState({
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
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setAddNewSkuData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleStrictAdherenceToggle = () => {
    const newStrictAdherence = !strictAdherence
    setStrictAdherence(newStrictAdherence)

    setAddNewSkuData((prevData) => ({
      ...prevData,
      strict_adherence: newStrictAdherence,
    }))
  }

  const handleAddSkuSubmit = async () => {
    try {
      if (editTag) {
        console.log(addNewSkuData);
        
        await apiMethods.updateSku(addNewSkuData)
        navigate('/SKU')
      } else {
        await apiMethods.addSku(addNewSkuData)
        navigate('/SKU')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSkuEdit = (id) => {
    const selectedSku = skudata.find((sku) => sku.id === id);
    setEditTag(true)
    setAddNewSkuData({
      id: selectedSku.id || '',
      sku_name: selectedSku.sku_name || '',
      company_id: selectedSku.company_id || 8,
      client_id: selectedSku.client_id || 2,
      client: selectedSku.client || '',
      ply: selectedSku.ply || '',
      length: selectedSku.length || '',
      width: selectedSku.width || '',
      height: selectedSku.height || '',
      joints: selectedSku.joints || '',
      ups: selectedSku.ups || '',
      inner_outer_dimension: selectedSku.inner_outer_dimension || '',
      flap_width: selectedSku.flap_width || '',
      flap_tolerance: selectedSku.flap_tolerance || '',
      length_trimming_tolerance: selectedSku.length_trimming_tolerance || '',
      width_trimming_tolerance: selectedSku.width_trimming_tolerance || '',
      strict_adherence: selectedSku.strict_adherence || false,
      customer_reference: selectedSku.customer_reference || '',
      reference_number: selectedSku.reference_number || '',
      internal_id: selectedSku.internal_id || '',
      board_size_cm2: selectedSku.board_size_cm2 || '',
      deckle_size: selectedSku.deckle_size || '',
      minimum_order_level: selectedSku.minimum_order_level || '',
      sku_type: selectedSku.sku_type || '',
      sku_values: selectedSku.sku_values || [
        {
          material: '',
          color: '',
        },
      ],
    })

    setStrictAdherence(selectedSku.strict_adherence || false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await apiMethods.getDynamicFormFields(11)
        const response = await axios.get('https://mocki.io/v1/388d6512-3fdf-4fe9-8cf2-0588e51ceb38')
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
    const fetchData = async () => {
      try {
        const response = await apiMethods.getSkuList()
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-x-2 -my-2">
        <h1 className="sm:text-[32px] font-bold text-[#424242]">SKU</h1>
        <span className="sm:text-[18px] font-semibold text-[#424242] ">Total SKU Count: 475</span>
        <div className="flex gap-2 items-center justify-between w-full sm:w-auto">
          {['Add SKU', 'Bulk Upload', 'Export to Excel'].map((text, index) => (
            <ActionButton
              key={index}
              label={text}
              customColor='bg-[#21338e]'
              className="sm:h-8 flex items-center font-bold text-white px-2 rounded-lg shadow-md border-none cursor-pointer"
              onClick={() => {
                if (text === 'Add SKU') {
                  setDrawerOpen(true)
                }
                if (text === 'Bulk Upload') {
                  setVisible(true)
                }
              }}
            >
            </ActionButton>
          ))}
        </div>
      </div>

      {/* SKU Boxes */}
      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
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
            className={`w-full sm:w-[280px] flex items-center justify-between  font-bold rounded-lg shadow-md text-white border p-2`}
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
      <div className="flex items-center justify-between flex-wrap gap-2 mt-2 w-full">
        <input
          type="text"
          placeholder="Search SKU"
          value={searchSKU}
          onChange={(e) => setSearchSKU(e.target.value)}
          className="w-full sm:w-[350px] p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
        />

        <div className="flex justify-between gap-2 w-full sm:w-auto">
          <select
            value={skuType}
            onChange={(e) => setSkuType(e.target.value)}
            className="sm:w-[150px] p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
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
            className="sm:w-[150px] p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
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

      <div className='mb-1'>
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap mt-2 ">
          <SkuTable skudata={skudata} handleSkuEdit={handleSkuEdit} editTag={editTag} />
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-4">
        <CommonPagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </div>
      <div>
        <SkuPopup visible={visible} setVisible={setVisible} />
      </div>
      <Drawer
        isOpen={isDrawerOpen || editTag}
        onClose={() => (setDrawerOpen(false), setEditTag(false))}
      >
        <SkuAddEdit
          handleChange={handleChange}
          strictAdherence={strictAdherence}
          handleStrictAdherenceToggle={handleStrictAdherenceToggle}
          handleAddSkuSubmit={handleAddSkuSubmit}
          editTag={editTag}
          addNewSkuData={addNewSkuData}
          setAddNewSkuData={setAddNewSkuData}
        />
      </Drawer>
    </div>
  )
}

export default SkuList
