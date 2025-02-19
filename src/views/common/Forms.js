import React, { useState, useEffect } from 'react'
import axios from 'axios'
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

const Forms = ({ visible, setVisible }) => {
  const initialValues = {}

  const [SKUformData, setSKUformData] = useState({ sections: [] })
  const [visibleSections, setVisibleSections] = useState({
    corrugated_sheet: false,
    corrugated_box: false,
    die_cut_box: false,
    sku_management: false,
    custom_items: false,
  })

  useEffect(() => {
    axios
      .get('https://mocki.io/v1/d28c5219-9f41-4ef2-b642-0d53cab4d893')
      .then((resp) => {
        console.log('Response:', resp.data)
        setSKUformData(resp.data || { sections: [] })
      })
      .catch((err) => console.error('Error fetching data:', err.response || err))
  }, [])

  if (SKUformData?.sections?.length > 0) {
    SKUformData.sections.forEach((section) => {
      if (section.inputs) {
        section.inputs.forEach((input) => {
          if (input.defaultValue !== undefined) {
            initialValues[input.id] =
              input.type === 'checkbox' ? [input.defaultValue] : input.defaultValue
          }
        })
      }
    })
  }

  const [formValues, setFormValues] = useState(initialValues)

  const handleChange = (e, id, isMultiSelect = false, isCheckbox = false, isToggle = false) => {
    // console.log(e.target.value);
    if (Number(e.target.value) === 1) {
      document.getElementById('corrugated_sheet').style.display = 'block'
      document.getElementById('corrugated_box').style.display = 'none'
      document.getElementById('die_cut_box').style.display = 'none'
      document.getElementById('sku_management').style.display = 'none'
      document.getElementById('custom_items').style.display = 'none'
    } else if (Number(e.target.value) === 2) {
      document.getElementById('corrugated_sheet').style.display = 'none'
      document.getElementById('corrugated_box').style.display = 'block'
      document.getElementById('die_cut_box').style.display = 'none'
      document.getElementById('sku_management').style.display = 'none'
      document.getElementById('custom_items').style.display = 'none'
    } else if (Number(e.target.value) === 3) {
      document.getElementById('corrugated_sheet').style.display = 'none'
      document.getElementById('corrugated_box').style.display = 'none'
      document.getElementById('die_cut_box').style.display = 'block'
      document.getElementById('sku_management').style.display = 'none'
      document.getElementById('custom_items').style.display = 'none'
    } else if (Number(e.target.value) === 4) {
      document.getElementById('corrugated_sheet').style.display = 'none'
      document.getElementById('corrugated_box').style.display = 'none'
      document.getElementById('die_cut_box').style.display = 'none'
      document.getElementById('custom_items').style.display = 'block'
      document.getElementById('sku_management').style.display = 'block'
    } else if (Number(e.target.value) === 5) {
      document.getElementById('corrugated_sheet').style.display = 'none'
      document.getElementById('corrugated_box').style.display = 'none'
      document.getElementById('die_cut_box').style.display = 'none'
      document.getElementById('sku_management').style.display = 'none'
      document.getElementById('custom_items').style.display = 'none'
    } else {
      document.getElementById('corrugated_sheet').style.display = 'none'
      document.getElementById('corrugated_box').style.display = 'none'
      document.getElementById('die_cut_box').style.display = 'none'
      document.getElementById('sku_management').style.display = 'none'
      document.getElementById('custom_items').style.display = 'none'
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Data Submitted:', formValues)
  }

  return (
    <>
      <CModal
        alignment="center"
        scrollable
        size="xl"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample2"
      >
        <CModalHeader>
          <CModalTitle id="VerticallyCenteredScrollableExample2">
            {SKUformData.pageTitle}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <form className="container" onSubmit={handleSubmit}>
            {SKUformData.sections.map((section, sectionIndex) => {
              const { groupName, count, inputs, groupId, groupShow } = section
              const chunkedInputs = []

              for (let i = 0; i < inputs.length; i += count) {
                chunkedInputs.push(inputs.slice(i, i + count))
              }

              return (
                <div
                  key={sectionIndex}
                  className={`section ${groupShow ? 'visible' : 'hidden'}`}
                  id={groupId}
                >
                  <h2 className="group-title">{groupName}</h2>

                  {chunkedInputs.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                      {row.map((input, colIndex) => {
                        const inputId =
                          input.id ||
                          `${input.label.replace(/\s+/g, '_').toLowerCase()}_${sectionIndex}_${colIndex}`
                        const isDisabled = input.readOnly || false

                        return (
                          <div
                            key={colIndex}
                            className={`input-group ${input.layout === 'horizontal' ? 'horizontal' : 'vertical'}`}
                          >
                            {input.type !== 'submit' && input.type !== 'reset' && (
                              <label htmlFor={inputId}>
                                {input.label}{' '}
                                {input.required && <span className="required-asterisk">*</span>}
                              </label>
                            )}

                            {[
                              'text',
                              'email',
                              'password',
                              'tel',
                              'number',
                              'date',
                              'time',
                              'datetime-local',
                              'month',
                              'week',
                              'color',
                              'range',
                              'search',
                              'url',
                            ].includes(input.type) ? (
                              <input
                                id={inputId}
                                type={input.type}
                                placeholder={input.placeholder}
                                defaultValue={input.defaultValue || ''}
                                className="input-box"
                                required={input.required || false}
                                readOnly={input.readOnly || false}
                                disabled={isDisabled}
                                onChange={(e) => handleChange(e, inputId)}
                              />
                            ) : input.type === 'file' ? (
                              <input
                                id={inputId}
                                type="file"
                                className="input-box"
                                required={input.required || false}
                                disabled={isDisabled}
                                onChange={(e) => handleChange(e, inputId)}
                              />
                            ) : input.type === 'image' ? (
                              <input
                                id={inputId}
                                type="image"
                                src={input.src}
                                alt={input.label}
                                className="image-input"
                              />
                            ) : input.type === 'radio' ? (
                              <div
                                className={`radio-group ${input.layout === 'horizontal' ? 'horizontal' : 'vertical'}`}
                              >
                                {input.options.map((option, index) => (
                                  <label key={index} className="radio-label">
                                    <input
                                      type="radio"
                                      name={inputId}
                                      value={option.label || option} // Adjusted for option.label
                                      defaultChecked={
                                        input.defaultValue === (option.label || option)
                                      }
                                      required={input.required || false}
                                      disabled={isDisabled}
                                      onChange={(e) => handleChange(e, inputId)}
                                    />
                                    {option.label || option} {/* Adjusted for option.label */}
                                  </label>
                                ))}
                              </div>
                            ) : input.type === 'checkbox' ? (
                              <div
                                className={`checkbox-group ${input.layout === 'horizontal' ? 'horizontal' : 'vertical'}`}
                              >
                                {input.options.map((option, index) => (
                                  <label key={index} className="checkbox-label">
                                    <input
                                      type="checkbox"
                                      value={option.label || option} // Adjusted for option.label
                                      defaultChecked={input.defaultValue?.includes(
                                        option.label || option,
                                      )}
                                      required={input.required || false}
                                      disabled={isDisabled}
                                      onChange={(e) => handleChange(e, inputId, false, true)}
                                    />
                                    {option.label || option} {/* Adjusted for option.label */}
                                  </label>
                                ))}
                              </div>
                            ) : input.type === 'select' ? (
                              <select
                                id={inputId}
                                className="input-box"
                                required={input.required || false}
                                disabled={isDisabled}
                                defaultValue={input.defaultValue || ''}
                                onChange={(e) => handleChange(e, inputId)}
                              >
                                <option value="">Select {input.label}</option>
                                {input.options.map((option, index) => (
                                  <option key={index} value={option.id || option}>
                                    {' '}
                                    {/* Adjusted for option.label */}
                                    {option.label || option} {/* Adjusted for option.label */}
                                  </option>
                                ))}
                              </select>
                            ) : input.type === 'multi-select' ? (
                              <select
                                id={inputId}
                                multiple
                                className="input-box"
                                required={input.required || false}
                                disabled={isDisabled}
                                defaultValue={input.defaultValue || []}
                                onChange={(e) => handleChange(e, inputId, true)}
                              >
                                {input.options.map((option, index) => (
                                  <option key={index} value={option.label || option}>
                                    {' '}
                                    {/* Adjusted for option.label */}
                                    {option.label || option} {/* Adjusted for option.label */}
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
                            ) : input.type === 'submit' ? (
                              <button type="submit" className="button-input" disabled={isDisabled}>
                                {input.label || 'Submit'}
                              </button>
                            ) : input.type === 'reset' ? (
                              <button
                                type="reset"
                                className="button-input"
                                disabled={isDisabled}
                                onClick={() => setFormValues(initialValues)}
                              >
                                {input.label || 'Reset'}
                              </button>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  ))}
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
    </>
  )
}

export default Forms
