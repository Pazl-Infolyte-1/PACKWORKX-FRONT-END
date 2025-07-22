import { useContext, useEffect, useRef, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import { MdTakeoutDining, MdOutlineSettingsInputComposite, MdClearAll } from 'react-icons/md'
import { AiFillCarryOut, AiFillCodeSandboxCircle } from 'react-icons/ai'

import Drawer from '../../components/Drawer/Drawer'
import SkuPopup from './SkuPopup'
import SkuTable from './SkuTable'
import { useLocation, useParams } from 'react-router-dom'
import SkuAddEdit from './SkuAddEdit'
import ActionButton from '../../components/New/ActionButton'
import { AuthContext } from '../../Context/AuthContext'
import { useSearch } from '../../components/New/SearchContext'
import CustomAlert from '../../components/New/CustomAlert'
import createInitialSkuData from './CreateInitialSkuData'
import { useNavigate, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ContentHeader from '../../components/New/ContentHeader'
import { FiDownload, FiUpload } from 'react-icons/fi'
import SkuView from './SkuView'
import CommonPagination from '../../components/New/Pagination'
import CompactPagination from '../../components/New/CompactPagination'
import Loader from '../../components/New/Loader'
import { setSkuPartValue } from '../../action'
import { clientApi } from '../../api/client'
import { skuApi } from '../../api/sku'
//import { saveSkuFormState } from '../../action'

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
  //const [strictAdherence, setStrictAdherence] = useState(false)
  //const [editTag, setEditTag] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [clientDiasble, setClientDisable] = useState(false)
  const [limit, setLimit] = useState(50)
  const [alerts, setAlerts] = useState([])
  const { user } = useContext(AuthContext)
  const { searchQuery, filteredSearchData } = useSearch()
  const location = useLocation()
  const searchBarRef = useRef(null)
  //const [boardSizeError, setBoardSizeError] = useState('')
  const [isSingleViewPopupForType, setisSingleViewPopupForType] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({})
  const [isMinimized, setIsMinimized] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([]) // file URLs
  const [validationErrors, setValidationErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const prevLocationRef = useRef(null)
  const [hasMinimized, setHasMinimized] = useState(false)
  const successMessage = location.state?.successMessage
  useEffect(() => {
    if (successMessage) {
      setAlerts([{ severity: 'success', message: successMessage }])
    }
  }, [successMessage])
  const navigate = useNavigate()

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

  const fetchClient = async () => {
    if (!skuIdVal) return // Run only if skuIdVal exists

    try {
      const data = await skuApi.singlesku(skuIdVal)
      setSelectedSku(data)
    } catch (error) {
      console.error('Error fetching client:', error)
    }
  }

  const fromWorkOrderView = location.state?.fromWorkOrderView
  const skuIdVal = location.state?.skuId

  useEffect(() => {


    if (fromWorkOrderView) {
      setIsMinimized(true)
      fetchClient()
    }
  }, [fromWorkOrderView, skuIdVal])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await skuApi.getSkuType()
        setSkuType(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    // skip sku get call
    if (location.state?.skipInitialFetch && !refresh) {
      return
    }
    try {
      const response = await skuApi.getSkuList({
        search: searchQuery || '',
        client: clientName || '',
        sku_type: selectedSkuType || '',
        page: pagination?.currentPage || 1,
        limit: message ? 10000 : limit,
      })
      const clientResponse = await clientApi.getSkuClients({ limit: 10000 })

      setSkuData(response.data)
      setClient(clientResponse.data)
      setPagination(response.pagination)
      setTotalRecords(response?.pagination?.totalCount)
      setDashboard(response.dashboard)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false) // Always called, even if error occurs or early return
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
    setClientName('')
    setSelectedDisplayName('')
  }

  const handleSkuExelExport = async () => {
    await skuApi.getSkuExcelExport({
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
    navigate('/skuForm')
  }


  const { id } = useParams()
  useEffect(() => {
    if (id) {
      setIsMinimized(true)
    } else {
      setIsMinimized(false) // Reset to false if ID is not '10'
    }
  }, [id])

  useEffect(() => {
    const { fromClientForm, sku_type_for_navigate_from_client } = location.state || {}

    if (fromClientForm) {

      setDrawerOpen(true)
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_type: sku_type_for_navigate_from_client || prev.sku_type,
      }))
      // Optional: clear state from history to prevent retrigger
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.pathname, location.state])


  return (
    <div className="flex">
      <div className={`${isMinimized ? 'w-[24%] h-[515px]' : 'w-full'} pb-6`}>
        {/* Header */}
        <ContentHeader
          heading={'SKU'}
          onAddClick={handleNewSku}
          isMinimized={isMinimized}
          menuOptions={[
            // {
            //   icon: <FiDownload className="mr-2 text-blue-500" />,
            //   label: 'Bulk Upload',
            //   onClick: () => setVisible(true),
            // },
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
          <div className="flex justify-between items-center flex-wrap gap-2 mt-3 pl-3">
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
          <div className="flex items-center justify-between flex-wrap gap-2 my-4 p-2 w-full bg-white border border-gray-200 border-b-transparent">
            {/* <SearchBar text="SKU" data={skudata} ref={searchBarRef} /> */}
            <div className="w-full sm:w-[150px] flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <AiFillCarryOut className="text-blue-600 text-xl" />
                <span className="text-sm font-semibold text-gray-800 pr-1">Total Count: </span>
              </div>
              <div className="h-7 w-7 flex items-center justify-center text-gray-800 font-bold text-sm">
                {pagination?.totalCount ?? 0}
              </div>
            </div>

            <div className="flex justify-between gap-2 w-full sm:w-auto text-xs">
              <select
                value={selectedSkuType || ''}
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
                value={selectedClient || ''}
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
                  <option key={index} value={item.client_id || ''}>
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
        <Loader isLoading={loading} />
        <div className={`${isMinimized ? 'mt-1' : '-my-6'}`}>
          <div className="flex overflow-x-auto overflow-y-auto whitespace-nowrap ">
            <SkuTable
              skudata={filteredSearchData.length > 0 ? filteredSearchData : skudata}
              setSkuData={setSkuData}
              //handleSkuEdit={handleSkuEdit}
              //editTag={editTag}
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
        <div
          className={`flex justify-end items-center gap-4 pl-4 pr-4 ${isMinimized ? 'mt-[20px]' : 'mt-[40px]'}`}
        >
          <p className="w-40 text-sm">
            Total Count :<span className="font-semibold"> {totalRecords}</span>{' '}
          </p>
          <CompactPagination
            totalRecords={totalRecords}
            count={pagination?.totalPages || 1}
            page={pagination?.currentPage || 1}
            onPageChange={(event, value) => {
              setPagination((prev) => ({
                ...prev,
                currentPage: value,
              }))
              setRefresh((prev) => !prev)
            }}
            entriesPerPage={limit}
            onEntriesChange={(newLimit) => {
              setLimit(newLimit)
              // Reset to first page when changing limit
              setPagination((prev) => ({
                ...prev,
                currentPage: 1,
              }))
              setRefresh((prev) => !prev)
            }}
            isMinimized={isMinimized}
          />
        </div>
        <div>
          <SkuPopup visible={visible} setVisible={setVisible} />
        </div>
      </div>
      {isMinimized && (
        <div className="flex w-[75%] transition-all duration-300 ">
          <SkuView selectedSkuData={selectedSku} setIsMinimized={setIsMinimized} />
        </div>
      )}
    </div>
  )
}

export default SkuList
