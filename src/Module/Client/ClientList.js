import { useEffect, useState, useCallback, useRef } from 'react'
import apiMethods from '../../api/config'
import ClientTable from './ClientTable'
import ClientForm from './ClientForm'
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup'
import vendorImg from '../../assets/images/vendor.png'
import clientImg from '../../assets/images/client.jpg'
import { FaAccessibleIcon, FaFilter, FaUserCheck, FaUserSlash } from 'react-icons/fa'
import Loader from '../../components/New/Loader'
import Drawer1 from '../../components/Drawer/Drawer1'
import TableView from './TableView'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'
import ContentHeader from '../../components/header/ContentHeader'
import { FiDownload, FiUpload } from 'react-icons/fi'
import { FolderIcon } from '@heroicons/react/solid'
import { FaUserGroup } from 'react-icons/fa6'

function ClientList() {
  const [selected, setSelected] = useState('vendor')
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [reloadData, setReloadData] = useState(false)
  const [entityType, setEntityType] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState(5)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const clientListRef = useRef(null)
const [isMinimized, setIsMinimized] = useState(false);
// Add this in your component
const [selectedRowData, setSelectedRowData] = useState(null);


  useEffect(() => {
    if (clientListRef.current) {
      console.log('ClientList width:', clientListRef.current.offsetWidth, 'px')
    }
  }, [])

  const handleEntriesChange = (newEntries) => {
    setEntriesPerPage(newEntries)
    setCurrentPage(1)
  }

  const handlePageChange = (event, newPage) => {
    console.log('Page changed to:', newPage)
    setCurrentPage(newPage)
  }
  const handleCloseDrawer = () => {
    setDrawerOpen(false)
  }

  const selectionFrame = {
    vendor: {
      id: 1,
      name: 'vendor',
      image: vendorImg,
    },
    client: {
      id: 2,
      name: 'client',
      image: clientImg,
    },
  }

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const queryParams = {
          ...(searchQuery && { search: searchQuery }),
          limit: entriesPerPage,
          page: currentPage,
          entity_type: selectedFilter,
        }

        const response = await apiMethods.getClients(queryParams)
        setData(response?.data || [])
        setTotalPage(response.totalPages)
      } catch (error) {
        console.error('Error fetching client data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientData()
  }, [reloadData, searchQuery, entriesPerPage, currentPage, selectedFilter])

  const handleResetFilters = () => {
    setSearchQuery('')
    setCurrentPage(1)
    setEntriesPerPage(5)
    setSelectedFilter('')
    setReloadData((prev) => !prev)
  }

  const refreshClients = () => {
    setReloadData((prev) => !prev)
  }

  const handleSelection = (selection) => {
    const optionValue = selectionFrame[selection].id
    if (optionValue === 2) {
      setEntityType('Client')
      setPopupOpen(false)
      setDrawerOpen(true)
    } else if (optionValue === 1) {
      setEntityType('Vendor')
      setPopupOpen(false)
      setDrawerOpen(true)
    } else {
      console.log('option not selected')
    }
  }

  const handleSelectAction = (selection) => {
    setSelected(selection)
    setTriggerSelection(true)
  }

  // Handles key events

  let entity_type = ''
  const handleKeyDown = (event) => {
    if (!isPopupOpen) {
      return
    }

    if (event.key === 'ArrowRight') {
      handleSelectAction('client')
      setEntityType('Client')
    } else if (event.key === 'ArrowLeft') {
      handleSelectAction('vendor')
      setEntityType('Vendor')
    } else if (event.key === 'Enter') {
      console.log('Enter Pressed: Executing Selection')
      setTriggerSelection(true)
    }
  }

  // Ensures `handleSelection` runs AFTER `selected` updates
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

      // Create a Blob from the response
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link element
      const a = document.createElement('a')
      a.href = url
      a.download = 'clients.xlsx'
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading Excel:', error)
    }
  }

  console.log("main pagfe data",selectedRowData)
  return (
    <div className="flex w-full">
    <div ref={clientListRef} className={isMinimized ? "w-[320px]" : "w-full"} transition-all duration-300>
      <ContentHeader
        heading="Client/Vendor"
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
        onAddClick={() => setPopupOpen(true)}
        headingOptions={[
          {
            label: 'All Clients',
            icon: <FaUserGroup size={16} />,
            onClick: () => console.log('All Clients selected'),
          },
          {
            label: 'Active Clients',
            icon: <FaUserCheck size={16} />,
            onClick: () => console.log('Active Clients selected'),
          },
          {
            label: 'Inactive Clients',
            icon: <FaUserSlash size={16} />,
            onClick: () => console.log('Inactive Clients selected'),
          },
        ]}
      />
      <Loader isLoading={loading} />

      {/* Search Bar & Actions */}
      {/* <div className="overflow-x-auto border border-gray-200 p-3 rounded-md h-[550px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2"> */}
      {/* Search Input Container */}

      {/* <div className="flex items-center h-[35px] w-[300px] gap-2 border rounded-md">
              <div className="bg-white h-full w-[40px] flex justify-center items-center rounded-l-md">
                <IoSearch />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="outline-none h-full w-full rounded-r-md pl-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div> */}

      {/* Filter Icon */}
      {/* Dropdown */}
      {/* <div className="flex items-center gap-3">
              <div className="relative inline-block text-left">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="inline-flex w-40 justify-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 shadow-xs hover:bg-gray-50 appearance-none"
                >
                  <option value="" disabled hidden>
                    Entity
                  </option>
                  <option value="Client">Client</option>
                  <option value="Vendor">Vendor</option>
                  <option value="">All</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <FaChevronDown className="size-4 text-gray-400" />
                </div>
              </div>
              <button
                onClick={handleResetFilters}
                className="bg-gray-500 text-white text-sm px-3 py-[6px] rounded-md hover:bg-gray-600 transition-all"
              >
                Clear
              </button>
            </div>
          </div>*/}

   <div className="w-full flex justify-end items-center gap-2">
  {/* <ActionButton height={'9'} label={'Export'} onClick={downloadClientExcelSheet} /> */}
 <ActionButton
  height={'9'}
  width={isMinimized ? '9' : '30'} // shrink width when minimized
  label={isMinimized ? '+' : '+ New'} // shrink label when minimized
  onClick={() => setPopupOpen(true)}
  variant="add"
/>

  <button
    className="h-9 w-9 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100"
    onClick={() => console.log('More options clicked')}
  >
    <CIcon icon={cilOptions} className="text-gray-700 w-4 h-4" />
  </button>
</div>

        </div>

        {/* Table Section */}
        <div className="mt-3 overflow-x-auto">
          <ClientTable setSelectedRowData={setSelectedRowData} isMinimized={isMinimized} setIsMinimized={setIsMinimized} refreshClients={refreshClients} clientdata={data}/>
        </div>

      {/* <div className="flex justify-end items-center gap-4 mt-3">
          <DynamicPagination
            count={totalPage}
            page={currentPage}
            onPageChange={handlePageChange}
            entriesPerPage={entriesPerPage}
            onEntriesChange={handleEntriesChange}
          />
        </div> */}
      {/* </div> */}

      {/* Drawer */}

      {!isDrawerOpen && (
        <CustomPopup
          isOpen={isPopupOpen}
          onClose={() => setPopupOpen(false)}
          width={'w-[500px]'}
          height={'230px'}
        >
          <div className="flex justify-center items-center space-x-12 p-6">
            {Object.keys(selectionFrame).map((key) => (
              <div
                key={key}
                className={`w-1/3 flex flex-col items-center border-4 p-2 cursor-pointer focus:outline-none ${
                  selected === key ? 'border-blue-200' : 'border-gray-100'
                }`}
                onClick={() => handleSelectAction(key)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSelectAction(key)
                }}
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
      )}

      <Drawer1
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        maxWidth={'1280px'}
        title={`New ${entityType}`}
      >
        {/* Pass handleCloseDrawer as a prop to ClientForm */}
        <ClientForm
          entity_type={entityType}
          refreshClients={refreshClients}
          closeDrawerDuringAdd={() => handleCloseDrawer(false)}
          resetForm={isDrawerOpen}
          setReloadData={setReloadData}
        />
      </Drawer1>
    </div>
  {isMinimized && (
    <div className="flex-1 transition-all duration-300">
      <TableView selectedRowData={selectedRowData} onClose={() => setIsMinimized(false)}/>
    </div>
  )}
    </div>
  )
}

export default ClientList
