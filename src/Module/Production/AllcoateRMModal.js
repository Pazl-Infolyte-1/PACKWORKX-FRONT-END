import React from 'react'
import PopUp from '../../components/New/PopUp'
import { CButton, CCard, CCardBody, CCardHeader, CModalBody, CModalFooter } from '@coreui/react'
import { FaLock } from 'react-icons/fa'

const AllcoateRMModal = ({ visibleAllocate, setVisibleAllocate }) => {
  return (
    <div>
      <PopUp visible={visibleAllocate} setVisible={setVisibleAllocate} size="md">
        <CModalBody>
          <CCardHeader className="text-xl font-bold">Allocation - Reel 02</CCardHeader>

          <div className="mb-2 flex gap-40 items-center">
            <label className="text-gray-600">Total Quantity:</label>
            <input
              type="text"
              value="500 Kg"
              disabled
              className="bg-gray-200 p-2 rounded-md w-15 text-left h-9 "
            />
          </div>
          <div className="mb-2 flex gap-32 items-center">
            <label className="text-gray-600">Available Quantity:</label>
            <input
              type="text"
              value="90 Kg"
              disabled
              className="bg-gray-200 p-2 rounded-md w-15 text-left h-9"
            />
          </div>
          <div className="mb-2 flex gap-2 items-center">
            <label className="text-gray-600 ">How much do you want to allocate:</label>
            <input
              type="text"
              value="50 Kg"
              disabled
              className="bg-gray-200 p-2 rounded-md w-15 text-left h-9"
            />
          </div>
          <h3 className="text-lg font-bold mt-2 mb-2">Blocked Quantity</h3>

          <div className="flex flex-col items-center text-center p-4 ">
            <CCard className="w-full max-w-md shadow-lg p-3">
              <CCardBody>
                <div className="flex w-full font-bold pb-2 text-center">
                  <div className="w-1/2 text-left">Work Order</div>
                  <div className="w-1/2">Quantity (Kg)</div>
                </div>
                <div className="mt-1 w-full relative">
                  <div className="flex py-2 text-center relative">
                    <div className="w-1/2 text-[#8167e5] cursor-pointer  text-left ">WO – 1005</div>
                    <div className="w-1/2 flex justify-center items-center gap-4">
                      100 <FaLock className="text-[#023f81]" />
                    </div>
                  </div>
                  <div className="flex py-2 text-center relative">
                    <div className="w-1/2 text-[#8167e5] cursor-pointer text-left">WO – 1006</div>
                    <div className="w-1/2 flex justify-center items-center gap-4">
                      250 <FaLock className="text-[#023f81]" />
                    </div>
                  </div>
                  <div className="flex py-2 text-center relative">
                    <div className="w-1/2 text-[#8167e5] cursor-pointer text-left">WO – 1007</div>
                    <div className="w-1/2 flex justify-center items-center gap-4">
                      100 <FaLock className="text-[#023f81]" />
                    </div>
                  </div>
                  <div className="flex py-2 text-center relative">
                    <div className="w-1/2 text-[#8167e5] cursor-pointer text-left">WO – 1008</div>
                    <div className="w-1/2 flex justify-center items-center gap-4">
                      500 <FaLock className="text-[#023f81]" />
                    </div>
                  </div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-300 transform -translate-x-1/2"></div>
                </div>
              </CCardBody>
            </CCard>
          </div>
        </CModalBody>
        <CModalFooter>
          <div className="flex justify-between mt-3 mr-5 gap-2">
            <CButton
              style={{ backgroundColor: '#e3e7fd', color: '#21338e' }}
              onClick={() => setVisibleAllocate(false)}
            >
              Cancel
            </CButton>

            <CButton style={{ backgroundColor: '#023f81', color: '#ffffff' }} color="primary">
              Confirm
            </CButton>
          </div>
        </CModalFooter>
      </PopUp>
    </div>
  )
}

export default AllcoateRMModal
