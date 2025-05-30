import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiMethods from '../../api/config';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeOpen, cilPencil, cilPrint } from '@coreui/icons';
import html2pdf from 'html2pdf.js';


function InvoiceView() {
    const { id } = useParams(); // grabs the `id` from the URL
    const [invoice, setInvoice] = useState([]);

    useEffect(() => {
        const fetchSalesOrderData = async () => {
            try {
                const response = await apiMethods.getInvoiceById(id)
                setInvoice(response?.data);
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

    const handlePrint = () => {
        const element = document.getElementById('invoice-content');
        const opt = {
            margin:       0.5,
            filename:     `Invoice_${invoice?.invoice_number || 'download'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };
    


    return (
        
        <div className="bg-white w-full font-sans flex flex-col" style={{ height: '90vh' }}>
            {/* Header */}
            <div className="w-full bg-white z-50">
                <div className="flex justify-between items-top p-2">
                    <h1 className="text-lg font-semibold">Invoice # {invoice?.invoice_number}</h1>
                    <div className="flex items-start space-x-4">
                        <button className="text-black text-xs">Upload Files</button>
                        <button className="text-black text-xs">Comments & History</button>
                        <button className="text-gray-500 text-sm items-start" onClick={() => { navigate('/salesorder') }}>✕</button>
                    </div>
                </div>
                <div className="flex bg-gray-50 px-3 border-t text-xs">
                    <button
                        className="flex items-centergap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600"
                    //    onClick={()=>navigate(`/salesorder/form/${invoice?.id}?tab=salesOrder`)}
                    >
                        <CIcon icon={cilPencil} className="h-3 w-3" />
                        <span>Edit</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600">
                        <CIcon icon={cilEnvelopeOpen} className="h-3 w-3" />
                        <span>Email</span>
                    </button>
                    <button
                    onClick={handlePrint}
                     className="flex items-center gap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600">
                        <CIcon icon={cilPrint} className="h-3 w-3" />
                        <span>Print</span>
                    </button>
                    {/* <button className="flex items-center gap-1 px-3 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 border-b-2 border-transparent hover:border-blue-600">
            <CIcon icon={cilDollar} className="h-3 w-3" />
            <span>To Invoice</span>
          </button> */}
                </div>
            </div>

            {/* Main content area with scrolling */}
            <div className="flex-1 overflow-y-auto"  id="invoice-content">


                {/* Main form content */}
                <div className="flex flex-col mx-auto font-sans px-4 md:px-44 pt-4 pb-8">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex flex-col gap-0 mb-4 md:mb-0">
                            <span className="text-xl">Invoice</span>
                            <span className="text-xs text-gray-600">Work Order# <span className="font-bold">{invoice?.work_id}</span></span>
                        </div>

                        <div className="flex flex-col gap-0 items-start">
                            <span className="text-xs font-semibold">Billing Address</span>
                            <span className="text-xs text-gray-600">{invoice?.client}</span>
                            <span className="text-xs text-gray-600">{invoice?.confirmation_email}</span>
                            {invoice?.confirmation_mobile && (
                                <span className="text-xs text-gray-600">{invoice?.confirmation_mobile}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between text-sm mb-6 mt-3">
                        <div>
                            <h2 className="font-semibold text-xs text-gray-700 mb-2">STATUS</h2>
                            <div className="flex flex-col border-l-2 pl-2 gap-2 border-yellow-500 text-xs w-[170px]">
                                <div className="flex justify-between">
                                    <span className="text-black">Payment Status:</span>
                                    <span className={`${invoice?.payment_status === "pending" ? "text-orange-500" :
                                            invoice?.payment_status === "paid" ? "text-green-600" : "text-blue-600"
                                        }`}>
                                        {invoice?.payment_status}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-black">Sales Order Status:</span>
                                    <span
                                        className={
                                            invoice?.salesOrder?.status === "active"
                                                ? "text-green-600"
                                                : "text-blue-600"
                                        }
                                    >
                                        {invoice?.salesOrder?.status || "N/A"}
                                    </span>                </div>
                                <div className="flex justify-between gap-1">
                                    <span className="text-black">Transaction Type:</span>
                                    <span className="text-orange-500">
                                        {invoice?.transaction_type ? `${invoice?.transaction_type} ` : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs flex flex-col mb-6 mt-3 md:w-80">
                        <p className="flex flex-col md:flex-row md:gap-24 md:justify-between">
                            <span>ORDER DATE</span>
                            <span>{formatDate(invoice?.created_at)}</span>
                        </p>
                        <p className="flex flex-col md:flex-row md:gap-24  md:justify-between">
                            <span>PAYMENT EXPECTED DATE </span>
                            <span>{invoice?.payment_expected_date ? `${invoice?.payment_expected_date} ` : "N/A"}</span>
                        </p>
                        <p className="flex flex-col md:flex-row md:gap-24 md:justify-between">
                            <span>DUE DATE</span>
                            <span>{invoice?.due_date || 'N/A'}</span>
                        </p>
                    </div>

                    <div className="border rounded overflow-hidden">
                        <div className="bg-gray-100 grid grid-cols-8 text-xs font-semibold text-gray-600 px-4 py-2">
                            <div className="col-span-2">ITEMS & DESCRIPTION</div>
                            {/* <div>QUANTITY</div> */}
                            {/* <div>ACCEPTABLE UNITS</div> */}
                            <div>RATE</div>
                            <div>Discount</div>
                            <div>Tax</div>
                            <div>AMOUNT</div>
                            <div>INVOICED</div>
                            <div>PENDING</div>
                        </div>

                        {invoice?.sku_id && (
    <div className="grid grid-cols-8 items-center px-4 py-4 border-t text-sm">
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
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5V5.25C3 4.00736 4.00736 3 5.25 3h13.5C19.9926 3 21 4.00736 21 5.25V16.5M3 16.5l2.25-2.25M3 16.5l2.25 2.25M21 16.5l-2.25-2.25M21 16.5l-2.25 2.25M9 21h6"
                    />
                </svg>
            </div>
            <div>
                <p className="text-blue-600 underline cursor-pointer">
                    {invoice.sku}
                </p>
                <p className="text-gray-600 text-xs">SKU: {invoice.sku_id}</p>
            </div>
        </div>
        {/* <div>{invoice.quantity_required}</div>
        <div>{invoice.acceptable_sku_units}</div> */}
        <div>₹{parseFloat(invoice.total)?.toFixed(2)}</div>
        <div>₹{parseFloat(invoice.discount)?.toFixed(2) || 22}</div>
        <div>₹{parseFloat(invoice.total_tax)?.toFixed(2) || 22}</div>
        <div>₹{parseFloat(invoice.total_amount)?.toFixed(2)}</div>
        <div>  {parseFloat(invoice.total_amount - invoice.balance)?.toFixed(2) || "0.00"}</div>
        <div>{parseFloat(invoice.balance)?.toFixed(2) || 42}</div>
    </div>
)}


                        {(!invoice?.sku_id || invoice?.SalesSkuDetails?.length === 0) && (
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
                                        <td className="text-base font-bold">₹{parseFloat(invoice?.total)?.toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="text-xs text-gray-600 pt-1">
                                            Total Quantity : {invoice?.SalesSkuDetails ?
                                                invoice?.SalesSkuDetails?.reduce((total, item) => total + parseInt(item?.quantity_required), 0) : 0}
                                        </td>
                                    </tr>
                                    {(parseFloat(invoice?.sgst) > 0 || parseFloat(invoice?.cgst) > 0) && (
                                        <>
                                            {parseFloat(invoice?.sgst) > 0 && (
                                                <tr>
                                                    <td className="text-gray-600 pt-3">SGST</td>
                                                    <td className="text-gray-600 pt-3">₹{parseFloat(invoice?.sgst)?.toFixed(2)}</td>
                                                </tr>
                                            )}
                                            {parseFloat(invoice?.cgst) > 0 && (
                                                <tr>
                                                    <td className="text-gray-600 pt-3">CGST</td>
                                                    <td className="text-gray-600 pt-3">₹{parseFloat(invoice?.cgst)?.toFixed(2)}</td>
                                                </tr>
                                            )}
                                        </>
                                    )}
                                    <tr>
                                        <td className="text-lg font-bold pt-4">Total</td>
                                        <td className="text-lg font-bold pt-4">₹{parseFloat(invoice?.total_amount)?.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Created/Updated by information
                    <div className="text-xs text-gray-500 mt-8">
                        <p>Created by: {invoice?.creator_sales?.name || 'Unknown'} on {formatDate(invoice?.created_at)}</p>
                        <p>Last updated by: {invoice?.updater_sales?.name || 'Unknown'} on {formatDate(invoice?.updated_at)}</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default InvoiceView;
