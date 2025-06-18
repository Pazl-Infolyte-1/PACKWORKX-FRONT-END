// Updated InventoryMain component with fixed Total Stock Value calculation

import { useEffect, useState, useRef } from 'react'
import InventoryTable from './InventoryTable'
import { BiDollarCircle, BiRupee } from 'react-icons/bi'
import { FaShieldAlt, FaStar, FaUsers, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa'
import { CgWorkAlt } from 'react-icons/cg'
import { MdCategory, MdOutlineStickyNote2, MdPushPin, MdRecycling } from 'react-icons/md'
import { cilArrowTop, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ContentHeader from '../../components/New/ContentHeader'
import { useNavigate } from 'react-router-dom'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'
import { FiDownload } from 'react-icons/fi'
import { commonApi } from '../../api/common'
import { inventoryApi } from '../../api/inventory'
import { itemApi } from '../../api/item'
import InventoryView from './InventoryView'
import ViewInventory from './ViewInventory'

const InventoryMain = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [filteredInventoryData, setFilteredInventoryData] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [category, setCategory] = useState([])
  const [categoryId, setCategoryId] = useState(null)
  const [subCategoryId, setSubCategoryId] = useState(1)
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
  const [isStockDropdownOpen, setIsStockDropdownOpen] = useState(false)
const [isMinimised,setIsMinimised] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Refs for click outside detection
  const stockDropdownRef = useRef(null)
  const subCategoryDropdownRefs = useRef({})

  const navigate = useNavigate()
  const backgroundColors = [
    'bg-[#22c35c]',
    'bg-[#6366f1]',
    'bg-[#6b7380]',
    'bg-[#a755f7]',
    'bg-red-100',
    'bg-gray-100',
  ]

  // Click outside effect for all dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close stock dropdown if click is outside
      if (stockDropdownRef.current && !stockDropdownRef.current.contains(event.target)) {
        setIsStockDropdownOpen(false)
      }

      // Close subcategory dropdown if click is outside
      if (openCategoryId) {
        const currentDropdownRef = subCategoryDropdownRefs.current[openCategoryId]
        if (currentDropdownRef && !currentDropdownRef.contains(event.target)) {
          setOpenCategoryId(null)
          setSubCategories([])
        }
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openCategoryId])

  // Function to determine stock status
  const getStockStatus = (item) => {
    const quantity = parseFloat(item.total_quantity) || 0
    const minStock = parseFloat(item.item.min_stock_level) || 0

    if (quantity == 0) return 'out_of_stock'
    if (quantity > 0 && quantity < minStock) return 'low_stock'
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

  const backgroundColorsBox = ['#18a24d', '#5046e4', '#4c5564', '#9334ea']

  // Helper functions to get selected category and subcategory names
  const getSelectedCategoryName = () => {
    if (!categoryId) return null
    const selectedCategory = category.find((cat) => cat.id === categoryId)
    return selectedCategory ? selectedCategory.category_name.replace(/-/g, ' ') : null
  }

  const getSelectedSubCategoryName = () => {
    if (!subCategoryId) return null
    const selectedSubCategory = subCategory.find((subCat) => subCat.id === subCategoryId)
    return selectedSubCategory ? selectedSubCategory.sub_category_name.replace(/-/g, ' ') : null
  }

  // Fixed function to get total stock value for selected subcategory
  const getTotalStockValue = () => {
    if (!subCategoryId || !subCategoryQuantities.length) return '0.00'

    // Find the subcategory data that matches the selected subCategoryId
    const selectedSubCategoryData = subCategoryQuantities.find(
      (item) => item.sub_category === subCategoryId,
    )

    if (selectedSubCategoryData && selectedSubCategoryData.sub_category_info) {
      const totalAmount = parseFloat(selectedSubCategoryData.sub_category_info.total_amount) || 0
      return parseFloat(totalAmount) || '0'
    }

    return '0.00'
  }

  // // Function to get total quantity for selected subcategory
  // const getTotalQuantity = () => {
  //   if (!subCategoryId || !subCategoryQuantities.length) return '0'

  //   const selectedSubCategoryData = subCategoryQuantities.find(
  //     (item) => item.sub_category === subCategoryId
  //   )

  //   if (selectedSubCategoryData && selectedSubCategoryData.sub_category_info) {
  //     const totalQuantity = parseFloat(selectedSubCategoryData.sub_category_info.total_quantity) || 0
  //     return totalQuantity.toString()
  //   }

  //   return '0'
  // }

  useEffect(() => {
    setGlobalPlaceholder('Search Inventory')

    // In the fetchInventory function, modify the API call parameters:
    const fetchInventory = async () => {
      try {
        const response = await inventoryApi.getinventoryWithParams(
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
          itemApi.getCategoryList(),
          itemApi.getSubCategory(),
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
    // clearAllFilters()

    // Only proceed for categories that have subcategories
    if (categoryId !== 1 && categoryId !== 4) {
      setOpenCategoryId(null)
      setSubCategories([])
      return
    }

    try {
      if (openCategoryId === categoryId) {
        setOpenCategoryId(null)
        setSubCategories([])
      } else {
        const res = await commonApi.subCategoryDropdown(categoryId)
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
    setSubCategoryId(1)
    setOpenCategoryId(null)
    setStockFilter(null)
  }

  const clearCategoryFilter = () => {
    setCategoryId(null)
    setSubCategoryId(1)
  }

  const clearSubCategoryFilter = () => {
    setSubCategoryId(1)
  }

  const clearStockFilter = () => {
    setStockFilter(null)
  }

  const handleInventoryExelExport = async () => {
    const params = {
      categoryId,
      currentPage,
      entriesPerPage,
      searchQuery,
      subCategoryId,
    }
    await inventoryApi.getInventoryExcelExport(params)
  }

  const handleSummary = async () => {
    try {
      const response = await inventoryApi.getInventorySummary()
      const data = response.data.data.inventoryData
      const selectedSubcategory = data.filter((item) => item.item.sub_category === subCategoryId)
      setInventoryData(selectedSubcategory)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
          <div className={isMinimised ? 'w-[387px] border-r' : 'w-full'}>

      <ContentHeader
                  isMinimized={isMinimised}
        addLabel="New Product"
        heading="Inventory"
        isNewButton={true}
        newButtonLabel="Summary"
        addNewButtonClick={handleSummary}
        onAddClick={() =>
          navigate('/inventoryhandling/inventory_form', {
            state: { fromInventory: true },
          })
        }
        menuOptions={[
          {
            icon: <FiDownload className="mr-2 text-blue-500" />,
            label: 'Export',
            onClick: handleInventoryExelExport,
          },
        ]}
      />
      </div>

      {/*dashboard panel*/}
    {!isMinimised && (    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full mt-2">
        {category.map((item, index) => {
          const IconComponent = icons[index % icons.length]
          const hasSubCategories = item.id === 1 || item.id === 4
          const isOpen = openCategoryId === item.id
          const isSelected = categoryId === item.id

          return (
            <div
              key={item.id}
              className="relative"
              ref={(el) => {  
                if (el) {
                  subCategoryDropdownRefs.current[item.id] = el
                }
              }}
            >
              <div
                onClick={() => setCategoryId(item.id)}
                className={`p-2 py-3 rounded-md shadow-md text-center capitalize flex items-center justify-between w-full cursor-pointer ${
                  backgroundColors[index % backgroundColors.length]
                } ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-75' : ''}`}
              >
                <div
                  // onClick={(e) => handleSubCategoryClick(e, item.id)}
                  className="flex items-center pl-2"
                >
                  <IconComponent className="text-white mr-2" />
                  <span className="font-bold text-white">
                    {item.category_name.replace(/-/g, ' ')}
                  </span>
                </div>
                <span
                  onClick={(e) => handleSubCategoryClick(e, item.id)}
                  className={`size-8 rounded flex items-center justify-center mr-2 border border-white shadow-lg ${
                    ['bg-green-700', 'bg-indigo-700', 'bg-slate-700', 'bg-purple-700'][index % 4]
                  }`}
                >
                  {hasSubCategories ? (
                    isOpen ? (
                      <FaChevronUp className="text-sm text-white cursor-pointer" />
                    ) : (
                      <FaChevronDown className="text-sm text-white cursor-pointer" />
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
                      if (lowerName.includes('reel')) return MdRecycling
                      if (lowerName.includes('corrugation') || lowerName.includes('glue'))
                        return BiDollarCircle
                      if (lowerName.includes('pasting')) return CgWorkAlt
                      if (lowerName.includes('stitching')) return MdOutlineStickyNote2
                      if (lowerName.includes('pin')) return MdPushPin
                      if (lowerName.includes('dye')) return MdCategory
                      if (lowerName.includes('stereo')) return FaStar
                      return CgWorkAlt // default icon
                    }
                    const getSubCategoryColor = (name) => {
                      const lowerName = name.toLowerCase()
                      if (lowerName.includes('reel')) return '#10b981' // green
                      if (lowerName.includes('corrugation') || lowerName.includes('glue'))
                        return '#3b82f6' // blue
                      if (lowerName.includes('stitching')) return '#f97316' // orange
                      if (lowerName.includes('pasting')) return '#f59e0b' // amber
                      if (lowerName.includes('pin')) return '#8b5cf6' // purple
                      if (lowerName.includes('dye')) return '#ef4444' // red
                      if (lowerName.includes('stereo')) return '#06b6d4' // cyan
                      return '#6b7280' // default gray
                    }

                    const SubIcon = getSubCategoryIcon(subCat.sub_category_name)
                    const iconColor = getSubCategoryColor(subCat.sub_category_name)
                    const isSubSelected = subCategoryId === subCat.id

                    const getQuantityForSubCategory = (subCategoryId) => {
                      const found = subCategoryQuantities.find(
                        (item) => item.sub_category === subCategoryId,
                      )
                      console.log(found)

                      return found?.sub_category_info.total_quantity
                        ? parseInt(found.sub_category_info.total_quantity)
                        : '0'
                    }

                    return (
                      <div
                        key={subCat.id}
                        onClick={() => handleSubCategorySelect(subCat.id)}
                        className={`flex items-center justify-between px-3 py-2 hover:bg-gray-50 z-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          isSubSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: iconColor }}
                          >
                            <SubIcon className="text-white text-xs" />
                          </div>
                          <span
                            className={`text-sm capitalize ${
                              isSubSelected ? 'text-blue-700 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {subCat.sub_category_name.replace(/-/g, ' ')}
                          </span>
                        </div>

                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            isSubSelected
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
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

        {/* Total Stock Value Card - Fixed Implementation */}

        <div className="p-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md shadow-md text-center text-white">
          <div className="flex flex-col items-center justify-center">
            <div className="flex">
              <BiRupee className="text-xl opacity-80" />
              <p className="text-xs font-medium opacity-90 m-0">Total Stock Value</p>
            </div>
            <p className="text-lg font-bold m-0">₹{getTotalStockValue()}</p>
          </div>
        </div>
      </div>
    )}

      {/* Stock Filter Buttons */}
   {!isMinimised && (   <div className="flex w-full mt-2 gap-2">
        {/* Selected Filters Display */}
        {(categoryId || subCategoryId || stockFilter) && (
          <div className="flex flex-wrap gap-2 mt-1 mb-2 flex-1">
            <span className="text-sm text-gray-600 font-medium mr-2">Active Filters:</span>

            {/* Category Filter Badge */}
            {categoryId && (
              <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span className="mr-2">Category: {getSelectedCategoryName()}</span>
                <FaTimes
                  className="cursor-pointer hover:text-blue-600"
                  size={12}
                  onClick={clearCategoryFilter}
                />
              </div>
            )}

            {/* Subcategory Filter Badge */}
            {subCategoryId && (
              <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <span className="mr-2">Subcategory: {getSelectedSubCategoryName()}</span>
                {subCategoryId !== 1 && (
                  <FaTimes
                    className="cursor-pointer hover:text-green-600"
                    size={12}
                    onClick={clearSubCategoryFilter}
                  />
                )}
              </div>
            )}

            {/* Stock Filter Badge */}
            {stockFilter && (
              <div
                className={`flex items-center px-3 py-1 rounded-full text-sm ${
                  stockFilter === 'in_stock'
                    ? 'bg-green-100 text-green-800'
                    : stockFilter === 'low_stock'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                <span className="mr-2">
                  {stockFilter === 'in_stock'
                    ? 'In Stock'
                    : stockFilter === 'low_stock'
                      ? 'Low Stock'
                      : 'Out of Stock'}
                  ({filteredInventoryData.length})
                </span>
                <FaTimes
                  className={`cursor-pointer ${
                    stockFilter === 'in_stock'
                      ? 'hover:text-green-600'
                      : stockFilter === 'low_stock'
                        ? 'hover:text-yellow-600'
                        : 'hover:text-red-600'
                  }`}
                  size={12}
                  onClick={clearStockFilter}
                />
              </div>
            )}
          </div>
        )}

        <div className="relative z-50 flex gap-3 ml-auto" ref={stockDropdownRef}>
          {/* Stock Filter Dropdown */}
          <button
            className={` px-4 rounded-lg border transition-all duration-200 flex items-center ${
              stockFilter
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setIsStockDropdownOpen(!isStockDropdownOpen)}
          >
            {stockFilter === 'in_stock' && 'In Stock'}
            {stockFilter === 'low_stock' && 'Low Stock'}
            {stockFilter === 'out_of_stock' && 'Out of Stock'}
            {!stockFilter && 'Stock Status'}
            {stockFilter && (
              <span
                className={`ml-2 text-white text-xs px-2 py-1 rounded-full ${
                  stockFilter === 'in_stock'
                    ? 'bg-green-600'
                    : stockFilter === 'low_stock'
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                }`}
              >
                {filteredInventoryData.length}
              </span>
            )}
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isStockDropdownOpen && (
            <div className="absolute right-21 top-9 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
              <button
                onClick={() => {
                  handleStockFilterChange('in_stock')
                  setIsStockDropdownOpen(false)
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-green-50 ${
                  stockFilter === 'in_stock' ? 'bg-green-100 text-green-700' : 'text-gray-700'
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => {
                  handleStockFilterChange('low_stock')
                  setIsStockDropdownOpen(false)
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-yellow-50 ${
                  stockFilter === 'low_stock' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-700'
                }`}
              >
                Low Stock
              </button>
              <button
                onClick={() => {
                  handleStockFilterChange('out_of_stock')
                  setIsStockDropdownOpen(false)
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-red-50 ${
                  stockFilter === 'out_of_stock' ? 'bg-red-100 text-red-700' : 'text-gray-700'
                }`}
              >
                Out of Stock
              </button>
            </div>
          )}

          <button
            onClick={clearAllFilters}
            className="py-2 px-4 rounded-lg text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
          >
            Clear All
          </button>
        </div>
      </div>)}

      {/* Pass filtered data to table */}
  <div className={`${isMinimised ? 'grid grid-cols-10 gap-2' : ''}`}>
  {/* Left Section - Inventory Table */}
  <div
    name="tableView"
    className={`${isMinimised ? 'col-span-3' : ''}`}
  >
    <InventoryTable
      isMinimised={isMinimised}
      setIsMinimised={setIsMinimised}
      inventoryData={filteredInventoryData}
      subCategoryId={subCategoryId}
      totalInventoryValue={inventoryData}
        selectedItem={selectedItem}
  setSelectedItem={setSelectedItem} 
    />

    {/* Bottom Pagination Bar */}
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50 px-4 py-2">
    <div
  className={`flex justify-between items-center ${
    isMinimised ? 'w-[300px]' : 'w-full'
  }`}
>
 <p className="text-sm font-medium text-gray-700 ml-[200px] whitespace-nowrap">
  Total Records: {stockFilter ? filteredInventoryData.length : totalRecords}
  {stockFilter && (
    <span className="ml-2 text-blue-600">
      (Filtered by {stockFilter.replace('_', ' ')})
    </span>
  )}
</p>

 <div className={`mr-3 mb-3 ${isMinimised ? 'ml-[20px]' : ''}`}>
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
  </div>

  {/* Right Section - Inventory View */}
 <div className={`${isMinimised ? 'col-span-7' : ''} -mt-10`}>
    {/*<InventoryView />*/}
    <ViewInventory item={selectedItem} totalInventoryValue={totalInventoryValue} setIsMinimised={setIsMinimised}/>
  </div>
</div>

    </>
  )
}

export default InventoryMain
