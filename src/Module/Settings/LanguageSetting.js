import React, { useState, useEffect } from 'react';
import { BiEdit } from 'react-icons/bi';
import { FiTrash2 } from 'react-icons/fi';
import ActionButton from '../../components/New/ActionButton';
import { CFormSwitch } from '@coreui/react';
import { cifBg, cifDe, cifEs, cifGb, cifGe, cifRs, cifSa, cifTh } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
 
const LanguageSetting = () => {
  const [activeLanguages, setActiveLanguages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    // Check if the screen width is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
 
    // Initial check
    checkMobile();
 
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
 
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
 
  const languages = [
    { id: 1, name: 'English', code: 'en', flag: cifGb, rtl: 'No', status: false },
    { id: 2, name: 'Arabic', code: 'ar', flag: cifSa, rtl: 'Yes', status: true },
    { id: 3, name: 'Bulgarian', code: 'bg', flag: cifBg, rtl: 'No', status: false },
    { id: 4, name: 'Thai', code: 'th', flag: cifTh, rtl: 'No', status: false },
    { id: 5, name: 'Serbian', code: 'sr', flag: cifRs, rtl: 'No', status: false },
    { id: 6, name: 'Georgian', code: 'ka', flag: cifGe, rtl: 'No', status: false },
    { id: 7, name: 'German', code: 'de', flag: cifDe, rtl: 'No', status: false },
    { id: 8, name: 'Spanish', code: 'es', flag: cifEs, rtl: 'No', status: false },
  ];
 
  const toggleSwitch = (id) => {
    setActiveLanguages((prev) =>
      prev.includes(id) ? prev.filter((langId) => langId !== id) : [...prev, id]
    );
  };
 
  return (
    <div className="p-4 md:p-6 mx-auto bg-white">
      <h1 className="text-xl md:text-2xl font-medium text-gray-700 mb-4">Language Settings</h1>
 
      <div className="bg-blue-100 border border-blue-200 rounded p-2 flex items-center mb-4 ">
        <p className=" md:text-sm text-blue-800 ">
          <span className="font-bold">Note:</span> Simply enabling a language setting will not
          automatically change the language. To effectively change the language, you must also have
          translations available in that specific language.
        </p>
      </div>
 
      {isMobile ? (
        // Card view for mobile
        <div className="grid grid-cols-1 gap-4">
          {languages.map((language, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CIcon icon={language.flag} size="lg" />
                  <span className="font-medium">{language.name}</span>
                </div>
                <CFormSwitch
                  className="mx-2"
                  color="primary"
                  checked={activeLanguages.includes(language.id)}
                  style={{ height: '20px', width: '38px' }}
                  onChange={() => toggleSwitch(language.id)}
                />
              </div>
             
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Language Code:</span>
                  <span className="ml-2 font-medium">{language.code}</span>
                </div>
                <div>
                  <span className="text-gray-500">RTL Status:</span>
                  <span
                    className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded ${language.rtl === 'Yes' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}
                  >
                    {language.rtl}
                  </span>
                </div>
              </div>
             
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <button className="flex items-center justify-center border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-500 py-2 px-3 rounded w-32">
                  <span className="text-xs bg-blue-400 text-white px-1 mr-1">A 文</span> Publish
                </button>
                <ActionButton
                  label={'Edit'}
                  icon={BiEdit}
                  variant="mininal"
                  customColor="text-gray-600"
                  className="border border-gray-300 bg-gray-50 hover:bg-gray-200 p-2 rounded w-32"
                />
                <ActionButton
                  label={'Delete'}
                  icon={FiTrash2}
                  variant="mininal"
                  customColor="text-gray-600"
                  className="border border-gray-300 bg-gray-50 hover:bg-gray-200 p-2 rounded w-32"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Table view for desktop
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 font-bold text-center">
                <th className="text-left pb-2 pl-2 text-gray-500">Language Name</th>
                <th className="pb-2 text-gray-500">Language Code</th>
                <th className="pb-2 text-gray-500">RTL Status</th>
                <th className="pb-2 text-gray-500">Status</th>
                <th className="text-right pb-2 text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((language, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 text-center">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-2">
                      <CIcon icon={language.flag} size="lg" />
                      <span>{language.name}</span>
                    </div>
                  </td>
                  <td>{language.code}</td>
                  <td>
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded ${language.rtl === 'Yes' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}
                    >
                      {language.rtl}
                    </span>
                  </td>
                  <td className="flex justify-center items-center">
                    <CFormSwitch
                      className="mx-3 my-3"
                      color="primary"
                      checked={activeLanguages.includes(language.id)}
                      style={{ height: '20px', width: '38px' }}
                      onChange={() => toggleSwitch(language.id)}
                    />
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end">
                      <button className="flex items-center border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-500 py-2 px-3 rounded mr-2">
                        <span className="text-xs bg-blue-400 text-white px-1 mr-1">A 文</span> Publish
                      </button>
                      <ActionButton
                        label={'Edit'}
                        icon={BiEdit}
                        variant="mininal"
                        customColor="text-gray-600"
                        className="border border-gray-300 bg-gray-50 hover:bg-gray-200 p-2 rounded mr-2"
                      />
                      <ActionButton
                        label={'Delete'}
                        icon={FiTrash2}
                        variant="mininal"
                        customColor="text-gray-600"
                        className="border border-gray-300 bg-gray-50 hover:bg-gray-200 p-2 rounded"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
 
export default LanguageSetting;