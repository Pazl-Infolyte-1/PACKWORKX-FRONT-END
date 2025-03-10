import React from 'react'
import PopUp from '../../components/New/PopUp'
import { CButton, CCard, CCardBody, CCardHeader, CModalBody, CModalFooter } from '@coreui/react'
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
import { FaLock } from 'react-icons/fa'

const AllcoateRMModal = ({ visibleAllocate, setVisibleAllocate }) => {
  return (
    <div>
      <PopUp visible={visibleAllocate} setVisible={setVisibleAllocate} width="700px"
        height="650px"
        header={<div style={{color: "#030303",
          fontSize: "25px",
         marginLeft:"20px",
          fontWeight: 700,
          }}>Allocation - Reel 02</div>}
        showCloseButton={false}>
        <Box className="p-6  rounded-xl ">

          <Box className="mb-2 flex gap-40 items-center">
          <Typography className="text-black text-[20px]">Total Quantity:</Typography>

            <input
              type="text"
              value="500 Kg"
              disabled
              className="bg-[#eeeeee] text-[#858585] p-2 rounded-xl w-15 text-left h-9 "
            />
          </Box>

          <Box className="mb-2 flex gap-32 items-center">
            <Typography className="text-black text-[20px]">Available Quantity:</Typography>
            <input
              type="text"
              value="90 Kg"
              disabled
              className="bg-[#eeeeee] text-[#858585] p-2 rounded-xl w-15 text-left h-9"
            />
          </Box>

          <Box className="mb-2 flex gap-2 items-center">
            <Typography className="text-black text-[20px] pr-1">How much do you want to allocate:</Typography>
            <input
  type="text"
  value="50 Kg"
  disabled
  className="bg-[#eeeeee] text-[#858585] p-2 rounded-xl w-15 text-left h-9"
/>

          </Box>

          <Typography variant="h6" style={{color: "#030303",
          fontSize: "25px",
         marginTop:"20px",
          fontWeight:" 700"}}>
  Blocked Quantity
</Typography>

          <Card className="w-full max-w-lg shadow-lg p-3 ml-20">
            <CardContent>
              {/* Container with a single vertical line */}
              <Box className="relative w-full">
                {/* Single Vertical Line */}
                <Box className="absolute left-1/2 top-0 w-px bg-[#e0dfdf] h-full"></Box>

                {/* Header */}
                <Box className="flex w-full font-bold pb-2 text-center">
                  <p className="w-1/2 text-left text-[#030303] text-[20px] ">Work Order</p>
                  <p className="w-1/2 text-[#030303] text-[20px]">Quantity (Kg)</p>
                </Box>
                <Divider />

                {/* Work Orders List */}
                {[
                  { id: "1005", qty: 100 },
                  { id: "1006", qty: 250 },
                  { id: "1007", qty: 100 },
                  { id: "1008", qty: 500 },
                ].map((wo) => (
                  <Box key={wo.id} className="flex py-2 text-center items-center">
                    <Typography className="w-1/2 Poppins underline text-[#8167e5] cursor-pointer text-left">
                      WO – {wo.id}
                    </Typography>
                    <Box className="w-1/2 flex justify-center items-center gap-4 text-[#9b9b9b]">
                      {wo.qty} <FaLock className="text-blue-900" />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Box className="flex justify-center  mt-3">
            <Button
              style={{ backgroundColor: "#e3e7fd", color: "#21338e", borderRadius: "15px",width:"220px",marginLeft:"50px"}}

              onClick={() => setVisibleIndex(false)}
            >
              Cancel
            </Button>
            <Button style={{ backgroundColor: "#023f81", color: "#ffffff", borderRadius: "15px" ,width:"220px", marginLeft:"60px"}} color="primary">
              Confirm
            </Button>
          </Box>
        </Box>
      </PopUp>

    </div>
  )
}

export default AllcoateRMModal
