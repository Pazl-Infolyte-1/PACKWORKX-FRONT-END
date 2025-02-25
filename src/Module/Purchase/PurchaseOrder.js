import { useState } from 'react'
import { CiSettings } from 'react-icons/ci'
import { LuScanBarcode } from 'react-icons/lu'
import { FiAlertCircle } from 'react-icons/fi'

const PurchaseOrder = () => {
  const [files, setFiles] = useState([])

  return (
    <div
      style={{
        padding: '24px',
        background: '#fff',
        margin: '0 auto',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <button
          style={{
            marginBottom: '16px',
            color: '#1d4ed8',
            fontWeight: 'bold',
            padding: '8px 16px',
            border: '1px solid #1d4ed8',
            borderRadius: '6px',
            background: '#cae9f8',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          + Add a Contact
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              background: '#fff',
              border: '1px solid #ccc',
              padding: '8px 16px',
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          >
            Close
          </button>
          <button
            style={{
              background: '#8761e5',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '6px',
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div>
          <p style={{ color: '#7f7f7f' }}>Bill</p>
          <p style={{ color: '#030303' }}>Demo Pack works</p>
          <p style={{ color: '#030303' }}>US</p>
        </div>
        <div>
          <p style={{ color: '#7f7f7f' }}>Ship To</p>
          <p style={{ color: '#030303' }}>Demo Pack works</p>
          <p style={{ color: '#030303' }}>US</p>
        </div>

        <div></div>
        <div style={{ marginLeft: 'auto' }}>
          <table>
            <tr>
              <td>#</td>
              <td>No.</td>
              <td></td>
              <td></td>
              <td></td>

              <td>0-00000</td>
            </tr>
            <tr>
              <td>🔗</td>
              <td>WO-</td>
              <td></td>
              <td></td>
              <td></td>
              <td>0000084</td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div>
            <label style={{ color: '#b7b7b7' }}>Order Date:</label>
            <input
              type="date"
              defaultValue="2024-04-04"
              style={{
                border: '1px solid #ccc',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                width: '100%',
                backgroundColor: '#f1f1f1',
                color: '#7f7f7f',
              }}
            />
          </div>
          <div>
            <label style={{ color: '#b7b7b7' }}>Due Date:</label>
            <input
              type="date"
              defaultValue="2024-04-05"
              style={{
                border: '1px solid #ccc',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                width: '100%',
                backgroundColor: '#f1f1f1',
                color: '#7f7f7f',
              }}
            />
          </div>
          <div>
            <label style={{ color: '#b7b7b7' }}>Receive By:</label>
            <input
              type="date"
              defaultValue="2024-05-04"
              style={{
                border: '1px solid #ccc',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                width: '100%',
                backgroundColor: '#f1f1f1',
                color: '#7f7f7f',
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div>
            <label style={{ color: '#b7b7b7' }}>Business:</label>
            <select
              style={{
                border: '1px solid #ccc',
                padding: '8px',
                borderRadius: '6px',
                width: '100px',
                background: '#f1f1f1',
                color: '#7f7f7f',
              }}
            >
              <option>Select</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#b7b7b7' }}>Class:</label>
            <select
              style={{
                border: '1px solid #ccc',
                padding: '8px',
                borderRadius: '6px',
                width: '100px',
                background: '#f1f1f1',
                color: '#7f7f7f',
              }}
            >
              <option>Select</option>
            </select>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              color: '#1d4ed8',
              cursor: 'pointer',
              marginTop: '28px',
            }}
          >
            <div style={{ width: '96px' }}>+ Add firm</div>
            <div>
              <CiSettings />
            </div>
          </div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
        <thead style={{ background: '#f3f4f6', color: '#b7b7b7' }}>
          <tr>
            {[
              'Product',
              'Product Code',
              'Description',
              'Qty',
              'UOM',
              'Price',
              'Discount',
              'Amount',
            ].map((header) => (
              <th key={header} style={{ border: '1px solid #ccc', padding: '8px' }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { product: 'Chair Leg', code: 'P-0000058', qty: 4 },
            { product: 'Backrest', code: 'P-0000061', qty: 1 },
          ].map(({ product, code, qty }, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{code}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                <FiAlertCircle />
              </td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{qty}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>UNIT</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>US$ 0.00</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>US$ 0.00</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>US$ 0.00</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          color: '#567295',
          marginTop: '16px',
        }}
      >
        <span>+ Add Item</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <LuScanBarcode /> Scan Barcode
        </span>
        <span>- Clear all items</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          background: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            width: '50%',
            border: '1px solid #ccc',
            padding: '24px',
            background: '#f3f4f6',
            borderRadius: '8px',
            minHeight: '100px',
            textAlign: 'center',
          }}
        >
          {files.length > 0 ? (
            files.map((file, index) => (
              <p key={index} style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                {file.name}
              </p>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: '#6b7280' }}>No files attached</p>
          )}
        </div>

        <div style={{ width: '33.3333%', textAlign: 'right' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: '600', color: '#1a202c' }}>Sub-total</p>
            <span style={{ color: '#b7b7b7' }}>Rs. 100.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontWeight: '600', color: '#1a202c' }}>Total Discount(-)</p>
            <span style={{ color: '#b7b7b7' }}>Rs. 0.00</span>
          </div>
          <p
            style={{
              color: '#567295',
              fontSize: '0.875rem',
              cursor: 'pointer',
              marginTop: '0.25rem',
              textAlign: 'left',
            }}
          >
            + Add Charges/Discount
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <p style={{ fontWeight: '600', color: '#1a202c' }}>Rounding off</p>
            <span style={{ color: '#b7b7b7' }}>Rs. 0.00</span>
          </div>
          <hr style={{ marginTop: '0.5rem', marginBottom: '0.5rem', borderColor: '#d1d5db' }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '1.125rem',
            }}
          >
            <p>Total (Rs.)</p>
            <span>Rs. 100.00</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '-48px' }}>
        <label
          style={{
            color: '#374151',
            fontWeight: '600',
            marginBottom: '8px',
            paddingLeft: '11px',
            cursor: 'pointer',
          }}
        >
          Attach Files
        </label>
        <input
          id="fileUpload"
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={(event) => setFiles([...files, ...Array.from(event.target.files)])}
        />
      </div>
    </div>
  )
}

export default PurchaseOrder
