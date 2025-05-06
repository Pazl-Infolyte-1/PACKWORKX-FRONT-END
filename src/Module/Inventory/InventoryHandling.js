import React, { useState, useEffect, useMemo } from 'react'
import {
  FaShieldAlt,
  FaStar,
  FaUsers,
} from 'react-icons/fa'
import { BiDollarCircle } from 'react-icons/bi'
import { CgWorkAlt } from 'react-icons/cg'
import CommonPagination from '../../components/New/Pagination'
import { FiFilter } from 'react-icons/fi'
import ActionButton from '../../components/New/ActionButton'
import SearchBar from '../../components/New/SearchBar'
import apiMethods from '../../api/config';
import ReelsDetails from './ReelsDetails'
import RawMaterialsDetails from './RawMaterialsDetails'
import CorrugationGlueDetails from './CorrugationGlueDetails'
import PastingGlueDetails from './PastingGlueDetails'
import FinishedGoodsDetails from './FinishedGoodsDetails'
import { cilDog } from '@coreui/icons'


const InventoryDashboard = () => {
  const [isfinishedgoodpopup, setfinishedgoodpopup] = useState(false)
  const [reelsgoodpopup, setreelsgoodpopup] = useState(false)
  const [inventoryData, setInventoryData] = useState([])
  const [itemData, setItemData] = useState([])
  const [selectedType, setSelectedType] = useState('Raw Materials')
  const [rawMaterialPopup, setRawMaterialPopup] = useState(false);
  const [corrugationgluePopup, setCorrugationGluePopup] = useState(false);
  const [pastinggluePopup, setPastingGlueDetailsPopup] = useState(false);
  
  const [paginationParams, setPaginationParams] = useState({ currentPage: 1, pageSize: 10 });
  const [totalPages, setTotalPages] = useState(1);
  // const { searchQuery, filteredSearchData } = useSearch();
  const [status, setStatus] = useState('');
  
  
  


  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await apiMethods.getinventory();
        if (response.data.success) {
          setInventoryData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      }
    };
    fetchInventory();
  }, [paginationParams]);

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
    });  };

  const handlePageChange = (event, newPage) => {
    setPaginationParams(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };



  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await apiMethods.getItemList({
          page: paginationParams.currentPage,
          limit: paginationParams.pageSize,
          // client: searchQuery,
          sales_status: status,
        });
        if (response.data.success) {
          setItemData(response.data.data);
          setTotalPages(Math.ceil(response.data.totalItems / paginationParams.pageSize)); 

        }
      } catch (error) {
        console.error('Failed to fetch item data:', error);
      }
    };
    fetchItemData();
  }, []);

  const normalize = str => str?.toLowerCase().replace(/[\s\-]/g, '');

  const inventorySummary = useMemo(() => {
    const summary = {};
    inventoryData.forEach(item => {  
      const type = item.inventory_type || 'Unknown';  
      console.log(item.inventory_type)    
      const qty = parseFloat(item.quantity_available || 0);
      if (!summary[type]) {
        summary[type] = { total: 0 };
      }
      summary[type].total += qty;
    });
    return summary;
  }, [inventoryData]);


  

  const getMinStockLevel = (type) => {
    const normalizedType = normalize(type);
    const item = itemData.find(i => normalize(i?.item_type) === normalizedType);
    return item?.min_stock_level ?? 500;
  };

  const getStatus = (type) => {
    const total = inventorySummary[type]?.total || 0;
    const minLevel = getMinStockLevel(type);
    if (total > minLevel) return "Enough Stock";
    if (total > 0) return "Low Stock";
    return "Out of Stock";
  };

  const totalStockValue = useMemo(() => {
    let total = 0;
    inventoryData.forEach(invItem => {
      const item = itemData.find(i => i.id === invItem.item_id);
      const qty = parseFloat(invItem.quantity_available || 0);
      const cost = parseFloat(item?.standard_cost || 0);
      total += qty * cost;
    });
    return total.toFixed(2);
  }, [inventoryData, itemData]);

  const handleCardClick = (modalName, type) => {
    setSelectedType(type);
    if (modalName === "finished_goods") {
      setfinishedgoodpopup(true);
    } else if (modalName === "reels_details") {
      setreelsgoodpopup(true);
    }else if (modalName === "raw_material") {
      setRawMaterialPopup(true);
    }else if (modalName === "corrugation_glue") {
      setCorrugationGluePopup(true);
    }else if (modalName === "pasting_glue") {
      setPastingGlueDetailsPopup(true);
    }
  };

  const MaterialTable = ({ data, selectedType }) => {
    const filteredItems = useMemo(() => {
      const normalizedType = normalize(selectedType);
      return data.filter(item => normalize(item.item_type) === normalizedType);
    }, [data, selectedType]);

    const rawMaterialsList = inventoryData.filter(item => 
      normalize(item.inventory_type) === "rawmaterials");

    const relatedItemData = itemData.filter(item =>
      rawMaterialsList.some(rm => rm.item_id === item.id)
    );
    console.log("check :", relatedItemData);
    

    return (
      <div className="p-2 border border-gray-300 my-4">
        {/* <h5 className="mb-2 text-lg font-bold text-gray-700">Details for: {selectedType}</h5> */}
        <table className="w-full border-collapse shadow-md border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">Item Name</th>
              <th className="p-2 text-left">Min Stock Level</th>
              <th className="p-2 text-left">Reorder Level</th>
              <th className="p-2 text-left">Standard Cost</th>
              <th className="p-2 text-left">Manufacturer</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <tr key={item.item_id} className="border-b border-gray-300">
                  <td className="p-2">{item.item_name}</td>
                  <td className="p-2">{item.min_stock_level}</td>
                  <td className="p-2">{item.reorder_level}</td>
                  <td className="p-2">{item.standard_cost}</td>
                  <td className="p-2">{item.manufacturer}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No data available for {selectedType}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  const StockCard = ({ title, quantity, status, bgColor, textColor, buttonColor, icon, modalname }) => (
    <div onClick={() => setSelectedType(title)} className={`flex justify-between p-2 rounded-lg shadow-md ${bgColor} ${textColor} min-h-[130px]`}>
      <div>
        <h6>{title}</h6>
        <p>Total Quantity: {quantity}</p>
        {status && <p>Status: {status}</p>}
        <button
          className={`text-white text-sm px-4 py-1 rounded ${buttonColor} mt-3`}
          onClick={() => handleCardClick(modalname, title)}
        >
          View Info
        </button>
      </div>
      <div className="text-3xl p-2">{icon}</div>
    </div>
  )

  return (
    <div className="bg-gray-100 p-2">
      <div className="grid grid-cols-3 gap-3">
      {console.log('inventorySummary', inventorySummary)}

        {/* <StockCard title="Raw Materials" quantity={inventorySummary["raw-materials"]?.total || 0} status={getStatus("Raw Materials")} bgColor="bg-indigo-100" textColor="text-indigo-700" buttonColor="bg-indigo-700" icon={<FaUsers />} modalname="raw_material" /> */}
        <StockCard title="Reels" quantity={inventorySummary["reels"]?.total || 0} status={getStatus("Reels")} bgColor="bg-green-100" textColor="text-green-800" buttonColor="bg-green-700" icon={<BiDollarCircle />} modalname="reels_details" />
        <StockCard title="Corrugation Glue" quantity={inventorySummary["Corrugation Glue"]?.total || 0} status={getStatus("Corrugation Glue")} bgColor="bg-yellow-100" textColor="text-yellow-800" buttonColor="bg-yellow-700" icon={<FaStar />} modalname="corrugation_glue" />
        <StockCard title="Pasting Glue" quantity={inventorySummary["Pasting Glue"]?.total || 0} status={getStatus("Pasting Glue")} bgColor="bg-red-100" textColor="text-red-800" buttonColor="bg-red-700" icon={<CgWorkAlt />} modalname="pasting_glue" />
        <StockCard title="Finished Goods" quantity={inventorySummary["Finished Goods"]?.total || 0} status={getStatus("Finished Goods")} bgColor="bg-gray-200" textColor="text-gray-700" buttonColor="bg-gray-700" icon={<FaShieldAlt />} modalname="finished_goods" />
        <StockCard title="Semi Finished Goods" quantity={inventorySummary["Semi Finished Goods"]?.total || 0} status={getStatus("Semi Finished Goods")} bgColor="bg-indigo-100" textColor="text-indigo-700" buttonColor="bg-indigo-700" icon={<FaUsers />} modalname="finished_goods" />
        <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg shadow-md">
          <h6 className="text-blue-800">Total Stock Value</h6>
          <h5 className="text-2xl font-bold text-blue-800">${totalStockValue}</h5>
        </div>
      </div>

      <section className="bg-white p-2 mt-2 rounded-lg shadow-md">
        <h5>{selectedType} Details</h5>
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
        <MaterialTable data={itemData} selectedType={selectedType} />

        <div className="flex justify-end items-center gap-4 mt-2">
          <CommonPagination  
            count={totalPages} 
            page={paginationParams.currentPage}
            onChange={handlePageChange}
            onLimitChange={handleLimitChange}
            limit={paginationParams.pageSize}
          />
        </div>
      </section>

      <FinishedGoodsDetails visible={isfinishedgoodpopup} setVisible={() => setfinishedgoodpopup(false)} />
      <ReelsDetails visible={reelsgoodpopup} setVisible={() => setreelsgoodpopup(false)} />
      <RawMaterialsDetails 
          visible={rawMaterialPopup} 
          setVisible={() => setRawMaterialPopup(false)} 
          rawMaterials={inventoryData.filter(item => normalize(item.inventory_type) === "rawmaterials")}
          itemdata={itemData}
      />
      <CorrugationGlueDetails 
      visible={corrugationgluePopup} setVisible={() => setCorrugationGluePopup(false)}      />


      <PastingGlueDetails visible={pastinggluePopup} setVisible={() => setPastingGlueDetailsPopup(false)} />


    </div>
  )
}

export default InventoryDashboard;
