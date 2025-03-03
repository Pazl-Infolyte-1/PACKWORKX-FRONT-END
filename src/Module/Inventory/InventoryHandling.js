import React from "react";
import { FaSearch, FaCircle, FaFillDrip, FaThumbtack, FaStar, FaShieldAlt, FaUsers } from "react-icons/fa";
import { BiDollarCircle } from "react-icons/bi";
import { CgWorkAlt } from "react-icons/cg";
import {  FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'
import CommonPagination from '../../components/New/Pagination'
import { FiFilter } from "react-icons/fi";


const InventoryDashboard = () => {
    return (
        
        <div style={{ backgroundColor: "#f7f7f7", margin: 0, }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px"}}>
                <StockCard title="Reels" quantity="1200" status="Enough Stock" backgroundColor="#d4edda" color="#155724" buttonColor="#286e34" height="1px" icon={<BiDollarCircle />} />
                <StockCard title="Corrugation Glue" quantity="300" status="Low Stock" backgroundColor="#fff3cd " color="#856404" buttonColor="#856404" icon={<FaStar />} />
                <StockCard title="Pasting Glue" quantity="50" status="Out of Stock" backgroundColor="#f8d7da " color="#721c24" buttonColor="#721c24" icon={<CgWorkAlt />} />
                <StockCard title="Finished Goods" quantity="600" backgroundColor="#e5e5e5" color="#858585" buttonColor="#858585" icon={<FaShieldAlt />} />
                <StockCard title="Semi Finished Goods" quantity="450" backgroundColor="#c7c7f1" color="#2f667f" buttonColor="#2f667f" icon={<FaUsers />} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <h5 style={{ color: '#21338e' }}>Total Stock Value</h5>
                    <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#21338e" }}>$50,000</h3>
                </div>
            </div>
            <MaterialSection />
        </div>
    );
};

const StockCard = ({ title, quantity, status, color, buttonColor, icon, backgroundColor }) => (
    <div style={{ boxSizing: "border-box", display: "flex", justifyContent: "space-between", padding: "10px 30px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", color, backgroundColor,minHeight:'140.2px' }}>
        <div>
            <h6>{title}</h6>
            <p style={{ marginBottom: '0' }}>Total Quantity: {quantity}</p>
            {status && <p style={{ marginBottom: '0' }}>Status: {status}</p>}
            <button style={{ fontSize: "14px", color: "white", padding: "2px 10px", borderRadius: "4px", backgroundColor: buttonColor, border: "none", cursor: "pointer", marginTop: '20px', bottom: '0' }}>view info</button>
        </div>
        <div>
            <span style={{ color:buttonColor, borderRadius: '5px', fontSize: "30px", backgroundColor: buttonColor }}>{icon}</span>

        </div>
    </div>
);

const ButtonCommon = ({children}) => (
    <span style={{color: "white",padding: "4px 6px",borderRadius: "4px",margin: "0 4px",border: "none",boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
        outline: 'none',
        background: '#8167e5', 
        cursor: 'pointer' 
    }}>
        {children}
    </span>
);

const MaterialSection = () => (
    <section style={{ backgroundColor: "white", padding: "16px", marginTop: "10px", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <h6>Raw Materials Types</h6>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
            <div className="flex justify-start items-center gap-2">
            <div style={{ position: "relative", display: "flex", alignItems: "center", boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',marginTop:"10px" }}>
                <input type="text" placeholder="Search SKU by name or ID" style={{ border: "1px solid #d1d5db", padding: "3px", borderRadius: "6px", width: "280px"}} />
                <FaSearch style={{ position: "absolute", right: "12px", color: "#6b7280" }} />
                

            </div>
            <div>
                <FiFilter className="h-6 w-6 " />

                </div>
                </div>
            <div>

                <ButtonCommon>Saved Filter</ButtonCommon>
                <ButtonCommon>Bulk Upload</ButtonCommon>
            </div>
        </div>
        <MaterialTable />
        <div className="flex justify-end items-center gap-4 mt-4">
          <CommonPagination count={5} page={1} onChange={''} />
        </div>
      
       
    </section>
    
);

const MaterialTable = () => (
    <div className="p-2 border-2 b-gray-200 my-5 ">
    <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 1px 4px rgba(0,0,0,0)",border :"1px solid lightgray "}}>
        <tbody>
            <MaterialRow icon={<FaCircle style={{ color: "#3b82f6" }} />} name="Reel - Standard" type="Standard" available="180" reorder="500" updated="2023-10-01" />
            <MaterialRow icon={<FaFillDrip style={{ color: "#ec4899" }} />} name="Glue - Pasting" type="Normal" available="200" reorder="100" updated="2023-10-01" />
            <MaterialRow icon={<FaThumbtack style={{ color: "#6366f1" }} />} name="Pin - Small" type="Medium" available="25" reorder="200" updated="2023-10-01" />
        </tbody>
    </table>
    </div>
);

const MaterialRow = ({ icon, name, type, available, reorder, updated }) => (
    <tr style={{ borderBottom: "1px solid #d1d5db", textAlign: "left" }}>
        <td style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px" }}>{icon} <span>{name}</span></td>
        <td style={{ padding: "8px 16px" }}>Type: {type}</td>
        <td style={{ padding: "8px 16px" }}>Available: {available}</td>
        <td style={{ padding: "8px 16px" }}>Reorder Level: {reorder}</td>
        <td style={{ padding: "8px 16px" }}>Last Updated: {updated}</td>
    </tr>
);

 

export default InventoryDashboard;