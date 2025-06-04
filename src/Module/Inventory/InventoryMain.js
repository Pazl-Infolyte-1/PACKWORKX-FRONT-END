import { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import InventoryTable from './InventoryTable'
import { BiDollarCircle } from 'react-icons/bi'
import { FaShieldAlt, FaStar, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { CgWorkAlt } from 'react-icons/cg'
import { MdCategory, MdPushPin } from 'react-icons/md'
import { cilArrowTop, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import ContentHeader from '../../components/New/ContentHeader'
import { useNavigate } from 'react-router-dom'
import CompactPagination from '../../components/New/CompactPagination'
import { useSearch } from '../../components/New/SearchContext'

const InventoryMain = () => {
  const [inventoryData, setInventoryData] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [category, setCategory] = useState([])
  const [categoryId, setCategoryId] = useState(null)
  const [subCategoryId, setSubCategoryId] = useState(null)
  const icons = [FaShieldAlt, FaStar, FaUsers, FaChevronDown, FaChevronUp]
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [entriesPerPage, setEntriesPerPage] = useState(50)
  const [openCategoryId, setOpenCategoryId] = useState(null)
  const [subCategories, setSubCategories] = useState([])
  const [subCategoryQuantities, setSubCategoryQuantities] = useState([])
  const { setGlobalPlaceholder, searchQuery } = useSearch()

  const navigate = useNavigate()
  const backgroundColors = [
    'bg-[#22c35c]',
    'bg-[#6366f1]',
    'bg-[#6b7380]',
    'bg-[#a755f7]',
    'bg-red-100',
    'bg-gray-100',
  ]

  {
    console.log(subCategoryQuantities)
  }

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
        // Close dropdown if it's already open
        setOpenCategoryId(null)
        setSubCategories([])
      } else {
        // Open dropdown and fetch subcategories
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
    // setCategoryId(parentCategoryId) // Keep the parent category ID
    setOpenCategoryId(null) // Close dropdown
  }

  return (
    <>
      <ContentHeader
        addLabel="Add New Product"
        heading="Inventory"
        onAddClick={() =>
          navigate('/inventoryhandling/inventory_form', {
            state: { fromInventory: true },
          })
        }
      />

      {/*dashboard panel*/}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full mt-2">
        {category.map((item, index) => {
          const IconComponent = icons[index % icons.length]
          const hasSubCategories = item.id === 1 || item.id === 4 // Categories with subcategories
          const isOpen = openCategoryId === item.id

          return (
            <div key={item.id} className="relative">
              <div
                onClick={() => setCategoryId(item.id)}
                className={`p-2 rounded-xl shadow-md text-center capitalize flex items-center justify-between w-full cursor-pointer ${
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
                <div className="absolute top-12 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {subCategories.map((subCat, subIndex) => {
                    // Get corresponding icon and color for subcategory
                    const getSubCategoryIcon = (name) => {
                      const lowerName = name.toLowerCase()
                      if (lowerName.includes('reel')) return BiDollarCircle
                      if (lowerName.includes('corrugation')) return FaStar
                      if (lowerName.includes('pasting')) return CgWorkAlt
                      if (lowerName.includes('pin')) return MdPushPin
                      return MdCategory
                    }

                    const getSubCategoryColor = (name) => {
                      const lowerName = name.toLowerCase()
                      if (lowerName.includes('reel')) return '#10b981'
                      if (lowerName.includes('corrugation')) return '#f59e0b'
                      if (lowerName.includes('pasting')) return '#ef4444'
                      if (lowerName.includes('pin')) return '#8b5cf6'
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
        <div className="bg-blue-600 rounded-xl m-0 shadow-md text-center font-bold capitalize w-full text-white">
          <p className="m-0">Total Stock Value</p>
          <p className="m-0">₹{totalInventoryValue}</p>
        </div>
      </div>

      <div className="flex justify-end w-full mt-3">
        <button
          onClick={() => {
            setCategoryId(null)
            setSubCategoryId(null)
            setOpenCategoryId(null)
          }}
          className="py-1 px-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Clear
        </button>
      </div>

      <InventoryTable inventoryData={inventoryData} />

      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md z-50 px-4 py-2">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-medium text-gray-700 ml-[200px]">
            Total Records: {totalRecords}
          </p>
          <div className="mr-3">
            <CompactPagination
              totalRecords={totalRecords}
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
