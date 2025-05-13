import { useEffect, useState, useRef } from 'react';
import apiMethods from '../../api/config';
import ClientTable from './ClientTable';
import ClientForm from './ClientForm';
import CustomPopup from '../../components/New/CustomPopupModal/CustomPopup';
import vendorImg from '../../assets/images/vendor.png';
import clientImg from '../../assets/images/client.jpg';
import { FaUserCheck, FaUserSlash } from 'react-icons/fa';
import Loader from '../../components/New/Loader';
import Drawer1 from '../../components/Drawer/Drawer1';
import TableView from './TableView';
import CIcon from '@coreui/icons-react';
import { cilOptions } from '@coreui/icons';
import ContentHeader from '../../components/header/ContentHeader';
import { FiDownload, FiUpload } from 'react-icons/fi';
import { FaUserGroup } from 'react-icons/fa6';
import ActionButton from '../../components/New/ActionButton';
import { Outlet, useNavigate } from 'react-router-dom';

function ClientList() {
  const [selected, setSelected] = useState('vendor');
  const [triggerSelection, setTriggerSelection] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [entityType, setEntityType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const clientListRef = useRef(null);
 const navigate = useNavigate();
  const selectionFrame = {
    vendor: { id: 1, name: 'vendor', image: vendorImg },
    client: { id: 2, name: 'client', image: clientImg },
  };

  useEffect(() => {
    if (clientListRef.current) {
      console.log('ClientList width:', clientListRef.current.offsetWidth, 'px');
    }
  }, []);

  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      try {
        const queryParams = {
          ...(searchQuery && { search: searchQuery }),
          limit: entriesPerPage,
          page: currentPage,
          entity_type: selectedFilter,
        };
        const response = await apiMethods.getClients(queryParams);
        setData(response?.data || []);
        setTotalPage(response.totalPages || 1);
      } catch (error) {
        console.error('Error fetching client data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, [reloadData, searchQuery, entriesPerPage, currentPage, selectedFilter]);

  const handleEntriesChange = (newEntries) => {
    setEntriesPerPage(newEntries);
    setCurrentPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setEntriesPerPage(5);
    setSelectedFilter('');
    setReloadData((prev) => !prev);
  };

  const refreshClients = () => {
    setReloadData((prev) => !prev);
  };

  const handleSelection = (selection) => {
    const optionValue = selectionFrame[selection].id;
    if (optionValue === 2) {
      setEntityType('Client');
    } else if (optionValue === 1) {
      setEntityType('Vendor');
    }
    setPopupOpen(false);
    setDrawerOpen(true);
  };

  const handleSelectAction = (selection) => {
    setSelected(selection);
    setTriggerSelection(true);
  };

  const handleKeyDown = (event) => {
    if (!isPopupOpen) return;
    if (event.key === 'ArrowRight') {
      handleSelectAction('client');
      setEntityType('Client');
    } else if (event.key === 'ArrowLeft') {
      handleSelectAction('vendor');
      setEntityType('Vendor');
    } else if (event.key === 'Enter') {
      setTriggerSelection(true);
    }
  };

  useEffect(() => {
    if (triggerSelection) {
      handleSelection(selected);
      setTriggerSelection(false);
    }
  }, [selected, triggerSelection]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const downloadClientExcelSheet = async () => {
    try {
      const queryParams = {
        ...(searchQuery && { search: searchQuery }),
        entity_type: selectedFilter,
      };
      const response = await apiMethods.downloadClientExcel(queryParams);
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'clients.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <div className="flex w-full">
      <div ref={clientListRef} className={isMinimized ? 'w-[320px]' : 'w-full'}>

        <ContentHeader
        isMinimized={isMinimized}
          heading="Client/Vendor"
          menuOptions={[
            {
              icon: <FiUpload className="mr-2 text-blue-500" />,
              label: 'Import',
              onClick: () => console.log('Import clicked'),
            },
            {
              icon: <FiDownload className="mr-2 text-blue-500" />,
              label: 'Export',
              onClick: downloadClientExcelSheet,
            },
          ]}
         onAddClick={() => navigate('/clients/new')}
          headingOptions={[
            {
              label: 'All Clients',
              icon: <FaUserGroup size={16} />,
              onClick: () => console.log('All Clients selected'),
            },
            {
              label: 'Active Clients',
              icon: <FaUserCheck size={16} />,
              onClick: () => console.log('Active Clients selected'),
            },
            {
              label: 'Inactive Clients',
              icon: <FaUserSlash size={16} />,
              onClick: () => console.log('Inactive Clients selected'),
            },
          ]}
        />

        <Loader isLoading={loading} />

        <div className="mt-3 overflow-x-auto">
          <ClientTable
            setSelectedRowData={setSelectedRowData}
            isMinimized={isMinimized}
            setIsMinimized={setIsMinimized}
            refreshClients={refreshClients}
            clientdata={data}
          />
        </div>

        {!isDrawerOpen && (
          <CustomPopup
            isOpen={isPopupOpen}
            onClose={() => setPopupOpen(false)}
            width="w-[500px]"
            height="230px"
          >
            <div className="flex justify-center items-center space-x-12 p-6">
              {Object.keys(selectionFrame).map((key) => (
                <div
                  key={key}
                  className={`w-1/3 flex flex-col items-center border-4 p-2 cursor-pointer ${
                    selected === key ? 'border-blue-200' : 'border-gray-100'
                  }`}
                  onClick={() => handleSelectAction(key)}
                  tabIndex={0}
                  role="button"
                >
                  <img
                    src={selectionFrame[key].image}
                    alt={selectionFrame[key].name}
                    className="w-16 h-16 rounded-full"
                  />
                  <p className="mt-2 text-sm font-semibold">{selectionFrame[key].name}</p>
                </div>
              ))}
            </div>
          </CustomPopup>
        )}

        <Drawer1
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(false)}
          maxWidth="1280px"
          title={`New ${entityType}`}
        >
          <ClientForm
            entity_type={entityType}
            refreshClients={refreshClients}
            closeDrawerDuringAdd={() => setDrawerOpen(false)}
            resetForm={isDrawerOpen}
            setReloadData={setReloadData}
          />
        </Drawer1>
      </div>

      {isMinimized && (
        <div className="flex-1 transition-all duration-300">
          <TableView
            selectedRowData={selectedRowData}
            onClose={() => setIsMinimized(false)}
          />
        </div>
      )}
         {/*<Outlet />*/}
    </div>
  );
}

export default ClientList;
