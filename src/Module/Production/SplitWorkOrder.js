import React from 'react'
import PopUp from '../../components/New/PopUp'
import { CButton, CFormInput, CFormSelect, CModalBody, CModalFooter } from '@coreui/react'

const SplitWorkOrder = ({ visibleSplit, setVisibleSplit, setSelectedType }) => {
  return (
    <div>
      <PopUp
        visible={visibleSplit}
        setVisible={setVisibleSplit}
        width="500px"
        height="300px"
        header="Split Work Order"
        showCloseButton={true}
      >
        <CModalBody>
          <div className="mb-3 text-[#023f81] text-[16px] flex float-right">
            <strong>WO - #50015</strong> | <strong>Qty - 150</strong> | <strong>FG - 100</strong>
          </div>
          <h5 className="mb-1 text-[#023f81]">Balance Qty from Work Order:</h5>
          <div className="mb-3 d-flex align-items-center gap-2">
            <label className="form-label mb-0 ">Balance Qty</label>
            <CFormInput
              value="50"
              disabled
              style={{ width: '80px', height: '35px', marginLeft: '150px' }}
            />
          </div>
          <div className="mb-3 d-flex align-items-center gap-2">
            <label className="form-label mb-0 ">Allocate To</label>
            <CFormSelect
              onChange={(e) => setSelectedType(e.target.value)}
              style={{ width: '150px', marginLeft: '150px' }}
            >
              <option value="">Select type</option>
              <option value="Outsource">Outsource</option>
              <option value="Purchase Order">Purchase Order</option>
            </CFormSelect>
            <CFormInput value="50" disabled style={{ width: '80px', height: '35px' }} />
          </div>
          <h5 className="text-[#023f81]">Allocated Finished Goods:</h5>
          <div className="d-flex gap-2 mb-3">
            <CFormSelect style={{ width: '220px', height: '35px', color: '#023f81' }}>
              <option value="WO-50015">WO - 50015</option>
            </CFormSelect>
            <CFormInput style={{ width: '80px', height: '35px' }} value="50" disabled />
            <CButton
              style={{
                width: '80px',
                height: '35px',
                backgroundColor: '#8761e5',
                color: '#ffffff',
              }}
              color="success"
            >
              {' '}
              Add
            </CButton>
          </div>
          {/* <CListGroup style={{ maxWidth: "300px" }}>
  <CListGroupItem className="d-flex justify-content-between">
      <span>WO - 50015</span>
      <span>Qty. 50</span>
  </CListGroupItem>
</CListGroup> */}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleSplit(false)}>
            Close
          </CButton>
          <CButton style={{ backgroundColor: '#023f81', color: '#ffffff' }} color="primary">
            Submit
          </CButton>
        </CModalFooter>
      </PopUp>
    </div>
  )
}

export default SplitWorkOrder
