// Updated InventoryMain component with complete stock filtering

import { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import InventoryTable from './InventoryTable'
import { BiDollarCircle } from 'react-icons/bi'
import { FaShieldAlt, FaStar, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { CgWorkAlt } from 'react-icons/cg'
import { MdCategory, MdPushPin, MdRecycling } from 'react-icons/md'
import { cilArrowTop, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ContentHeader from '../../components/New/ContentHeader'
import { useNavigate } from 'react-router-dom'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'
import { FiDownload } from 'react-icons/fi'

const InventoryMain = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [filteredInventoryData, setFilteredInventoryData] = useState([]) // Add filtered data state
  const [subCategory, setSubCategory] = useState([])
  const [category, setCategory] = useState([])
  const [categoryId, setCategoryId] = useState(null)
  const [subCategoryId, setSubCategoryId] = useState(null)
  const icons = [FaShieldAlt, FaStar, FaUsers, MdRecycling, FaChevronUp]
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [openCategoryId, setOpenCategoryId] = useState(null)
  const [subCategories, setSubCategories] = useState([])
  const [subCategoryQuantities, setSubCategoryQuantities] = useState([])
  const { setGlobalPlaceholder, searchQuery } = useSearch()
  const [stockFilter, setStockFilter] = useState(null)
  const [isStockDropdownOpen, setIsStockDropdownOpen] = useState(false);

  const navigate = useNavigate()
  const backgroundColors = [
    'bg-[#22c35c]',
    'bg-[#6366f1]',
    'bg-[#6b7380]',
    'bg-[#a755f7]',
    'bg-red-100',
    'bg-gray-100',
  ]

  // Function to determine stock status
  const getStockStatus = (item) => {
    const quantity = item.total_quantity || 0
    const minStock = item.item?.min_stock_level || 0

    if (quantity === 0) return 'out_of_stock'
    if (quantity < minStock) return 'low_stock'
    return 'in_stock'
  }

  // Function to apply stock filtering
  const applyStockFilter = (data, filter) => {
    if (!filter) return data

    return data.filter((item) => {
      const status = getStockStatus(item)
      return status === filter
    })
  }

  // Update filtered data when inventory data or stock filter changes
  useEffect(() => {
    const filtered = applyStockFilter(inventoryData, stockFilter)
    setFilteredInventoryData(filtered)
  }, [inventoryData, stockFilter])

  const totalInventoryValue = inventoryData?.reduce((acc, item) => {
    const quantity = item.total_quantity || 0
    const cost = item.item?.standard_cost || 0
    return acc + quantity * cost
  }, 0)

  const backgroundColorsBox = ['#18a24d', '#5046e4', '#4c5564', '#9334ea']

  useEffect(() => {
    setGlobalPlaceholder('Search Inventory')

    const fetchInventory = async () => {
      try {
        const response = await apiMethods.getinventoryWithParams(
          categoryId,
          currentPage,
          entriesPerPage,
          searchQuery,
          subCategoryId,
        )

        if (response?.data?.success) {
          setInventoryData(response.data.data.inventoryData)
          setSubCategoryQuantities(response.data.data.subCategoryQuantities)
          const pagination = response.data.pagination
          setCurrentPage(pagination.currentPage)
          setTotalPage(pagination.totalPages)
          setTotalRecords(pagination.totalCount)
          setEntriesPerPage(pagination.perPage)
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error)
      }
    }

    fetchInventory()
  }, [categoryId, subCategoryId, currentPage, entriesPerPage, searchQuery])

  const handlePageChange = (_, newPage) => {
    setCurrentPage(newPage)
  }

  const handleEntriesChange = (newEntriesPerPage) => {
    setEntriesPerPage(newEntriesPerPage)
    setCurrentPage(1)
  }

  const handleStockFilterChange = (filterType) => {
    if (stockFilter === filterType) {
      // If clicking the same filter, clear it
      setStockFilter(null)
    } else {
      setStockFilter(filterType)
    }
  }

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const [categoryRes, subCategoryRes] = await Promise.all([
          apiMethods.getCategoryList(),
          apiMethods.getSubCategory(),
        ])

        setCategory(categoryRes.data.data)
        setSubCategory(subCategoryRes.data.data)
      } catch (error) {
        console.error('Error fetching category data:', error)
      }
    }

    fetchCategoryData()
  }, [])

  const handleSubCategoryClick = async (e, categoryId) => {
    e.stopPropagation()
    try {
      if (openCategoryId === categoryId) {
        setOpenCategoryId(null)
        setSubCategories([])
      } else {
        const res = await apiMethods.subCategoryDropdown(categoryId)
        setSubCategories(res.data.data)
        setOpenCategoryId(categoryId)
      }
    } catch (error) {
      console.error('Failed to fetch subcategories:', error)
    }
  }

  const handleSubCategorySelect = (subCategoryId) => {
    setSubCategoryId(subCategoryId)
    setOpenCategoryId(null)
  }

  const clearAllFilters = () => {
    setCategoryId(null)
    setSubCategoryId(null)
    setOpenCategoryId(null)
    setStockFilter(null)
  }

  return (
    <>
      <ContentHeader
        addLabel="New Product"
        heading="Inventory"
        onAddClick={() =>
          navigate('/inventoryhandling/inventory_form', {
            state: { fromInventory: true },
          })
        }
        menuOptions={[
          {
            icon: <FiDownload className="mr-2 text-blue-500" />,
            label: 'Export',
            // onClick: downloadClientExcelSheet,
          },
        ]}
      />

      {/*dashboard panel*/}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full mt-2">
        {category.map((item, index) => {
          const IconComponent = icons[index % icons.length]
          const hasSubCategories = item.id === 1 || item.id === 4
          const isOpen = openCategoryId === item.id

          return (
            <div key={item.id} className="relative">
              <div
                onClick={() => setCategoryId(item.id)}
                className={`p-2 py-3 rounded-md shadow-md text-center capitalize flex items-center justify-between w-full cursor-pointer ${
                  backgroundColors[index % backgroundColors.length]
                }`}
              >
                <div
                  onClick={(e) => handleSubCategoryClick(e, item.id)}
                  className="flex items-center pl-2"
                >
                  <IconComponent className="text-white mr-2" />
                  <span className="font-bold text-white">
                    {item.category_name.replace(/-/g, ' ')}
                  </span>
                </div>
                <span
                  className={`size-8 rounded flex items-center justify-center mr-2 border border-white shadow-lg ${
                    ['bg-green-700', 'bg-indigo-700', 'bg-slate-700', 'bg-purple-700'][index % 4]
                  }`}
                >
                  {hasSubCategories ? (
                    isOpen ? (
                      <FaChevronUp
                        className="text-sm text-white cursor-pointer"
                        onClick={(e) => handleSubCategoryClick(e, item.id)}
                      />
                    ) : (
                      <FaChevronDown
                        className="text-sm text-white cursor-pointer"
                        onClick={(e) => handleSubCategoryClick(e, item.id)}
                      />
                    )
                  ) : (
                    <span className="text-sm text-white">0</span>
                  )}
                </span>
              </div>

              {/* Subcategory Dropdown */}
              {isOpen && subCategories.length > 0 && (
                <div className="absolute top-16 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {subCategories.map((subCat) => {
                    const getSubCategoryIcon = (name) => {
                      const lowerName = name.toLowerCase()
                      if (lowerName.includes('dye')) return BiDollarCircle
                      if (lowerName.includes('stereo')) return FaStar
                      if (lowerName.includes('other')) return MdCategory
                      return CgWorkAlt
                    }

                    const getSubCategoryColor = (name) => {
                      const lowerName = name.toLowerCase()
                      if (lowerName.includes('dye')) return '#10b981'
                      if (lowerName.includes('stereo')) return '#f59e0b'
                      if (lowerName.includes('other')) return '#ef4444'
                      return '#6b7280'
                    }

                    const SubIcon = getSubCategoryIcon(subCat.sub_category_name)
                    const iconColor = getSubCategoryColor(subCat.sub_category_name)

                    const getQuantityForSubCategory = (subCategoryId) => {
                      const found = subCategoryQuantities.find(
                        (item) => item.sub_category === subCategoryId,
                      )
                      return found?.total_quantity ? parseInt(found.total_quantity) : '0'
                    }

                    return (
                      <div
                        key={subCat.id}
                        onClick={() => handleSubCategorySelect(subCat.id)}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 z-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: iconColor }}
                          >
                            <SubIcon className="text-white text-xs" />
                          </div>
                          <span className="text-gray-700 text-sm capitalize">
                            {subCat.sub_category_name.replace(/-/g, ' ')}
                          </span>
                        </div>

                        <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                          {getQuantityForSubCategory(subCat.id)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Total Stock Value Card */}
        <div className="bg-blue-600 rounded-md m-0 shadow-md text-center font-bold capitalize w-full text-white">
          <p className="m-0">Total Stock Value</p>
          <p className="m-0">₹{totalInventoryValue}</p>
        </div>
      </div>

      {/* Stock Filter Buttons */}
     <div className="flex justify-end w-full mt-3 gap-2">
  <div className="relative z-50">
    <button
      className="py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center"
      onClick={() => setIsStockDropdownOpen(!isStockDropdownOpen)}
    >
      {stockFilter === 'in_stock' && 'In Stock'}
      {stockFilter === 'low_stock' && 'Low Stock'}
      {stockFilter === 'out_of_stock' && 'Out of Stock'}
      {!stockFilter && 'Stock Status'}
      {stockFilter && (
        <span className={`ml-2 bg-${
          stockFilter === 'in_stock' ? 'green' : 
          stockFilter === 'low_stock' ? 'yellow' : 'red'
        }-600 text-white text-xs px-2 py-1 rounded-full`}>
          {filteredInventoryData.length}
        </span>
      )}
      <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    {isStockDropdownOpen && (
      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
        <button
          onClick={() => {
            handleStockFilterChange('in_stock');
            setIsStockDropdownOpen(false);
          }}
          className={`block w-full text-left px-4 py-2 hover:bg-green-50 ${
            stockFilter === 'in_stock' ? 'bg-green-100 text-green-700' : 'text-gray-700'
          }`}
        >
          In Stock
        </button>
        <button
          onClick={() => {
            handleStockFilterChange('low_stock');
            setIsStockDropdownOpen(false);
          }}
          className={`block w-full text-left px-4 py-2 hover:bg-yellow-50 ${
            stockFilter === 'low_stock' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-700'
          }`}
        >
          Low Stock
        </button>
        <button
          onClick={() => {
            handleStockFilterChange('out_of_stock');
            setIsStockDropdownOpen(false);
          }}
          className={`block w-full text-left px-4 py-2 hover:bg-red-50 ${
            stockFilter === 'out_of_stock' ? 'bg-red-100 text-red-700' : 'text-gray-700'
          }`}
        >
          Out of Stock
        </button>
      </div>
    )}
  </div>

  <button
    onClick={clearAllFilters}
    className="py-2 px-4 rounded-lg text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
  >
    Clear All
  </button>
</div>

      {/* Pass filtered data to table */}
      <InventoryTable inventoryData={filteredInventoryData} />

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50 px-4 py-2">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-medium text-gray-700 ml-[200px]">
            Total Records: {stockFilter ? filteredInventoryData.length : totalRecords}
            {stockFilter && (
              <span className="ml-2 text-blue-600">
                (Filtered by {stockFilter.replace('_', ' ')})
              </span>
            )}
          </p>
          <div className="mr-3">
            <CompactPagination
              totalRecords={stockFilter ? filteredInventoryData.length : totalRecords}
              count={totalPage}
              page={currentPage}
              onPageChange={handlePageChange}
              entriesPerPage={entriesPerPage}
              onEntriesChange={handleEntriesChange}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default InventoryMain
