import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import PopUp from '../../components/New/PopUp';
import ActionButton from '../../components/New/ActionButton';
import { BiSolidDownArrow, BiSolidUpArrow, BiTrash } from 'react-icons/bi';
import { cilPencil, cilTrash } from '@coreui/icons';
import ThreeDotMenu from '../../components/ThreeDotMenu';
import apiMethods from '../../api/config';

function VersionsPopup({ visible, setVisible, versionData, skuName, getskuversions,handleDeleteVersion,setIsEdit,setSelectedSkuVersionID,formVisibility }) {
  const [expandedVersions, setExpandedVersions] = useState({});

  useEffect(() => {
    console.log(versionData, "----------------------------");
  }, [versionData]);

  const toggleVersionCollapse = (versionId) => {
    setExpandedVersions(prev => ({
      ...prev,
      [versionId]: !prev[versionId]
    }));
  };

//  const handleDeleteVersion = async (versionId,) => {
//   try {

//     const response = await apiMethods.deleteSkuVersion(versionId);
//     console.log("Version deleted successfully:", response);

//     // Show success alert (optional)
//     alert("Version deleted successfully");

//   } catch (error) {
//     console.error("Error deleting version:", error);
//     alert("Failed to delete the version. Please try again.");
//   }
// };

  // Calculate summary data for each version
  const getVersionSummary = (version) => {
    const totalLayers = version.sku_values?.length || 0;
    const totalWeight = version.sku_values?.reduce((sum, item) => sum + (parseFloat(item.weight) || 0), 0) || '-';
    const primaryMaterial = version.sku_values?.[0]?.material || '-';
    
    return {
      totalLayers,
      totalWeight,
      primaryMaterial
    };
  };

  return (
    <PopUp
      visible={visible}
      setVisible={setVisible}
      width="1200px"
      height="500px"
      size="xl"
      header=""
      showCloseButton={true}
    >
      <div>
        {/* Header Section */}
        <div className="flex justify-between pb-2 mb-3 ">
          <span className="text-lg font-semibold text-gray-800">
            SKU Name: <span>{skuName || "60ml"}</span>
          </span>
          <span className="text-lg font-semibold text-gray-800">
            Dimensions: <span>60 x 30 x 40</span>
          </span>
          <span className="text-lg font-semibold text-gray-800">
            Print: <span>Flexo</span>
          </span>
        </div>

        {/* Scrollable Table */}
        <div className="max-h-[300px]   overflow-auto">
          <CTable striped hover responsive className="table-fixed border-none min-h-[150px]">
            {/* Main Table Header */}
            <CTableHead className="sticky top-0 !border-none">
              <CTableRow className="!border-y-2">
                <CTableHeaderCell className="font-semibold w-10 !text-gray-600"></CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[100px] !text-gray-600">
                  Version
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[80px] !text-gray-600">
                  Layers
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[100px] !text-gray-600">
                  Material
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[100px] !text-gray-600">
                  Total Weight
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[80px] !text-gray-600">
                  Action
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            {/* Table Body with Versions and Collapsible Details */}
            <CTableBody>
              {versionData && versionData.length > 0 ? (
                versionData.map((version, vIndex) => {
                  const isExpanded = expandedVersions[version.id] || false;
                  const summary = getVersionSummary(version);
                  
                  return (
                    <React.Fragment key={version.id}>
                      {/* Version Summary Row */}
                      <CTableRow className={`h-[50px] transition ${vIndex % 2 === 0 ? '' : 'bg-gray-50'}`}>
                        <CTableDataCell className="text-center border-none">
                          <button 
                            className="px-3 py-1"
                            onClick={() => toggleVersionCollapse(version.id)}
                          >
                            {isExpanded ? <BiSolidUpArrow /> : <BiSolidDownArrow />}
                          </button>
                        </CTableDataCell>
                        <CTableDataCell className="min-w-[100px] font-semibold border-none">
                          {version.sku_version}
                        </CTableDataCell>
                        <CTableDataCell className="min-w-[80px] border-none">
                          {summary.totalLayers}
                        </CTableDataCell>
                        <CTableDataCell className="min-w-[100px] border-none">
                          {summary.primaryMaterial}
                        </CTableDataCell>
                        <CTableDataCell className="min-w-[100px] border-none">
                          {summary.totalWeight}
                        </CTableDataCell>
                        <CTableDataCell className="min-w-[80px] border-none">
                    <ThreeDotMenu
                      value={[
                        {
                          label: 'Edit',
                          icon: cilPencil,
                          onClick: () => {
                            setSelectedSkuVersionID(version.id)
                            setIsEdit(true)
                            formVisibility(true)
                          },
                        },
                        {
                          label: 'Delete',
                          icon: cilTrash,
                          onClick: async() => {
                            await handleDeleteVersion(version.id)
                          },
                        },
                      ]}
                    />
                        </CTableDataCell>
                      </CTableRow>

                      {/* Collapsible Detail Section */}
                      <CTableRow>
                        <CTableDataCell colSpan={6} className="p-0 border-none">
                          <div 
                            className={`transition-all duration-300 ease-in-out overflow-y-scroll  ${
                              isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            {isExpanded && (
                              <CTable bordered className="mb-2 mt-2 mx-4">
                                <CTableHead>
                                  <CTableRow className="bg-gray-100">
                                    <CTableHeaderCell className="!text-gray-600 font-semibold">Layer</CTableHeaderCell>
                                    <CTableHeaderCell className="!text-gray-600 font-semibold">GSM</CTableHeaderCell>
                                    <CTableHeaderCell className="!text-gray-600 font-semibold">Flute Type</CTableHeaderCell>
                                    <CTableHeaderCell className="!text-gray-600 font-semibold">BF</CTableHeaderCell>
                                    <CTableHeaderCell className="!text-gray-600 font-semibold">Color</CTableHeaderCell>
                                    <CTableHeaderCell className="!text-gray-600 font-semibold">Material</CTableHeaderCell>
                                    <CTableHeaderCell className="!text-gray-600 font-semibold">Weight</CTableHeaderCell>
                                  </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                  {version.sku_values?.map((item, index) => (
                                    <CTableRow key={index} className="h-[50px]">
                                      <CTableDataCell>{item.layer || '-'}</CTableDataCell>
                                      <CTableDataCell>{item.gsm || '-'}</CTableDataCell>
                                      <CTableDataCell>{item.flute_type || '-'}</CTableDataCell>
                                      <CTableDataCell>{item.bf || '-'}</CTableDataCell>
                                      <CTableDataCell>{item.color || '-'}</CTableDataCell>
                                      <CTableDataCell>{item.material || '-'}</CTableDataCell>
                                      <CTableDataCell>{item.weight || '-'}</CTableDataCell>
                                    </CTableRow>
                                  ))}
                                </CTableBody>
                              </CTable>
                            )}
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    </React.Fragment>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableDataCell
                    colSpan={6}
                    className="text-center py-3 text-gray-500 border-none"
                  >
                    No versions available
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>
      </div>
    </PopUp>
  );
}

export default VersionsPopup;