import React, { useEffect } from 'react';

const PurchaseReturnItemForm = ({ items, setItems, formValues, setFormValues }) => {
  // Update form values on items change
  useEffect(() => {
    let total_qty = 0;
    let subtotal = 0;
    let cgst_amount = 0;
    let sgst_amount = 0;

    (items || []).forEach(item => {
      if (item.selected) {
        const qty = parseFloat(item.quantity || 0);
        const price = parseFloat(item.unit_price || 0);
        const cgst = parseFloat(item.cgst || 0);
        const sgst = parseFloat(item.sgst || 0);

        const amount = qty * price;
        total_qty += qty;
        subtotal += amount;
        cgst_amount += (amount * cgst) / 100;
        sgst_amount += (amount * sgst) / 100;
      }
    });

    const tax_amount = cgst_amount + sgst_amount;
    const total_amount = subtotal + tax_amount;

    setFormValues({
      total_qty,
      cgst_amount,
      sgst_amount,
      tax_amount,
      total_amount
    });
  }, [items, setFormValues]);

  const handleQtyChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = value;
    setItems(updatedItems);
  };

  const handleItemSelect = (index) => {
    const updatedItems = [...items];
    updatedItems[index].selected = !updatedItems[index].selected;
    setItems(updatedItems);
  };

  return (
    <div className="p-4">
      <table className="min-w-full table-auto border mb-6">
        <thead className="bg-gray-100 text-center">
          <tr>
            <th>Select</th>
            <th>Item Name</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>CGST %</th>
            <th>SGST %</th>
            <th>Total</th>
            <th>CGST Amount</th>
            <th>SGST Amount</th>
            <th>Tax Amount</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {(items || []).map((item, idx) => {
            const qty = parseFloat(item.quantity || 0);
            const price = parseFloat(item.unit_price || 0);
            const cgst = parseFloat(item.cgst || 0);
            const sgst = parseFloat(item.sgst || 0);

            const amount = qty * price;
            const cgst_amt = (amount * cgst) / 100;
            const sgst_amt = (amount * sgst) / 100;
            const tax_amt = cgst_amt + sgst_amt;
            const total_amt = amount + tax_amt;

            return (
              <tr key={idx} className="text-center border-t">
                <td>
                  <input
                    type="checkbox"
                    checked={item.selected || false}
                    onChange={() => handleItemSelect(idx)}
                    className="border px-2 py-1"
                  />
                </td>
                <td className="border px-2 py-1">{item.item_name || `Item ${idx + 1}`}</td>
                <td>
                  <input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => handleQtyChange(idx, e.target.value)}
                    className="border px-2 py-1 w-20 text-center"
                  />
                </td>
                <td className="border px-2 py-1">{price.toFixed(2)}</td>
                <td className="border px-2 py-1">{cgst}%</td>
                <td className="border px-2 py-1">{sgst}%</td>
                <td className="border px-2 py-1">{amount.toFixed(2)}</td>
                <td className="border px-2 py-1">{cgst_amt.toFixed(2)}</td>
                <td className="border px-2 py-1">{sgst_amt.toFixed(2)}</td>
                <td className="border px-2 py-1">{tax_amt.toFixed(2)}</td>
                <td className="border px-2 py-1">{total_amt.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

     <table className="flex-1 w-full">
        <tbody>
          <tr>
            <td className="px-4 py-2 text-[#7f7f7f] text-[15px]">
              Total Qty: {formValues?.total_qty ?? 0}
            </td>
            <td className="px-4 py-2 text-[#7f7f7f] text-[15px]">
              C-GST: {formValues?.cgst_amount ? Number(formValues.cgst_amount).toFixed(2) : '0.00'}
            </td>
            <td className="px-4 py-2 text-[#7f7f7f] text-[15px]">
              S-GST: {formValues?.sgst_amount ? Number(formValues.sgst_amount).toFixed(2) : '0.00'}
            </td>
            <td className="px-4 py-2 text-[#7f7f7f] text-[15px]">
              Tax: {formValues?.tax_amount ? Number(formValues.tax_amount).toFixed(2) : '0.00'}
            </td>
            <td className="px-4 py-2 text-[#7f7f7f] text-[15px]">
              Total Amount (Incl GST): {formValues?.total_amount ? Number(formValues.total_amount).toFixed(2) : '0.00'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseReturnItemForm;