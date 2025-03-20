import { cilBellExclamation, cilCart } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import React, { useState } from 'react';
import ActionButton from '../../components/New/ActionButton'

function AppSettingTab() {
  const [formData, setFormData] = useState({
    dateFormat: 'd-m-Y (18-03-2025)',
    timeFormat: '12 Hour(s) (04:30 pm)',
    defaultTimezone: 'Asia/Kolkata',
    defaultCurrency: '₹ (INR)',
    language: 'English',
    datatableRowLimit: '25',
    sessionDriver: 'File',
    appDebug: true,
    appUpdate: false,
    enableCache: false,
    companyNeedApproval: false,
    turnOnEmailVerification: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with values:', formData);
  };

  // Options for dropdowns
  const dateFormatOptions = [
    "DD-MM-YYYY",
    "YYYY-MM-DD",
    "MM/DD/YYYY",
  ];



  const timeFormatOptions = [
    "12-hour",
    "24-hour",
  ];


  const timezoneOptions = [
    'Asia/Kolkata',
    'America/New_York',
    'Europe/London'
  ];

  const currencyOptions = [
    '₹ (INR)',
    '$ (USD)',
    '€ (EUR)'
  ];

  const languageOptions = [
    'English',
    'Hindi',
    'Spanish'
  ];

  const rowLimitOptions = [
    '25',
    '50',
    '100'
  ];

  const sessionDriverOptions = [
    'File',
    'Database',
    'Redis'
  ];

  return (
    <form className="p-4 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
        {/* Date Format */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">Date Format</label>
          <div className="relative">
            <select
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {dateFormatOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
              name="timeFormat"
              value={formData.timeFormat}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {timeFormatOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
              name="defaultTimezone"
              value={formData.defaultTimezone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {timezoneOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
              name="defaultCurrency"
              value={formData.defaultCurrency}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {currencyOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm text-gray-500 mb-2">
            Language
            <span className="ml-1 inline-block text-gray-400">
              <CIcon icon={cilBellExclamation} className="mr-2" />
            </span>
          </label>
          <div className="relative">
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 pr-8 appearance-none text-gray-700"
            >
              {languageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div>
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
              {rowLimitOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Session Driver */}
        <div>
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
              {sessionDriverOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* App Debug */}
        <div className="flex items-center mt-6">
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
        </div>

        {/* App Update */}
        <div className="flex items-center mt-6">
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
        </div>
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableCache"
            name="enableCache"
            checked={formData.enableCache}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableCache" className="ml-2 text-sm text-gray-700">Enable Cache</label>
        </div>

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

        <div className="flex items-center">
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
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <ActionButton
        label={"Save"}
        customColor='bg-red-500 text-white'
        onClick={handleSubmit}
        />
      </div>
    </form>
  );
}

export default AppSettingTab;