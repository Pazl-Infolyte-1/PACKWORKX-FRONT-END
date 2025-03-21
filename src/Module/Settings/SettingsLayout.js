import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cilSettings, cilUser, cilBell, cilLanguage, cilSearch, cilMenu } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import EmptyState from '../User/EmptyState';

const SettingsLayout = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { path: '/settings/app-settings', label: 'App Settings', icon: cilSettings },
    { path: '/settings/notification', label: 'Notification Settings', icon: cilBell },
    { path: '/settings/language', label: 'Language Settings', icon: cilLanguage },
    { path: '/settings/superAdmin', label: 'Super Admin', icon: cilUser },
  ];

  const isActive = (path) => location.pathname === path;

  const isChildRouteSelected = menuItems.some(item => location.pathname === item.path);

  return (
    <div className="flex flex-col md:flex-row h-[80vh] overflow-hidden w-full xxxl:h-[90vh] bg-gray-100">
      {/* Mobile Dropdown Menu */}
      <div className="md:hidden p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">Settings</h1>
        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <CIcon icon={cilMenu} className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {isDropdownOpen && (
        <div className="md:hidden bg-white border-b sm:overflow-y-auto border-gray-200 shadow-md rounded-b-lg">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 no-underline ${isActive(item.path) ? 'text-indigo-700 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setIsDropdownOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Sidebar for Larger Screens */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-800">Settings</h1>
          <div className="mt-2 relative w-full">
            <CIcon icon={cilSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search settings..."
              className="w-full pl-10 pr-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div
          className="overflow-y-auto flex-grow"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#CBD5E0 #EDF2F7',
          }}
        >
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block w-full text-left px-4 py-[0.714rem] transition-all duration-150 no-underline ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500'
                  : 'border-l-2 border-transparent hover:bg-gray-50 text-gray-600'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-medium text-sm truncate">{item.label}</span>
                <CIcon icon={item.icon} className="h-4 w-4 text-gray-500 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#CBD5E0 #EDF2F7',
        }}
        className="flex-grow bg-gray-50 overflow-y-scroll"
      >
        {isChildRouteSelected ? <Outlet /> : <EmptyState />}
      </main>
    </div>
  );
};

export default SettingsLayout;
