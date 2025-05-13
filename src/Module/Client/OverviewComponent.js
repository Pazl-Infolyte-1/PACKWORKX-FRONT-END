import CIcon from "@coreui/icons-react";
import prof from "../../assets/images/profile-icon.png"
import { cilSettings } from "@coreui/icons";
const OverviewComponent = ({tableData}) => {
	console.log("table data",JSON.stringify(tableData))
  return (
    <div className="flex w-full gap-4">
      {/* Left section - 35% */}
  <div className="w-[35%] rounded p-2">
      <p>{tableData?.company_name}</p>
      <div className="border-b border-gray-300 mt-2"></div> {/* Thinner horizontal line */}
	    <div className="relative mt-2 flex items-center">
        {/* Image on the left */}
        <img src={prof} alt="Profile Icon" className="w-10 h-10 rounded-full mb-4" />

        {/* Right content */}
        <div className="ml-3"> {/* Reduced margin */}
         <p className="font-semibold text-sm m-0">Mr. Siva Shakthi Ram</p>
<p className="text-sm m-0">siva82dev@gmail.com</p>
<p className="text-sm m-0">7392927939</p>

        </div>

        {/* Settings icon on the top-right corner */}
        <div className="absolute top-1 right-2 text-gray-500">
          <CIcon icon={cilSettings} />
        </div>
      </div>

    </div>


      {/* Vertical divider */}
      <div className="w-[1px] bg-gray-300"></div>

      {/* Right section - 65% */}
      <div className="w-[65%] bg-gray-50 p-4 rounded">
        Right Content
      </div>
    </div>
  );
};

export default OverviewComponent;
