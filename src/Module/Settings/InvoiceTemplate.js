import React, { useEffect, useState } from 'react'
import { SettingsApi } from '../../api/Settings'
import CustomAlert from '../../components/New/CustomAlert'
import { set } from 'lodash'

function InvoiceTemplate() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [alerts, setAlerts] = useState([])

   const fetchData = async () => {
      try {
        setLoading(true)
        const response = await SettingsApi.getInvoiceTemplates()
        console.log(response)

        if (response?.data) {
          // Parse the HTML content to extract templates
          const parser = new DOMParser()
          const doc = parser.parseFromString(response.data, 'text/html')
          const templateBlocks = doc.querySelectorAll('.template-block')

          const templatesData = Array.from(templateBlocks).map((block, index) => {
            const templateInfo = block.querySelector('.template-info')
            const templateId = templateInfo
              ? templateInfo.textContent.match(/Template ID:\s*(\d+)/)?.[1]
              : index + 1
            let templateStatus = ''
            if (templateInfo) {
              const templateInfoElements = block.querySelectorAll('.template-info')
              templateInfoElements.forEach((element) => {
                const text = element.textContent.trim()
                if (text.includes('Template Status:')) {
                  const statusMatch = text.match(/Template Status:\s*(.+)/s)
                  if (statusMatch) {
                    const cleanStatus = statusMatch[1].replace(/<[^>]*>/g, '').trim()
                    templateStatus = cleanStatus
                  }
                }
              })
            }
            const htmlContent = block.innerHTML.replace(templateInfo?.outerHTML || '', '')

            return {
              id: templateId,
              templateStatus: templateStatus,
              content: htmlContent,
            }
          })

          setTemplates(templatesData)
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
        setError('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
  }

  const handleClosePreview = () => {
    setSelectedTemplate(null)
  }

  const handleUseTemplate = async (template) => {
    try {
      const response = await SettingsApi.applyInvoiceTemplate(template.id)
      setAlerts([{ severity: 'success', message: response?.data?.message || 'Success' }])
      fetchData()
    } catch (error) {
      setAlerts([
        { severity: 'error', message: error?.response?.data?.message || 'Error occurred' },
      ])
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-hidden">
      <CustomAlert alerts={alerts} handleClose={() => setAlerts([])} />
      <div className="p-3 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-start">Invoice Templates</h1>
          <p className="text-gray-600">
            Choose from our collection of professional purchase order templates
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full"
            >
              <div className="flex justify-between items-center !p-2">
                <h3 className="text-lg font-semibold text-gray-900">Template {template.id}</h3>
                {template.templateStatus === 'Active' && (
                  <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 rounded-full px-3 py-1 text-xs font-semibold border border-emerald-200 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Active
                  </div>
                )}
              </div>

              {/* Template Preview - Fixed scaling and overflow */}
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-2 mb-4 h-48 overflow-hidden relative border">
                  <div
                    className="absolute top-0 left-0 pointer-events-none"
                    style={{
                      transform: 'scale(0.2)',
                      transformOrigin: 'top left',
                      width: '500%',
                      height: '500%',
                    }}
                  >
                    <div
                      className="w-full h-full overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: template.content }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Preview
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUseTemplate(template)
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No templates available</div>
          </div>
        )}
      </div>

      {/* Full Preview Modal - Fixed width constraints */}
      {selectedTemplate && (
        <div className="fixed inset-0 top-10 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] mt-4 overflow-hidden mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Template {selectedTemplate.id} Preview
              </h2>
              <button
                onClick={handleClosePreview}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 flex-shrink-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4 w-full">
              <div
                className="bg-white rounded-lg w-full"
                style={{ minWidth: 'fit-content' }}
                dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
              />
            </div>

            <div className="flex gap-2 p-4 border-t border-gray-200">
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceTemplate
