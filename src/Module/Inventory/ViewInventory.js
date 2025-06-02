import { useEffect, useState } from "react";
import apiMethods from "../../api/config";

const ViewInventory = ({ item }) => {
  const [itemDetails, setItemDetails] = useState(null);
  const menus = [
    "Purchase Order",
    "GRN",
    "Purchase Returns",
    "Credit Notes",
    "Debit Notes",
    "Stock Adjustment"
  ];

  const [activeMenu, setActiveMenu] = useState("Purchase Order");
  useEffect(() => {
    const fetchSingleItem = async () => {
      if (!item?.item_id) return;

      try {
        const response = await apiMethods.singleInventoryView(item.item_id);
        setItemDetails(response.data);
      } catch (error) {
        console.error('Error fetching single inventory view:', error);
      }
    };

    fetchSingleItem();
  }, [item]);

  return (   <div>
      {/* Nav menu */}
      <nav className="flex space-x-8 border-b mb-4">
        {menus.map(menu => (
          <button
            key={menu}
            onClick={() => setActiveMenu(menu)}
            className={`pb-2 font-semibold ${
              activeMenu === menu
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {menu}
          </button>
        ))}
      </nav>

      {/* Content area */}
      <div>
        {activeMenu === "Purchase Order" ? (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Purchase Orders</h2>
            {itemDetails?.purchaseOrders?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {itemDetails.purchaseOrders.map((po) => (
                  <div key={po.id} className="p-4 bg-transparent">
                    <p><strong>PO Number:</strong> {po.purchaseOrder.purchase_generate_id}</p>
                    <p><strong>PO Date:</strong> {po.purchaseOrder.po_date}</p>
                    <p><strong>Supplier Name:</strong> {po.purchaseOrder.supplier_name}</p>
                    <p><strong>Contact:</strong> {po.purchaseOrder.supplier_contact}</p>
                    <p><strong>Description:</strong> {po.description}</p>
                    <p><strong>Quantity:</strong> {po.quantity}</p>
                    <p><strong>Unit Price:</strong> ₹{po.unit_price}</p>
                    <p><strong>CGST:</strong> {po.cgst}%</p>
                    <p><strong>SGST:</strong> {po.sgst}%</p>
                    <p><strong>Tax Amount:</strong> ₹{po.tax_amount}</p>
                    <p><strong>Total Amount:</strong> ₹{po.total_amount}</p>
                    <p><strong>Status:</strong> {po.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No purchase orders found.</p>
            )}
          </div>
        ) : activeMenu === "Stock Adjustment" ? (
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Stock Adjustments</h2>
            {itemDetails?.stockAdjustments?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {itemDetails.stockAdjustments.map((adj) => (
                  <div key={adj.id} className="p-4 bg-transparent">
                    <p><strong>Adjustment ID:</strong> {adj.adjustment.stock_adjustment_generate_id}</p>
                    <p><strong>Adjustment Date:</strong> {adj.adjustment.adjustment_date}</p>
                    <p><strong>Type:</strong> {adj.type}</p>
                    <p><strong>Previous Quantity:</strong> {adj.previous_quantity}</p>
                    <p><strong>Adjustment Quantity:</strong> {adj.adjustment_quantity}</p>
                    <p><strong>Difference:</strong> {adj.difference}</p>
                    <p><strong>Remarks:</strong> {adj.adjustment.remarks || "N/A"}</p>
                    <p><strong>Status:</strong> {adj.adjustment.status}</p>
                    <p><strong>Created By:</strong> {adj.adjustment.creator.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No stock adjustments found.</p>
            )}
          </div>
        ) : (
          <div>
            {/* Empty content for other menus */}
          </div>
        )}
      </div>
    </div>
    
  );
};

export default ViewInventory;
