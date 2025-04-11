import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCollapse,
  CCard
} from '@coreui/react';
import PopUp from '../../components/New/PopUp';
import ActionButton from '../../components/New/ActionButton';

function VersionsPopup({ visible, setVisible, versionData, skuName, getskuversions }) {
  const [expandedVersions, setExpandedVersions] = useState({});

  useEffect(() => {
    console.log(versionData, "----------------------------");
  }, [versionData]);

  const toggleVersionExpand = (versionId) => {
    setExpandedVersions(prev => ({
      ...prev,
      [versionId]: !prev[versionId]
    }));
  };

  const handleDeleteVersion = (versionId) => {
    // Implement version deletion logic here
    console.log(`Deleting version with ID: ${versionId}`);
    // After deletion, refresh versions
    // getskuversions();
  };

  return (
    <PopUp
      visible={visible}
      setVisible={setVisible}
      width="1200px"
      height="550px"
      size="xl"
      header=""
      showCloseButton={true}
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-inner">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
              <span className="text-white font-bold">SKU</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              {skuName}
            </span>
          </div>
          <div className="flex space-x-6">
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase text-gray-500 font-semibold">Dimensions</span>
              <span className="text-lg font-medium text-gray-700">60 x 30 x 40</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase text-gray-500 font-semibold">Print Type</span>
              <span className="text-lg font-medium text-gray-700">Flexo</span>
            </div>
          </div>
        </div>

        {/* Summary Table with Expandable Rows */}
        <div className="max-h-[320px] overflow-auto bg-white rounded-lg shadow-md">
          <CTable hover responsive className="table-fixed mb-0 border-collapse">
            {/* Summary Table Header */}
            <CTableHead className="sticky top-0 z-10">
              <CTableRow className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
                <CTableHeaderCell className="font-bold w-16 text-center py-4"></CTableHeaderCell>
                <CTableHeaderCell className="font-bold min-w-[120px] py-4">
                  Version
                </CTableHeaderCell>
                <CTableHeaderCell className="font-bold min-w-[100px] py-4">
                  Layers
                </CTableHeaderCell>
                <CTableHeaderCell className="font-bold min-w-[120px] py-4">
                  Total Weight
                </CTableHeaderCell>
                <CTableHeaderCell className="font-bold w-24 text-center py-4">
                  Actions
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            {/* Summary Table Body */}
            <CTableBody>
              {versionData?.map((version, versionIndex) => {
                const isExpanded = expandedVersions[version.id] || false;
                const totalLayers = version.sku_values?.length || 0;
                const totalWeight = version.sku_values?.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0) || '-';
                
                return (
                  <>
                    <CTableRow 
                      key={version.id}
                      className={`${versionIndex % 2 === 0 ? 'bg-white' : 'bg-indigo-50'} hover:bg-blue-100 transition-colors duration-150`}
                    >
                      <CTableDataCell className="text-center">
                        <button
                          onClick={() => toggleVersionExpand(version.id)}
                          className={`${isExpanded ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'} 
                            hover:bg-indigo-600 hover:text-white rounded-full w-8 h-8 flex items-center justify-center 
                            transition-all duration-200 transform hover:scale-110 shadow-sm`}
                        >
                          {isExpanded ? '−' : '+'}
                        </button>
                      </CTableDataCell>
                      <CTableDataCell>
                        <span className="font-bold text-lg text-indigo-700">{version.sku_version}</span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="flex items-center">
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">{totalLayers}</span>
                          </div>
                          <span className="text-gray-700">Layers</span>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="bg-gray-100 px-3 py-1 rounded-full inline-block">
                          <span className="font-medium">{totalWeight}</span> kg
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <button
                          onClick={() => handleDeleteVersion(version.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium
                            transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                        >
                          Delete
                        </button>
                      </CTableDataCell>
                    </CTableRow>

                    {/* Expanded Detail View */}
                    <CTableRow className="border-0">
                      <CTableDataCell colSpan={5} className="p-0 border-0">
                        <CCollapse visible={isExpanded}>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mx-4 mb-4 rounded-lg shadow-inner">
                            <CTable bordered hover className="mb-0 shadow-sm">
                              <CTableHead>
                                <CTableRow className="bg-blue-200">
                                  <CTableHeaderCell className="font-bold text-indigo-800 text-center">Layer</CTableHeaderCell>
                                  <CTableHeaderCell className="font-bold text-indigo-800 text-center">GSM</CTableHeaderCell>
                                  <CTableHeaderCell className="font-bold text-indigo-800 text-center">Flute Type</CTableHeaderCell>
                                  <CTableHeaderCell className="font-bold text-indigo-800 text-center">BF</CTableHeaderCell>
                                  <CTableHeaderCell className="font-bold text-indigo-800 text-center">Color</CTableHeaderCell>
                                  <CTableHeaderCell className="font-bold text-indigo-800 text-center">Material</CTableHeaderCell>
                                  <CTableHeaderCell className="font-bold text-indigo-800 text-center">Weight</CTableHeaderCell>
                                </CTableRow>
                              </CTableHead>
                              <CTableBody>
                                {version.sku_values?.map((item, index) => (
                                  <CTableRow 
                                    key={`${version.id}-${index}`}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}
                                  >
                                    <CTableDataCell className="text-center font-medium">{item.layer || '-'}</CTableDataCell>
                                    <CTableDataCell className="text-center">{item.gsm || '-'}</CTableDataCell>
                                    <CTableDataCell className="text-center">{item.flute_type || '-'}</CTableDataCell>
                                    <CTableDataCell className="text-center">{item.bf || '-'}</CTableDataCell>
                                    <CTableDataCell>
                                      {item.color ? (
                                        <div className="flex items-center justify-center">
                                          <div 
                                            className="h-4 w-4 rounded-full mr-2" 
                                            style={{ backgroundColor: item.color.toLowerCase() }}
                                          ></div>
                                          {item.color}
                                        </div>
                                      ) : '-'}
                                    </CTableDataCell>
                                    <CTableDataCell className="text-center">{item.material || '-'}</CTableDataCell>
                                    <CTableDataCell className="text-center font-medium">{item.weight || '-'}</CTableDataCell>
                                  </CTableRow>
                                ))}
                              </CTableBody>
                            </CTable>
                          </div>
                        </CCollapse>
                      </CTableDataCell>
                    </CTableRow>
                  </>
                );
              })}
            </CTableBody>
          </CTable>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end items-center mt-6">
        <ActionButton 
          label="Save as New Version" 
          className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 
            text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        />
      </div>
    </PopUp>
  );
}

export default VersionsPopup;