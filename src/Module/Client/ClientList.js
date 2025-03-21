import React, { useEffect, useState, useCallback } from 'react'
import Drawer from '../../components/Drawer/Drawer'
import { IoFilter, IoFilterOutline, IoSearch } from 'react-icons/io5'
import apiMethods from '../../api/config'
import CommonPagination from '../../components/New/Pagination'
import ClientTable from './ClientTable'
import ClientForm from './ClientForm'
import ActionButton from '../../components/New/ActionButton'
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup'
import vendorImg from "../../assets/images/vendor.png"
import clientImg from "../../assets/images/client.jpg"
import CustomAlert from '../../components/New/CustomAlert'
import DynamicPagination from '../../components/New/DynamicPagination'
import { FaFilter } from 'react-icons/fa'
import { FaChevronDown } from "react-icons/fa";

function ClientList() {
  const [selected, setSelected] = useState("vendor");
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [reloadData, setReloadData] = useState(false); //Trigger reload
  const [entityType, setEntityType] = useState(""); // State to hold entity_type

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [data, setData] = useState([]) // Stores all fetched data
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [entriesPerPage, setEntriesPerPage] = useState(5); // Default value 5
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  //const totalPages = Math.ceil(data.length / entriesPerPage) || 1; // Ensure total pages > 0
  const toggleFilterPopup = () => setIsFilterOpen(!isFilterOpen);

  const handleEntriesChange = (newEntries) => {
    setEntriesPerPage(newEntries);
    setCurrentPage(1); // Reset to page 1 when changing entries per page
  };
  
  const handlePageChange = (event, newPage) => {
    console.log("Page changed to:", newPage);
    setCurrentPage(newPage);
  };
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  console.log("curr pg",currentPage)
  //const handlePageChange = (event, newPage) => {
  //  setCurrentPage(newPage);
  //};
  //const handleEntriesChange = (newEntries) => {
  //  setEntriesPerPage(newEntries)
  //  console.log('Updated Entries Per Page:', newEntries)
  //  //setCurrentPage(1) // Reset to first page when changing entries
  //}
  const selectionFrame = {
    vendor: {
      id: 1,
      name: "vendor",
      image: vendorImg,
    },
    client: {
      id: 2,
      name: "client",
      image: clientImg,
    },
  };

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const queryParams = {
          ...(searchQuery && { search: searchQuery }), // Include search if present
          limit: entriesPerPage, // Number of entries per page
          page: currentPage, // Add page number
          entity_type:selectedFilter
        };
  
        const response = await apiMethods.getClients(queryParams);
        console.log("clientData:", response);
        setData(response?.data || []);
        setTotalPage(response.totalPages);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
  
    fetchClientData();
  }, [reloadData, searchQuery, entriesPerPage, currentPage,selectedFilter]); // Depend on these values
  
  
  

  const refreshClients = () => {
    setReloadData((prev) => !prev); //  Toggle state to trigger `useEffect`
  };

  //const totalPages = Math.ceil(data?.length / rowsPerPage)
 
  const handleSelection = (selection) => {
    const optionValue = selectionFrame[selection].id;
    console.log(`Selected ID: ${optionValue}`);
  
    if (optionValue === 2) {
      setEntityType("Client")
      setPopupOpen(false);
      setDrawerOpen(true);
    } else if(optionValue === 1) {
      setEntityType("Vendor")
      setPopupOpen(false);
      setDrawerOpen(true);
    }else{
      console.log("option not selected")
    }
  };
  
  // Updates selection but does NOT trigger `handleSelection`
  const handleSelectAction = (selection) => {
    setSelected(selection);
    setTriggerSelection(true); // Ensures it runs handleSelection

  };
  
  // Handles key events

  let entity_type = ""
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      handleSelectAction("client");
      setEntityType("Client"); // Update state
    } else if (event.key === "ArrowLeft") {
      handleSelectAction("vendor");
      setEntityType("Vendor"); // Update state
    } else if (event.key === "Enter") {
      console.log("Enter Pressed: Executing Selection");
      setTriggerSelection(true); // Mark that Enter was pressed
    }
  };
  
  // Ensures `handleSelection` runs AFTER `selected` updates
  useEffect(() => {
    if (triggerSelection) {
      handleSelection(selected);
      setTriggerSelection(false); // Reset trigger
    }
  }, [selected, triggerSelection]); // Runs when `selected` or `triggerSelection` changes
  
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []); // Runs once on mount
  
  //const handlePageChange = useCallback((event, value) => setCurrentPage(value), [])
  //console.log("curr rows",currentRows)

  const downloadClientExcelSheet = async () => {
    try {
      const queryParams = {
        ...(searchQuery && { search: searchQuery }),
        entity_type:selectedFilter
      };

      const response = await apiMethods.downloadClientExcel(queryParams);
  
      // Create a Blob from the response
      const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary link element
      const a = document.createElement("a");
      a.href = url;
      a.download = "clients.xlsx"; // Set the downloaded file name
      document.body.appendChild(a);
      a.click();
  
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };
  
  //const alertsData = [
  //  { severity: "success", message: "This is a success Alert." },
  //];
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="w-full h-[40px] flex justify-between items-center">
        <h4>Clients/Vendors</h4>
      </div>
      {/* Search Bar & Actions */}
      <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
        <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
  {/* Search Input Container */}
  <div className="flex items-center h-[35px] w-[300px] gap-2 border rounded-md">
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
  </div>

  {/* Filter Icon */}
  {/*<FaFilter onClick={toggleFilterPopup} className="w-5 h-5 cursor-pointer text-gray-600 hover:text-gray-900" />*/}
  <div className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        type="button"
        className="inline-flex w-full justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 shadow-xs hover:bg-gray-50"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedFilter || "Entity"}
        <FaChevronDown className="size-4 text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
          <div className="py-1">
            <button
              className="block w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100"
              onClick={() => {
                setSelectedFilter("Client");
                setIsDropdownOpen(false);
                console.log("Selected Filter:", selectedFilter);
              }}
            >
              Client
            </button>
            <button
              className="block w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100"
              onClick={() => {
                setSelectedFilter("Vendor");
                setIsDropdownOpen(false);
                console.log("Selected Filter:", selectedFilter);
              }}
            >
              Vendor
            </button>
          </div>
        </div>
      )}
    </div>
