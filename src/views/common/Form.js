import React, { useState } from 'react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormCheck,
  CRow,
  CCol,
  CFormTextarea,
} from '@coreui/react'

const Form = ({ visible, setVisible, formFields }) => {
  const [formData, setFormData] = useState({})

  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target

    setFormData((prev) => {
      const updatedData = { ...prev }

      if (type === 'checkbox') {
        const prevValues = prev[name] || []

        updatedData[name] = checked ? [...prevValues, value] : prevValues.filter((v) => v !== value)
      } else if (type === 'radio') {
        updatedData[name] = value
      } else if (type === 'file') {
        updatedData[name] = files[0]
      } else {
        updatedData[name] = value
      }

      return updatedData
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Submitted: ', formData)
  }

  return (
    <div>
      <CModal
        alignment="center"
        scrollable
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample2"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredScrollableExample2">Add Employee</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleSubmit} className="p-3">
            <CRow className="g-3">
              {formFields.map((field) => (
                <CCol key={field.id} xs={12} md={field.type === 'textarea' ? 12 : 6}>
                  <CFormLabel htmlFor={field.name}>{field.label}</CFormLabel>

                  {[
                    'input',
                    'email',
                    'password',
                    'number',
                    'date',
                    'datetime-local',
                    'url',
                    'tel',
                  ].includes(field.type) && (
                    <CFormInput
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      onChange={handleChange}
                      title={field.placeholder}
                    />
                  )}

                  {field.type === 'select' && (
                    <CFormSelect id={field.name} name={field.name} onChange={handleChange}>
                      <option value="">{field.placeholder}</option>
                      {field.items.map((option) => (
                        <option key={option.id} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </CFormSelect>
                  )}

                  {field.type === 'checkbox' &&
                    field.items.map((option) => (
                      <CFormCheck
                        key={option.id}
                        type="checkbox"
                        id={`${field.name}_${option.value}`}
                        name={field.name}
                        value={option.value}
                        label={option.name}
                        onChange={handleChange}
                        checked={formData[field.name]?.includes(option.value) || false}
                      />
                    ))}

                  {field.type === 'radio' &&
                    field.items.map((option) => (
                      <CFormCheck
                        key={option.id}
                        type="radio"
                        id={`${field.name}_${option.value}`}
                        name={field.name}
                        value={option.value}
                        label={option.name}
                        onChange={handleChange}
                        checked={formData[field.name] === option.value}
                      />
                    ))}

                  {field.type === 'textarea' && (
                    <CFormTextarea
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      rows={4}
                      onChange={handleChange}
                    />
                  )}

                  {field.type === 'file' && (
                    <CFormInput
                      type="file"
                      id={field.name}
                      name={field.name}
                      onChange={handleChange}
                    />
                  )}
                  {field.type === 'color' && (
                    <CFormInput
                      type="color"
                      id={field.name}
                      name={field.name}
                      onChange={handleChange}
                    />
                  )}
                  {field.type === 'range' && (
                    <CFormInput
                      type="range"
                      id={field.name}
                      name={field.name}
                      onChange={handleChange}
                    />
                  )}
                </CCol>
              ))}
            </CRow>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            Save changes
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Form
