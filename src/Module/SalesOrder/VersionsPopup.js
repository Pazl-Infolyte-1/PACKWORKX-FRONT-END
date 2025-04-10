import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react';
import PopUp from '../../components/New/PopUp';
import ActionButton from '../../components/New/ActionButton';

function VersionsPopup({ visible, setVisible, versionData, skuName }) {
  const [collapseopen, setCollapseOpen] = useState(false);

  useEffect(() => {
    console.log(versionData, "----------------------------");
  }, [versionData]);

  const handleToggleCollapse = () => {
    setCollapseOpen((prev) => !prev);
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
        <div className="flex justify-between pb-2 mb-3">
          <span className="text-lg font-semibold text-gray-800">
            SKU Name: <span>{skuName}</span>
          </span>
          <span className="text-lg font-semibold text-gray-800">
            Dimensions: <span>60 x 30 x 40</span>
          </span>
          <span className="text-lg font-semibold text-gray-800">
            Print: <span>Flexo</span>
          </span>
        </div>

        {/* Scrollable Table */}
        <div className="max-h-[300px] overflow-auto">
          <CTable striped hover responsive className="table-fixed border-none">
            {/* Table Header */}
            <CTableHead className="sticky top-0 !border-none bg-gray-100">
              <CTableRow className="!border-y-2">
                <CTableHeaderCell className="font-semibold min-w-[100px] !text-gray-600">
                  Version
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[100px] !text-gray-600">
                  Layer
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[80px] !text-gray-600">
                  GSM
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[120px] !text-gray-600">
                  Flute Type
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[70px] !text-gray-600">
                  BF
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[90px] !text-gray-600">
                  Color
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[100px] !text-gray-600">
                  Material
                </CTableHeaderCell>
                <CTableHeaderCell className="font-semibold min-w-[100px] !text-gray-600">
                  Weight
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            {/* Table Body */}
            <CTableBody>
              {versionData?.map((version) =>
                version.sku_values?.map((item, index) => (
                  <CTableRow key={`${version.id}-${index}`}>
                    {/* Only show version for first row in each group */}
                    {index === 0 ? (
                      <CTableDataCell rowSpan={version.sku_values.length} className="font-bold">
                        {version.sku_version}
                      </CTableDataCell>
                    ) : null}
                    <CTableDataCell>{item.layer || '-'}</CTableDataCell>
                    <CTableDataCell>{item.gsm || '-'}</CTableDataCell>
                    <CTableDataCell>{item.flute_type || '-'}</CTableDataCell>
                    <CTableDataCell>{item.bf || '-'}</CTableDataCell>
                    <CTableDataCell>{item.color || '-'}</CTableDataCell>
                    <CTableDataCell>{item.material || '-'}</CTableDataCell>
                    <CTableDataCell>{item.weight || '-'}</CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end items-center h-15 mt-3">
        <ActionButton label="Save as New Version" />
      </div>
    </PopUp>
  );
}

export default VersionsPopup;
