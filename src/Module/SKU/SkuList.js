import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import {
  MdTakeoutDining,
  MdOutlineSettingsInputComposite,
  MdCheckroom,
  MdClearAll,
  MdFavorite
} from 'react-icons/md'
import { AiFillCarryOut, AiFillCodeSandboxCircle } from "react-icons/ai";

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
import CustomAlert from '../../components/New/CustomAlert'
import createInitialSkuData from './CreateInitialSkuData'
import { bottom } from '@popperjs/core'
import { useNavigate } from 'react-router-dom';

function SkuList() {
  const [skuType, setSkuType] = useState([])
  const [client, setClient] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedSkuType, setSelectedSkuType] = useState('')
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [skudata, setSkuData] = useState([])
  const [editedSkudata, setEditedSkuData] = useState(null)
  const [strictAdherence, setStrictAdherence] = useState(false)
  const [editTag, setEditTag] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [clientDiasble, setClientDisable] = useState(false)
  const [limit, setLimit] = useState(10)
  const [alerts, setAlerts] = useState([])
  const { user } = useContext(AuthContext)
  const { searchQuery, setSearchQuery, filteredSearchData } = useSearch()
  const location = useLocation()
  const searchBarRef = useRef(null)
  const [boardSizeError, setBoardSizeError] = useState('')
  const navigate = useNavigate();

  const [addNewSkuData, setAddNewSkuData] = useState({
    sku_name: null,
    client_id: user?.id,
    client: null,
    ply: null,
    length: null,
    width: null,
    height: null,
    unit: 'mm',
    joints: null,
    ups: null,
    select_dies: null,
    no_of_parts: null,
    composite_type: null,
    inner_outer_dimension: null,
    flap_width: null,
    flap_tolerance: null,
    length_trimming_tolerance: 20,
    width_board_size_cm2: null,
    length_board_size_cm2: null,
    width_trimming_tolerance: 20,
    strict_adherence: strictAdherence,
    customer_reference: null,
    reference_number: null,
    internal_id: null,
    board_size_cm2: null,
    deckle_size: null,
    minimum_order_level: null,
    sku_type: 'RSC box',
    part_value: [],
    part_count: null,
    estimate_composite_item: null,
    description: null,
    default_sku_details: null,
    tags: {},
    sku_values: [
      {
        layer: null,
        gsm: null,
        bf: null,
        material: null,
        color: null,
        flute_type: null,
        weight: null,
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

    // Clear the location state after using it to prevent side effects on refresh
    if (location.state) {
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'client' && value === 'add_client') {
      navigate('/clients');
      return;
    }


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
        const response = await apiMethods.updateSku(addNewSkuData)
        if (response?.status === 200) {
          setEditTag(false)
          setRefresh((prev) => !prev)
          setAlerts([
            {
              severity: 'success',
              message: response?.data?.message || 'Sku updated successfully!',
            },
          ])
        } else {
          setAlerts([{ severity: 'error', message: response.data.error || 'Something went wrong' }])
        }
      } else {
        if (boardSizeError) {
          console.warn('Blocked submission due to board size error:', boardSizeError)
          setAlerts([{ severity: 'error', message: boardSizeError }])
          return null // 🔴 Stop submission
        }
        const response = await apiMethods.addSku(addNewSkuData)
        if (response?.status === 201) {
          setDrawerOpen(false)
          setRefresh((prev) => !prev)
          setAlerts([{ severity: 'success', message: 'Sku Added successfully!' }])
        } else {
          setAlerts([
            { severity: 'error', message: response.data.message || 'Something went wrong' },
          ])
        }
      }
    } catch (error) {
      console.error(error)
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Something went wrong' },
      ])
    }
    setAlerts([])
    setBoardSizeError('')
  }

  const handleSkuEdit = (id) => {
    const selectedSku = skudata.find((sku) => sku.id === id)
    setEditTag(true)
    setEditedSkuData(selectedSku)
    setAddNewSkuData({
      id: selectedSku.id || null,
      sku_name: selectedSku.sku_name || null,
      client_id: selectedSku.client_id || 1,
      client: selectedSku.client || null,
      ply: selectedSku.ply || null,
      length: selectedSku.length || null,
      width: selectedSku.width || null,
      height: selectedSku.height || null,
      unit: selectedSku.unit || null,
      joints: selectedSku.joints || null,
      ups: selectedSku.ups || null,
      select_dies: selectedSku.select_dies || null,
      no_of_parts: selectedSku?.no_of_parts || null,
      composite_type: selectedSku?.composite_type || null,
      inner_outer_dimension: selectedSku.inner_outer_dimension || null,
      flap_width: selectedSku.flap_width || null,
      flap_tolerance: selectedSku.flap_tolerance || null,
      length_trimming_tolerance: selectedSku.length_trimming_tolerance || null,
      width_trimming_tolerance: selectedSku.width_trimming_tolerance || null,
      strict_adherence: selectedSku.strict_adherence || false,
      customer_reference: selectedSku.customer_reference || null,
      reference_number: selectedSku.reference_number || null,
      internal_id: selectedSku.internal_id || null,
      board_size_cm2: selectedSku.board_size_cm2 || null,
      deckle_size: selectedSku.deckle_size || null,
      minimum_order_level: selectedSku.minimum_order_level || null,
      sku_type: selectedSku.sku_type || null,
      part_value: selectedSku.part_value || [],
      part_count: selectedSku.part_count,
      estimate_composite_item: selectedSku.estimate_composite_item || null,
      description: selectedSku.description || null,
      default_sku_details: selectedSku.default_sku_details || null,
      tags: selectedSku.tags || {},
      sku_values: selectedSku.sku_values || [
        {
          layer: null,
          gsm: null,
          bf: null,
          material: null,
          color: null,
          flute_type: null,
          weight: null,
          flute_ratio: null,
        },
      ],
    })

    setStrictAdherence(selectedSku.strict_adherence || false)
  }

  useEffect(() => {
    const fetchData = async () => {
      // skip sku get call
      if (location.state?.skipInitialFetch && !refresh) {
        return
      }
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
        setDashboard(response.dashboard)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [
    refresh,
    selectedClient,
    searchQuery,
    pagination?.currentPage,
    selectedSkuType,
    limit,
    location.state?.skipInitialFetch,
  ])

  // Clear all filters
  const handleClearFilters = () => {
    // Clear the search input using the ref
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch()
    }
    setSelectedSkuType('')
    setSelectedClient('')
  }

  const handleSkuExelExport = async () => {
    await apiMethods.getSkuExcelExport({
      search: searchQuery,
      sku_type: selectedSkuType,
      client: selectedClient,
      status: 'active',
    })
  }

  const handleClose = () => {
    setAlerts([])
  }
console.log("client data",client)
console.log("dashboard",dashboard)
  return (
    <div>
      {/* Header */}
      <CustomAlert alerts={alerts} handleClose={handleClose} />
      <div className="flex items-center justify-between flex-wrap gap-x-2 -my-2">
        <h1 className="sm:text-[32px] text-[#424242]">SKU</h1>
        {/* <span className="sm:text-[18px] font-semibold text-[#424242] ">
          Total SKU Count: {pagination?.totalCount}
        </span> */}
        <h3>Total Count:{pagination?.totalCount || 0}</h3>
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
                  setAddNewSkuData(() => createInitialSkuData(user.id, strictAdherence))
                }
                if (text === 'Bulk Upload') {
                  setVisible(true)
                }
                if (text === 'Export to Excel') {
                  handleSkuExelExport()
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
            name: 'RSC Box',
            count: dashboard?.rscbox || 0,
            color: '#286eb1',
            bgColor: '#2e2d6d',
            icon: <FaBoxOpen className="text-white text-2xl" />,
          },
          {
            name: 'Board',
            count: dashboard?.board || 0,
            color: '#ffeeaa',
            bgColor: '#ffcc00',
            icon: <MdTakeoutDining className="text-white text-2xl" />,
          },
          {
            name: 'Die Cut Box',
            count: dashboard?.diecutbox || 0,
            color: '#aad3ff',
            bgColor: '#007aff',
            icon: <MdOutlineSettingsInputComposite className="text-white text-2xl" />,
          },
          {
            name: 'Composite',
            count: dashboard?.composite || 0,
            color: '#87e880',
            bgColor: '#bfbfbb',
            icon: <AiFillCarryOut className="text-white text-2xl" />,
          },
          {
            name: 'Custom Item',
            count: dashboard?.customitem || 0,
            color: '#e2cbf7',
            bgColor: '#10b3aa',
            icon: <AiFillCodeSandboxCircle  className="text-white text-2xl" />,
          },
          //{
          //  name: 'Total SKU',
          //  count: pagination?.totalCount || 0,
          //  color: '#c3f2cb',
          //  bgColor: '#4cd964',
          //  icon: <MdCheckroom className="text-white text-2xl" />,
          //},
        ].map((item, index) => (
          <div
            key={index}
            className={`w-full sm:w-[235px] flex items-center justify-between  font-bold rounded-lg shadow-md text-white border p-2`}
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
      <div className="flex items-center justify-between flex-wrap gap-2 my-4 p-3 w-full bg-white border border-gray-200 border-b-transparent">
        <SearchBar text="SKU" data={skudata} ref={searchBarRef} />

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
      <div className="-my-6">
        <div className="overflow-x-auto overflow-y-auto whitespace-nowrap ">
          <SkuTable
            skudata={filteredSearchData.length > 0 ? filteredSearchData : skudata}
            setSkuData={setSkuData}
            handleSkuEdit={handleSkuEdit}
            editTag={editTag}
            alerts={alerts}
            setAlerts={setAlerts}
          />
        </div>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-end items-center gap-4 mt-[40px]">
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
        maxWidth="1280px"
        isOpen={isDrawerOpen || editTag}
        title={editTag ? 'Edit SKU Details' : 'Add SKU Details'}
        onClose={() => {
          setDrawerOpen(false)
          setEditTag(false)
          setClientDisable(false)
          setAddNewSkuData(() => createInitialSkuData(user.id, strictAdherence))
        }}
      >
        <SkuAddEdit
        isopenval={isDrawerOpen || editTag}
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
          locationvalue={location?.state?.client_id}
          closedrawer={setDrawerOpen}
          setBoardSizeError={setBoardSizeError}
          //onUnitChange={handleUnitChange}
          editedSkudata={editedSkudata}
          handleClose={() => {
            setDrawerOpen(false)
            setEditTag(false)
            setClientDisable(false)
            setAddNewSkuData(() => createInitialSkuData(user.id, strictAdherence))
          }}
        />
      </Drawer>
    </div>
  )
}

export default SkuList
