import React, { useState } from 'react'
import {
    CCol,
    CRow,
    CFormCheck,
    CFormInput,
    CFormSelect,
    CButton,
} from '@coreui/react'
import Drawer from '../../../components/Drawer/Drawer'  
import ActionButton from '../../../components/New/ActionButton'


function PackagesForm({ isDrawerOpen, setDrawerOpen }) {

  const [packageType, setPackageType] = useState('Paid plan')

  return (
    <>
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        {/* Header */}
        <div className="bg-[#f2f4f7] w-full h-15 mb-2 flex justify-start items-center mt-5">
          <div className="bg-white m-2 h-15 w-full mx-2 flex justify-start items-center">
            <h2 className="text-xl font-semibold text-gray-700 p-2">Create Package</h2>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#f2f4f7] w-full mb-2 flex justify-start items-center">
          <div className="bg-white m-2 p-4 w-full mx-2 flex flex-col gap-4">
            <CRow className="g-3 pt-2">
              {/* Package Type */}
              <CCol>
                <label className="block text-gray-700 font-medium mb-1">Package Type</label>
                <div className="flex gap-4">
                  <CFormCheck
                    type="radio"
                    name="packageType"
                    id="Paidplan"
                    label="Paid Plan"
                    value="Paid plan"
                    checked={packageType === 'Paid plan'}
                    onChange={(e) => setPackageType(e.target.value)}
                  />
                  <CFormCheck
                    type="radio"
                    name="packageType"
                    id="FreePlan"
                    label="Free Plan"
                    value="Free Plan"
                    checked={packageType === 'Free Plan'}
                    onChange={(e) => setPackageType(e.target.value)}
                  />
                </div>
              </CCol>

            {/* Inputs Section */}
                        
            <div className="grid grid-cols-4 gap-2 w-full">
            {/* Package Name */}
            <CCol className="w-[250px] h-[80px] ">
                <CFormInput label="Package Name" placeholder="Enter Package Name" className="w-full" />
            </CCol>

            {/* Max Employee */}
            <CCol className="w-[250px] h-[80px]">
                <CFormInput label="Max Employee" placeholder="Enter Max Employee" className="w-full" />
            </CCol>

            {/* Max Storage Size */}
            <CCol className="w-[250px] h-[80px]">
                <CFormInput label="Max Storage Size" placeholder="Enter Max Storage Size" className="w-full" />
                <p className="text-sm text-gray-600">Set -1 for unlimited storage size</p>
            </CCol>

            {/* Storage Unit */}
            <CCol className="w-[250px] h-[80px]">
                <CFormSelect label="Storage Unit" className="w-full">
                <option>MB</option>
                <option>GB</option>
                <option>TB</option>
                </CFormSelect>
            </CCol>
            </div>


              {/* Position Number */}
              <CCol md={3}>
                <CFormSelect label="Position No">
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                </CFormSelect>
              </CCol>

              {/* Checkboxes */}
              <div className="flex gap-4">
                <CFormCheck id="make_private" label="Make Private" value="private" />
                <CFormCheck id="mark_recommended" label="Mark as Recommended" value="recommended" />
              </div>

              {/* Payment Gateway Plans */}
              <h5 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
                Payment Gateway Plans
              </h5>

              <div className="grid grid-cols-2 gap-4 w-full items-center">
                {/* Package Currency */}
                <CCol md={6} className="w-[250px]">
                  <CFormSelect label="Package Currency">
                    <option>INR</option>
                    <option>USD</option>
                  </CFormSelect>
                </CCol>

                {/* Plan Options */}
                <div className="flex gap-4">
                  <CFormCheck id="monthly_Plan" label="Monthly Plan" value="Monthly Plan" />
                  <CFormCheck id="annual_plan" label="Annual Plan" value="Annual Plan" />
                </div>
              </div>
            </CRow>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
        
          <ActionButton
          label="Cancel"
          onClick={()=>setDrawerOpen(false)}
          width="[80px]"
          height="10"
          />
          
          <ActionButton
          label="Save"
          width="[80px]"
          height="10"
          borderRadius='md'
          />
        </div>
      </Drawer>
    </>
  )
}

export default PackagesForm;
