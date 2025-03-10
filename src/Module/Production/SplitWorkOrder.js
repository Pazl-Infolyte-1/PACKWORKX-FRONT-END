import React from 'react'
import PopUp from '../../components/New/PopUp'
import { CButton, CFormInput, CFormSelect, CModalBody, CModalFooter } from '@coreui/react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  CardHeader,
  CardContent,
  Card,
  Divider,

} from "@mui/material";


const SplitWorkOrder = ({ visibleSplit, setVisibleSplit, setSelectedType }) => {
  return (
    <div>
      <PopUp
        visible={visibleSplit}
        setVisible={setVisibleSplit}
        width="880px"
        height="580px"
        header=""
        showCloseButton={true}
      >
       

<table style={{ borderCollapse: "collapse", width: "80%", height: "50%", textAlign: "center" }}>
  <thead>
    <tr style={{ margin: 0, padding: 0, lineHeight: 1 }}>
      <th style={{ padding: "8px", justifyItems: "left" }}>
        <Typography variant="h6" className='italic underline text-[#030303]'>
          Split Work Order
        </Typography>
      </th>
      <th className="italic underline text-[#023f81]" style={{ padding: "8px", textAlign: "left" }}>WO 877878</th>
      <th className='italic underline text-[#023f81]' style={{ padding: "8px", textAlign: "left" }}>QTY - 9898</th>
      <th className='italic underline text-[#023f81]' style={{ padding: "8px", textAlign: "left" }}>FG - 100</th>
      {/* <th style={{ padding: "8px", textAlign: "left" }}>X</th> */}
    </tr>
  </thead>
  <tbody>
    <tr style={{ margin: 0, padding: 0, lineHeight: 1 }}>
    <td style={{ padding: "8px", textAlign: "left" }}> 
  <Typography variant="h6" style={{ marginLeft: "-1px" }} className='mb-0 text-[#023f81] w-96'>
    Balance Qty from Work Order
  </Typography>
</td>
      <td style={{ padding: "8px" }}></td>
      <td style={{ padding: "8px" }}></td>
      <td style={{ padding: "8px" }}></td>
    </tr>
    <tr style={{ margin: 0, padding: 0, lineHeight: 1 }}>
      <td className="p-2 text-black text-[18px] font-roboto leading-[24px] text-left">Balance QTY</td>
      <td style={{ padding: "8px", textAlign: "left" }}>
        <input value="50" disabled className="w-[130px] h-[35px] ml-[-10px] rounded-full bg-gray-200 text-gray-500 text-center" />
      </td>
      <td style={{ padding: "8px" }}></td>
      <td style={{ padding: "8px" }}></td>
    </tr>
    <tr style={{ margin: 0, padding: 0, lineHeight: 1 }}>
      <td className="p-2 text-black text-[18px] font-roboto leading-[24px] text-left">Allocate To</td>
      <td style={{ padding: "8px", textAlign: "left" }}>
      <Select
        displayEmpty
        size="small"
        style={{
          width: "140px",
          height: "35px",
          marginLeft: "-12px", /* Reduced from 30px */
          borderRadius: "15px",
          backgroundColor: "#eeeeee",
          color: "#858585",
        }}
        renderValue={(selected) => (selected ? selected : "Select type")}
      >
        <MenuItem value="Outsource">Outsource</MenuItem>
        <MenuItem value="Purchase Order">Purchase Order</MenuItem>
      </Select>
      </td>
      <td style={{ padding: "8px", textAlign: "left" }}>
        <input value="50" disabled className="w-[130px] h-[35px] ml-[-10px] rounded-full bg-gray-200 text-gray-500 text-center" />
      </td>
      <td style={{ padding: "8px" }}></td>
    </tr>
    <tr style={{ margin: 0, padding: 0, lineHeight: 1 }}>
      <td style={{ padding: "8px" }}> 
        <Typography variant="h6" className='text-[#023f81] text-left'>Allocated Finished Goods</Typography>
      </td>
      <td style={{ padding: "8px" }}></td>
      <td style={{ padding: "8px" }}></td>
      <td style={{ padding: "8px" }}></td>
    </tr>
    <tr style={{ margin: 0, padding: 0, lineHeight: 1 }}>
      <td style={{ padding: "8px", textAlign: "left" }}>
        <select className="w-60 h-10 text-[#023f81] bg-white border border-gray-300 rounded-xl px-4 pr-10 text-sm cursor-pointer outline-none">
          <option value="" selected disabled>Select WO</option>
          <option value="WO - 50015">WO - 50015</option>
          <option value="WO - 50016">WO - 50016</option>
        </select>
      </td>
      <td style={{ padding: "8px", textAlign: "left" }}>
        <input value="50" disabled className="w-[130px] h-[35px] ml-[-10px] rounded-full bg-gray-200 text-gray-500 text-center " />
      </td>
      <td style={{ padding: "8px" }}>
        <button className="w-[130px] h-[35px] bg-[#8761e5] ml-[-20px] text-white rounded-[10px]">Add</button>
      </td>
      <td style={{ padding: "8px" }}></td>
    </tr>
    <tr style={{ margin: 0, padding: 0, lineHeight: 1 }}>
      <td className="p-[8px] text-black text-[18px] font-roboto leading-[24px] text-left">WO - #50016</td>
      <td className="p-[8px] text-black text-[18px] font-roboto leading-[24px] text-left">Qty. 50</td>
      <td style={{ padding: "8px" }}></td>
      <td style={{ padding: "8px" }}></td>
    </tr>
    <tr style={{ margin: 0, padding: 0, lineHeight: 1 }}>
      <td className="p-[8px] text-black text-[18px] font-roboto leading-[24px] text-left">WO - #50017</td>
      <td className="p-[8px] text-black text-[18px] font-roboto leading-[24px] text-left">Qty. 50</td>
      <td style={{ padding: "8px" }}></td>
      <td style={{ padding: "8px" }}></td>
    </tr>
    <tr style={{ margin: 0, padding: 0, lineHeight: 1 }}>
      <td style={{ padding: "8px" }}></td>
      <td style={{ padding: "8px" }}></td>
      <td style={{ padding: "8px" }}></td>
      <td className="p-4">
        <button className="bg-[#023f81] text-white rounded-[10px] px-2 py-1 w-[100px] h-[35px] text-[16px] font-roboto font-medium leading-[24px] shadow-md focus:outline-none ml-[-10px]">Submit</button>
      </td>
    </tr>
  </tbody>
</table>



      </PopUp>
    </div>
  )
}

export default SplitWorkOrder
