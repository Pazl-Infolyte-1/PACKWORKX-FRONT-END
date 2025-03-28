import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import {
  MdTakeoutDining,
  MdOutlineSettingsInputComposite,
  MdCheckroom,
  MdClearAll,
} from 'react-icons/md'
import Drawer from '../../components/Drawer/Drawer'
import apiMethods from '../../api/config'
import CommonPagination from '../../components/New/Pagination'
import SkuPopup from './SkuPopup'
import SkuTable from './SkuTable'
import { useLocation } from 'react-router-dom'
import SkuAddEdit from './SkuAddEdit'
import ActionButton from '../../components/New/ActionButton'
import SearchBar from '../../components/New/SearchBar'
import { AuthContext } from '../../Context/AuthContext'
import { useSearch } from '../../components/New/SearchContext'

function SkuList() {
  const [skuType, setSkuType] = useState([])
  const [client, setClient] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedSkuType, setSelectedSkuType] = useState('')
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [skudata, setSkuData] = useState([])
  const [strictAdherence, setStrictAdherence] = useState(false)
  const [editTag, setEditTag] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [clientDiasble, setClientDisable] = useState(false)
  const [limit, setLimit] = useState(10)
  const { user } = useContext(AuthContext)
  const { searchQuery, setSearchQuery, filteredSearchData } = useSearch()
  const location = useLocation()
  const searchBarRef = useRef(null);


  const [addNewSkuData, setAddNewSkuData] = useState({
    sku_name: null,
    client_id: user.id,
    client: null,
    ply: null,
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
        flute_ratio: null,
      },
    ],
  })

  useEffect(() => {
    if (location.state?.initialRender) {
      setDrawerOpen(true)
      setClientDisable(true)
    }
    if (location.state?.clientdata) {
      setClient(location.state?.clientdata)
    }
    if (location.state?.client_id) {
      setAddNewSkuData((prevState) => ({
        ...prevState,
        client: location.state?.client_id,
      }))
    }
  }, [location.state])

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
        await apiMethods.updateSku(addNewSkuData)
        setEditTag(false)
        setRefresh((prev) => !prev)
      } else {
        await apiMethods.addSku(addNewSkuData)
        setDrawerOpen(false)
        setRefresh((prev) => !prev)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSkuEdit = (id) => {
    const selectedSku = skudata.find((sku) => sku.id === id)
    setEditTag(true)
    setAddNewSkuData({
      id: selectedSku.id || '',
      sku_name: selectedSku.sku_name || '',
      client_id: selectedSku.client_id || 1,
      client: selectedSku.client || '',
      ply: selectedSku.ply || '',
      length: selectedSku.length || '',
      width: selectedSku.width || '',
      height: selectedSku.height || '',
      unit: selectedSku.unit || '',
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
          layer: '',
          gsm: '',
          bf: '',
          material: '',
          color: '',
          flute_type: '',
          flute_ratio: '',
        },
      ],
    })

    setStrictAdherence(selectedSku.strict_adherence || false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiMethods.getSkuList({
          search: searchQuery || '',
          client: selectedClient || '',
          sku_type: selectedSkuType || '',
          page: pagination?.currentPage || 1,
          limit: limit,
        })
        const clientResponse = await apiMethods.getClients()
    
        setSkuData(response.data)
        setClient(clientResponse.data)
        setPagination(response.pagination)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [refresh, selectedClient, searchQuery, pagination?.currentPage, selectedSkuType, limit])

  // Clear all filters
  const handleClearFilters = () => {
    // Clear the search input using the ref
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch();
    }
    setSelectedSkuType('')
    setSelectedClient('')
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-x-2 -my-2">
        <h1 className="sm:text-[32px] text-[#424242]">SKU</h1>
        <span className="sm:text-[18px] font-semibold text-[#424242] ">
          Total SKU Count: {pagination?.totalCount}
        </span>
        <div className="flex gap-2 items-center justify-between w-full sm:w-auto">
          {['Add SKU', 'Bulk Upload', 'Export to Excel'].map((text, index) => (
            <ActionButton
              key={index}
              label={text}
              customColor="bg-[#21338e]"
              className="sm:h-8 flex items-center font-bold text-white px-2 rounded-lg shadow-md border-none cursor-pointer"
              onClick={() => {
                if (text === 'Add SKU') {
                  setDrawerOpen(true)
                }
                if (text === 'Bulk Upload') {
                  setVisible(true)
                }
              }}
            ></ActionButton>
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
      <div className="flex items-center justify-between flex-wrap gap-2 my-3 w-full">
        <SearchBar text="SKU" data={skudata} ref={searchBarRef}/>

        <div className="flex justify-between gap-2 w-full sm:w-auto">
          <select
            value={selectedSkuType}
            onChange={(e) => setSelectedSkuType(e.target.value)}
            className="sm:w-[150px] p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
          >
            <option value="" disabled>
              SKU Type
            </option>
            {skuType.map((option, index) => (
              <option key={index} value={option.sku_type}>
                {option.sku_type}
              </option>
            ))}
          </select>

          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="sm:w-[150px] p-2 rounded-lg shadow-md bg-white text-[#424242] outline-none border-none"
          >
            <option value="">Select Client</option>
            {client.map((item, index) => (
              <option key={index} value={item.client_id}>
                {item.display_name || item.client_id}
              </option>
            ))}
          </select>
          <ActionButton
            label={'Clear All'}
            variant="minimal"
            customColor="black"
            className="bg-white"
            icon={MdClearAll}
            onClick={handleClearFilters}
          />
        </div>
      </div>

      <div className="mb-1">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap mt-2 ">
          <SkuTable
            skudata={filteredSearchData.length > 0 ? filteredSearchData : skudata}
            setSkuData={setSkuData}
            handleSkuEdit={handleSkuEdit}
            editTag={editTag}
          />
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-4">
        <CommonPagination
          count={pagination?.totalPages || 1}
          page={pagination?.currentPage || 1}
          onChange={(event, value) => {
            setPagination((prev) => ({
              ...prev,
              currentPage: value,
            }))
            setRefresh((prev) => !prev)
          }}
          onLimitChange={(newLimit) => {
            setLimit(newLimit)
            // Reset to first page when changing limit
            setPagination((prev) => ({
              ...prev,
              currentPage: 1,
            }))
            setRefresh((prev) => !prev)
          }}
          limit={limit}
        />
      </div>
      <div>
        <SkuPopup visible={visible} setVisible={setVisible} />
      </div>
      <Drawer
        isOpen={isDrawerOpen || editTag}
        onClose={() => (setDrawerOpen(false), setEditTag(false), setClientDisable(false))}
      >
        <SkuAddEdit
          handleChange={handleChange}
          strictAdherence={strictAdherence}
          handleStrictAdherenceToggle={handleStrictAdherenceToggle}
          handleAddSkuSubmit={handleAddSkuSubmit}
          editTag={editTag}
          addNewSkuData={addNewSkuData}
          setAddNewSkuData={setAddNewSkuData}
          client={client}
          setClient={setClient}
          clientDiasble={clientDiasble}
          skuType={skuType}
          setSkuType={setSkuType}
        />
      </Drawer>
    </div>
  )
}

export default SkuList
