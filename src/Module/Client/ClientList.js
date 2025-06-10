import { useEffect, useState, useRef } from 'react'
import apiMethods from '../../api/config'
import ClientTable from './ClientTable'
import ClientForm from './ClientForm'
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup'
import vendorImg from '../../assets/images/vendor.png'
import clientImg from '../../assets/images/client.jpg'
import { FaUserCheck, FaUserPlus, FaUsers, FaUserSlash } from 'react-icons/fa'
import Loader from '../../components/New/Loader'
import Drawer1 from '../../components/Drawer/Drawer1'
import TableView from './TableView'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'
import { FiDownload, FiUpload } from 'react-icons/fi'
import { FaUserGroup } from 'react-icons/fa6'
import ActionButton from '../../components/New/ActionButton'
import ContentHeader from '../../components/New/ContentHeader'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'

function ClientList() {
  const [selected, setSelected] = useState('vendor')
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [reloadData, setReloadData] = useState(false)
  const [entityType, setEntityType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(null)
  const [totalPage, setTotalPage] = useState(1)
  const [data, setData] = useState([])
  // const [searchQuery, setSearchQuery] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [selectedFilter, setSelectedFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const clientListRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [status,setStatus]=useState("active")
    const [singleStatusUpdate,setSingleStatusUpdate]=useState(false)

   const { setGlobalPlaceholder, searchQuery  } = useSearch()
  const selectionFrame = {
    vendor: { id: 1, name: 'vendor', image: vendorImg },
    client: { id: 2, name: 'client', image: clientImg },
  }

  useEffect(() => {
    if (clientListRef.current) {
      console.log('ClientList width:', clientListRef.current.offsetWidth, 'px')
    }
  }, [])

    useEffect(() => {
    // Set the placeholder when component mounts
    setGlobalPlaceholder("Search clients....")
    
    // Clean up when component unmounts
    return () => {
      setGlobalPlaceholder("Search...") // Reset to default
    }
  }, [setGlobalPlaceholder])

  useEffect(() => {
    if (location.pathname === '/clients') {
      setIsMinimized(false)
    } else {
      setIsMinimized(true)
    }
  }, [location.pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAddDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true)
      try {
        const queryParams = {
          ...(searchQuery && { search: searchQuery }),
          limit: entriesPerPage,
          page: currentPage,
          entity_type: selectedFilter,
          status:status
        }
        const response = await apiMethods.getClients(queryParams)
        setData(response?.data || [])
        setTotalPage(response.totalPages || 1)
        setTotalRecords(response?.totalRecords || 0)
      } catch (error) {
        console.error('Error fetching client data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchClientData()
    setSingleStatusUpdate(false)
  }, [reloadData, searchQuery, entriesPerPage, currentPage, selectedFilter,status,singleStatusUpdate])

  const handleEntriesChange = (newEntries) => {
    setEntriesPerPage(newEntries)
    setCurrentPage(1)
  }

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage)
  }

  const handleResetFilters = () => {
    // setSearchQuery('')
    setCurrentPage(1)
    setEntriesPerPage(5)
    setSelectedFilter('')
    setReloadData((prev) => !prev)
  }

  const refreshClients = () => {
    setReloadData((prev) => !prev)
  }

  const handleAddEntityClick = () => {
    setShowAddDropdown(!showAddDropdown)
  }

  const handleEntitySelect = (type) => {
    setEntityType(type)
    setShowAddDropdown(false)
    setDrawerOpen(true)
    navigate(`/clients/clientForm`, {
    state: { entityType: type },
  });
  }

  const handleSelection = (selection) => {
    const optionValue = selectionFrame[selection].id
    if (optionValue === 2) {
      setEntityType('Client')
    } else if (optionValue === 1) {
      setEntityType('Vendor')
    }
    setPopupOpen(false)
    setDrawerOpen(true)
  }

  const handleSelectAction = (selection) => {
    setSelected(selection)
    setTriggerSelection(true)
  }

  const handleKeyDown = (event) => {
    if (!isPopupOpen) return
    if (event.key === 'ArrowRight') {
      handleSelectAction('client')
      setEntityType('Client')
    } else if (event.key === 'ArrowLeft') {
      handleSelectAction('vendor')
      setEntityType('Vendor')
    } else if (event.key === 'Enter') {
      setTriggerSelection(true)
    }
  }

  useEffect(() => {
    if (triggerSelection) {
      handleSelection(selected)
      setTriggerSelection(false)
    }
  }, [selected, triggerSelection])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const downloadClientExcelSheet = async () => {
    try {
      const queryParams = {
        ...(searchQuery && { search: searchQuery }),
        entity_type: selectedFilter,
      }
      const response = await apiMethods.downloadClientExcel(queryParams)
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'clients.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading Excel:', error)
    }
  }

  return (
    <div className="flex ">
      <div ref={clientListRef} className={isMinimized ? 'w-[320px] border-r' : 'w-full'}>
        <div className="relative">
          <ContentHeader
            isMinimized={isMinimized}
            heading="Client/Vendor"
            onAddClick={handleAddEntityClick}
            menuOptions={[
              {
                icon: <FiUpload className="mr-2 text-blue-500" />,
                label: 'Import',
                onClick: () => console.log('Import clicked'),
              },
              {
                icon: <FiDownload className="mr-2 text-blue-500" />,
                label: 'Export',
                onClick: downloadClientExcelSheet,
              },
            ]}
            headingOptions={[
              {
                label: 'All Clients',
                icon: <FaUserGroup size={16} />,
                onClick: () =>  setStatus(""),
              },
              {
                label: 'Active Clients',
                icon: <FaUserCheck size={16} />,
                onClick: () => setStatus("active"),
              },
              {
                label: 'Inactive Clients',
                icon: <FaUserSlash size={16} />,
                 onClick: () => setStatus("inactive"),
              },
            ]}
          />

          {showAddDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-4 mt-1 w-32 bg-white rounded-md shadow-lg z-50 border border-gray-200"
            >
              <ul className="py-1 m-1">
                <li
                  className="flex gap-3 items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded-md cursor-pointer"
                  onClick={() => handleEntitySelect('Client')}
                >
                  <FaUserPlus />
                  Client
                </li>
                <li
                  className="flex gap-3 items-center px-2 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded-md cursor-pointer"
                  onClick={() => handleEntitySelect('Vendor')}
                >
                  <FaUsers />
                  Vendor
                </li>
              </ul>
            </div>
          )}
        </div>

        <Loader isLoading={loading} />

        <div className="mt-3 overflow-x-auto">
          <ClientTable
          setSingleStatusUpdate={setSingleStatusUpdate}
            isMinimized={isMinimized}
            refreshClients={refreshClients}
            clientdata={data}
          />
        </div>
        <div
          className={`${isMinimized ? 'flex-col ' : 'flex justify-between '} items-center gap-4 m-2 px-2`}
        >
          <div className=" flex w-32 items-center gap-1 font-normal text-sm">
            <span>Total Count:</span>
            <span className="font-medium">{totalRecords}</span>
          </div>

          <CompactPagination
            totalRecords={totalRecords}
            count={totalPage}
            page={currentPage}
            onPageChange={handlePageChange}
            entriesPerPage={entriesPerPage}
            onEntriesChange={handleEntriesChange}
            isMinimized={isMinimized}
          />
        </div>
        {/*{!isDrawerOpen && (
          <CustomPopup
            isOpen={isPopupOpen}
            onClose={() => setPopupOpen(false)}
            width="w-[500px]"
            height="230px"
          >
            <div className="flex justify-center items-center space-x-12 p-6">
              {Object.keys(selectionFrame).map((key) => (
                <div
                  key={key}
                  className={`w-1/3 flex flex-col items-center border-4 p-2 cursor-pointer ${
                    selected === key ? 'border-blue-200' : 'border-gray-100'
                  }`}
                  onClick={() => handleSelectAction(key)}
                  tabIndex={0}
                  role="button"
                >
                  <img
                    src={selectionFrame[key].image}
                    alt={selectionFrame[key].name}
                    className="w-16 h-16 rounded-full"
                  />
                  <p className="mt-2 text-sm font-semibold">{selectionFrame[key].name}</p>
                </div>
              ))}
            </div>
          </CustomPopup>
        )}*/}

        {/*<Drawer1
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          maxWidth="1280px"
          title={`New ${entityType}`}
        >
          <ClientForm
            entity_type={entityType}
            refreshClients={refreshClients}
            closeDrawerDuringAdd={() => setDrawerOpen(false)}
            resetForm={isDrawerOpen}
            setReloadData={setReloadData}
          />
        </Drawer1>*/}
      </div>

      <div className="flex-1 transition-all duration-300">
        <Outlet />
      </div>
    </div>
  )
}

export default ClientList
