import { cilBellExclamation, cilCart } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import React, { useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { SettingsApi } from '../../api/Settings'

function AppSettingTab() {
  const [formData, setFormData] = useState({
    date_format: 'DD-MM-YYYY',
    time_format: '12-hour',
    timezone: 'Asia/Kolkata',
    currency_id: '₹ (INR)',
    locale: 'English',
    // datatableRowLimit: '25',
    // sessionDriver: 'File',
    // appDebug: true,
    // appUpdate: false,
    // enableCache: false,
    companyNeedApproval: false,
    // turnOnEmailVerification: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      date_format:
        formData.date_format === 'DD-MM-YYYY'
          ? 'd-m-Y'
          : formData.date_format === 'YYYY-MM-DD'
            ? 'Y-m-d'
            : 'm/d/Y',

      time_format: formData.time_format === '12-hour' ? 'h:i a' : 'H:i',

      timezone: formData.timezone,

      currency_id:
        formData.currency_id === '₹ (INR)' ? 1 : formData.currency_id === '$ (USD)' ? 2 : 3, // assuming 3 is EUR

      locale: formData.locale === 'English' ? 'en' : formData.locale === 'Hindi' ? 'hi' : 'es',

      company_need_approval: formData.companyNeedApproval ? 1 : 0,
    }

    console.log('Payload to send:', payload)
    const response = await SettingsApi.appSettings(payload)
    if (response.status === 200) {
      console.log('Settings saved successfully:', response.data)
      // Optionally, you can show a success message or redirect the user
    } else {
      console.error('Error saving settings:', response.data)
      // Optionally, you can show an error message to the user
    }
  }

  // Options for dropdowns
  const date_formatOptions = ['DD-MM-YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']

  const time_formatOptions = ['12-hour', '24-hour']

  const timezoneOptions = ['Asia/Kolkata', 'America/New_York', 'Europe/London']

  const currencyOptions = ['₹ (INR)', '$ (USD)', '€ (EUR)']

  const localeOptions = ['English', 'Hindi', 'Spanish']

  const rowLimitOptions = ['25', '50', '100']

  const sessionDriverOptions = ['File', 'Database', 'Redis']

  return (
    <form className="p-4 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        {/* Date Format */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">Date Format</label>
          <div className="relative">
            <select
              name="date_format"
              value={formData.date_format}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {date_formatOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Time Format */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">Time Format</label>
          <div className="relative">
            <select
              name="time_format"
              value={formData.time_format}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {time_formatOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Default Timezone */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">Default Timezone</label>
          <div className="relative">
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {timezoneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Default Currency */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Default Currency
            <span className="ml-1 inline-block text-gray-400">
              <CIcon icon={cilBellExclamation} className="mr-2" />
            </span>
          </label>
          <div className="relative">
            <select
              name="currency_id"
              value={formData.currency_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {currencyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* locale */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">
            locale
            <span className="ml-1 inline-block text-gray-400">
              <CIcon icon={cilBellExclamation} className="mr-2" />
            </span>
          </label>
          <div className="relative">
            <select
              name="locale"
              value={formData.locale}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {localeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Second Row */}
        {/* <div>
          <label className="block text-sm text-gray-500 mb-2">
            Datatable Row Limit
            <span className="ml-1 inline-block text-gray-400">
              <CIcon icon={cilBellExclamation} className="mr-2" />
            </span>
          </label>
          <div className="relative">
            <select
              name="datatableRowLimit"
              value={formData.datatableRowLimit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {rowLimitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div> */}

        {/* Session Driver */}
        {/* <div>
          <label className="block text-sm text-gray-500 mb-2">
            Session Driver
            <span className="ml-1 inline-block text-gray-400">
              <CIcon icon={cilBellExclamation} className="mr-2" />
            </span>
          </label>
          <div className="relative">
            <select
              name="sessionDriver"
              value={formData.sessionDriver}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {sessionDriverOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div> */}

        {/* App Debug */}
        {/* <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="appDebug"
            name="appDebug"
            checked={formData.appDebug}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="appDebug" className="ml-2 text-sm text-gray-700">
            App Debug
            <span className="ml-1 inline-block text-gray-400">
              <CIcon icon={cilBellExclamation} className="mr-2" />
            </span>
          </label>
        </div> */}

        {/* App Update */}
        {/* <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="appUpdate"
            name="appUpdate"
            checked={formData.appUpdate}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="appUpdate" className="ml-2 text-sm text-gray-700">
            App Update
            <span className="ml-1 inline-block text-gray-400">
              <CIcon icon={cilBellExclamation} className="mr-2" />
            </span>
          </label>
        </div> */}
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* <div className="flex items-center">
          <input
            type="checkbox"
            id="enableCache"
            name="enableCache"
            checked={formData.enableCache}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableCache" className="ml-2 text-sm text-gray-700">
            Enable Cache
          </label>
        </div> */}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="companyNeedApproval"
            name="companyNeedApproval"
            checked={formData.companyNeedApproval}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="companyNeedApproval" className="ml-2 text-sm text-gray-700">
            Company Need Approval
            <span className="ml-1 inline-block text-gray-400">
              <CIcon icon={cilBellExclamation} className="mr-2" />
            </span>
          </label>
        </div>

        {/* <div className="flex items-center">
          <input
            type="checkbox"
            id="turnOnEmailVerification"
            name="turnOnEmailVerification"
            checked={formData.turnOnEmailVerification}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="turnOnEmailVerification" className="ml-2 text-sm text-gray-700">
            Turn On Email Verification
            <span className="ml-1 inline-block text-gray-400">
              <CIcon icon={cilBellExclamation} className="mr-2" />
            </span>
          </label>
        </div> */}
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <ActionButton label={'Save'} customColor="bg-red-500 text-white" onClick={handleSubmit} />
      </div>
    </form>
  )
}

export default AppSettingTab
