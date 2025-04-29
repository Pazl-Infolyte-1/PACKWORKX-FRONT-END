import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash, cilX } from '@coreui/icons'
import { useEffect, useRef, useState } from 'react'
import SelectionCards from '../../components/New/SelectionCards'
import ClientForm from '../Client/ClientForm'
import vendorImg from '../../assets/images/vendor.png'
import clientImg from '../../assets/images/client.jpg'
import PopUp from '../../components/New/PopUp'
import { useDispatch, useSelector } from 'react-redux'
import RoutePopup from './RoutePopup'
import ChipSelectorWithBrowse from '../../components/New/ChipSelectorWithBrowse'
import apiMethods from '../../api/config'

function CustomItem({
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
  updateSkuValues,
  isopenval,
  compositeSelect,
  setPopupOpen,
  isPopupOpen,
  message,
  setMessage
}) {
  const [tagFields, setTagFields] = useState([]);
  const [editingLabelIndex, setEditingLabelIndex] = useState(null);
const [selected, setSelected] = useState('vendor')
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [entityType, setEntityType] = useState('') // State to hold entity_type
  const [submitFromRsc, setSubmitFromRsc] = useState(true)
  const dispatch = useDispatch()
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

  useEffect(() => {
    const ply = 2
    setAddNewSkuData((prev) => ({ ...prev, ply }))
  }, [])
  
  useEffect(() => {
    if (editTag && Array.isArray(addNewSkuData?.tags)) {
      setTagInput(addNewSkuData.tags.join(''))
    }
  }, [editTag]) // only run when editTag toggles



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
  const handleAddField = () => {
    const newIndex = tagFields.length + 1;
    const newLabel = `label${newIndex}`;
    setTagFields((prev) => [...prev, { label: newLabel, value: '' }]);
    updateTags([...tagFields, { label: newLabel, value: '' }]);
  };

  const handleTagChange = (index, key, newValue) => {
    const updatedFields = [...tagFields];
    updatedFields[index][key] = newValue;
    setTagFields(updatedFields);
    updateTags(updatedFields);
  };

  const handleLabelEdit = (index, newLabel) => {
    const updatedFields = [...tagFields];
    updatedFields[index].label = newLabel;
    setTagFields(updatedFields);
    updateTags(updatedFields);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...tagFields];
    updatedFields.splice(index, 1);
    setTagFields(updatedFields);
    updateTags(updatedFields);
  };

  const updateTags = (fields) => {
    const tagsObj = fields.reduce((acc, curr) => {
      if (curr.label) acc[curr.label] = curr.value;
      return acc;
    }, {});
    setAddNewSkuData((prev) => ({ ...prev, tags: tagsObj }));
  };
  useEffect(() => {
    if (editTag && addNewSkuData.tags) {
      const initialFields = Object.entries(addNewSkuData.tags).map(([label, value]) => ({
        label,
        value,
      }));
      setTagFields(initialFields);
    }
  }, [editTag, addNewSkuData.tags]);

  useEffect(() => {
    if (compositeSelect) {
      setAddNewSkuData((prev) => ({
        ...prev,
        sku_type: compositeSelect,
      }));
    }
  }, [compositeSelect]);
  


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
              
          
  return (
    <div className="rounded-lg">
      {/* Top header fields */}
      <div className="grid grid-cols-3 gap-6 p-6 border border-gray-200 rounded-lg">
        <div>
        <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">SKU Type</label>
          <div className="relative w-full" ref={dropdownRef}>
            <div
              className="p-2 h-10 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center bg-white hover:border-blue-500 transition-colors"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span className="text-gray-800">{addNewSkuData?.sku_type || 'Select Type'}</span>
              <BsChevronDown className={`transition-transform text-gray-600 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
              <ul
                className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md z-20 shadow-lg"
              >
          {skuType.map((option) => (
  <div key={option.id} className="flex justify-between mx-2 hover:bg-gray-50">
    <li
      className={`p-2 w-full cursor-pointer
        ${
          compositeSelect || editTag
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-800'
        }
        ${compositeSelect === option.sku_type ? 'bg-gray-200 font-semibold' : ''}`
      }
      onClick={
        !compositeSelect && !editTag ? () => handleSelect(option) : undefined
      }
    >
      {option.sku_type}
    </li>
  </div>
))}



              </ul>
            )}
          </div>
        </div>
        <div>
            <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">SKU Name</label>
            <input
              id="sku_name"
              name="sku_name"
              value={addNewSkuData.sku_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Client Name</label>
          <select
            name="client"
            id="client"
            disabled={clientDiasble}
            //value={filteredClient ? filteredClient.client_id : addNewSkuData.client || ''}
            value={addNewSkuData.client_id || null}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
      <div className="grid grid-cols-3 gap-6 p-6 mt-6 border border-gray-200 rounded-lg">
        <Input
          skuName="Estimate"
          id="estimate_composite_item"
          name="estimate_composite_item"
          value={addNewSkuData?.estimate_composite_item}
          onChange={handleChange}
          //placeholder="Estimate"
          requiredSymbol={true}
        />

        <Input
          skuName="Default SKU Details"
          id="default_sku_details"
          name="default_sku_details"
          value={addNewSkuData?.default_sku_details}
          onChange={handleChange}
          //placeholder="Default SKU Details"
          requiredSymbol={true}
        />

        <Input
          skuName="Description"
          id="description"
          name="description"
          value={addNewSkuData.description}
          onChange={handleChange}
          //placeholder="Description"
          requiredSymbol={true}
        />

         {/*<ChipSelectorWithBrowse
                  label="Route"
                  required={true}
                  selectedIds={selectedRouteIds1}
                  allOptions={displayAsChips}
                  onRemoveChip={handleRemoveChip}
                  onBrowseClick={handleBrowseClickRoute}
                />
                */}
 <div className="col-span-3">
    <button
      type="button"
      onClick={handleAddField}
      className="bg-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-400 transition-colors"
    >
      + Add Fields
    </button>
  </div>

  {/* Render Dynamic Tag Fields */}
  {tagFields.map((field, index) => (
    <div
      key={index}
      className="relative flex flex-col gap-1"
    >
      {/* Label title */}
      <label className="text-sm font-medium text-gray-700">
        {editingLabelIndex === index ? (
          <input
            type="text"
            value={field.label}
            onChange={(e) => handleLabelEdit(index, e.target.value)}
            onBlur={() => setEditingLabelIndex(null)}
            className="border rounded px-2 py-1 text-sm w-28"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer break-words w-28 inline-block text-[16px] font-medium"
            onClick={() => setEditingLabelIndex(index)}
          >
            {field.label}
          </span>
        )}
      </label>

      {/* Input field */}
      <input
        type="text"
        placeholder="Value"
        value={field.value}
        onChange={(e) => handleTagChange(index, 'value', e.target.value)}
        className="w-full p-2 mt-2 shadow-md border-l-2 rounded-md"
      />

      {/* Remove icon */}
      <CIcon
        onClick={() => handleRemoveField(index)}
        icon={cilX}
        size="sm"
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer"
      />
    </div>
  ))}

      </div>
   
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

export default CustomItem