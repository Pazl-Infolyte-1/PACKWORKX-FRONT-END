import React from 'react'
import Drawer from '../../../components/Drawer/Drawer'
import { CCardBody, CRow, CCol, CFormInput, CFormSelect, CButton } from '@coreui/react'

function CompaniesForm({ isDrawerOpen, setDrawerOpen }) {
  return (
    <>
      <div>
        <Drawer maxWidth={'1280px'} isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
          <div className="text-2xl font-semibold text-left p-1 -ml-2 ">Add Company</div>

          <div className=" bg-white sm:ml-[10%] md:ml-[10%] lg:ml-0 w-full">
            {/* Company Details Section */}
            <h3 className="mt-1 text-xl font-semibold text-gray-700 border-b pb-2">
              Company Details
            </h3>
            <CCardBody>
              {/* First Row: Company Name, Email, Phone */}
              <CRow className="g-3">
                <CCol md={4}>
                  <CFormInput label="Company Name *" placeholder="Enter Company Name" />
                </CCol>
                <CCol md={4}>
                  <CFormInput label="Company Email *" placeholder="Enter Company Email" />
                </CCol>
                <CCol md={4}>
                  <CFormInput label="Company Phone" placeholder="Enter Phone Number" />
                </CCol>
              </CRow>

              {/* Second Row: Website, Default Currency, Default Timezone */}
              <CRow className="g-3 mt-3">
                <CCol md={4}>
                  <CFormInput label="Website" placeholder="Enter Website URL" />
                </CCol>
                <CCol md={4}>
                  <CFormSelect label="Default Currency" defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect label="Default Timezone" defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="UTC">UTC</option>
                    <option value="PST">PST</option>
                    <option value="EST">EST</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Third Row: Language, Status, Address */}
              <CRow className="g-3 mt-3">
                <CCol md={4}>
                  <CFormSelect label="Language" defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormSelect label="Status" defaultValue="">
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CFormInput label="Address" placeholder="Enter Address" />
                </CCol>
              </CRow>
            </CCardBody>

            {/* Account Details Section */}

            <h3 className="mt-4 text-xl font-semibold text-gray-700 border-b pb-2">
              Account Details (First Company Admin)
            </h3>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={6}>
                  <CFormInput label="Name *" placeholder="Name " />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label=" Email(Login details will be emailted to this email)*"
                    placeholder="Admin Email "
                  />
                </CCol>
              </CRow>
            </CCardBody>
            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-4">
              <CButton color="secondary" onClick={() => setDrawerOpen(false)}>
                Cancel
              </CButton>
              <CButton
                className="text-white"
                style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
              >
                Save Company
              </CButton>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  )
}

export default CompaniesForm
