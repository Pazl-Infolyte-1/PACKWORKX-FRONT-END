import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import { useEffect, useState } from 'react'
import apiMethods from '../../api/config'
import { IoTrash } from 'react-icons/io5'
import React from 'react'
import ActionButton from '../../components/New/ActionButton'
import PopUp from '../../components/New/PopUp'
import CompositePopupTable from './CompositePopupTable'
import { FaChevronDown } from 'react-icons/fa'
import Tooltip from '@mui/material/Tooltip'
import PlyToggle from '../../components/New/PlyToggle'
import RSCBox from './RSCBox'
import CorrugatedSheet from './CorrugatedSheet'
import DieCutBox from './DieCutBox'
import CustomItem from './CustomItem'
import ModifiedPopup from '../../components/New/ModifiedPopup'
import SelectionCards from '../../components/New/SelectionCards'
import ClientForm from '../Client/ClientForm'
import vendorImg from '../../assets/images/vendor.png'
import clientImg from '../../assets/images/client.jpg'
import { useDispatch, useSelector } from 'react-redux'
import RoutePopup from './RoutePopup'
import ChipSelectorWithBrowse from '../../components/New/ChipSelectorWithBrowse'
import { setCompositeArray } from '../../action';

const compositeTypes = [
  { id: '1', name: 'Partition' },
  { id: '2', name: 'Panel' },
]

const skuTypes = [
  { id: 1, name: 'Charger' },
  { id: 2, name: 'Laptop' },
]

