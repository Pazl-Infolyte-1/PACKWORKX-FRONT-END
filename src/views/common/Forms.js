import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const Forms = ({ visible, setVisible, formFields }) => {
  const [visibleSections, setVisibleSections] = useState({})
  const [skuTypeSelected, setSkuTypeSelected] = useState(false)
  const [formValues, setFormValues] = useState({})

  useEffect(() => {
    const initialValues = {}
    formFields.sections?.forEach((section) => {
      section.inputs?.forEach((input) => {
        initialValues[input.id] = input.defaultValue || ''
      })
    })
    setFormValues(initialValues)
  }, [formFields])

  // Handling input changes
  const handleChange = (e, id, isMultiSelect = false, isCheckbox = false, isToggle = false) => {
    const value = e.target.value

    console.log('id', id)

    if (id === 'sku_name') {
      console.log('Selected SKU Type:', value)
      setSkuTypeSelected(true)

      const newVisibility = {
        corrugated_sheet: value === '1',
        corrugated_box: value === '2',
        die_cut_box: value === '3',
        sku_management: value === '4',
        custom_items: value === '5',
      }

      setVisibleSections(newVisibility)
    }

    if (isToggle) {
      setFormValues((prevState) => ({ ...prevState, [id]: e.target.checked }))
    } else if (isMultiSelect) {
      const options = Array.from(e.target.selectedOptions, (option) => option.value)
      setFormValues((prevState) => ({ ...prevState, [id]: options }))
    } else if (isCheckbox) {
      setFormValues((prevState) => {
        const checkedValues = prevState[id] || []
        return e.target.checked
          ? { ...prevState, [id]: [...checkedValues, e.target.value] }
          : { ...prevState, [id]: checkedValues.filter((v) => v !== e.target.value) }
      })
    } else {
      setFormValues((prevState) => ({ ...prevState, [id]: e.target.value }))
    }
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Data Submitted:', formValues)
  }

  return (
    <CModal
      alignment="center"
      scrollable
      size="xl"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="VerticallyCenteredScrollableExample2"
    >
      <CModalHeader>
        <CModalTitle id="VerticallyCenteredScrollableExample2">{formFields.pageTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <form className="container" onSubmit={handleSubmit}>
          {(formFields.sections || []).map((section, sectionIndex) => {
            const { groupName, count, inputs, groupId } = section

            if (!inputs || inputs.length === 0) {
              return null
            }

            // Only hide sections related to SKU type selection if they exist in `visibleSections`
            const shouldBeHidden =
              Object.keys(visibleSections).length > 0 &&
              groupId in visibleSections &&
              !visibleSections[groupId]

            return (
              <div
                key={sectionIndex}
                className={`section ${shouldBeHidden ? 'hidden' : ''}`}
                id={groupId}
              >
                <h2 className="group-title">{groupName}</h2>

                {inputs.map((input, index) => {
                  const inputId = input.id || `input_${sectionIndex}_${index}`
                  const isDisabled = input.readOnly || false

                  return (
                    <div key={index} className="input-group">
                      {input.type !== 'submit' && input.type !== 'reset' && (
                        <label htmlFor={inputId}>
                          {input.label}{' '}
                          {input.required && <span className="required-asterisk">*</span>}
                        </label>
                      )}

                      {input.type === 'text' ||
                      input.type === 'number' ||
                      input.type === 'email' ||
                      input.type === 'password' ? (
                        <input
                          id={inputId}
                          type={input.type}
                          placeholder={input.placeholder}
                          defaultValue={input.defaultValue || ''}
                          required={input.required || false}
                          readOnly={isDisabled}
                          disabled={isDisabled}
                          onChange={(e) => handleChange(e, inputId)}
                        />
                      ) : input.type === 'checkbox' ? (
                        <input
                          type="checkbox"
                          id={inputId}
                          checked={formValues[inputId] || false}
                          disabled={isDisabled}
                          onChange={(e) => handleChange(e, inputId, false, true)}
                        />
                      ) : input.type === 'select' ? (
                        <select
                          id={inputId}
                          required={input.required || false}
                          disabled={isDisabled}
                          defaultValue={input.defaultValue || ''}
                          onChange={(e) => handleChange(e, inputId)}
                        >
                          <option value="">Select {input.label}</option>
                          {input.options.map((option, idx) => (
                            <option key={idx} value={option.id || option}>
                              {option.label || option}
                            </option>
                          ))}
                        </select>
                      ) : input.type === 'toggle' ? (
                        <label className="switch">
                          <input
                            type="checkbox"
                            id={inputId}
                            defaultChecked={input.defaultValue}
                            onChange={(e) => handleChange(e, inputId, false, false, true)}
                          />
                          <span className="slider"></span>
                        </label>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )
          })}
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
  )
}

export default Forms
