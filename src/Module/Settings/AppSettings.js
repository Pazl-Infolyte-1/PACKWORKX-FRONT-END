import React, { useState } from 'react';
import AppSettingTab from './AppSettingTab';
import FileUploadSetting from './FileUploadSetting';

function Settings() {
  const [activeTab, setActiveTab] = useState('app');

  return (
    <div className="p-4">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b pb-2 mb-4 relative">
        <button
          onClick={() => setActiveTab('app')}
          className={`px-4 py-2 relative transition-all duration-300 ${activeTab === 'app' ? 'border-b-2 border-red-500' : 'hover:border-b-2 hover:border-gray-300'}`}
        >
          App Settings
        </button>
        <button
          onClick={() => setActiveTab('file')}
          className={`px-4 py-2 relative transition-all duration-300 ${activeTab === 'file' ? 'border-b-2 border-red-500' : 'hover:border-b-2 hover:border-gray-300'}`}
        >
          File Upload Settings
        </button>
      </div>

      {/* Render Component Based on Active Tab */}
      <div className="mt-4 transition-opacity duration-300">
        {activeTab === 'app' && <AppSettingTab />}
        {activeTab === 'file' && <FileUploadSetting />}
      </div>
    </div>
  );
}

export default Settings;
