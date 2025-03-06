import React from 'react';
import PopUp from '../../components/New/PopUp';
import {
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
    CButton, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from "@coreui/react";

function SkuPopup({ visible, setVisible }) {
    const tableData = [
        { id: "DIE2345", name: "Standard Die", client: "XYZ Corp", boardSize: "20x30 cm", ups: 4 },
        { id: "DIE67890", name: "Custom Die", client: "ABC Ltd", boardSize: "25x35 cm", ups: 6 },
        { id: "DIE1223", name: "Die Pro", client: "LMN Inc", boardSize: "30x40 cm", ups: 8 },
        { id: "DIE33445", name: "Precision Die", client: "OPQ Solutions", boardSize: "22x32 cm", ups: 5 },
    ];

    return (
        <PopUp visible={visible} setVisible={setVisible} width="800px" height="500px" size="lg">
            <CModalHeader>
                <CModalTitle>Select Die for SKU Mapping</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CTable bordered hover>
                    <CTableHead color="light">
                        <CTableRow>
                            <CTableHeaderCell>Die ID</CTableHeaderCell>
                            <CTableHeaderCell>Name</CTableHeaderCell>
                            <CTableHeaderCell>Client</CTableHeaderCell>
                            <CTableHeaderCell>Board Size</CTableHeaderCell>
                            <CTableHeaderCell>UPS</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {tableData.map((row, index) => (
                            <CTableRow key={index}>
                                <CTableDataCell>{row.id}</CTableDataCell>
                                <CTableDataCell>{row.name}</CTableDataCell>
                                <CTableDataCell>{row.client}</CTableDataCell>
                                <CTableDataCell>{row.boardSize}</CTableDataCell>
                                <CTableDataCell>{row.ups}</CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>


            </CModalBody>
            <CModalFooter>
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <CButton color="success" className="text-white" onClick={() => setVisible(false)}>Cancel</CButton>
                    <CButton color="success" className="text-white">Select</CButton>
                </div>


            </CModalFooter>
        </PopUp>

    );
}

export default SkuPopup;
