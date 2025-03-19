import React, { useEffect, useState, useCallback } from 'react'
import Drawer from '../../components/Drawer/Drawer'
import { IoSearch } from 'react-icons/io5'
import apiMethods from '../../api/config'
import CommonPagination from '../../components/New/Pagination'
import ClientTable from './ClientTable'
import ClientForm from './ClientForm'
import ActionButton from '../../components/New/ActionButton'
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup'
import vendorImg from "../../assets/images/vendor.png"
import clientImg from "../../assets/images/client.jpg"
import CustomAlert from '../../components/New/CustomAlert'

function ClientList() {
  const [selected, setSelected] = useState("vendor");
  const [triggerSelection, setTriggerSelection] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [data, setData] = useState([]) // Stores all fetched data
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };
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
        const response = await apiMethods.getClients()
        console.log('clientData:', response)
          setData(response?.data) // Assuming response.data is an array of client objects
          console.log("res.////",response.data)
      } catch (error) {
        console.error('Error fetching client data:', error)
      }
    }

    fetchClientData()
  }, [isPopupOpen])
  // Pagination Calculations
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = data?.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(data?.length / rowsPerPage)
 
  const handleSelection = (selection) => {
    const optionValue = selectionFrame[selection].id;
    console.log(`Selected ID: ${optionValue}`);
  
    if (optionValue === 2) {
      setPopupOpen(false);
      setDrawerOpen(true);
    } else {
      console.log("On vendor page");
    }
  };
  
  // Updates selection but does NOT trigger `handleSelection`
  const handleSelectAction = (selection) => {
    setSelected(selection);
    setTriggerSelection(true); // Ensures it runs handleSelection

  };
  
  // Handles key events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      handleSelectAction("client");
    } else if (event.key === "ArrowLeft") {
      handleSelectAction("vendor");
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
  
  const handlePageChange = useCallback((event, value) => setCurrentPage(value), [])
  console.log("curr rows",currentRows)

  // Function to Convert Table Data to CSV and Download
  const downloadCSV = async () => {
    if (!data?.length) {
      console.error('No data available to download')
      return
    }

    // Define the specific keys to extract
    const selectedKeys = [
      'first_name',
      'last_name',
      'display_name',
      'email',
      'mobile',
      'PAN',
      'created_at',
    ]

    // Function to format headers (Remove "_" and capitalize the first letter of each word)
    const formatHeader = (key) => {
      return key
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    }

    // Add CSV Headers (Formatted Column Names)
    const csvRows = []
    csvRows.push(selectedKeys.map(formatHeader).join(','))

    // Process Data Rows (Handling Async Format Date)
    const formattedData = await Promise.all(
      data?.map(async (row) => {
        const values = await Promise.all(
          selectedKeys.map(async (key) => {
            if (key === 'created_at') {
              return `"${(await apiMethods.formatDate(row[key])) || ''}"` // Await the async function
            }
            return `"${row[key] || ''}"`
          }),
        )
        return values.join(',')
      }),
    )

    csvRows.push(...formattedData)

    // Convert to CSV String
    const csvString = csvRows.join('\n')

    // Create Blob and Download File
    const blob = new Blob([csvString], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'filtered_client_data.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }
  //const alertsData = [
  //  { severity: "success", message: "This is a success Alert." },
  //];
  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="w-full h-[40px] flex justify-between items-center">
        <h4>Clients and Vendors</h4>
      </div>
      {/* Search Bar & Actions */}
      <div className="overflow-x-auto border border-gray-200 p-3 rounded-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center h-[35px] w-[300px] gap-2 border rounded-md">
            <div className="bg-white h-full w-[40px] flex justify-center items-center rounded-l-md">
              <IoSearch />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="outline-none h-full w-full rounded-r-md pl-2"
            />
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
            onClick={downloadCSV}
            />

            {/* <button
              className="h-9 flex items-center bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md border-none cursor-pointer ml-auto"
              onClick={() => setDrawerOpen(true)}
            >
              Add Client
            </button> */}

            <ActionButton
            height={"9"}
            label={"Add Client"}
            //onClick={()=>setDrawerOpen(true)}
            onClick={()=>setPopupOpen(true)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-3 overflow-x-auto">
          <ClientTable clientdata={data} />
        </div>

        {/* Pagination Section */}
        
        <div className="flex justify-end items-center gap-4 mt-3">
          <CommonPagination count={totalPages} page={currentPage} onChange={handlePageChange} />
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
        <ClientForm />
      </Drawer>
        </div>
  )
}

export default ClientList
