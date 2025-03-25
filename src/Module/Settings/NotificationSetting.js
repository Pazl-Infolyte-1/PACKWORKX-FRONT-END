import React, { useState } from 'react'
import ActionButton from '../../components/New/ActionButton'
import { FaCheckCircle } from 'react-icons/fa'
 
function NotificationSetting() {
  const [formData, setFormData] = useState({
    mailFromName: '',
    mailFromEmail: '',
    enableEmailQueue: '',
    mailDriver: '',
    mailHost: '',
    mailEncryption: '',
    mailPort: '',
    mailPassword: '',
    mailUsername: '',
  })
 
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
 
  const handleRadioChange = (value) => {
    setFormData({
      ...formData,
      mailDriver: value,
    })
  }
 
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form data to be sent:', formData)
  }
 
  const sendTestEmail = () => {
    // Send test email using current formData
    console.log('Sending test email with:', formData)
  }
 
  return (
    <div className="bg-white p-4 font-sans mb-4">
      {/* Tabs */}
      <div className="flex border-b">
        <div className="px-4 py-2 text-gray-600 font-medium">Email</div>
      </div>
 
      <form onSubmit={handleSubmit}>
        <div className="border border-gray-400">
          <div className="flex">
            <div className="w-8/12 border border-gray-400">
              {/* Success message */}
              <div className=" bg-green-100 border-green-200 border p-3 m-2 rounded flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-green-500 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-800 text-xs sm:text-sm">Your SMTP details are correct</span>
              </div>
 
              {/* Form with border */}
              <div className="rounded px-2 sm:px-6 flex-grow my-3 ">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Mail From Name */}
                  <div>
                    <label className="block text-gray-500 mb-2">
                      Mail From Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mailFromName"
                      placeholder="from name"
                      className="w-full border border-gray-300 rounded p-2"
                      value={formData.mailFromName}
                      onChange={handleInputChange}
                    />
                  </div>
 
                  {/* Mail From Email */}
                  <div>
                    <label className="block text-gray-500 mb-2">
                      Mail From Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="mailFromEmail"
                      placeholder="from email"
                      className="w-full border border-gray-300 rounded p-2"
                      value={formData.mailFromEmail}
                      onChange={handleInputChange}
                    />
                  </div>
 
                  {/* Enable Email Queue */}
                  <div>
                    <label className="block text-gray-500 mb-2 flex items-center">
                      Enable Email Queue
                      <span className="ml-1 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm">
                        ?
                      </span>
                    </label>
                    <select
                      name="enableEmailQueue"
                      className="w-full border border-gray-300 rounded p-2 bg-white"
                      value={formData.enableEmailQueue}
                      onChange={handleInputChange}
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
 
                  {/* Mail Driver */}
                  <div>
                    <label className="block text-gray-500 mb-2">Mail Driver</label>
                    <div className="flex items-center">
                      <label className="mr-6 flex items-center">
                        <input
                          type="radio"
                          name="mailDriver"
                          value="mail"
                          checked={formData.mailDriver === 'mail'}
                          onChange={() => handleRadioChange('mail')}
                          className="mr-2"
                        />
                        <span>Mail</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mailDriver"
                          value="smtp"
                          checked={formData.mailDriver === 'smtp'}
                          onChange={() => handleRadioChange('smtp')}
                          className="mr-2"
                        />
                        <span className="relative">SMTP</span>
                      </label>
                    </div>
                  </div>
 
                  {/* Mail Host */}
                  <div>
                    <label className="block text-gray-500 mb-2">
                      Mail Host <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mailHost"
                      placeholder="host"
                      className="w-full border border-gray-300 rounded p-2"
                      value={formData.mailHost}
                      onChange={handleInputChange}
                    />
                  </div>
 
                  {/* Mail Encryption */}
                  <div>
                    <label className="block text-gray-500 mb-2">Mail Encryption</label>
                    <select
                      name="mailEncryption"
                      className="w-full border border-gray-300 rounded p-2 bg-white"
                      value={formData.mailEncryption}
                      onChange={handleInputChange}
                    >
                      <option>none</option>
                      <option>tls</option>
                      <option>ssl</option>
                    </select>
                  </div>
 
                  {/* Mail Port */}
                  <div>
                    <label className="block text-gray-500 mb-2">
                      Mail Port <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mailPort"
                      placeholder="port"
                      className="w-full border border-gray-300 rounded p-2"
                      value={formData.mailPort}
                      onChange={handleInputChange}
                    />
                  </div>
 
                  {/* Mail Password */}
                  <div>
                    <label className="block text-gray-500 mb-2">Mail Password</label>
                    <input
                      type="password"
                      name="mailPassword"
                      placeholder="password"
                      className="w-full border border-gray-300 rounded p-2"
                      value={formData.mailPassword}
                      onChange={handleInputChange}
                    />
                  </div>
 
                  {/* Mail Username */}
                  <div>
                    <label className="block text-gray-500 mb-2">
                      Mail Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mailUsername"
                      placeholder="username"
                      className="w-full border border-gray-300 rounded p-2"
                      value={formData.mailUsername}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-4/12 flex justify-center items-center">
              <div className="text-gray-500 flex items-center justify-center h-full text-center p-4">
                Please configure the SMTP details to make
                <br />
                emails work in the application.
              </div>
            </div>
          </div>
        </div>
 
        {/* Buttons */}
        <div className="mt-6 flex justify-end">
          <ActionButton
            type="submit"
            label={'Save'}
            variant="save"
            className="bg-red-500 text-white py-2 px-4 rounded flex items-center"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </ActionButton>
          <ActionButton
            label={'Send Test Email'}
            variant="minimal"
            className="ml-4 border border-gray-300  text-gray-600 py-2 px-4 rounded flex items-center"
            onClick={sendTestEmail}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </ActionButton>
        </div>
      </form>
    </div>
  )
}
 
export default NotificationSetting