</div>

          <div className="flex justify-center items-center gap-2">
            {/* <button className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto">
              Import
            </button> */}

            <ActionButton
            height="9"
            label="Import"
            />

            {/* <button
              className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto"
              onClick={downloadCSV}
            >
              Download
            </button> */}

            <ActionButton
            height={"9"}
            label={"Download"}
            //onClick={downloadCSV}
            onClick={downloadClientExcelSheet}
            />

            {/* <button
              className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto"
              onClick={() => setDrawerOpen(true)}
            >
              Add Client
            </button> */}

            <ActionButton
            height={"9"}
            label={"+ Create New"}
            //onClick={()=>setDrawerOpen(true)}
            onClick={()=>setPopupOpen(true)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-3 overflow-x-auto">
          <ClientTable refreshClients={refreshClients} clientdata={data} />
        </div>

        {/* Pagination Section */}
        
        <div className="flex justify-end items-center gap-4 mt-3">
          {/*<DynamicPagination count={totalPages} page={currentPage} onChange={handlePageChange} />*/}
          <DynamicPagination
         count={totalPage}
         page={currentPage}
         onPageChange={handlePageChange}
         entriesPerPage={entriesPerPage}
         onEntriesChange={handleEntriesChange}
      />
        </div>
        {/*<div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <CustomAlert alerts={alertsData} />
    </div>*/}
      </div>

      {/* Drawer */}

      {!isDrawerOpen && (
   <CustomPopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} width={"w-[500px]"} height={"230px"}>
   <div className="flex justify-center items-center space-x-12 p-6">
     {Object.keys(selectionFrame).map((key) => (
       <div
         key={key}
         className={`w-1/3 flex flex-col items-center border-4 p-2 cursor-pointer focus:outline-none ${
           selected === key ? "border-blue-200" : "border-gray-100"
         }`}
         onClick={() => handleSelectAction(key)} // Mouse Click Support
         onKeyDown={(event) => {
           if (event.key === "Enter") handleSelectAction(key); // Keyboard Support
         }}
         tabIndex={0} // Makes div focusable for keyboard navigation
         role="button" // Improves accessibility
       >
         <img src={selectionFrame[key].image} alt={selectionFrame[key].name} className="w-16 h-16 rounded-full" />
         <p className="mt-2 text-sm font-semibold">{selectionFrame[key].name}</p>
       </div>
     ))}
   </div>
 </CustomPopup>
)}
      
      <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} maxWidth={"1280px"}>
        {/* Pass handleCloseDrawer as a prop to ClientForm */}
        <ClientForm entity_type={entityType} refreshClients={refreshClients} closeDrawerDuringAdd={() => handleCloseDrawer(false)}/>
      </Drawer>


        </div>
  )
}

export default ClientList
