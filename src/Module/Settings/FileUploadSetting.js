import React, { useState } from 'react';
import ActionButton from '../../components/New/ActionButton';

function FileUploadSetting() {
  const [maxFileSize, setMaxFileSize] = useState(1024);
  const [sizeUnit, setSizeUnit] = useState('MB');
  const [maxNumberOfFiles, setMaxNumberOfFiles] = useState(100);
  const [fileTypeInput, setFileTypeInput] = useState('');
  const [allowedFileTypes, setAllowedFileTypes] = useState([
    'image/*', 
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/docx',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv',
    'application/sla',
    '.stl'
  ]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && fileTypeInput.trim() !== '') {
      e.preventDefault();
      setAllowedFileTypes([...allowedFileTypes, fileTypeInput.trim()]);
      setFileTypeInput('');
    }
  };

  const removeFileType = (fileType) => {
    setAllowedFileTypes(allowedFileTypes.filter(type => type !== fileType));
  };

  const handleSave = () => {
    const data = {
      maxFileSize: maxFileSize + ' ' + sizeUnit,
      maxNumberOfFiles,
      allowedFileTypes
    };
    
    console.log('Form Data:', data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-blue-400 pb-6 flex md:flex-row flex-col md:gap-12">
       <p>Server upload_max_filesize = 1.95 GB </p> <p>Server post_max_size = 1.95 GB</p>
      </div>
      
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-8 mb-6">
        <div>
          <label className="block mb-2">
            Max File size for upload <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="number"
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(e.target.value)}
              className="border p-2 w-full rounded-l-md"
            />
            <div
              value={sizeUnit}
              onChange={(e) => setSizeUnit(e.target.value)}
              className="border p-2 bg-white rounded-r-md"
            >
               MB
            </div>
          </div>
          <div className="text-gray-500 text-sm mt-1">
            Enter lower value than 1.95 GB
          </div>
        </div>
        
        <div>
          <label className="block mb-2">
            Max number of files for upload <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={maxNumberOfFiles}
            onChange={(e) => setMaxNumberOfFiles(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2">
          Allowed file types for upload <span className="text-red-500">*</span>
        </label>
        <div className="border rounded p-4 text-sm">
          <div className="flex flex-wrap gap-2 mb-4">
            {allowedFileTypes.map((fileType, index) => (
              <div key={index} className="bg-gray-200 rounded flex items-center px-1 py-1">
                <span>{fileType}</span>
                <button 
                  onClick={() => removeFileType(fileType)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={fileTypeInput}
            onChange={(e) => setFileTypeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. application/x-zip-compressed"
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      <ActionButton
        label={"Save"}
        customColor='bg-red-500 text-white'
        onClick={handleSave}
        />

    </div>
  );
}

export default FileUploadSetting;