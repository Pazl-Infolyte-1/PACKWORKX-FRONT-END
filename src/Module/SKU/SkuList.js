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

        <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
          <div className="flex justify-start text-[20px] font-semibold pb-4 mt-0">
            {dynamicFields?.data?.pageTitle}
          </div>

          <div className="bg-white">
            {dynamicFields?.data?.sections.map((section) => (
              <div key={section?.groupId} className="mb-8">
                {/* Group Name as Subtitle */}
                <h2 className="text-[18px] font-semibold text-gray-700 mb-4 border-b pb-2">
                  {section?.groupName}
                </h2>

                {/* Render Fields */}
                <div className="grid grid-cols-3">
                  {section?.inputs?.map((inputField) => (
                    <div key={inputField?.id} className="p-2 px-4 rounded-lg">
                      <label className="text-black text-[15px] font-medium block mb-1">
                        {inputField?.label}
                        {inputField?.required && <span className="text-red-500">*</span>}
                      </label>
                      {inputField.type === 'select' && (
                        <select
                          ref={(el) => (formRefs.current[inputField.id] = el)}
                          defaultValue={inputField?.defaultValue || ''}
                          required={inputField?.required}
                          className="w-full h-10 px-2 rounded-lg bg-white text-gray-400 text-[15px] font-['Mulish'] leading-6 outline-none placeholder:text-sm shadow-[0px_5px_15px_rgba(0,0,0,0.25)]"
                        >
                          <option value="" disabled>
                            {inputField?.placeholder || 'Select an option'}
                          </option>
                          {inputField?.options?.map((option) => (
                            <option key={option?.id} value={option?.id}>
                              {option?.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {inputField?.type === 'text' && (
                        <input
                          ref={(el) => (formRefs.current[inputField.id] = el)}
                          type="text"
                          placeholder={inputField?.placeholder || ''}
                          defaultValue={inputField?.defaultValue || ''}
                          required={inputField?.required}
                          className="w-full h-10 px-2 rounded-lg bg-white text-gray-400 text-[15px] font-['Mulish'] leading-6 outline-none placeholder:text-sm shadow-[0px_5px_15px_rgba(0,0,0,0.25)]"
                        />
                      )}
                      {inputField?.type === 'url' && (
                        <input
                          ref={(el) => (formRefs.current[inputField.id] = el)}
                          type="text"
                          placeholder={inputField?.placeholder || ''}
                          defaultValue={inputField?.defaultValue || ''}
                          required={inputField?.required}
                          className="w-full h-10 px-2 rounded-lg bg-white text-gray-400 text-[15px] font-['Mulish'] leading-6 outline-none placeholder:text-sm shadow-[0px_5px_15px_rgba(0,0,0,0.25)]"
                        />
                      )}
                      {inputField?.type === 'email' && (
                        <input
                          ref={(el) => (formRefs.current[inputField.id] = el)}
                          type="email"
                          placeholder={inputField?.placeholder || ''}
                          defaultValue={inputField?.defaultValue || ''}
                          required={inputField?.required}
                          className="w-full h-10 px-2 rounded-lg bg-white text-gray-400 text-[15px] font-['Mulish'] leading-6 outline-none placeholder:text-sm shadow-[0px_5px_15px_rgba(0,0,0,0.25)]"
                        />
                      )}

                      {inputField?.type === 'number' && (
                        <input
                          ref={(el) => (formRefs.current[inputField.id] = el)}
                          type="number"
                          placeholder={inputField?.placeholder || ''}
                          defaultValue={inputField?.defaultValue || ''}
                          required={inputField?.required}
                          className="w-full h-10 px-2 rounded-lg bg-white text-gray-400 text-[15px] font-['Mulish'] leading-6 outline-none placeholder:text-sm shadow-[0px_5px_15px_rgba(0,0,0,0.25)]"
                        />
                      )}

                      {inputField?.type === 'tel' && (
                        <input
                          ref={(el) => (formRefs.current[inputField.id] = el)}
                          type="number"
                          placeholder={inputField?.placeholder || ''}
                          defaultValue={inputField?.defaultValue || ''}
                          required={inputField?.required}
                          className="w-full h-10 px-2 rounded-lg bg-white text-gray-400 text-[15px] font-['Mulish'] leading-6 outline-none placeholder:text-sm shadow-[0px_5px_15px_rgba(0,0,0,0.25)]"
                        />
                      )}

                      {inputField?.type === 'radio' && (
                        <div className="mt-1 flex space-x-4">
                          {inputField?.options?.map((option) => (
                            <label key={option?.id} className="inline-flex items-center">
                              <input
                                ref={(el) => (formRefs.current[inputField.id] = el)}
                                type="radio"
                                name={inputField?.name}
                                value={option?.id}
                                defaultChecked={inputField?.defaultValue == option?.id}
                                className="w-5 h-5 text-blue-500"
                              />
                              <span className="ml-2 text-gray-700">{option?.label}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {inputField?.type === 'checkbox' && (
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id={`checkbox-${inputField?.id}`}
                            className="w-5 h-5 text-blue-500"
                            defaultChecked={inputField?.defaultValue}
                          />
                          <label
                            htmlFor={`checkbox-${inputField?.id}`}
                            className="ml-2 text-gray-700"
                          >
                            {inputField?.options[0]?.label}
                          </label>
                        </div>
                      )}
                      {inputField?.type === 'file' && (
                        <input
                          ref={(el) => (formRefs.current[inputField.id] = el)}
                          type="file"
                          placeholder={inputField?.placeholder || ''}
                          defaultValue={inputField?.defaultValue || ''}
                          required={inputField?.required}
                          className="w-full h-14 px-2 py-2 border-0 border-t border-t-gray-100 box-border rounded-lg shadow-md bg-white text-gray-400 text-lg font-['Mulish'] leading-6 outline-none placeholder:text-sm"
                        />
                      )}
                      {inputField.type === 'toggle' && (
                        <div className="flex items-center ml-[40%] mt-[3%]">
                          <input
                            type="checkbox"
                            id={`toggle-${inputField.id}`}
                            className="hidden peer"
                            defaultChecked={inputField.defaultValue}
                          />
                          <label
                            htmlFor={`toggle-${inputField.id}`}
                            className="relative w-[60px] h-[30px] cursor-pointer block rounded-[10px] shadow-md border border-[#8167E5] bg-white transition-all"
                          >
                            <span className="absolute top-1/2 left-[3px] w-[calc(50%-6px)] h-[calc(100%-6px)] bg-[#8167E5] rounded-[10px] transition-all transform -translate-y-1/2 peer-checked:left-[calc(100%-33px)]"></span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className="top-[1150px] left-[41px] w-[98%] h-auto bg-white rounded-lg border-t border-t-gray-100 box-border shadow-md p-1 pb-5">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr>
                      {data.tableHeaders.map((header) => (
                        <th
                          key={header.id}
                          className="p-6 text-[17px] font-[Mulish] font-medium text-[#7f7f7f] tracking-[0.6px] leading-[26px] capitalize"
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.tableBody.map((row) => (
                      <tr key={row.id}>
                        <td className="p-2 text-center text-[15px] font-[Lexend] font-semibold text-[#030303] leading-[20px]">
                          {row.label}
                        </td>
                        {data.tableHeaders.slice(1).map((header) => (
                          <td key={header.id} className="p-2 text-center">
                            {row[header.id]?.type === 'input' ? (
                              <div className="flex items-center justify-center rounded-lg shadow-md bg-white p-1">
                                <input
                                  type="text"
                                  value={row[header.id]?.defaultValue}
                                  readOnly
                                  className="w-[50px] text-center text-[#030303] text-[15px] font-[Roboto] leading-[19px] outline-none bg-transparent"
                                />
                                <div className="flex flex-col ml-2">
                                  <button className="p-[2px] hover:bg-gray-200 rounded">
                                    <ChevronUpIcon className="w-3 h-3 text-gray-600" />
                                  </button>
                                  <button className="p-[2px] hover:bg-gray-200 rounded">
                                    <ChevronDownIcon className="w-3 h-3 text-gray-600" />
                                  </button>
                                </div>
                              </div>
                            ) : row[header.id]?.type === 'select' ? (
                              <select
                                className="cursor-pointer w-[118px] h-[30px] px-2 border-0 box-border rounded-[10px] shadow-md bg-white text-[#030303] text-[14px] font-[Roboto] leading-[16px] outline-none"
                                defaultValue={row[header.id]?.defaultValue}
                              >
                                {data.colorOptions.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-[#030303] text-[18px] font-[Lexend] leading-[23px]">
                                {row[header.id]?.defaultValue}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
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
          </div>
        </Drawer>
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
    </div>
  )
}

export default SkuList
