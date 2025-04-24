import Input from '../../components/New/Input'
import { BsChevronDown } from 'react-icons/bs'
import CIcon from '@coreui/icons-react'
import { cilChevronCircleDownAlt, cilChevronDoubleDown, cilPencil, cilTrash } from '@coreui/icons'
import DiePopupTable from './DiePopupTable'
import PopUp from '../../components/New/PopUp'
import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import PlyToggle from '../../components/New/PlyToggle'
import vendorImg from '../../assets/images/vendor.png'
import clientImg from '../../assets/images/client.jpg'
import ClientForm from '../Client/ClientForm'
import SelectionCards from '../../components/New/SelectionCards'
import ChipSelectorWithBrowse from '../../components/New/ChipSelectorWithBrowse'
import RoutePopup from './RoutePopup'
import { useDispatch, useSelector } from 'react-redux'
import apiMethods from '../../api/config'

function DieCutBox({
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
  const [isSingleViewPopup, setisSingleViewPopup] = useState(false)
  const [selectedDiePopup, setSelectedDiePopup] = useState(null)
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
  const handleBrowseClick = () => {
    setisSingleViewPopup(true)
  }
  
  useEffect(() => {
    if (selectedDiePopup?.name) {
      setAddNewSkuData((prev) => ({
        ...prev,
        select_dies: selectedDiePopup.name,
      }))
    }
  }, [selectedDiePopup])
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
          {/*<div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">SKU Type</label>
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
                      className={`p-2 cursor-pointer w-full ${editTag ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'}`}
                      onClick={!editTag ? () => handleSelect(option) : undefined}
                    >
                      {option.sku_type}
                    </li>
                  </div>
                ))}
              </ul>
            )}
              
          </div>*/}
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
            value={addNewSkuData.client || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>
              Select
            </option>
            {client?.map((item, index) => (
              <option key={index} value={item.display_name}>
                {item.display_name}
              </option>
            ))}
                                        <option value="add_client">➕ Add Client</option>

          </select>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-3 gap-6 p-6 mt-6 border border-gray-200 rounded-lg">
        {/*<div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2">Ply</label>
          <select
            name="ply"
            id="ply"
            value={addNewSkuData.ply}
            onChange={(e) => {
              const selectedPly = Number(e.target.value)
              updateSkuValues(selectedPly)
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="" hidden>
              Select Number of Layers
            </option>
            <option value={2}>2 Ply</option>
            <option value={3}>3 Ply</option>
            <option value={5}>5 Ply</option>
            <option value={7}>7 Ply</option>
            <option value={9}>9 Ply</option>
          </select>
        </div>*/}
          <PlyToggle
  value={addNewSkuData.ply}
  onChange={(selectedPly) => updateSkuValues(selectedPly)}
/>

        <div>
          <Input
            skuName="UPS"
            id="ups"
            name="ups"
            value={addNewSkuData.ups}
            onChange={handleChange}
            requiredSymbol={true}
            //placeholder="UPS"
          />
        </div>

        <div>
          <label className="block text-[16px] font-medium text-gray-700 mb-2 after:content-['*'] after:text-red-500 after:ml-1">Die</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="select_dies"
              id="select_dies"
              value={addNewSkuData.select_dies || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Select"
              readOnly={true}
            />
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-500 transition-colors"
              onClick={handleBrowseClick}
            >
              Browse
            </button>
          </div>
        </div>

        <div>
          <Input
            skuName="Customer Reference"
            id="customer_reference"
            name="customer_reference"
            value={addNewSkuData.customer_reference}
            onChange={handleChange}
            //placeholder="Customer Reference"
            requiredSymbol={true}
          />
        </div>

        <div>
          <Input
            skuName="Reference #"
            id="reference_number"
            name="reference_number"
            value={addNewSkuData.reference_number}
            onChange={handleChange}
            //placeholder="Reference Number"
            requiredSymbol={true}
          />
        </div>

        <div>
          <Input
            skuName="Internal ID"
            id="internal_id"
            name="internal_id"
            value={addNewSkuData.internal_id}
            onChange={handleChange}
            //placeholder="Internal ID"
            requiredSymbol={true}
          />
        </div>

        <div>
          <Input
            skuName="Board Size (cm²)"
            id="board_size_cm2"
            name="board_size_cm2"
            value={addNewSkuData.board_size_cm2}
            onChange={handleChange}
            //placeholder="Board Size"
            requiredSymbol={true}
          />
        </div>

        <div>
          <Input
            skuName="Deckle Size"
            id="deckle_size"
            name="deckle_size"
            value={addNewSkuData.deckle_size}
            onChange={handleChange}
            //placeholder="Deckle Size"
            requiredSymbol={true}
          />
        </div>

        <div>
          <Input
            skuName="Minimum Order Level"
            id="minimum_order_level"
            name="minimum_order_level"
            type="number"
            value={addNewSkuData.minimum_order_level}
            onChange={handleChange}
            requiredSymbol={true}
            //placeholder="Minimum Order Level"
          />
        </div>


        <ChipSelectorWithBrowse
          label="Route"
          required={true}
          selectedIds={selectedRouteIds1}
          allOptions={displayAsChips}
          onRemoveChip={handleRemoveChip}
          onBrowseClick={handleBrowseClickRoute}
        />
        
      </div>

      <PopUp
        header={'Select SKU'}
        visible={isSingleViewPopup}
        setVisible={setisSingleViewPopup}
        showCloseButton={true}
        width={'60vw'}
      >
        <DiePopupTable
          setSelectedDiePopup={setSelectedDiePopup}
          selectedDiePopup={selectedDiePopup}
          setisSingleViewPopup={setisSingleViewPopup}
          client={client}
        />
      </PopUp>



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

export default DieCutBox