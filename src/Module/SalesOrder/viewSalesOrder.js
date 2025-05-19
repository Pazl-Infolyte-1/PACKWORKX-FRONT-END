import { cilDollar, cilEnvelopeOpen, cilPencil, cilPrint } from "@coreui/icons";
import { useParams } from "react-router-dom"; // to extract `id` from the URL
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiMethods from "../../api/config";

export default function SalesOrderView({ }) {
  const navigate = useNavigate();
  const [salesOrderData, setSalesOrderData] = useState(null);
  const { id } = useParams();


  useEffect(() => {
    const fetchSalesOrderData = async () => {
      try {
        const response = await apiMethods.getSaleOrderData(id);
        setSalesOrderData(response?.data);
      } catch (error) {
        console.error("Error viewing sales order:", error);
        // setAlerts([{
        //   severity: "error",
        //   message: error?.response?.data?.message || "Error viewing sales order"
        // }]);
      }
    };
  
    if (id) {
      fetchSalesOrderData();
    }
  }, [id]);
  

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  return (
    <div className="bg-white w-full font-sans flex flex-col" style={{height: '90vh'}}>
      {/* Header */}
      <div className="w-full bg-white z-50">
        <div className="flex justify-between items-top p-2">
          <h1 className="text-lg font-semibold">Sales Order # {salesOrderData?.sales_generate_id}</h1>
          <div className="flex items-start space-x-4">
            <button className="text-black text-xs">Upload Files</button>
            <button className="text-black text-xs">Comments & History</button>
            <button className="text-gray-500 text-sm items-start" onClick={()=>{navigate('/salesorder')}}>✕</button>
          </div>
        </div>
        <div className="flex bg-gray-50 px-3 border-t text-xs">
          <button className="flex items-centergap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600">
            <CIcon icon={cilPencil} className="h-3 w-3" />
            <span>Edit</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600">
            <CIcon icon={cilEnvelopeOpen} className="h-3 w-3" />
            <span>Email</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600">
            <CIcon icon={cilPrint} className="h-3 w-3" />
            <span>Print</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600">
            <CIcon icon={cilDollar} className="h-3 w-3" />
            <span>To Invoice</span>
          </button>
        </div>
      </div>

      {/* Main content area with scrolling */}
      <div className="flex-1 overflow-y-auto">
        {/* Next steps banner */}
        <div className="px-3 flex flex-col mt-4">
          <div className="bg-blue-50 border border-blue-100 rounded p-1 mb-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="bg-blue-100 p-0.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 text-xs">WHAT'S NEXT?</h3>
                  <p className="text-blue-700 text-xs">Convert to packages, shipments, or invoices.</p>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded shadow-sm text-xs">
                Convert to Invoice
              </button>
            </div>
          </div>

          {/* Invoices section */}
          <div className="bg-white border border-gray-200 rounded mb-3 hover:shadow-sm text-xs">
            <div className="p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-1.5">
                <div className="bg-gray-100 p-0.5 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-xs">Invoices</h3>
                </div>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded-full text-xs">
                  {salesOrderData?.workOrders ? salesOrderData?.workOrders?.length : 0}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main form content */}
        <div className="flex flex-col mx-auto font-sans px-4 md:px-44 pt-4 pb-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex flex-col gap-0 mb-4 md:mb-0">
              <span className="text-xl">SALES ORDER</span>
              <span className="text-xs text-gray-600">Sales Order# <span className="font-bold">{salesOrderData?.sales_generate_id}</span></span>
            </div>

            <div className="flex flex-col gap-0 items-start">
              <span className="text-xs font-semibold">Billing Address</span>
              <span className="text-xs text-gray-600">{salesOrderData?.client}</span>
              <span className="text-xs text-gray-600">{salesOrderData?.confirmation_email}</span>
              {salesOrderData?.confirmation_mobile && (
                <span className="text-xs text-gray-600">{salesOrderData?.confirmation_mobile}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between text-sm mb-6 mt-3">
            <div>
              <h2 className="font-semibold text-xs text-gray-700 mb-2">STATUS</h2>
              <div className="flex flex-col border-l-2 pl-2 gap-2 border-yellow-500 text-xs w-[170px]">
                <div className="flex justify-between">
                  <span className="text-black">Sales Status:</span>
                  <span className={`${
                    salesOrderData?.sales_status === "Pending" ? "text-orange-500" : 
                    salesOrderData?.sales_status === "Completed" ? "text-green-600" : "text-blue-600"
                  }`}>
                    {salesOrderData?.sales_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Confirmation:</span>
                  <span className="text-blue-600">{salesOrderData?.confirmation || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Payment:</span>
                  <span className="text-orange-500">
                    {salesOrderData?.credit_period ? `${salesOrderData?.credit_period} days credit` : "Unpaid"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs space-y-2 mb-6">
            <p className="flex flex-col md:flex-row md:gap-[118px]">
              <span>ORDER DATE</span>
              <span>{formatDate(salesOrderData?.created_at)}</span>
            </p>
            <p className="flex flex-col md:flex-row md:gap-24">
              <span>PAYMENT TERMS</span>
              <span>{salesOrderData?.credit_period ? `${salesOrderData?.credit_period} days credit` : "Due on Receipt"}</span>
            </p>
            {salesOrderData?.freight_paid && (
              <p className="flex flex-col md:flex-row md:gap-24">
                <span>FREIGHT PAID</span>
                <span>₹{parseFloat(salesOrderData?.freight_paid).toFixed(2)}</span>
              </p>
            )}
          </div>

          <div className="border rounded overflow-hidden">
            <div className="bg-gray-100 grid grid-cols-6 text-xs font-semibold text-gray-600 px-4 py-2">
              <div className="col-span-2">ITEMS & DESCRIPTION</div>
              <div>QUANTITY</div>
              <div>ACCEPTABLE UNITS</div>
              <div>RATE</div>
              <div>AMOUNT</div>
            </div>

            {salesOrderData?.SalesSkuDetails?.map((item, idx) => (
              <div key={idx} className="grid grid-cols-6 items-center px-4 py-4 border-t text-sm">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-400"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V5.25C3 4.00736 4.00736 3 5.25 3h13.5C19.9926 3 21 4.00736 21 5.25V16.5M3 16.5l2.25-2.25M3 16.5l2.25 2.25M21 16.5l-2.25-2.25M21 16.5l-2.25 2.25M9 21h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-600 underline cursor-pointer">{item?.sku}</p>
                    <p className="text-gray-600 text-xs">SKU: {item?.sku}</p>
                  </div>
                </div>
                <div>{item?.quantity_required}</div>
                <div>{item?.acceptable_sku_units}</div>
                <div>₹{parseFloat(item?.rate_per_sku)?.toFixed(2)}</div>
                <div>₹{parseFloat(item?.total_amount)?.toFixed(2)}</div>
              </div>
            ))}
            
            {(!salesOrderData?.SalesSkuDetails || salesOrderData?.SalesSkuDetails?.length === 0) && (
              <div className="px-4 py-4 text-sm text-gray-500 text-center">
                No items found
              </div>
            )}
          </div>
          
          <div className="w-full flex flex-col items-end text-sm text-gray-900 mt-4">
            <div className="w-full max-w-xs">
              <table className="w-full text-right">
                <tbody>
                  <tr>
                    <td className="text-base font-medium">Sub Total</td>
                    <td className="text-base font-bold">₹{parseFloat(salesOrderData?.total_amount)?.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="text-xs text-gray-600 pt-1">
                      Total Quantity : {salesOrderData?.SalesSkuDetails ? 
                        salesOrderData?.SalesSkuDetails?.reduce((total, item) => total + parseInt(item?.quantity_required), 0) : 0}
                    </td>
                  </tr>
                  {(parseFloat(salesOrderData?.sgst) > 0 || parseFloat(salesOrderData?.cgst) > 0) && (
                    <>
                      {parseFloat(salesOrderData?.sgst) > 0 && (
                        <tr>
                          <td className="text-gray-600 pt-3">SGST</td>
                          <td className="text-gray-600 pt-3">₹{parseFloat(salesOrderData?.sgst)?.toFixed(2)}</td>
                        </tr>
                      )}
                      {parseFloat(salesOrderData?.cgst) > 0 && (
                        <tr>
                          <td className="text-gray-600 pt-3">CGST</td>
                          <td className="text-gray-600 pt-3">₹{parseFloat(salesOrderData?.cgst)?.toFixed(2)}</td>
                        </tr>
                      )}
                    </>
                  )}
                  <tr>
                    <td className="text-lg font-bold pt-4">Total</td>
                    <td className="text-lg font-bold pt-4">₹{parseFloat(salesOrderData?.total_incl_gst)?.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Created/Updated by information */}
          <div className="text-xs text-gray-500 mt-8">
            <p>Created by: {salesOrderData?.creator_sales?.name || 'Unknown'} on {formatDate(salesOrderData?.created_at)}</p>
            <p>Last updated by: {salesOrderData?.updater_sales?.name || 'Unknown'} on {formatDate(salesOrderData?.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}