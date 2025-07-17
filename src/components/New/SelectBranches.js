import React, { useEffect, useState } from 'react';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { commonApi } from '../../api/common';
import CIcon from '@coreui/icons-react';
import { cilLocationPin } from '@coreui/icons';

const SelectBranches = () => {
  const [branchList, setBranchList] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await commonApi.getCompanyBranchDropdown();
        console.log('Branch dropdown response:', response.data);
        setBranchList(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem('company-branch-id') || '';
    if (storedId === '') {
      setSelectedBranchId(null);
    } else {
      setSelectedBranchId(Number(storedId));
    }
  }, [branchList]);

  const selectedBranch = branchList.find(
    (b) => String(b.id) === String(selectedBranchId)
  );

  const handleBranchSelect = (branchId) => {
    if (branchId === null) {
      setSelectedBranchId(null);
      localStorage.setItem('company-branch-id', '');
      console.log('Selected Branch ID: All (empty)');
    } else {
      setSelectedBranchId(branchId);
      localStorage.setItem('company-branch-id', branchId);
      console.log('Selected Branch ID:', branchId);
    }
    window.dispatchEvent(new Event('branchIdChanged'));
  };

  return (
    <CDropdown>

<CDropdownToggle 
  color="dark" 
  className="mr-[50px] outline outline-1 outline-gray-600 w-[170px] d-flex align-items-center justify-content-between"
>
  <div className="d-flex align-items-center">
    <CIcon icon={cilLocationPin} className="me-2" />
    {selectedBranch ? selectedBranch.location : 'Select Branch'}
  </div>
</CDropdownToggle>
      <CDropdownMenu dark>
        <CDropdownItem
          key="all"
          active={selectedBranchId === null}
          onClick={() => handleBranchSelect(null)}
        >
          All
        </CDropdownItem>
        {branchList.map((branch) => (
          <CDropdownItem
            key={branch.id}
            onClick={() => handleBranchSelect(Number(branch.id))}
          >
            {branch.location}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default SelectBranches;
