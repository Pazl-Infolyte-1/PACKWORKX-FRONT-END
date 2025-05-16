import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { CFormSelect } from '@coreui/react';
import { IoSettingsOutline } from "react-icons/io5";

const CompactPagination = ({ count, page, onPageChange, entriesPerPage, onEntriesChange,totalRecords, isMinimized=false }) => {
  console.log("total rec",totalRecords)
  const handleEntriesChange = (event) => {
    const selectedValue = Number(event.target.value);
    onEntriesChange(selectedValue);
  };

  const handlePrevious = () => {
    if (page > 1) onPageChange(null, page - 1);
  };

  const handleNext = () => {
    if (page < count) onPageChange(null, page + 1);
  };

  return (
 <div className={`flex w-full ${isMinimized ? 'justify-start' : 'justify-end'} my-1 text-sm`}>
  <div className="flex items-center border border-gray-300 w-48 rounded ">
    {/* Entries per page dropdown */}
    <div className="flex items-center w-1/2 p-1 py-2 bg-gray-200 gap-2 ">
      <IoSettingsOutline fontSize={'medium'} />
      <select
        aria-label="Entries per page"
        value={entriesPerPage}
        className="!appearance-none !text-xs !px-0 !border-none focus:ring-0 focus:outline-none bg-transparent font-medium"
        onChange={handleEntriesChange}
      >
        <option className="text-xs" value="5">5 per page</option>
        <option className="text-xs" value="10">10 per page</option>
        <option className="text-xs" value="25">25 per page</option>
        <option className="text-xs" value="50">50 per page</option>
      </select>
    </div>
    {/* Compact Pagination Controls */}
    <div className="flex items-center gap-2 w-1/2 ">
      {/* Previous Arrow */}
      <button
        onClick={handlePrevious}
        disabled={page === 1}
        className="p-1 rounded disabled:opacity-50 hover:bg-gray-100"
      >
        <MdOutlineKeyboardArrowLeft fontSize={'large'} color="blue"/>
      </button>

      {/* Page info */}
      <span className="text-xs font-medium text-gray-700">
        {page} - {count}
      </span>

      {/* Next Arrow */}
      <button
        onClick={handleNext}
        disabled={page === count}
        className="p-1 rounded disabled:opacity-50 hover:bg-gray-100"
      >
        <MdOutlineKeyboardArrowRight fontSize={'large'} color="blue"/>
      </button>
    </div>
  </div>
</div>

  );
};

export default CompactPagination;
