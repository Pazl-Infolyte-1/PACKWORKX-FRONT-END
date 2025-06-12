import React, { useState, useEffect, useMemo, useRef } from 'react'
import { FaShieldAlt, FaStar, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { BiDollarCircle } from 'react-icons/bi'
import { CgWorkAlt } from 'react-icons/cg'
import { MdPushPin, MdCategory, MdRecycling } from 'react-icons/md'
import CommonPagination from '../../components/New/Pagination'
import { FiFilter } from 'react-icons/fi'
import ActionButton from '../../components/New/ActionButton'
import SearchBar from '../../components/New/SearchBar'
import ReelsDetails from './ReelsDetails'
import RawMaterialsDetails from './RawMaterialsDetails'
import CorrugationGlueDetails from './CorrugationGlueDetails'
import PastingGlueDetails from './PastingGlueDetails'
import FinishedGoodsDetails from './FinishedGoodsDetails'
import { cilDog } from '@coreui/icons'
import ContentHeader from '../../components/New/ContentHeader'
import ReusableTable from '../SalesOrder/ReusableTable'
import CompactPagination from '../../components/New/CompactPagination'
import InventoryTable from './InventoryTable'
import { inventoryApi } from '../../api/inventory'
import { itemApi } from '../../api/item'

const InventoryDashboard = () => {
  const [isfinishedgoodpopup, setfinishedgoodpopup] = useState(false)
  const [reelsgoodpopup, setreelsgoodpopup] = useState(false)
  const [inventoryData, setInventoryData] = useState([])
  const [itemData, setItemData] = useState([])
  const [selectedType, setSelectedType] = useState('Raw Materials')
  const [rawMaterialPopup, setRawMaterialPopup] = useState(false)
  const [corrugationgluePopup, setCorrugationGluePopup] = useState(false)
  const [pastinggluePopup, setPastingGlueDetailsPopup] = useState(false)
  const [showRawMaterialsDropdown, setShowRawMaterialsDropdown] = useState(false)
  const [showReturnableDropdown, setShowReturnableDropdown] = useState(false)
  const [selectedReturnable, setSelectedReturnable] = useState('Returnable')
const [categoryId,setCategoryId]=useState(null)
const [subCategoryId,setSubCategoryId]=useState(null)
  const [paginationParams, setPaginationParams] = useState({ currentPage: 1, pageSize: 50 })
  const [totalPages, setTotalPages] = useState(1)
  // const { searchQuery, filteredSearchData } = useSearch();
  const [status, setStatus] = useState('')
  const [expandedRowId, setExpandedRowId] = useState(null)
  const [itemCustomFields, setItemCustomFields] = useState({})


  const dropdownRef = useRef(null)
  const returnableDropdownRef = useRef(null)

  // Raw materials dropdown options
  const rawMaterialOptions = [
    {
      id:1,
      name: 'Reels',
      icon: <BiDollarCircle />,
      color: '#10b981',
      hoverColor: 'hover:bg-green-50',
      textColor: 'text-green-700',
    },
    {
      id:2,
      name: 'Corrugation Glue',
      icon: <FaStar />,
      color: '#f59e0b',
      hoverColor: 'hover:bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      id:3,
      name: 'Pasting Glue',
      icon: <CgWorkAlt />,
      color: '#ef4444',
      hoverColor: 'hover:bg-red-50',
      textColor: 'text-red-700',
    },
    {
      id:4,
      name: 'Pins',
      icon: <MdPushPin />,
      color: '#8b5cf6',
      hoverColor: 'hover:bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      id:5,
      name: 'Other',
      icon: <MdCategory />,
      color: '#6b7280',
      hoverColor: 'hover:bg-gray-50',
      textColor: 'text-gray-700',
    },
  ]

  // Returnable dropdown options
  const returnableOptions = [
    {
      id:1,
      name: 'DYE',
      icon: <MdCategory />,
      color: '#10b981',
      hoverColor: 'hover:bg-green-50',
      textColor: 'text-green-700',
    },
    {
      id:2,
      name: 'Stereo',
      icon: <FaStar />,
      color: '#f59e0b',
      hoverColor: 'hover:bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      id:3,
      name: 'Other',
      icon: <MdPushPin />,
      color: '#ef4444',
      hoverColor: 'hover:bg-red-50',
      textColor: 'text-red-700',
    },
  ]


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowRawMaterialsDropdown(false)
      }
      if (returnableDropdownRef.current && !returnableDropdownRef.current.contains(event.target)) {
        setShowReturnableDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const openItemDetails = async (id) => {
    setExpandedRowId((prevId) => (prevId === id ? null : id))

    const inventoryItem = inventoryData.find((item) => item.id === id)

    if (!inventoryItem) {
      console.warn('No matching inventory item found for id:', id)
      return
    }

    const item_id = inventoryItem.item_id

    // Fetch all items
    const response = await itemApi.getItemList()
    const items = response?.data?.data || []

    // Find the full item details based on item_id
    const item = items.find((i) => i.id === parseInt(item_id))

    // Parse custom_fields if available
    const customFields = item?.custom_fields ? JSON.parse(item.custom_fields) : {}
    setItemCustomFields(customFields)
  }

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await inventoryApi.getinventory()
        if (response.data.success) {
          setInventoryData(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error)
      }
    }
    fetchInventory()
  }, [paginationParams])

  // useEffect(() => {
  //   setPaginationParams(prev => ({
  //     ...prev,
  //     currentPage: 1
  //   }));
  // }, [searchQuery, status]);

  const handleLimitChange = (value) => {
    setPaginationParams({
      currentPage: 1, // Reset to the first page when limit changes
      pageSize: value, // Update the page size
    })
  }

  const handlePageChange = (event, newPage) => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: newPage,
    }))
  }

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await itemApi.getItemList({
          page: paginationParams.currentPage,
          limit: paginationParams.pageSize,
          // client: searchQuery,
          sales_status: status,
        })
        if (response.data.success) {
          setItemData(response.data.data)
          setTotalPages(Math.ceil(response.data.totalItems / paginationParams.pageSize))
        }
      } catch (error) {
        console.error('Failed to fetch item data:', error)
      }
    }
    fetchItemData()
  }, [paginationParams])

  const normalize = (str) => str?.toLowerCase().replace(/[\s\-]/g, '')

  // const inventorySummary = useMemo(() => {
  //   const summary = {};
  //   inventoryData.forEach(item => {
  //     const type = item.inventory_type || 'Unknown';
  //     console.log(item.inventory_type)
  //     const qty = parseFloat(item.quantity_available || 0);
  //     if (!summary[type]) {
  //       summary[type] = { total: 0 };
  //     }
  //     summary[type].total += qty;
  //   });
  //   return summary;
  // }, [inventoryData]);

  const inventorySummary = useMemo(() => {
    const summary = {}

    inventoryData.forEach((item) => {
      const itemId = item.item_id
      const matchedItem = itemData.find((i) => i.id === itemId)

      // Skip if item not in itemData (filteredItems will be based on itemData)
      if (!matchedItem) return

      const type = item.inventory_type || 'Unknown'
      const qty = parseFloat(item.quantity_available || 0)

      if (!summary[type]) {
        summary[type] = { total: 0 }
      }

      summary[type].total += qty
    })

    return summary
  }, [inventoryData, itemData])

  const getMinStockLevel = (type) => {
    const normalizedType = normalize(type)
    const item = itemData.find((i) => normalize(i?.item_type) === normalizedType)
    return item?.min_stock_level ?? 500
  }

  const getStatus = (type) => {
    const total = inventorySummary[type]?.total || 0
    const minLevel = getMinStockLevel(type)
    if (total > minLevel) return 'Enough Stock'
    if (total > 0) return 'Low Stock'
    return 'Out of Stock'
  }

  const totalStockValue = useMemo(() => {
    let total = 0
    inventoryData.forEach((invItem) => {
      const item = itemData.find((i) => i.id === invItem.item_id)
      const qty = parseFloat(invItem.quantity_available || 0)
      const cost = parseFloat(item?.standard_cost || 0)
      total += qty * cost
    })
    return total.toFixed(2)
  }, [inventoryData, itemData])

  const handleCardClick = (modalName, type) => {
    setSelectedType(type)
    if (modalName === 'finished_goods') {
      setfinishedgoodpopup(true)
    } else if (modalName === 'reels_details') {
      setreelsgoodpopup(true)
    } else if (modalName === 'raw_material') {
      setRawMaterialPopup(true)
    } else if (modalName === 'corrugation_glue') {
      setCorrugationGluePopup(true)
    } else if (modalName === 'pasting_glue') {
      setPastingGlueDetailsPopup(true)
    }
  }

  const handleRawMaterialClick = (optionName,id) => {
    setSelectedType(optionName)
    setShowRawMaterialsDropdown(false)
    console.log("iddd",id)
      if (id) {
    setSubCategoryId(id);
  }
    // You can add additional logic here based on the selected option
  }

  const handleReturnableClick = (optionName,id) => {
    setSelectedReturnable(optionName)
    setShowReturnableDropdown(false)
    if(id){
    setSubCategoryId(id)
    }
  }

  const MaterialTable = ({ data, selectedType }) => {
    const [expandedRowId, setExpandedRowId] = useState(null) // Changed from array to single value
    const [itemCustomFields, setItemCustomFields] = useState({})

    const filteredItems = useMemo(() => {
      const normalizedType = normalize(selectedType)

      let typeFilteredItems
      if (normalizedType === 'rawmaterials') {
        const rawTypes = [
          'reels',
          'glues',
          'pasting-glue',
          'corrugation-glue',
          'pins',
          'finished-goods',
          'semi-finished-goods',
          'rawmaterials',
        ].map(normalize)

        typeFilteredItems = data.filter((item) => rawTypes.includes(normalize(item.item_type)))
      } else {
        typeFilteredItems = data.filter((item) => normalize(item.item_type) === normalizedType)
      }

      // Apply returnable filter
      if (selectedReturnable === 'Returnable') {
        return typeFilteredItems
      } else {
        return typeFilteredItems.filter((item) => {
          // Assuming returnable_type is a field in your item data
          // If not, you might need to check custom_fields or another field
          return (
            item.returnable_type === selectedReturnable ||
            (item.custom_fields &&
              JSON.parse(item.custom_fields).returnable_type === selectedReturnable)
          )
        })
      }
    }, [data, selectedType, selectedReturnable])

    const handleRowToggle = async (rowId) => {
      // If clicking on the same row that's already expanded, close it
      // Otherwise, open the new row (automatically closes the previous one)
      const newExpandedRowId = expandedRowId === rowId ? null : rowId
      setExpandedRowId(newExpandedRowId)

      // If expanding a new row, fetch the custom fields
      if (newExpandedRowId !== null && newExpandedRowId !== expandedRowId) {
        const item = filteredItems.find((item) => item.id === rowId)
        if (item) {
          try {
            // You might want to optimize this by fetching all items once
            // and storing them in a state or context
            const response = await itemApi.getItemList()
            const items = response?.data?.data || []
            const fullItem = items.find((i) => i.id === parseInt(item.id))

            const customFields = fullItem?.custom_fields ? JSON.parse(fullItem.custom_fields) : {}
            setItemCustomFields((prev) => ({
              ...prev,
              [rowId]: customFields,
            }))
          } catch (error) {
            console.error('Failed to fetch item details:', error)
          }
        }
      }
    }

    const columns = [
      { key: 'item_name', header: 'Product Name', field: 'item_name' },
      {
        key: 'available_quantity',
        header: 'Available Quantity',
        type: 'custom',
        render: (item) => {
          const inventoryItems = inventoryData.filter((inv) => inv.item_id === item.id)
          const totalQuantity = inventoryItems.reduce(
            (sum, inv) => sum + Number(inv.quantity_available || 0),
            0,
          )
          return <p className="-ml-14">{totalQuantity}</p>
        },
      },
      {
        key: 'min_stock_level',
        header: 'Min Stock Level',
        field: 'min_stock_level',
        type: 'number',
      },
      {
        key: 'reorder_level',
        header: 'Reorder Level',
        field: 'reorder_level',
      },
      {
        key: 'item_type',
        header: 'Product Type',
        field: 'item_type',
      },
      {
        key: 'standard_cost',
        header: 'Standard Cost',
        field: 'standard_cost',
      },
    ]

    const expandableConfig = {
      render: (row) => {
        const customFields = itemCustomFields[row.id] || {}

        if (Object.keys(customFields).length > 0) {
          return (
            <div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(customFields).map(([key, value]) => (
                  <span key={key} className="text-xs bg-gray-100 px-4 py-2 rounded-full">
                    <span className="text-gray-500">{key}:</span>
                    <span className="ml-1 text-gray-700">{value}</span>
                  </span>
                ))}
              </div>
            </div>
          )
        } else {
          return <p className="text-gray-500">No custom fields available for this item.</p>
        }
      },
      colSpan: columns.length,
    }

    return (
      <div className="my-3">
        <ReusableTable
          data={filteredItems}
          columns={columns}
          height="65vh"
          expandableConfig={expandableConfig}
          expandedRows={expandedRowId ? [expandedRowId] : []} // Convert single ID to array format
          onRowToggle={handleRowToggle}
        />
      </div>
    )
  }

  const StockCard = ({
    title,
    quantity,
    status,
    bgColor,
    textColor,
    buttonColor,
    icon,
    modalname,
    hoverBgColor,
  }) => (
    <div
      onClick={() => setSelectedType(title)}
      className={`w-full h-14 flex items-center justify-between font-bold rounded-lg cursor-pointer shadow-md text-white border p-2 ${hoverBgColor} transition`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex gap-2 items-center">
        <h2 className="text-xl text-white">{icon}</h2>
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      <div
        className="h-[40px] w-[50px] flex items-center justify-center rounded-lg"
        style={{ backgroundColor: buttonColor }}
      >
        {console.log(quantity)
        }
        {quantity}
      </div>
    </div>
  )

  const RawMaterialsDropdownCard = () => {
    return (
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => setShowRawMaterialsDropdown(!showRawMaterialsDropdown)}
          className="w-full h-14 flex items-center justify-between font-bold rounded-lg cursor-pointer shadow-md text-white border p-2 hover:bg-green-600 transition bg-green-500"
        >
          <div className="flex gap-2 items-center">
            <h2 className="text-xl text-white">
              <BiDollarCircle />
            </h2>
            <h2 className="text-sm font-bold text-white">RawMaterials</h2>
          </div>
          <div className="h-[40px] w-[50px] flex items-center justify-center rounded-lg bg-green-600">
            {showRawMaterialsDropdown ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>

        {showRawMaterialsDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 !z-[9999]">
            <div className="py-2">
              {rawMaterialOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleRawMaterialClick(option.name,option.id)}
                  className={`flex items-center gap-3 px-1 py-2 cursor-pointer transition-all duration-200 ${option.hoverColor} border-l-4 border-transparent hover:border-l-4`}
                  style={{
                    '--hover-border-color': option.color,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderLeftColor = option.color
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderLeftColor = 'transparent'
                  }}
                >
                  <div
                    className="text-lg flex items-center justify-center w-8 h-8 rounded-full"
                    style={{
                      backgroundColor: `${option.color}15`,
                      color: option.color,
                    }}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-xs ${option.textColor}`}>{option.name}</h3>
                  </div>
                  <div
                    className="p-1 rounded-full text-xs text-black"
                    // style={{ backgroundColor: option.color }}
                  >
                    {inventorySummary[option.name.toLowerCase().replace(' ', '-')]?.total || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const ReturnableDropdownCard = () => {
    return (
      <div className="relative" ref={returnableDropdownRef}>
        <div
          onClick={() => setShowReturnableDropdown(!showReturnableDropdown)}
          className="w-full h-14 flex items-center justify-between font-bold rounded-lg cursor-pointer shadow-md text-white border p-2 hover:bg-purple-600 transition bg-purple-500"
        >
          <div className="flex gap-2 items-center min-w-0">
            <h2 className="text-xl text-white">
              <MdRecycling />
            </h2>
            <h2 className="text-sm font-bold text-white truncate">{selectedReturnable}</h2>
          </div>
          <div className="h-[40px] w-[50px] flex items-center justify-center rounded-lg bg-purple-600 flex-shrink-0">
            {showReturnableDropdown ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>

        {showReturnableDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999]">
            <div className="py-2">
              {returnableOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleReturnableClick(option.name,option.id)}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-200 ${option.hoverColor} border-l-4 border-transparent hover:border-l-4`}
                  style={{
                    '--hover-border-color': option.color,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderLeftColor = option.color
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderLeftColor = 'transparent'
                  }}
                >
                  <div
                    className="text-lg flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: `${option.color}15`,
                      color: option.color,
                    }}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-xs ${option.textColor} truncate`}>
                      {option.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
console.log("dddd",subCategoryId)
  return (
    <div>
      <ContentHeader heading={`${selectedType} Details`} isAddNew={false} />
      <div className="flex flex-col sm:flex-row justify-between items-stretch gap-2 mt-2 pl-3">
        {/* Raw Materials Card with Dropdown */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <div
              onClick={() => setShowRawMaterialsDropdown(!showRawMaterialsDropdown)}
              className="w-full h-14 flex items-center justify-between font-bold rounded-lg cursor-pointer shadow-md text-white border p-2 hover:bg-green-600 transition bg-green-500"
            >
              <div className="flex gap-2 items-center min-w-0">
                <h2 className="text-xl text-white">
                  <BiDollarCircle />
                </h2>
                <h2 className="text-sm font-bold text-white truncate">
                  {selectedType || 'Raw Materials'}
                </h2>
              </div>
              <div className="h-[40px] w-[50px] flex items-center justify-center rounded-lg bg-green-600 flex-shrink-0">
                {showRawMaterialsDropdown ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {showRawMaterialsDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999]">
                <div className="py-2">
                  {rawMaterialOptions.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleRawMaterialClick(option.name,option.id)}
                      className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-200 ${option.hoverColor} border-l-4 border-transparent hover:border-l-4`}
                      style={{
                        '--hover-border-color': option.color,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderLeftColor = option.color
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderLeftColor = 'transparent'
                      }}
                    >
                      <div
                        className="text-lg flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: `${option.color}15`,
                          color: option.color,
                        }}
                      >
                        {option.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-xs ${option.textColor} truncate`}>
                          {option.name}
                        </h3>
                      </div>
                      <div className="p-1 rounded-full text-xs text-black flex-shrink-0">
                        {inventorySummary[option.name.toLowerCase().replace(' ', '-')]?.total || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <StockCard
            title="Semi Finished Goods"
            quantity={inventorySummary['semi-finished-goods']?.total || 0}
            status={getStatus('Semi Finished Goods')}
            bgColor="#6366f1"
            textColor="text-indigo-700"
            buttonColor="#4f46e5"
            hoverBgColor="hover:bg-indigo-200"
            icon={<FaUsers />}
            modalname="finished_goods"
          />
        </div>

        <div className="flex-1 min-w-0">
          <StockCard
            title="Finished Goods"
            quantity={inventorySummary['finished-goods']?.total || 0}
            status={getStatus('finished-goods')}
            bgColor="#6b7280"
            textColor="text-gray-700"
            buttonColor="#4b5563"
            hoverBgColor="hover:bg-gray-300"
            icon={<FaShieldAlt />}
            modalname="finished_goods"
          />
        </div>

        {/* New Returnable Dropdown Card */}
        <div className="flex-1 min-w-0">
          <ReturnableDropdownCard />
        </div>

        <div className="flex-1 min-w-0">
          <div className="w-full h-14 flex flex-col items-center justify-center font-bold rounded-lg shadow-md text-white border p-2 bg-blue-500">
            <h6 className="text-white text-sm">Total Stock Value</h6>
            <h5 className="text-sm font-bold text-white">${totalStockValue}</h5>
          </div>
        </div>
      </div>

      <section>
        {/* <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SearchBar text={`${selectedType} Types`} data={[]} />
            <FiFilter className="text-xl text-gray-700" />
          </div>
          <div className="flex gap-2">
            <ActionButton label={"Saved Filter"} />
            <ActionButton label={"Bulk Upload"} />
          </div>
        </div> */}

        {/* Pass full itemData and selectedType */}
        {/*<MaterialTable data={itemData} selectedType={selectedType} />*/}
<InventoryTable inventoryData={inventoryData}/>
        <div className="flex justify-end items-center">
          <CompactPagination
            count={totalPages}
            page={paginationParams.currentPage}
            onPageChange={handlePageChange}
            onEntriesChange={handleLimitChange}
            entriesPerPage={paginationParams.pageSize}
          />
        </div>
      </section>

      <FinishedGoodsDetails
        visible={isfinishedgoodpopup}
        setVisible={() => setfinishedgoodpopup(false)}
      />
      <ReelsDetails visible={reelsgoodpopup} setVisible={() => setreelsgoodpopup(false)} />
      <RawMaterialsDetails
        visible={rawMaterialPopup}
        setVisible={() => setRawMaterialPopup(false)}
        rawMaterials={inventoryData.filter(
          (item) => normalize(item.inventory_type) === 'rawmaterials',
        )}
        itemdata={itemData}
      />
      <CorrugationGlueDetails
        visible={corrugationgluePopup}
        setVisible={() => setCorrugationGluePopup(false)}
      />

      <PastingGlueDetails
        visible={pastinggluePopup}
        setVisible={() => setPastingGlueDetailsPopup(false)}
      />
    </div>
  )
}

export default InventoryDashboard
