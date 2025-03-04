
import React from "react";
import { FaSearch, FaCircle, FaFillDrip, FaThumbtack, FaStar, FaShieldAlt, FaUsers } from "react-icons/fa";
import { BiDollarCircle } from "react-icons/bi";
import { CgWorkAlt } from "react-icons/cg";
import CommonPagination from '../../components/New/Pagination';
import { FiFilter } from "react-icons/fi";

const InventoryDashboard = () => {
    return (
        <div className="bg-gray-100 p-4">
            <div className="grid grid-cols-3 gap-6">
                <StockCard title="Reels" quantity="1200" status="Enough Stock" bgColor="bg-green-100" textColor="text-green-800" buttonColor="bg-green-700" icon={<BiDollarCircle />} />
                <StockCard title="Corrugation Glue" quantity="300" status="Low Stock" bgColor="bg-yellow-100" textColor="text-yellow-800" buttonColor="bg-yellow-700" icon={<FaStar />} />
                <StockCard title="Pasting Glue" quantity="50" status="Out of Stock" bgColor="bg-red-100" textColor="text-red-800" buttonColor="bg-red-700" icon={<CgWorkAlt />} />
                <StockCard title="Finished Goods" quantity="600" bgColor="bg-gray-200" textColor="text-gray-700" buttonColor="bg-gray-700" icon={<FaShieldAlt />} />
                <StockCard title="Semi Finished Goods" quantity="450" bgColor="bg-indigo-100" textColor="text-indigo-700" buttonColor="bg-indigo-700" icon={<FaUsers />} />
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
                    <h5 className="text-blue-800">Total Stock Value</h5>
                    <h3 className="text-2xl font-bold text-blue-800">$50,000</h3>
                </div>
            </div>
            <MaterialSection />
        </div>
    );
};

const StockCard = ({ title, quantity, status, bgColor, textColor, buttonColor, icon }) => (
    <div className={`flex justify-between p-3 rounded-lg shadow-md ${bgColor} ${textColor} min-h-[151.2px]`}>
        <div>
            <h6 style={{marginBottom:'0'}}>{title}</h6>
            <p style={{marginBottom:'0'}}>Total Quantity: {quantity}</p>
            {status && <p style={{marginBottom:'0'}}>Status: {status}</p>}
            <button className={`text-white text-sm px-4 py-1  rounded ${buttonColor} mt-4`}>View Info</button>
        </div>
        <div className={`text-3xl  p-2  `}>{icon}</div>
    </div>
);

const ButtonCommon = ({ children }) => (
    <span className="text-white px-3 py-1 rounded shadow bg-purple-600 cursor-pointer">{children}</span>
);

const MaterialSection = () => (
    <section className="bg-white p-4 mt-4 rounded-lg shadow-md">
        <h6>Raw Materials Types</h6>
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="relative flex items-center shadow-md mt-2">
                    <input type="text" placeholder="Search SKU by name or ID" className="border border-gray-300 p-2 rounded w-72" />
                    <FaSearch className="absolute right-3 text-gray-500" />
                </div>
                <FiFilter className="text-xl text-gray-700" />
            </div>
            <div className="flex gap-2">
                <ButtonCommon>Saved Filter</ButtonCommon>
                <ButtonCommon>Bulk Upload</ButtonCommon>
            </div>
        </div>
        <MaterialTable />
        <div className="flex justify-end items-center gap-4 mt-4">
            <CommonPagination count={5} page={1} onChange={() => {}} />
        </div>
    </section>
);

const MaterialTable = () => (
    <div className="p-2 border border-gray-300 my-5">
        <table className="w-full border-collapse shadow-md border border-gray-300">
            <tbody>
                <MaterialRow icon={<FaCircle className="text-blue-500" />} name="Reel - Standard" type="Standard" available="180" reorder="500" updated="2023-10-01" />
                <MaterialRow icon={<FaFillDrip className="text-pink-500" />} name="Glue - Pasting" type="Normal" available="200" reorder="100" updated="2023-10-01" />
                <MaterialRow icon={<FaThumbtack className="text-indigo-500" />} name="Pin - Small" type="Medium" available="25" reorder="200" updated="2023-10-01" />
            </tbody>
        </table>
        
    </div>
);

const MaterialRow = ({ icon, name, type, available, reorder, updated }) => (
    <tr className="border-b border-gray-300 text-left">
        <td className="p-2 flex items-center gap-2">{icon} <span>{name}</span></td>
        <td className="p-2">Type: {type}</td>
        <td className="p-2">Available: {available}</td>
        <td className="p-2">Reorder Level: {reorder}</td>
        <td className="p-2">Last Updated: {updated}</td>
    </tr>
);

export default InventoryDashboard;
