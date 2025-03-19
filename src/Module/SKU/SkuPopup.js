import React from 'react';
import PopUp from '../../components/New/PopUp';
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
function SkuPopup({ visible, setVisible }) {
    const tableData = [
        { id: "DIE2345", name: "Standard Die", client: "XYZ Corp", boardSize: "20x30 cm", ups: 4 },
        { id: "DIE67890", name: "Custom Die", client: "ABC Ltd", boardSize: "25x35 cm", ups: 6 },
        { id: "DIE1223", name: "Die Pro", client: "LMN Inc", boardSize: "30x40 cm", ups: 8 },
        { id: "DIE33445", name: "Precision Die", client: "OPQ Solutions", boardSize: "22x32 cm", ups: 5 },
    ];

    return (
        <PopUp visible={visible} setVisible={setVisible} width="700px" height="430px" header={<div style={{ color: '#21338e', display: 'flex', marginLeft:'150px' }}>Select Die For SKU Mapping </div>} showCloseButton={false} >
          
            <TableContainer   >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Die ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Board Size</TableCell>
                            <TableCell>UPS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.client}</TableCell>
                                <TableCell>{row.boardSize}</TableCell>
                                <TableCell>{row.ups}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <DialogActions style={{ fontSize: '10px',padding:'10px',marginTop:'5px' }} >
                <Button  onClick={() => setVisible(false)} color="success" variant="contained"> Colse </Button>
                <Button  color="success" variant="contained">Select</Button>
            </DialogActions>

        </PopUp>

    );
}

export default SkuPopup;