function Composite({
  editTag,
  dropdownRef,
  addNewSkuData,
  isOpen,
  handleChange,
  clientDiasble,
  client,
  setIsOpen,
  handleSelect,
  skuType,
  setAddNewSkuData,
  editedSkudata,
  updateSkuValues,
  isopenval,
  setCompositeSelect,
  isactivateRender,
  setPopupOpen,
  isPopupOpen,
  message,
  setMessage,
  errors,
  setErrors
}) {
  const [skuListTable, setSkuListTable] = useState([])
  const [skuFields, setSkuFields] = useState([])
  const [skuList, setSkuList] = useState([])
  const [skuDropdown, setSkuDropdown] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [isSingleViewPopupForType, setisSingleViewPopupForType] = useState(false)

  const [checkboxSelectedArray, setCheckboxSelectedArray] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('')
  const [skuTypes, setSkuTypes] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  })
  const [limit, setLimit] = useState(10)
  const [refresh, setRefresh] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedSkuType, setSelectedSkuType] = useState('')
  const [selectedSkuTypePopup, setSelectedSkuTypePopup] = useState(null);
  const [selected, setSelected] = useState('vendor')
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [entityType, setEntityType] = useState('') // State to hold entity_type
  const [submitFromRsc, setSubmitFromRsc] = useState(true)
  const dispatch = useDispatch()
  const compositeArray = useSelector((state) => state.compositeArray);

  const [displayAsChips,setDisplayAsChips] = useState([])
  const [isSingleViewPopupRoute, setisSingleViewPopupRoute] = useState(false)
  const [fullRouteResponse, setFullRouteResponse] = useState(null);

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
  const handleCompositeTypeChange = (e) => {
    const selectedType = e.target.value

    setAddNewSkuData((prev) => ({
      ...prev,
      composite_type: selectedType,
    }))
    if (selectedType.trim()) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.composite_type;
        return newErrors;
      });
    }
  }

  //this is for add sku with ratio dropw=down
  const fetchSkuList = async () => {
    try {
      const response = await apiMethods.getSkuListOptions()
      setSkuList(response.data) // Assuming data is inside 'data'
    } catch (error) {
      console.error('Failed to fetch SKU list:', error)
    }
  }

  useEffect(() => {
    fetchSkuList()
  }, [isactivateRender])

  //this is for popup table summary
  const fetchSkuListTablePopup = async () => {
    try {
      const response = await apiMethods.getSkuList({
        page: pagination.currentPage,
        limit: limit,
        search: searchQuery || '',
        client: selectedClient || '',
        sku_type: selectedSkuType || '',
      })
      //setSkuList(response.data); // Assuming data is inside 'data'
      setSkuListTable(response)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Failed to fetch SKU list:', error)
    }
  }

  useEffect(() => {
    fetchSkuListTablePopup()
  }, [pagination.currentPage, limit, refresh, searchQuery, selectedClient, selectedSkuType])

  const handleAddSkuField = () => {
    setSkuFields((prev) => [...prev, { id: '', ratio: '', key: Date.now() }])
  }

  const handleChangeSkuSelect = (index, value) => {
    setSkuFields((prev) => {
      const updatedFields = [...prev]
      const matchedSku = skuList.find((sku) => sku.id === value) // Find the SKU based on the selected value

      // Update the specific field at the given index
      updatedFields[index] = {
        ...updatedFields[index], // Keep the existing properties
        id: value, // Update the id with the selected value
        sku_name: matchedSku ? matchedSku.sku_name : '', // Update sku_name based on selection
        ratio: matchedSku ? matchedSku.ratio : '', // Optionally update ratio if needed
      }
      console.log('Selected dropdown values:', updatedFields);
      return updatedFields // Return the updated fields
    })
  }

  const handleChangeRatio = (index, value) => {
    const updated = [...skuFields]
    updated[index].ratio = parseFloat(value) // Ensure it's a number
    setSkuFields(updated)
  }

  const handleRemoveSkuField = (key) => {
    setSkuFields((prev) => prev.filter((field) => field.key !== key))
  }

  useEffect(() => {
    const part_value = skuFields
      .filter((field) => field.id !== '')
      .map((field) => {
        const selectedSku = skuList.find((sku) => sku.id === parseInt(field.id))
        return {
          sku_id: selectedSku?.id,
          sku_name: selectedSku?.sku_name,
          ratio: field.ratio,
        }
      })

    setAddNewSkuData((prev) => ({
      ...prev,
      part_value,
      part_count: part_value.length,
    }))
  }, [skuFields, skuList])

  useEffect(() => {
    if (addNewSkuData?.part_value?.length > 0) {
      const fetchSkuList = async () => {
        try {
          const response = await apiMethods.getSkuListOptions()
          const skuData = response.data
          setSkuDropdown(skuData)

          // Now process after data is fetched
          const newSkuFields = addNewSkuData.part_value.map((part) => {
            const matchedSku = skuData.find((sku) => sku.id === part.sku_id)
            return {
              id: matchedSku ? matchedSku.id : '',
              sku_name: matchedSku ? matchedSku.sku_name : '',
              ratio: part.ratio,
              key: Date.now() + Math.random(),
            }
          })

          setSkuFields((prev) => [...prev, ...newSkuFields])
        } catch (error) {
          console.error('Failed to fetch SKU list:', error)
        }
      }

      fetchSkuList()
    }
  }, [])

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedClientDeleteId(null)
  }

  const tablepopup = () => {
    setisSingleViewPopup(true)
  }

  useEffect(() => {
    if (checkboxSelectedArray.length > 0) {
      const addedFields = checkboxSelectedArray.map((sku) => ({
        id: sku.id,
        sku_name: sku.sku_name,
        ratio: '',
        key: Date.now() + Math.random(),
        readonly: true,
      }))

      setSkuFields((prev) => [...prev, ...addedFields])
      setCheckboxSelectedArray([])
    }
    const selectedSkuIds = skuFields.map((field) => parseInt(field.id));

  }, [checkboxSelectedArray])

  console.log("is open",isopenval)
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isopenval) {
        const message = "Don't refresh or else your data will be lost!";
        event.preventDefault(); // For most browsers
        event.returnValue = message; // For Chrome
        return message; // For Firefox
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isopenval]);



  const handleSelectPopup = (data) => {
    console.log("selected data", data.sku_type);
    setCompositeSelect(data.sku_type)

  };

      //setSelectedSkuTypePopup(data.sku_type);
    //setisSingleViewPopupForType(true);
  
  const skuComponents = {
    'RSC box': <RSCBox />,
    Board: <CorrugatedSheet />,
    'Die Cut box': <DieCutBox />,
    Composite: <Composite />,
    'Custom Item': <CustomItem />
  };

  console.log("popup selectr",isSingleViewPopupForType)
  //const handleClosePopup = () => {
  //  console.log("popup closed")
  //  setisSingleViewPopupForType(false);
  //  setCompositeSelect(null); // reset when popup is closed
  //};
  
  //console.log("pop///",isSingleViewPopupForType)
  console.log("rebder activate",isactivateRender)

  
    //these are the fonctionalities for client create dropdown
    
    const handleSelectAction = (selection) => {
      setSelected(selection)
      setTriggerSelection(true) // Ensures it runs handleSelection
    }
    
    const handleCloseDrawer = () => {
      setDrawerOpen(false)
    }
    const refreshClients = () => {
      setReloadData((prev) => !prev) //  Toggle state to trigger `useEffect`
    }
    
     useEffect(() => {
        if (triggerSelection) {
          handleSelection(selected)
          setTriggerSelection(false) // Reset trigger
        }
      }, [selected, triggerSelection]) 
    
      const handleSelection = (selection) => {
        const optionValue = selectionFrame[selection].id
        console.log(`Selected ID: ${optionValue}`)
    
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
    
        useEffect(() => {
          document.addEventListener('keydown', handleKeyDown)
          return () => document.removeEventListener('keydown', handleKeyDown)
        }, []) // Runs once on mount
    
        const handleKeyDown = (event) => {
          if (!isPopupOpen) {
            return; // Disable arrow key functionality if the popup is not open
          }
          if (event.key === 'ArrowRight') {
            handleSelectAction('client')
            setEntityType('Client') // Update state
          } else if (event.key === 'ArrowLeft') {
            handleSelectAction('vendor')
            setEntityType('Vendor') // Update state
          } else if (event.key === 'Enter') {
            console.log('Enter Pressed: Executing Selection')
            setTriggerSelection(true) // Mark that Enter was pressed
          }
        }
      
        console.log("jjjj",message)
    
        useEffect(() => {
          if (message) {
            setAlerts([{ severity: 'success', message }]);
        
            const timer = setTimeout(() => {
              setAlerts([]); // Clear alerts after 3 seconds
            }, 3000);
        
            return () => clearTimeout(timer); // Cleanup on unmount or message change
          }
        }, [message]);
        
           
        //functionality for route chip
         useEffect(() => {
              const fetchRoutes = async () => {
                const params = {
                  search: '',
                  page: 1,
                  limit: 10000,
                };
            
                try {
                  const response = await apiMethods.getRouteList(params);
                  console.log('Full API Response:', response);
                  setFullRouteResponse(response); // ✅ Save full response here
                  setDisplayAsChips(response.data.routes)
                } catch (err) {
                  console.error('Error fetching routes:', err);
                }
              };
            
              fetchRoutes();
            }, []);
            
        
        const selectedRouteIds1 = useSelector((state) => state.routeprocess.selectedRouteIds || []);
        
        useEffect(() => {
          if (editTag && typeof addNewSkuData?.route === 'string') {
            try {
              const parsedRoutes = JSON.parse(addNewSkuData.route);
              if (Array.isArray(parsedRoutes) && parsedRoutes.length > 0) {
                dispatch({
                  type: 'SET_SELECTED_ROUTE_IDS',
                  payload: parsedRoutes,
                });
        
                setAddNewSkuData((prevData) => ({
                  ...prevData,
                  route: parsedRoutes, // ✅ use parsedRoutes instead of selectedRouteIds1
                }));
              }
            } catch (err) {
              console.error('Invalid route format:', addNewSkuData.route);
            }
          }
        }, [editTag, addNewSkuData?.route, dispatch]);
        
        
        
        // Optional: track Redux changes
        useEffect(() => {
          console.log("Redux -> routeprocess.selectedRouteIds:", selectedRouteIds1);
        }, [selectedRouteIds1]);
        
        const selectedChips = displayAsChips.filter((item) =>
          selectedRouteIds1.includes(item.id)
        );
        
        const chipNames = selectedChips.map((chip) => chip.route_name).join(', ');
        
        useEffect(() => {
          if (!editTag) {
            setAddNewSkuData((prevData) => ({
              ...prevData,
              route: selectedRouteIds1,
            }));
          }
        }, [selectedRouteIds1, editTag]);
        
        
        const handleRemoveChip = (idToRemove) => {
          console.log("Removing chip with id:", idToRemove);
        
          const updated = selectedRouteIds1.filter((id) => id !== idToRemove);
          console.log("update", updated);
        
          dispatch({
            type: 'SET_SELECTED_ROUTE_IDS',
            payload: updated,
          });
        };
        useEffect(() => {
          setAddNewSkuData((prevData) => ({
            ...prevData,
            route: selectedRouteIds1,
          }));
        }, [selectedRouteIds1]);
        const handleBrowseClickRoute = () => {
          setisSingleViewPopupRoute(true)
        }
    
        useEffect(() => {
          // Only extract ids that are valid, and convert them to numbers
          const compositeIds = skuFields
            .filter((field) => field.id !== '') // skip empty ids
            .map((field) => Number(field.id));  // convert all to numbers
        
          console.log('Dispatching composite IDs:', compositeIds);
        
          dispatch(setCompositeArray(compositeIds));
        }, [skuFields]); // runs whenever skuFields changes
        console.log("sku fields",skuFields)

        useEffect(() => {
          console.log('Redux main comp:', compositeArray);
        }, [compositeArray]);

        const selectedRouteIds2 = useSelector(
          (state) => state.routeprocess?.selectedRouteIds || []
        );
        
        useEffect(() => {
          console.log('Selected Route IDs in comp:', selectedRouteIds2);
        
          if (selectedRouteIds2.length > 0) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.route;
              return newErrors;
            });
          }
        }, [selectedRouteIds2]);
        
 
  return (
    <div className="rounded-lg">
      {/* Top header fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3 border border-gray-200 rounded-lg">
        <div className='w-[200px]'>
          <label className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">SKU Type</label>
          <div className="relative w-full" ref={dropdownRef}>
            <div
              className="p-1 h-8 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center bg-white hover:border-blue-500 transition-colors"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="text-gray-800">{addNewSkuData?.sku_type || 'Select Type'}</span>
              <BsChevronDown
                className={`transition-transform text-gray-600 ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {isOpen && (
              <ul className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md z-20 shadow-lg">
                {skuType.map((option) => (
                  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-50">
                    <li
                      className={`p-2 cursor-pointer w-full ${editTag ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'}`}
                      onClick={!editTag ? () => handleSelect(option) : undefined}
                    >
                      {option.sku_type}
                    </li>
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className='w-[200px]'>
        <label className="block text-sm font-medium text-gray-700 mb-2">
    SKU Name
    <span className="text-red-500 ml-1">*</span>
    {errors.sku_name && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.sku_name}</span>
    )}
  </label>
            <input
              id="sku_name"
              name="sku_name"
              value={addNewSkuData.sku_name}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className='w-[200px]'>
          <label className="block text-sm font-medium text-gray-700 mb-2">
    Client Name
    <span className="text-red-500 ml-1">*</span>
    {errors.client_id && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.client_id}</span>
    )}
  </label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            //value={filteredClient ? filteredClient.client_id : addNewSkuData?.client || ''}
            value={addNewSkuData.client_id}
            onChange={handleChange}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>
              Select
            </option>
            {client?.map((item, index) => (
              <option key={index} value={item.client_id}>
                {item.display_name}
              </option>
            ))}
                            <option value="add_client">➕ Add Client</option>

          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3 mt-6 border border-gray-200 rounded-lg">
        <div className='w-[200px]'>
        <label className="block text-sm font-medium text-gray-700 mb-2">
    Partition Panel
    <span className="text-red-500 ml-1">*</span>
    {errors.composite_type && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.composite_type}</span>
    )}
  </label>
          <select
            name="composite_type"
            id="composite_type"
            value={addNewSkuData?.composite_type}
            className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            onChange={handleCompositeTypeChange}
          >
            <option value="">Select</option>
            <option value="Partition">Partition</option>
            <option value="Panel">Panel</option>
          </select>
        </div>

        <div className='w-[200px]'>
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
        Minimum Order Level
    <span className="text-red-500 ml-1">*</span>
    {errors.minimum_order_level && (
      <span className="text-red-500 text-sm ml-2 align-middle">{errors.minimum_order_level}</span>
    )}
  </label>
            <input
              id="minimum_order_level"
              name="minimum_order_level"
              value={addNewSkuData.minimum_order_level}
              onChange={handleChange}
              className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>


        <ChipSelectorWithBrowse
          label="Route"
          required={true}
          selectedIds={selectedRouteIds1}
          allOptions={displayAsChips}
          onRemoveChip={handleRemoveChip}
          onBrowseClick={handleBrowseClickRoute}
          errors={errors}
        />
        <div className="w-[200px]">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Tax Master
  </label>
  <select
    id="gst_percentage"
    name="gst_percentage"
    value={addNewSkuData?.gst_percentage || ""}
    onChange={handleChange}
    className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
  >
    <option value="">Select Tax</option>
    <option value={5}>5%</option>
    <option value={10}>10%</option>
    <option value={15}>15%</option>
  </select>
</div>

      </div>

        <div className="col-span-3">
          <div className="flex items-center gap-4 mt-4">
            <button
              type="button"
              className="bg-purple-400 text-white text-sm px-2 py-1 rounded-md shadow-md hover:bg-purple-500 transition-colors"
              onClick={handleAddSkuField}
            >
              + Add
            </button>

            <button
              type="button"
              className="bg-gray-400 text-white text-sm px-2 py-1 rounded-md shadow-md hover:bg-gray-500 transition-colors"
              onClick={tablepopup}
            >
              Browse
            </button>

            <div className="w-[150px]">
  <select
    id="sku_type"
    name="sku_type"
    value={selectedFilter || ''}
    onChange={(e) => {
      const selectedOption = skuType.find(opt => opt.sku_type === e.target.value);
      //handleSelect(selectedOption);
      handleSelectPopup(selectedOption)
    }}
    className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
  >
    <option value="">Create New</option>
    {skuType.map((option) => (
      <option key={option.id} value={option.sku_type}    disabled={option.sku_type === 'Composite'}>
        {option.sku_type}
      </option>
    ))}
  </select>
</div>

          </div>
        </div>
      {/* SKU Selection Area */}
      <div className="mt-2 w-full overflow-auto">
        {skuFields.length > 0 && (
          <div className="mt-4 min-w-[900px]">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left">SKU No</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Selected SKU</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Ratio</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {skuFields.map((field, index) => (
                  <tr key={field.key} className="bg-white hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">SKU {index + 1}</td>
                    <td className="border border-gray-300 px-3 py-2">
  {field.readonly ? (
    <input
      type="text"
      value={field.sku_name}
      readOnly
      className="w-full px-1 py-[5px] text-sm bg-gray-100 border border-gray-300 rounded text-black"
    />
  ) : (
    <select
      className="w-full h-[30px] px-1 border border-gray-300 text-sm rounded-md bg-white text-black outline-none"
      value={field.id}
      onChange={(e) => handleChangeSkuSelect(index, e.target.value)}
    >
      {addNewSkuData.part_value.length === 0 && (
        <option value="" disabled>
          Select SKU
        </option>
      )}
      {skuList.map((sku) => {
        // Check if the SKU is already selected in other fields
        //const isSelected = skuFields.some((f, i) => f.id === sku.id && i !== index);
        const isInComposite = compositeArray.includes(Number(sku.id));
        return (
          <option key={sku.id} value={sku.id} disabled={isInComposite}>
            {sku.sku_name}
          </option>
        );
      })}
    </select>
  )}
</td>
                    <td className="border border-gray-300 px-3 py-2">
                      <input
                        type="number"
                        placeholder="Ratio"
                        value={field.ratio ?? ''}
                        onChange={(e) => handleChangeRatio(index, e.target.value)}
                        className="w-[70%] p-1 text-center focus:outline-none border border-gray-300 rounded text-sm"
                      />
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSkuField(field.key)}
                        className="text-gray-500 hover:text-red-600"
                        title="Remove"
                      >
                        <IoTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PopUp
        header={'Select SKU'}
        visible={isSingleViewPopup}
        setVisible={setisSingleViewPopup}
        showCloseButton={true}
        width={'60vw'}
      >
        <CompositePopupTable
          skuSelected={setSelectedSkuType}
          onClientSelect={setSelectedClient}
          pagination={pagination}
          setSearchQuery={setSearchQuery}
          setPagination={setPagination}
          limit={limit}
          setLimit={setLimit}
          setRefresh={setRefresh}
          setVisible={setisSingleViewPopup}
          checkedValue={setCheckboxSelectedArray}
          skuListTable={skuListTable}
        />
      </PopUp>

     {/*<ModifiedPopup
  header="Selected SKU"
  visible={isSingleViewPopupForType}
  setVisible={handleClosePopup}
  showCloseButton={true}
  width="60vw"
>
  {skuComponents[selectedSkuTypePopup] || (
    <div className="text-gray-500">No view available for this SKU type</div>
  )}
</ModifiedPopup>*/}

      {/*popup for client create*/}
      {!isDrawerOpen && (
                 <PopUp
                        header={'Select Client/Vendor'}
                        visible={isPopupOpen}
                        setVisible={setPopupOpen}
                        showCloseButton={true}
                        width={'35vw'}
                      >
                <SelectionCards
      selectionFrame={selectionFrame}
      selected={selected}
      onSelect={handleSelectAction}
    />
                </PopUp>
            )}

<PopUp
                        header={'Select Client/Vendor'}
                        visible={isDrawerOpen}
                        setVisible={setDrawerOpen}
                        showCloseButton={true}
                        width={'1200px'}
                        height={"700px"}
                      >
              {/* Pass handleCloseDrawer as a prop to ClientForm */}
              <ClientForm
                entity_type={entityType}
                refreshClients={refreshClients}
                closeDrawerDuringAdd={() => handleCloseDrawer(false)}
                resetForm={isDrawerOpen}
                submitFromRsc={submitFromRsc}
                setDrawerOpen={setDrawerOpen}
                isDrawerOpen={isDrawerOpen}
                setMessage={setMessage}
              />
          </PopUp>
          <PopUp
        header={'Select Route'}
        visible={isSingleViewPopupRoute}
        setVisible={setisSingleViewPopupRoute}
        showCloseButton={true}
        width={'60vw'}
      >
        <RoutePopup  editTag={editTag} addNewSkuData={addNewSkuData}   fullRouteResponse={fullRouteResponse} setisSingleViewPopupRoute={setisSingleViewPopupRoute} />
      </PopUp>

    </div>
  )
}

export default Composite
