import { useEffect, useState } from "react"
import apiMethods from "../../api/config"
import InventoryTable from "./InventoryTable"
import { BiDollarCircle } from "react-icons/bi"
import { FaShieldAlt, FaStar, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { CgWorkAlt } from "react-icons/cg"
import { MdCategory, MdPushPin } from "react-icons/md"
import { cilArrowTop, cilSave } from "@coreui/icons"
import CIcon from '@coreui/icons-react';
import ContentHeader from "../../components/New/ContentHeader"
import { useNavigate } from "react-router-dom"



const InventoryMain=()=>{

	  const [inventoryData, setInventoryData] = useState([])
	  const [subCategory,setSubCategory]=useState([])
	  	  const [category,setCategory]=useState([])
		  	  	  const [categoryId,setCategoryId]=useState(null)
const icons = [FaShieldAlt, FaStar, FaUsers, FaChevronDown, FaChevronUp];
const [page, setPage] = useState(1); // default to page 1


		  const navigate=useNavigate()
  const backgroundColors = [
   'bg-[#22c35c]',
'bg-[#6366f1]',
'bg-[#6b7380]',
'bg-[#a755f7]',
//'bg-[#3b82f6]',
    'bg-red-100',
    'bg-gray-100',
  ];

    const backgroundColorsBox = [
'#18a24d',
'#5046e4',
'#4c5564',
'#9334ea',
  ];

useEffect(() => {
  const fetchInventory = async () => {
    try {
      const response = await apiMethods.getinventoryWithParams(categoryId, page);
      if (response?.data?.success) {
        setInventoryData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };
  fetchInventory();
}, [categoryId, page]); // now also runs when `page` changes

	
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


	 useEffect(() => {
  const fetchCategoryData = async () => {
    try {
      const [categoryRes, subCategoryRes] = await Promise.all([
        apiMethods.getCategoryList(),
        apiMethods.getSubCategory(),
      ]);

      setCategory(categoryRes.data.data);
      setSubCategory(subCategoryRes.data.data);
    } catch (error) {
      setAlerts([
        {
          severity: 'error',
          message: error?.response?.data?.message || 'Error fetching category data.',
        },
      ]);
    }
  };

  fetchCategoryData();
}, []);


console.log("category",category)
console.log("category",categoryId)

	return (
	<>
	  <ContentHeader
        heading="Inventory"
         onAddClick={() =>  navigate('/inventoryhandling/inventory_form', {
    state: { fromInventory: true }
  })}
          />

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full mt-2">
  {category.map((item, index) => {
  const IconComponent = icons[index % icons.length];
  return (
    <div
      key={item.id}
      onClick={() => setCategoryId(item.id)}
      className={`p-2 rounded-xl shadow-md text-center capitalize flex items-center justify-between w-full cursor-pointer ${
        backgroundColors[index % backgroundColors.length]
      }`}
    >
      <div className="flex items-center pl-2">
        <IconComponent className="text-white mr-2" />
        <span className="font-bold text-white">
          {item.category_name.replace(/-/g, ' ')}
        </span>
      </div>
      <span
       className={`size-8 rounded flex items-center justify-center mr-2 border border-white shadow-lg ${
    [
      'bg-green-700',
      'bg-indigo-700',
      'bg-slate-700',
      'bg-purple-700'
    ][index % 4]
  }`}
      >
        {(item.id === 1 || item.id === 4) ? (
          <FaChevronDown className="text-sm text-white" />
        ) : (
          <span className="text-sm text-white">0</span>
        )}
      </span>
    </div>
  );
})}


  {/* Total Stock Value Card */}
  <div className="bg-blue-600 p-4 rounded-xl shadow-md text-center font-bold capitalize flex items-center justify-center gap-2 w-full text-white">
    <span>Total Stock Value</span>
  </div>
</div>



<div className="flex justify-end w-full mt-3">
  <button
    onClick={() => setCategoryId(null)}
    className="py-1 px-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
  >
    Clear
  </button>
</div>

	<InventoryTable inventoryData={inventoryData}/>


	</>
	)
}

export default InventoryMain