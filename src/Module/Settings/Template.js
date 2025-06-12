import React, { useEffect, useState } from 'react'
import { SettingsApi } from '../../api/Settings'

function Template() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await SettingsApi.getTemplates()
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
            const htmlContent = block.innerHTML.replace(templateInfo?.outerHTML || '', '')

            return {
              id: templateId,
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

    fetchData()
  }, [])

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
  }

  const handleClosePreview = () => {
    setSelectedTemplate(null)
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
    <div >
      <div className="p-6 max-w-full overflow-x-hidden">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Order Templates</h1>
          <p className="text-gray-600">
            Choose from our collection of professional purchase order templates
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-full">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-full"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Template {template.id}</h3>
                <p className="text-sm text-gray-600">Professional purchase order layout</p>
              </div>

              {/* Template Preview */}
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-2 mb-4 h-48 overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ 
                      transform: 'scale(0.25)',
                      transformOrigin: 'top left',
                      width: '400%',
                      height: '400%',
                      overflow: 'hidden'
                    }}
                    dangerouslySetInnerHTML={{ __html: template.content }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleTemplateSelect(template)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Preview
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium">
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

      {/* Full Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 top-10 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] mt-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Template {selectedTemplate.id} Preview
              </h2>
              <button
                onClick={handleClosePreview}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
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

            <div className="p-4 overflow-auto max-h-[calc(90vh-100px)]">
              <div
                className="bg-white rounded-lg"
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

export default Template