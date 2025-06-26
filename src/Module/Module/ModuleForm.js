import { EyeIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock modules (if not present)
const mockModules = [
  { id: 1, name: 'Inventory Management', status: 'active' },
  { id: 2, name: 'Human Resource', status: 'active' },
  { id: 3, name: 'Financials', status: 'inactive' },
  { id: 4, name: 'Sales & Marketing', status: 'active' },
  { id: 5, name: 'Reporting', status: 'inactive' },
]

function ModuleForm() {
  const [file, setFile] = useState(null)
  const [email, setEmail] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [hasHeadingRow, setHasHeadingRow] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [errors, setErrors] = useState({})
  const [dragActive, setDragActive] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [moduleSearch, setModuleSearch] = useState('')
  const fileInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Download Sample Import File handler
  const handleDownloadSample = () => {
    // TODO: Implement actual download logic
    setAlerts([
      { severity: 'success', message: 'Sample import file download triggered (implement logic)' },
    ])
  }

  // File upload handlers
  const handleFileChange = (e) => {
    const uploaded = e.target.files[0]
    setFile(uploaded)
    setErrors((prev) => ({ ...prev, file: '' }))
  }
  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setErrors((prev) => ({ ...prev, file: '' }))
    }
  }
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }
  const removeFile = () => setFile(null)

  // Dropdown outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dropdown filter
  const filteredModules = mockModules.filter(
    (mod) => mod.name.toLowerCase().includes(moduleSearch.toLowerCase()) && mod.status === 'active',
  )

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    let hasError = false
    const newErrors = {}
    if (!selectedModule) {
      newErrors.module = true
      hasError = true
    }
    if (!file) {
      newErrors.file = true
      hasError = true
    }
    if (!email) {
      newErrors.email = true
      hasError = true
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      newErrors.email = 'Invalid email address'
      hasError = true
    }
    setErrors(newErrors)
    if (hasError) return
    setAlerts([{ severity: 'success', message: 'File and email submitted!' }])
    setFile(null)
    setEmail('')
    setHasHeadingRow(false)
    setSelectedModule(null)
    setModuleSearch('')
  }

  return (
    <div className="w-full h-[calc(100vh-80px)]  rounded-lg  p-3">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-6">Add Module</h2>

      {/* Info Alert */}
      <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 rounded px-4 py-2 mb-6 text-sm">
        Date format should be in Y-m-d (e.g. 2025-04-21) format. Make sure the date format is
        correct in the excel file.
      </div>

      {/* Module DropDown */}
      <div className="flex items-center mb-6">
        <label className="text-xs text-red-600 w-24">Module*</label>
        <div className="relative" ref={dropdownRef}>
          <div
            className={`flex h-8 w-80 items-center justify-between rounded border px-3 text-sm cursor-pointer bg-white ${
              errors.module ? 'ring-1 ring-red-600' : 'border-gray-300'
            }`}
            onClick={() => {
              setIsDropdownOpen((open) => !open)
              setErrors((prev) => ({ ...prev, module: '' }))
            }}
          >
            <span className="truncate text-sm text-gray-500">
              {selectedModule ? selectedModule.name : 'Select a module'}
            </span>
            <span className="text-gray-500">
              {isDropdownOpen ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}
            </span>
          </div>
          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 max-h-60 w-80 overflow-y-auto rounded border border-gray-200 bg-white shadow-md">
              <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={moduleSearch}
                    onChange={(e) => setModuleSearch(e.target.value)}
                    className="h-9 w-full rounded border border-gray-300 bg-gray-50 pl-8 pr-2 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>
              {filteredModules.length > 0 ? (
                filteredModules.map((mod) => (
                  <div
                    key={mod.id}
                    className="cursor-pointer px-3 py-2 text-xs hover:bg-gray-50"
                    onClick={() => {
                      setSelectedModule(mod)
                      setIsDropdownOpen(false)
                      setErrors((prev) => ({ ...prev, module: '' }))
                    }}
                  >
                    {mod.name}
                  </div>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-gray-500">No results found</div>
              )}
            </div>
          )}
        </div>
        {errors.module && <div className="text-xs text-red-600 ml-2">{errors.module}</div>}
      </div>

      {/* Email Field with Eye Icon and Tooltip */}
      <div className="mb-6 flex items-center relative ">
        <label className="text-xs text-red-600 w-24">Email*</label>
        <div className="relative w-1/4">
          <input
            type="email"
            className={`w-full border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.email ? 'ring-1 ring-red-600' : 'border-gray-300'}`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-white"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <EyeIcon size={20} />
            {showTooltip && (
              <div className="absolute -right-28 -top-10 bg-white text-black text-xs rounded px-2 py-2 whitespace-nowrap z-50 shadow-lg">
                Once you uploaded data, you will be notified.
              </div>
            )}
          </span>
        </div>
        {errors.email && <div className="text-xs text-red-600 ml-2">{errors.email}</div>}
      </div>

      {/* Download Sample Import File */}
      <button
        type="button"
        onClick={handleDownloadSample}
        className="flex items-center gap-2  text-sm border border-gray-300 rounded px-4 py-2 text-gray-700 hover:bg-gray-100 mb-2"
      >
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download Sample Import File
      </button>

      {/* File Upload */}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-xs text-red-500 mb-2">Upload File*</label>
          <div
            className={`flex flex-col items-center justify-center border rounded-md transition-colors cursor-pointer py-3 ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : errors.file
                  ? 'border-red-600'
                  : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".xls,.xlsx,.csv"
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm text-gray-700">{file.name}</span>
                <button
                  type="button"
                  className="text-xs text-red-500 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <svg
                  width="48"
                  height="48"
                  fill="none"
                  stroke="#bdbdbd"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  className="mb-2"
                >
                  <path d="M12 16V4M8 8l4-4 4 4" />
                  <rect x="4" y="16" width="16" height="4" rx="2" />
                </svg>
                <span className="text-base text-gray-500">Choose a file</span>
                <span className="text-xs text-gray-400">(xls, xlsx, csv)</span>
              </>
            )}
          </div>
          {errors.file && <div className="text-xs text-red-600 mt-1">{errors.file}</div>}
        </div>

        {/* File Contains Headings Row Toggle */}
        <div className="mb-8 flex items-center">
          <span className="text-sm text-gray-700 mr-4">File Contains Headings Row</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={hasHeadingRow}
              onChange={(e) => setHasHeadingRow(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
          </label>
        </div>
        {/* Buttons */}
        <div className="flex gap-4 mt-8 absolute bottom-2 bg-white">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#f44336] hover:bg-[#d32f2f] text-white px-6 py-2 rounded shadow transition-all text-xs"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            Upload And Move To Next Step
          </button>
          <button
            type="button"
            className="px-6 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all text-xs"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  )
}

export default ModuleForm
