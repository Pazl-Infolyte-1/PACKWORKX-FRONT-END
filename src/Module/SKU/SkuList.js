import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import {
  MdTakeoutDining,
  MdOutlineSettingsInputComposite,
  MdCheckroom,
  MdClearAll,
  MdFavorite,
} from 'react-icons/md'
import { AiFillCarryOut, AiFillCodeSandboxCircle } from 'react-icons/ai'

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
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Drawer1 from '../../components/Drawer/Drawer1'
import ContentHeader from '../../components/New/ContentHeader'
import { FiDownload, FiUpload } from 'react-icons/fi'
import SkuView from './SkuView'

function SkuList() {
  const [skuType, setSkuType] = useState([])
  const [client, setClient] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedDisplayName, setSelectedDisplayName] = useState('')
  const [clientName, setClientName] = useState('')
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
  const navigate = useNavigate()
  const [isSingleViewPopupForType, setisSingleViewPopupForType] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({})
  const [skuVariant, setSkuVariant] = useState('RSC Box')
  const [isMinimized, setIsMinimized] = useState(true)
  const [addNewSkuData, setAddNewSkuData] = useState({
    sku_name: null,
    client_id: null,
    client: null,
    ply: null,
    length: null,
    width: null,
    height: null,
    lwh: null,
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
    route: [],
    part_count: null,
    estimate_composite_item: null,
    description: null,
    default_sku_details: null,
    tags: {},
    gst_percentage: null,
    sku_values: [
      {
        layer: null,
        gsm: null,
        bf: null,
        material: null,
        color: null,
        flute_type: null,
        weight: null,
        bursting_strength: null,
        flute_ratio: null,
      },
    ],
  })
  const [selectedSku, setSelectedSku] = useState(null)
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
      setPopupOpen(true)

      // Don't set 'add_client' as the selected value
      setAddNewSkuData((prev) => ({
        ...prev,
        client: null,
      }))
      return
    }
    if (name === 'gst_percentage') {
      setAddNewSkuData((prev) => ({
        ...prev,
        gst_percentage: value,
      }))
      return
    }

    setAddNewSkuData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Find the selected client based on the client_id
    const selectedClient = client.find((item) => item.client_id === parseInt(value)) // Ensure value is an integer

    if (selectedClient) {
      setAddNewSkuData((prev) => ({
        ...prev,
        client_id: selectedClient.client_id,
        client: selectedClient.company_name,
      }))
      if (selectedClient.client_id?.toString().trim()) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.client_id
          return newErrors
        })
      }
    } else {
      console.log('No client found for the selected client_id')
    }

    if (value?.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleStrictAdherenceToggle = () => {
    const newStrictAdherence = !strictAdherence
    setStrictAdherence(newStrictAdherence)

    setAddNewSkuData((prevData) => ({
      ...prevData,
      strict_adherence: newStrictAdherence,
    }))
  }

  const deckleError = useSelector((state) => state.boardCalculations.deckleError)
  const dieError = useSelector((state) => state.diecutCalculations.deckleError)

  const handleAddSkuSubmit = async () => {
    console.log('skuVariant type', skuVariant)
    console.log('skuVariant typeddd', addNewSkuData.sku_type)

    let newErrors = {}
    if (addNewSkuData.sku_type === 'Custom Item') {
      // Validate only for Custom Item
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.estimate_composite_item) newErrors.estimate_composite_item = 'Required'
      if (!addNewSkuData.default_sku_details) newErrors.default_sku_details = 'Required'
      if (!addNewSkuData.description) newErrors.description = 'Required'
    } else if (addNewSkuData.sku_type === 'Composite') {
      // Validate only for Composite
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.composite_type) newErrors.composite_type = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
        newErrors.route = 'Required'
      }
    } else if (addNewSkuData.sku_type === 'Die Cut box') {
      // Validate only for Composite
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.ply) newErrors.ply = 'Required'
      if (!addNewSkuData.ups) newErrors.ups = 'Required'
      if (!addNewSkuData.select_dies) newErrors.select_dies = 'Required'
      // if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
      // if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
      if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
      if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
      if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
        newErrors.route = 'Required'
      }
    } else if (addNewSkuData.sku_type === 'Board') {
      // Validate only for Composite
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.ply) newErrors.ply = 'Required'
      if (!addNewSkuData.joints) newErrors.joints = 'Required'
      if (!addNewSkuData.ups) newErrors.ups = 'Required'
      if (!addNewSkuData.flap_width) newErrors.flap_width = 'Required'
      if (!addNewSkuData.flap_tolerance) newErrors.flap_tolerance = 'Required'
      if (!addNewSkuData.length_trimming_tolerance) newErrors.length_trimming_tolerance = 'Required'
      // if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
      // if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
      if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
      if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
      if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
      if (!addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
        newErrors.route = 'Required'
      }
    }
    //if (!addNewSkuData.gst_percentage) newErrors.gst_percentage = 'Required'
    else if (addNewSkuData.sku_type === 'RSC box') {
      // Validate only for Composite
      if (!addNewSkuData.sku_name) newErrors.sku_name = 'Required'
      if (!addNewSkuData.client_id) newErrors.client_id = 'Required'
      if (!addNewSkuData.ply) newErrors.ply = 'Required'

      if (!addNewSkuData.joints) newErrors.joints = 'Required'
      if (!addNewSkuData.ups) newErrors.ups = 'Required'
      if (!addNewSkuData.length) newErrors.length = 'Required'
      if (!addNewSkuData.width) newErrors.width = 'Required'
      if (!addNewSkuData.height) newErrors.height = 'Required'
      if (!addNewSkuData.joints) newErrors.joints = 'Required'
      if (!addNewSkuData.deckle_size) newErrors.deckle_size = 'Required'
      if (!addNewSkuData.inner_outer_dimension) newErrors.inner_outer_dimension = 'Required'
      if (!addNewSkuData.flap_width) newErrors.flap_width = 'Required'
      if (!addNewSkuData.length_trimming_tolerance) newErrors.length_trimming_tolerance = 'Required'
      if (!addNewSkuData.width_trimming_tolerance) newErrors.width_trimming_tolerance = 'Required'
      // if (!addNewSkuData.customer_reference) newErrors.customer_reference = 'Required'
      // if (!addNewSkuData.reference_number) newErrors.reference_number = 'Required'
      if (!addNewSkuData.internal_id) newErrors.internal_id = 'Required'
      if (!addNewSkuData.width_board_size_cm2) newErrors.width_board_size_cm2 = 'Required'
      if (!addNewSkuData.length_board_size_cm2) newErrors.length_board_size_cm2 = 'Required'
      if (!addNewSkuData.ups) newErrors.ups = 'Required'
      if (!addNewSkuData.minimum_order_level) newErrors.minimum_order_level = 'Required'
      if (!Array.isArray(addNewSkuData.route) || addNewSkuData.route.length === 0) {
        newErrors.route = 'Required'
      }
    } else {
      newErrors = {}
    }
    setErrors(newErrors)

    console.log('erroexxx', newErrors)
    if (Object.keys(newErrors).length === 0) {
      console.log('gggghhhg')
      if (dieError) {
        setAlerts([{ severity: 'error', message: dieError || '1' }])
        return null
      }
      if (deckleError) {
        setAlerts([{ severity: 'error', message: deckleError || '3' }])
        return null
      }
      if (boardSizeError) {
        console.warn('Blocked submission due to board size error:', boardSizeError)
        setAlerts([{ severity: 'error', message: boardSizeError || '4' }])
        return null
      }

      console.log('addskkkk', addNewSkuData)

      const numberSkuData = {
        ...addNewSkuData,
        width_board_size_cm2: Number(addNewSkuData.width_board_size_cm2),
        length_board_size_cm2: Number(addNewSkuData.length_board_size_cm2),
        deckle_size: Number(addNewSkuData.deckle_size),
        gst_percentage: Number(addNewSkuData.gst_percentage),
      }
      console.log('su data', numberSkuData)
      try {
        let response

        if (editTag) {
          response = await apiMethods.updateSku(numberSkuData)
        } else {
          response = await apiMethods.addSku(numberSkuData)
        }

        console.log('SKU request successful:', response)
        if (response?.data?.message) {
          setAlerts([{ severity: 'success', message: response.data.message }])
          setRefresh((prev) => !prev)
          if (isSingleViewPopupForType) {
            setisSingleViewPopupForType(false)
          } else {
            setDrawerOpen(false)
          }
          setEditTag(false)
        }
      } catch (error) {
        console.error('Error adding SKU:', error)
        console.log(JSON.stringify(error))
        if (error?.response?.data?.error) {
          setAlerts([{ severity: 'error', message: error?.response?.data?.error }])
        } else {
          setAlerts([{ severity: 'error', message: error?.response?.data?.message }])
        }
      } finally {
        setTimeout(() => {
          setAlerts([])
        }, 3000)
      }
    }
  }

  const handleSkuEdit = (id) => {
    const selectedSku = skudata.find((sku) => sku.id === id)
    setEditTag(true)
    setEditedSkuData(selectedSku)
    setAddNewSkuData({
      id: selectedSku.id || null,
      sku_name: selectedSku.sku_name || null,
      client_id: selectedSku.client_id || null,
      client: selectedSku.company_name || null,
      ply: selectedSku.ply || null,
      length: selectedSku.length || null,
      width: selectedSku.width || null,
      height: selectedSku.height || null,
      lwh: selectedSku.lwh || null,
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
      route: selectedSku.route || [],
      part_count: selectedSku.part_count,
      width_board_size_cm2: selectedSku.width_board_size_cm2 || null,
      length_board_size_cm2: selectedSku.length_board_size_cm2 || null,
      estimate_composite_item: selectedSku.estimate_composite_item || null,
      description: selectedSku.description || null,
      default_sku_details: selectedSku.default_sku_details || null,
      tags: selectedSku.tags || {},
      gst_percentage: selectedSku.gst_percentage || null,
      sku_values: selectedSku.sku_values || [
        {
          layer: null,
          gsm: null,
          bf: null,
          material: null,
          color: null,
          flute_type: null,
          weight: null,
          bursting_strength: null,
          flute_ratio: null,
        },
      ],
    })

    setStrictAdherence(selectedSku.strict_adherence || false)
  }
  const fetchData = async () => {
    // skip sku get call
    if (location.state?.skipInitialFetch && !refresh) {
      return
    }
    try {
      const response = await apiMethods.getSkuList({
        search: searchQuery || '',
        client: clientName || '',
        sku_type: selectedSkuType || '',
        page: pagination?.currentPage || 1,
        limit: message ? 10000 : limit,
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
  useEffect(() => {
    fetchData()
  }, [
    refresh,
    selectedClient,
    selectedDisplayName,
    clientName,
    searchQuery,
    pagination?.currentPage,
    selectedSkuType,
    limit,
    +location.state?.skipInitialFetch,
    message,
  ])

  // Clear all filters
  const handleClearFilters = () => {
    // Clear the search input using the ref
    if (searchBarRef.current) {
      searchBarRef.current.clearSearch()
    }
    setSelectedSkuType('')
    setSelectedClient('')
    setSelectedDisplayName('')
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
  const handleNewSku = () => {
    setErrors({})
    dispatch({
      type: 'SET_SELECTED_ROUTE_IDS',
      payload: [], // 👈 empty array
    })
    dispatch({
      type: 'SET_DECKLE_SIZE',
      payload: {
        deckle_size: '',
        deckleError: '',
      },
    })
    dispatch({ type: 'RESET_DIECUT_CALCULATIONS' })

    setDrawerOpen(true)
    setAddNewSkuData(() => createInitialSkuData(user.id, strictAdherence))
  }

  return (
    <div className="flex  h-full">
      <div className={`${isMinimized ? 'w-[350px]' : 'w-full'}`}>
        {/* Header */}
        <ContentHeader
          heading={'SKU'}
          onAddClick={handleNewSku}
          isMinimized={isMinimized}
          menuOptions={[
            {
              icon: <FiDownload className="mr-2 text-blue-500" />,
              label: 'Bulk Upload',
              onClick: () => setVisible(true),
            },
            {
              icon: <FiUpload className="mr-2 text-blue-500" />,
              label: 'Export to Excel',
              onClick: handleSkuExelExport,
            },
          ]}
        />
        <CustomAlert alerts={alerts} handleClose={handleClose} />
        {/* SKU Boxes */}
        {!isMinimized && (
          <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
            {[
              {
                name: 'RSC Box',
                count: dashboard?.rscbox || 0,
                color: '#286eb1',
                bgColor: '#2e2d6d',
                icon: <FaBoxOpen className="text-white text-1xl" />,
              },
              {
                name: 'Board',
                count: dashboard?.board || 0,
                color: '#8000c0',
                bgColor: '#67009a',
                icon: <MdTakeoutDining className="text-white text-1xl" />,
              },
              {
                name: 'Die Cut Box',
                count: dashboard?.diecutbox || 0,
                color: '#077A7D',
                bgColor: '#005a4d',
                icon: <MdOutlineSettingsInputComposite className="text-white text-1xl" />,
              },
              {
                name: 'Composite',
                count: dashboard?.composite || 0,
                color: '#C95792',
                bgColor: '#7a0064',
                icon: <AiFillCarryOut className="text-white text-1xl" />,
              },
              {
                name: 'Custom Item',
                count: dashboard?.customitem || 0,
                color: '#559400',
                bgColor: '#4a8000',
                icon: <AiFillCodeSandboxCircle className="text-white text-1xl" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`w-full sm:w-[235px] flex items-center justify-between  font-bold rounded-lg shadow-md text-white border p-2`}
                style={{ backgroundColor: item.color }}
              >
                <div className="flex  gap-2 items-center">
                  <h2 className="text-xl text-white">{item.icon}</h2>
                  <h2 className="text-sm font-bold text-white ">{item.name}</h2>
                </div>
                <div
                  className="h-[40px] w-[40px] flex items-center justify-center rounded-lg  "
                  style={{ backgroundColor: item.bgColor }}
                >
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        {!isMinimized && (
          <div className="flex items-center justify-end flex-wrap gap-2 my-4 p-2 w-full bg-white border border-gray-200 border-b-transparent">
            {/* <SearchBar text="SKU" data={skudata} ref={searchBarRef} /> */}

            <div className="flex justify-between gap-2 w-full sm:w-auto text-xs">
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
                onChange={(e) => {
                  setSelectedClient(e.target.value)

                  const selectedItem = client.find((item) => item.client_id == e.target.value)

                  setSelectedDisplayName(selectedItem?.display_name)
                  setClientName(selectedItem?.company_name)
                }}
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
        )}
        <div className={`${isMinimized ? 'mt-1' : '-my-6'}`}>
          <div className="flex overflow-x-auto overflow-y-auto whitespace-nowrap ">
            <SkuTable
              skudata={filteredSearchData.length > 0 ? filteredSearchData : skudata}
              setSkuData={setSkuData}
              handleSkuEdit={handleSkuEdit}
              editTag={editTag}
              alerts={alerts}
              setAlerts={setAlerts}
              onSkuDeleted={fetchData}
              setErrors={setErrors}
              setIsMinimized={setIsMinimized}
              isMinimized={isMinimized}
              setSelectedSku={setSelectedSku}
            />
          </div>
        </div>

        {/* Pagination Section */}
        {/* <div className="flex justify-end items-center gap-4 mt-[40px]">
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
      </div> */}
        <div>
          <SkuPopup visible={visible} setVisible={setVisible} />
        </div>
        {/*{isDrawerOpen || editTag && (*/}
        <Drawer
          maxWidth="1280px"
          isOpen={isDrawerOpen || editTag}
          title={editTag ? 'Edit SKU Details' : 'Add SKU Details'}
          onClose={() => {
            setDrawerOpen(false)
            setEditTag(false)
            setClientDisable(false)
            setAddNewSkuData(() => createInitialSkuData(user.id, strictAdherence))
            //navigate('/SKU')
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
              //navigate('/SKU')
            }}
            setisSingleViewPopupForType={setisSingleViewPopupForType}
            isSingleViewPopupForType={isSingleViewPopupForType}
            isPopupOpen={isPopupOpen}
            setPopupOpen={setPopupOpen}
            message={message}
            setMessage={setMessage}
            errors={errors}
            setErrors={setErrors}
            setSkuVariant={setSkuVariant}
          />
        </Drawer>
      </div>
      {isMinimized && (
        <div className="flex  transition-all duration-300">
          <SkuView selectedSku={selectedSku} setIsMinimized={setIsMinimized} />
        </div>
      )}
    </div>
  )
}

export default SkuList
